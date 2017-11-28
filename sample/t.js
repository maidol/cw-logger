const bunyan = require('bunyan');

const { EventEmitter } = require('events');
const util = require('util');

function MyStream(options) {
  this.writable = true;
  this.stream = require('fs').createWriteStream(
    './t.log', {
      flags: 'a',
      encoding: 'utf8'
    }
  );
  this.records = 0;
  this.buffer = Buffer.from('', 'utf8');
  EventEmitter.call(this);
}

util.inherits(MyStream, EventEmitter);

MyStream.prototype.write = function write(record) {
  if (typeof record !== 'string') record = `${JSON.stringify(record)}\n`;
  this.records++;
  if (!this.writable)
    throw (new Error('MyStream has been ended already'));

  this.buffer = Buffer.concat([this.buffer, Buffer.from(record, 'utf8')]);
  if (this.records > 2) {
    console.log(this.buffer.toString());
    this.stream.write(this.buffer);
    this.end();
  }

  return true;
};

MyStream.prototype.end = function end() {
  this.records = 0;
  this.buffer = Buffer.from('', 'utf8');
};

const mys = new MyStream();
const log = bunyan.createLogger({
  name: 'foo',
  streams: [
    // {
    //     level: 'info',
    //     stream: process.stdout
    // },
    {
      level: 'trace',
      type: 'raw', // use 'raw' to get raw log record objects
      stream: mys
    }
  ],
  src: true
});

setInterval(() => {
  log.info('hello');
  log.info('hello');
  log.info('hello');
}, 3000);

// /* Create a ring buffer that stores the last 100 records. */
// let ringbuffer = new bunyan.RingBuffer({ limit: 2 });
// const log = bunyan.createLogger({
//     name: 'foo',
//     streams: [
//         {
//             level: 'info',
//             stream: process.stdout
//         },
//         {
//             level: 'trace',
//             type: 'raw',    // use 'raw' to get raw log record objects
//             stream: ringbuffer
//         }
//     ],
//     src: true
// });

// log.info('hello world');
// log.info('hello world');
// log.info('hello world');
// log.info('hello world');
// log.info('hello world');
// log.info('hello world');
// console.log(ringbuffer.records);