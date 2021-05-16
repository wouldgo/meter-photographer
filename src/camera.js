'use strict';

const fs = require('fs')
  , {promisify} = require('util')
  , {Raspistill} = require('node-raspistill')
  , writeFile = promisify(fs.writeFile);

module.exports = async({log, conf}) => {
  const {debug, storage} = conf
    , {folder} = storage
    , camera = (() => {
        if (!debug) {

          return new Raspistill({
            'noFileSave': true,
            'encoding': 'png',
            'width': 800,
            'height': 600
          });
        }

        return {
          'takePhoto': () => new Promise(resolve => resolve(Buffer.from([
            1,
            2,
            3,
            4
          ])))
        };
      })();

  log.info('Camera module started');
  return {
    'takePhoto': async(now = new Date()) => {
      const photo = await camera.takePhoto()
        , fileName = `${now.toISOString()}.png`
        , whereIsStored = `${folder}/${fileName}`;

      log.info(`Photo ${whereIsStored} taken`);
      await writeFile(whereIsStored, photo, {
        'encoding': 'binary'
      });

      return {
        whereIsStored,
        fileName,
        photo
      };
    }
  };
};
