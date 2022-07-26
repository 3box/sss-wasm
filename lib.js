globalThis.__dirname = import.meta.url.match(/^(.+)\/([^\/]+)$/)[1].replace(/^file:\/\//, '')
import { createRequire } from 'module';
globalThis.require = (p) => {
  const origRequire = createRequire(import.meta.url);
  if (p === 'path') {
    const module = origRequire('path')
    return {
      ...module,
      normalize: (a) => a.replace(/^file:\/\//, '')
    }
  } else {
    return origRequire(p)
  }
}

import Wrapper from "./wrapper.js";

let api = undefined;

function load() {
  if (api) return new Promise(resolve => resolve(api));
  return new Promise(resolve => {
    Wrapper().then(Module => {
      api = {
        set: (d, p) => Module.HEAPU8.set(d, p),
        slice: (f, t) => Module.HEAPU8.slice(f, t),
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
      resolve(api);
    });
  });
}

export const createShares = function createShares(data, n, k) {
  return load().then(api => {
    const datap = api.createBuffer(data.length);
    api.set(data, datap);
    const sharep = api.createShares(datap, n, k);
    api.destroyBuffer(datap);

    const shareLen = api.getShareLen();
    const shares = [];
    for (let i = 0; i < n; i++) {
      shares[i] = api.slice(sharep + shareLen * i, sharep + shareLen * (i + 1));
    }
    return shares;
  });
};

export const combineShares = function combineShares(shares) {
  return load().then(api => {
    const input = api.createBuffer(api.getShareLen() * shares.length);
    for (let s in shares) {
      api.set(shares[s], input + s * api.getShareLen());
    }

    const datap = api.combineShares(input, shares.length);
    if (!datap) throw "InvalidAccessError: invalid or too few shares provided";
    api.destroyBuffer(input);

    return api.slice(datap, datap + api.getMessageLen());
  });
};

export const createKeyshares = function createKeyshares(key, n, k) {
  return load().then(api => {
    const keyp = api.createBuffer(key.length);
    api.set(key, keyp);
    const sharep = api.createKeyshares(keyp, n, k);
    api.destroyBuffer(keyp);

    const shareLen = api.getKeyshareLen();
    const shares = [];
    for (let i = 0; i < n; i++) {
      shares[i] = api.slice(sharep + shareLen * i, sharep + shareLen * (i + 1));
    }
    return shares;
  });
}

export const combineKeyshares = function combineKeyshares(keyshares) {
  return load().then(api => {
    const input = api.createBuffer(api.getKeyshareLen() * keyshares.length);
    for (let s in keyshares) {
      api.set(keyshares[s], input + s * api.getKeyshareLen());
    }

    const keyp = api.combineKeyshares(input, keyshares.length);
    api.destroyBuffer(input);

    return api.slice(keyp, keyp + api.getKeyLen());
  });
}
