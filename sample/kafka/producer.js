const K = require('../../kafka');
const k = new K({
  logproject: 'epaper',
  logstore: 'cw-logger',
  topic: 'testxway',
  opts: {
    'ssl_ca_location': __dirname + '/ca-cert',
    'sasl_plain_username': process.env.KAFKA_SASL_PLAIN_USERNAME,
    'sasl_plain_password': process.env.KAFKA_SASL_PLAIN_PASSWORD,
    'bootstrap_servers': ["kafka-ons-internet.aliyun.com:8080"],
  },
});