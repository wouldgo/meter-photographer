'use strict';

const {from} = require('rxjs')
  , {exhaustMap, of, catchError, retry} = require('rxjs/operators')
  , whenTriggerModule = require('./when-trigger')
  , lightsModule = require('./lights')
  , cameraModule = require('./camera');

module.exports = async({log, conf}) => {
  const whenTrigger = await whenTriggerModule({log, conf})
    , {turnOn, turnOff} = await lightsModule({log, conf})
    , {takePhoto} = await cameraModule({log, conf})
    , takePhotoAndStore = async now => {
        log.info('Preparing for camera shoot');
        try {

          await turnOn();
          const {whereIsStored} = await takePhoto(now);

          log.info('Tearing down camera shoot scenario');
          await turnOff();

          return whereIsStored;
        } catch (error) {

          log.info(`Taking photo and store it returns an error: ${error.message}`);
          throw error;
        }
      };


  return whenTrigger
    .pipe(
      exhaustMap(now =>
        from(takePhotoAndStore(now))
          .pipe(retry(10))
      ),
      catchError(error => of(`Taking photo at last throw something: ${error.message}`))
    );
};
