#include "sss/randombytes.h"

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

#if defined(__EMSCRIPTEN__)
static int randombytes_emscripten_randombytes(void *buf, size_t n)
{
	const int ret = EM_ASM_INT({
		if (typeof window!=="undefined") {
			var crypto = window.crypto || window.msCrypto;
			if (crypto) {
				var buf = new window.Uint8Array($1);
				crypto.getRandomValues(buf);
				writeArrayToMemory(buf, $0);
				return 0;
			}
		}
		var crypto = require('crypto');
		if (crypto) {
			writeArrayToMemory(crypto.randomBytes($1), $0);
			return 0;
		}
		return -1;
	}, buf, n);
	return ret;
}
#endif /* defined(__EMSCRIPTEN__) */

int randombytes(void *buf, size_t n)
{
#if defined(__EMSCRIPTEN__)
#pragma message("Using browser window.crypto.getRandomValues")
	/* Use window.crypto.getRandomValues */
	return randombytes_emscripten_randombytes(buf, n);
#else
#error "randombytes(...) is not supported on this platform"
#endif
}
