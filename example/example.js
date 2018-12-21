const { getLogger } = require('../src/main');

const logger = getLogger(module);

/**
 * Logging as info, sending some extra data
 */
logger.info('testing info...', { extra: { data: 'data' } });

/**
 * Logging as warning, sending both extra data and also setting a fingerprint
 * without the fingerprint you would have three different warning logs
 *
 * testing warning 0...
 * testing warning 1...
 * testing warning 2...
 *
 * But with the fingerprint, you will have all these logs grouped together
 */
for (let i = 0; i < 3; i += 1) {
  logger.warn(`testing warning ${i}...`, { fingerprint: ['somefingerprint'], extra: { data: 'data' } });
}

/**
 * Logging as an error, but here using a string intead of an error object.
 * This work but is not optimal, without an error object you do not get a stacktrace
 *
 * Also, here we are also submitting some tags as an example.
 */
logger.error('testing error...', { tags: { cool: 'tag' }, extra: { data: 'data' } });

/**
 * Logging an actual error object, complete with a stacktrace.
 */
logger.error(new Error('testing real error'),
  { extra: { data: 'data', object: { info: 'info', array: [{ moreInfo: 'even more info' }] } } });


/**
 * Here we are throwing an error in an async function, and not catching it.
 * This is to show the default configuration is to log Unhandled Promise Rejections.
 */
const fn = async () => { throw Error('UNHANDLED PROMISE REJECTION!'); };
fn();

/**
 * Here we are throwing an error in async function, and not catching it.
 * This is to show the default configuration is to all errors, even uncaught errors.
 */
const fn2 = () => { throw Error('UNHANDLED ERROR!'); };
fn2();
