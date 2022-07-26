# Shamir secret sharing for Javascript
[Shamir secret sharing](https://en.wikipedia.org/wiki/Shamir's_Secret_Sharing) is an algorithm for splitting data into multiple `shares`, a subset of which can then be combined to reconstruct the original secret. This library aims to provide javascript bindings for [dsprenkles/sss](https://github.com/dsprenkels/sss/tree/master) implementation of this algorithm using Web Assembly.

## Background
Currently there are bindings for sss in node.js. However this code will not run in the browser since it uses node binaries. By using Web Assembly it is possible to create a javascript library that works both in the browser as well as node.js.

## Usage
```ts
// Import the sss library
import * as sss from 'sss-wasm' 

// Create a buffer for the data that will be shared (must be 64 bytes long)
const data = new Uint8Array(64);
data.fill(0x42);

const amount = 5;
const threshold = 4;

// Creating 5 shares (need 3 to restore)
const shares = await sss.createShares(data, amount, threshold);

// For demonstrational purpose, lose one of the shares
const newShares = [shares[3], shares[2], shares[4], shares[0]]

// Restore the original secret
const restored = await sss.combineShares(newShares);

// Dump the original secret back to the screen
console.log(restored)
```

## Build
We need Emscripten toolchain installed to build wasm. [More info](https://webassembly.org/getting-started/developers-guide/)

You need to setup submodules first.
```
git submodules init
git submodules update
cd sss
git submodules init
git submodules update
```

Then go to the root folder.
```
npm install
npm run build
npm run test
```
