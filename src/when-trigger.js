'use strict';

const {Observable} = require('rxjs');

module.exports = async({log, conf}) => {
  const {intervals} = conf;

  return new Observable(subscriber => {
    const actualIntervals = []
      , intervalLogic = (start, end) => {
        const now = new Date()
          , time = now.toLocaleString(undefined, {
              'hour': 'numeric',
              'minute': 'numeric',
              'second': 'numeric',
              'timeZone': 'Europe/Rome',
              'hour12': false
            });


        if (time >= start && time <= end) {
          log.info(`${now} it's into ${start} - ${end}`);
          return subscriber.next(now);
        }
      };

    for (const {interval, start, end} of intervals) {
      log.info(`Creating interval ${interval} for ${start} - ${end}`);
      const reccurentFunct = setInterval(intervalLogic, interval, start, end);

      actualIntervals.push({
        interval,
        start,
        end,
        reccurentFunct
      });
      intervalLogic(start, end);
    }

    return () => {
      for (const {interval, start, end, reccurentFunct} of actualIntervals) {
        log.info(`Clearing interval ${interval} for ${start} - ${end}`);

        clearInterval(reccurentFunct);
      }
    };
  });
};
