# Shamir secret sharing for Javascript

[![Greenkeeper badge](https://badges.greenkeeper.io/3box/sss-wasm.svg)](https://greenkeeper.io/)

[Shamir secret sharing](https://en.wikipedia.org/wiki/Shamir's_Secret_Sharing) is an algorithm for splitting data into multiple `shares`, a subset of which can then be combined to reconstruct the original secret. This library aims to provide javascript bindings for [dsprenkles/sss](https://github.com/dsprenkels/sss/tree/master) implementation of this algorithm using Web Assembly.

## Background
Currently there are bindings for sss in node.js. However this code will not run in the browser since it uses node binaries. By using Web Assembly it is possible to create a javascript library that works both in the browser as well as node.js.

## Usage
```js
// Import the sss library
const sss = require("sss-wasm");

// Create a buffer for the data that will be shared (must be 64 bytes long)
const data = new Uint8Array(64);
data.fill(0x42);

const amount = 5;
const theshold = 4;

// Creating 5 shares (need 3 to restore)
let sharesPromise = sss.createShares(data, amount, theshold);

// Write the shares to the screen
sharesPromise.then((x) => {
    console.log(x);
    return x;
});

// For demonstrational purpose, lose one of the shares
let newSharesPromise = sharesPromise.then((x) => {
    return [x[3], x[2], x[4], x[0]];
});

// Restore the original secret
let restoredPromise = newSharesPromise.then((x) => {
    return sss.combineShares(x);
});

// Dump the original secret back to the screen
let main = restoredPromise.then((x) => {
    console.log(x);
}).catch((x) => {
    console.log("Error: " + x);
});
```

## Build
We need Emscripten toolchain installed to build wasm. [More info](https://webassembly.org/getting-started/developers-guide/)

```
$ npm install
$ npm run build:wasm
$ npm run build
```