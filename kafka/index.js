'use strict';

const CBuffer = require('CBuffer');
const Kafka = require('node-rdkafka');
const EventEmitter = require('events').EventEmitter;
const levels = new Map([
  [10, 'trace'],
  [20, 'debug'],
  [30, 'info'],
  [40, 'warn'],
  [50, 'error'],
  [60, 'fatal']
]);

console.log('Kafka.librdkafka:', Kafka.librdkafkaVersion, Kafka.features);

class KafkaStream extends EventEmitter {
  constructor(config) {
    super();
    let {
      logproject,
      logstore,
      topic,
      cbuffer_size,
      opts
    } = config;
    if (!opts) {
      throw new Error('Kafka options must be provided');
    }

    // if (!opts.partitioner || typeof opts.partitioner !== 'function') {
    //   throw new Error('Kafka options must have a partitioner function');
    // }

    if (!topic) {
      throw new Error('KafkaStream must have a topic');
    }

    this.config = config;
    this.logproject = logproject;
    this.logstore = logstore;
    this.topic = topic;
    this.opts = opts;

    this.cbuffer_size = cbuffer_size || 100;
    this.log_queue = new CBuffer(this.cbuffer_size);

    this.connected = false;

    this.createKafkaProducer();
  }

  // static roundRobinPartitioner() {
  //   let rrIndex = 0;
  //   return (topic, partitions) => {
  //     const curIndex = rrIndex;
  //     rrIndex++;
  //     if (rrIndex >= partitions.length) {
  //       rrIndex = 0;
  //     }
  //     return curIndex;
  //   };
  // }

  createKafkaProducer() {
    console.log('KafkaStream createKafkaProducer', this.opts, 'ssl_ca_location:', this.opts['ssl_ca_location'] || __dirname + '/ca-cert');

    const producer = new Kafka.Producer({
      /*'debug': 'all', */
      'api.version.request': 'true',
      'bootstrap.servers': this.opts['bootstrap_servers'],
      'dr_cb': true,
      'dr_msg_cb': true,
      'security.protocol': 'sasl_ssl',
      'ssl.ca.location': this.opts['ssl_ca_location'] || __dirname + '/ca-cert',
      'sasl.mechanisms': 'PLAIN',
      'sasl.username': this.opts['sasl_plain_username'],
      'sasl.password': this.opts['sasl_plain_password']
    });

    // Wait for the ready event before proceeding
    producer.on('ready', () => {
      this.connected = true;
      console.log("kafka producter connect ok");
      this.flush();
    });

    producer.on("disconnected", () => {
      this.connected = false;
      console.log("kafka producter disconnected");
      //断线自动重连
      producer.connect();
    })

    producer.on('event.log', (event) => {
      console.log("event.log", event);
    });

    producer.on("error", (error) => {
      console.log("error:" + error);
    });

    producer.on('delivery-report', (err, report) => {
      //消息发送成功，这里会收到report
      console.log("delivery-report: producer ok");
    });

    // Any errors we encounter, including connection errors
    producer.on('event.error', (err) => {
      console.error('event.error:' + err);
    });

    // Poll for events every 100 ms
    producer.setPollInterval(100);

    // Connect to the broker manually
    producer.connect();

    this.producer = producer;
  }

  write(record) {
    record.logproject = this.logproject;
    record.logstore = this.logstore;
    record.topic = this.topic;
    
    if (record.time) {
      record['@timestamp'] = new Date(record.time).toISOString();
    } else {
      record['@timestamp'] = new Date(Date.now()).toISOString();
    }
    if (levels.has(record.level)) {
      record.level = levels.get(record.level);
    } else {
      record.level = 'UNKNOWN';
    }

    delete record.time;
    delete record.v;
    
    for (const key in record) {
      if (record.hasOwnProperty(key)) {
        const value = record[key];
        if (typeof value === 'number') {
          record[key] = value.toString();
          continue;
        }
        if (typeof value === 'object') {
          record[key] = JSON.stringify(value);
          continue;
        }
      }
    }
    const message = JSON.stringify(record);
    if (!this.connected) {
      console.log('Kafka Producer not connected');
      this.log_queue.push({
        message
      });
      return;
    }
    this.send(message);
  }
  send(msg) {
    // 发消息
    try {
      this.producer.produce(
        // Topic to send the message to
        this.topic,
        // optionally we can manually specify a partition for the message
        // this defaults to -1 - which will use librdkafka's default partitioner (consistent random for keyed messages, random for unkeyed messages)
        null,
        // Message to send. Must be a buffer
        new Buffer(msg),
        // for keyed messages, we also specify the key - note that this field is optional
        null,
        // you can send a timestamp here. If your broker version supports it,
        // it will get added. Otherwise, we default to 0
        Date.now()
        // you can send an opaque token here, which gets passed along
        // to your delivery reports
      );
    } catch (err) {
      console.error('A problem occurred when kafka sending our message', err);
    }
  }
  flush() {
    let ele = this.log_queue.pop();
    while (ele) {
      this.send(ele.message);
      ele = this.log_queue.pop();
    }
    this.log_queue.empty();
  }
}

module.exports = KafkaStream;