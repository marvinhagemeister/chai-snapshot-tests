# Chai Snapshot Tests

Adds support for [Jest-like snapshot testing](https://facebook.github.io/jest/docs/snapshot-testing.html)
to chai. It works by creating a `__snapshots__` directory alongside your tests,
which contains the snapshot files in `json` format.

## Installation

```bash
# npm
npm install --save-dev chai-snapshot-tests

# yarn
yarn add --dev chai-snapshot-tests
```

## Usage

```js
const chai = require("chai");
const snapshots = require("chai-snapshot-tests");

chai.use(snapshots());

const { assert, expect } = chai;

// Example with strings, but works with anything!
assert.snapshot("snapName", "This is the expected text");
expect("This is the expected text").toMatchSnapshot("snapName");

// Pass `true` to update the snapshot `snapName` with a new value
expect("Another text").toMatchSnapshot("snapName", true);
```

## License

MIT, see [License.md](LICENSE.md)
