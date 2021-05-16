'use strict';

// eslint-disable-next-line import/no-unassigned-import
require('make-promises-safe');

const {defer} = require('rxjs')
  , logger = require('pino')
  , conf = require('./_conf')
  , log = logger({
      'level': conf.log.level
    })
  , {name, version} = require('./package')
  // eslint-disable-next-line import/max-dependencies
  , actionsModule = require('./src');

(async() => {
  const actions = await actionsModule({
        conf,
        log
      })
    , toSub = defer(() => actions)
    , terminationPolicy = async() => {

        log.info('Termination policy started. Stop to be ready.');
      }
    , reactor = toSub.subscribe({
        'next': (value = 'iteration done') => {

          log.info(JSON.stringify(value));
        },
        'error': async err => {

          log.error(err);
          await terminationPolicy();
        },
        'complete': async() => {

          log.info('complete');
          await terminationPolicy();
        }
      })
    , onProcessEvents = async() => {
        await terminationPolicy();

        reactor.unsubscribe();
      };

  for (const anEvent of ['SIGINT', 'SIGTERM']) {

    log.info(`Registering ${anEvent} termination event listener`);
    process.on(anEvent, onProcessEvents);
  }
  log.info(`${name}@${version} starting to process data....`);
})();
