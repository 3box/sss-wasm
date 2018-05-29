const Module = require("./wrapper");

let api = undefined;

function load() {
  if (api) return new Promise(resolve => resolve(api));
  return new Promise(resolve => Module.onRuntimeInitialized = resolve)
    .then(_ => {
      api = {
        getShareLen: Module.cwrap('get_share_len', 'number', []),
        getMessageLen: Module.cwrap('get_message_len', 'number', []),
        getKeyshareLen: Module.cwrap('get_keyshare_len', 'number', []),
        getKeyLen: Module.cwrap('get_key_len', 'number', []),
        createBuffer: Module.cwrap('create_buffer', 'number', ['number', 'number']),
        destroyBuffer: Module.cwrap('destroy_buffer', '', ['number']),
        createShares: Module.cwrap('create_shares', 'number', ['number', 'number', 'number']),
        combineShares: Module.cwrap('combine_shares', 'number', ['number', 'number']),
        createKeyshares: Module.cwrap('create_keyshares', 'number', ['number', 'number', 'number']),
        combineKeyshares: Module.cwrap('combine_keyshares', 'number', ['number', 'number']),
      };
      return api;
    });
}

exports.createShares = function createShares(data, n, k) {
  return load().then(api => {
    const datap = api.createBuffer(data.length);
    Module.HEAPU8.set(data, datap);
    const sharep = api.createShares(datap, n, k);
    api.destroyBuffer(datap);

    const shareLen = api.getShareLen();
    const shares = [];
    for (let i = 0; i < n; i++) {
      shares[i] = Module.HEAPU8.slice(sharep + shareLen * i, sharep + shareLen * (i + 1));
    }
    return shares;
  });
};

exports.combineShares = function combineShares(shares) {
  return load().then(api => {
    const input = api.createBuffer(api.getShareLen() * shares.length);
    for (let s in shares) {
      Module.HEAPU8.set(shares[s], input + s * api.getShareLen());
    }

    const datap = api.combineShares(input, shares.length);
    if (!datap) throw "InvalidAccessError: invalid or too few shares provided";
    api.destroyBuffer(input);

    return Module.HEAPU8.slice(datap, datap + api.getMessageLen());
  });
};

exports.createKeyshares = function createKeyshares(key, n, k) {
  return load().then(api => {
    const keyp = api.createBuffer(key.length);
    Module.HEAPU8.set(key, keyp);
    const sharep = api.createKeyshares(keyp, n, k);
    api.destroyBuffer(keyp);

    const shareLen = api.getKeyshareLen();
    const shares = [];
    for (let i = 0; i < n; i++) {
      shares[i] = Module.HEAPU8.slice(sharep + shareLen * i, sharep + shareLen * (i + 1));
    }
    return shares;
  });
}

exports.combineKeyshares = function combineKeyshares(keyshares) {
  return load().then(api => {
    const input = api.createBuffer(api.getKeyshareLen() * keyshares.length);
    for (let s in keyshares) {
      Module.HEAPU8.set(keyshares[s], input + s * api.getKeyshareLen());
    }

    const keyp = api.combineKeyshares(input, keyshares.length);
    api.destroyBuffer(input);

    return Module.HEAPU8.slice(keyp, keyp + api.getKeyLen());
  });
}