const minimist = require('minimist');

const space = 2;

const stringify = x => (typeof x === 'string' ? x : JSON.stringify(x, null, space));
const prettyPrint = (...args) => console.log(...args.map(x => stringify(x)));

const init = async fn => {
  const millisecond = 1000000;
  const hrStart = process.hrtime();

  const args = minimist(process.argv.slice(space));

  await fn(args);

  const hrEnd = process.hrtime(hrStart);

  console.info('Done. Execution time (hr): %ds %dms', hrEnd[0], hrEnd[1] / millisecond);
};

module.exports = {
  stringify,
  prettyPrint,
  init,
};
