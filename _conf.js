'use strict';

const {
    DEBUG_MODE = 'false',
    LOG_LEVEL = 'debug',

    MODEL = 'raspi-b+',
    LIGTHS_PIN = '21',
    STORAGE_FOLDER = `${__dirname}/photos`,
    INTERVALS = JSON.stringify([
      {
        'start': '00:00:00',
        'end': '23:59:59',
        'interval': 3.6e+6
      }
    ])
  } = process.env;


module.exports = {
  'log': {
    'level': LOG_LEVEL
  },
  'model': MODEL,
  'debug': DEBUG_MODE === 'true',
  'lights': {
    'pin': Number(LIGTHS_PIN)
  },
  'intervals': JSON.parse(INTERVALS),
  'storage': {
    'folder': STORAGE_FOLDER
  }
};
