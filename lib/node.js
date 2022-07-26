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

export * from './index.js'
