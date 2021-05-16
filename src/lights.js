'use strict';

const {promisify} = require('util')
  , rpio = require('rpio')
  , waitABit = promisify(setTimeout);

module.exports = async({log, conf}) => {
  const {debug, lights, model} = conf
    , {pin} = lights
    , configOpts = {
        'mapping': 'gpio'
      };

  if (debug) {

    configOpts.mock = model;
  }

  log.debug('Initializing GPIO...');
  rpio.init(configOpts);
  rpio.open(pin, rpio.OUTPUT, rpio.LOW);

  await waitABit(500);

  log.info(`Lights module started. Light is on pin ${pin} (GPIO)`);
  return {
    'turnOn': async() => {
      log.info('Turning on lights...');
      try {

        rpio.write(pin, rpio.HIGH);
      } catch (err) {

        log.error(`Turning on lights went in error: ${err}`);
        throw err;
      }
    },
    'turnOff': async() => {
      log.info('Turning off lights...');
      try {

        rpio.write(pin, rpio.LOW);
      } catch (err) {

        log.error(`Turning off lights went in error: ${err}`);
        throw err;
      }
    }
  };
};
