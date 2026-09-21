const { TestEnvironment } = require('jest-environment-jsdom');

// jsdom does not implement the Fetch API globals that react-router relies on,
// so copy them in from the Node.js realm.
class JSDOMEnvironment extends TestEnvironment {
  constructor(config, context) {
    super(config, context);
    for (const name of ['fetch', 'Request', 'Response', 'Headers', 'TextEncoder', 'TextDecoder']) {
      if (typeof this.global[name] === 'undefined') {
        this.global[name] = globalThis[name];
      }
    }
  }
}

module.exports = JSDOMEnvironment;
