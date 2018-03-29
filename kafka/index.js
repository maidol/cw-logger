'use strict';

const Kafka = require('node-rdkafka');
const EventEmitter = require('events').EventEmitter;
console.log('Kafka.librdkafka:', Kafka.librdkafkaVersion, Kafka.features);

function createKafkaProducer(opts, target) {
  console.log('KafkaStream createKafkaProducer', opts, 'ssl_ca_location:', opts['ssl_ca_location'] || __dirname + '/ca-cert');

  const producer = new Kafka.Producer({
    /*'debug': 'all', */
    'api.version.request': 'true',
    'bootstrap.servers': opts['bootstrap_servers'],
    'dr_cb': true,
    'dr_msg_cb': true,
    'security.protocol': 'sasl_ssl',
    'ssl.ca.location': opts['ssl_ca_location'] || __dirname + '/ca-cert',
    'sasl.mechanisms': 'PLAIN',
    'sasl.username': opts['sasl_plain_username'],
    'sasl.password': opts['sasl_plain_password']
  });

  // Wait for the ready event before proceeding
  producer.on('ready', function () {
    target.connected = true;
    console.log("kafka producter connect ok");
  });

  producer.on("disconnected", function () {
    target.connected = false;
    console.log("kafka producter disconnected");
    //断线自动重连
    producer.connect();
  })

  producer.on('event.log', function (event) {
    console.log("event.log", event);
  });

  producer.on("error", function (error) {
    console.log("error:" + error);
  });

  producer.on('delivery-report', function (err, report) {
    //消息发送成功，这里会收到report
    console.log("delivery-report: producer ok");
  });
  // Any errors we encounter, including connection errors
  producer.on('event.error', function (err) {
    console.error('event.error:' + err);
  });

  // Poll for events every 100 ms
  producer.setPollInterval(100);

  // Connect to the broker manually
  producer.connect();

  return producer;
}

class KafkaStream extends EventEmitter {
  constructor({
    logproject,
    logstore,
    topic,
    opts
  }) {
    super();

    if (!opts) {
      throw new Error('Kafka options must be provided');
    }

    // if (!opts.partitioner || typeof opts.partitioner !== 'function') {
    //   throw new Error('Kafka options must have a partitioner function');
    // }

    if (!topic) {
      throw new Error('KafkaStream must have a topic');
    }

    this.logproject = logproject;
    this.logstore = logstore;
    this.topic = topic;
    this.opts = opts;

    this.connected = false;

    this.producer = createKafkaProducer(this.opts, this);
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

  write(record) {
    if (!this.connected) {
      console.log('Kafka Producer not connected');
      return;
    }
    record.logproject = this.logproject;
    record.logstore = this.logstore;
    record.topic = this.topic;
    // 发消息
    try {
      this.producer.produce(
        // Topic to send the message to
        this.topic,
        // optionally we can manually specify a partition for the message
        // this defaults to -1 - which will use librdkafka's default partitioner (consistent random for keyed messages, random for unkeyed messages)
        null,
        // Message to send. Must be a buffer
        new Buffer(JSON.stringify(record)),
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
}

module.exports = KafkaStream;