#include <stdlib.h>
#include <emscripten.h>
#include "sss/sss.h"
#include "sss/randombytes/randombytes.h"

EMSCRIPTEN_KEEPALIVE
int get_share_len()
{
    return sss_SHARE_LEN;
}

EMSCRIPTEN_KEEPALIVE
int get_message_len()
{
    return sss_MLEN;
}

EMSCRIPTEN_KEEPALIVE
int get_keyshare_len()
{
    return sss_KEYSHARE_LEN;
}

EMSCRIPTEN_KEEPALIVE
int get_key_len()
{
    return 32;
}

EMSCRIPTEN_KEEPALIVE
uint8_t *create_shares(uint8_t *data, uint8_t n, uint8_t k)
{
    uint8_t *output = (uint8_t *)malloc(sss_SHARE_LEN * n);
    sss_create_shares((sss_Share *)output, data, n, k);
    return output;
}

EMSCRIPTEN_KEEPALIVE
uint8_t *combine_shares(uint8_t *input, uint8_t k)
{
    uint8_t *data = (uint8_t *)malloc(sss_MLEN);
    if (sss_combine_shares(data, (sss_Share *)input, k) == 0) {
        return data;
    } else {
        free(data);
        return NULL;
    }
}

EMSCRIPTEN_KEEPALIVE
uint8_t *create_keyshares(uint8_t *key, uint8_t n, uint8_t k)
{
    uint8_t *output = (uint8_t *)malloc(sss_KEYSHARE_LEN * n);
    sss_create_keyshares((sss_Keyshare *)output, key, n, k);
    return output;
}

EMSCRIPTEN_KEEPALIVE
uint8_t *combine_keyshares(uint8_t *input, uint8_t k)
{
    uint8_t *key = (uint8_t *)malloc(32);
    sss_combine_keyshares(key, (sss_Keyshare *)input, k);
    return key;
}

EMSCRIPTEN_KEEPALIVE
uint8_t *create_buffer(uint8_t length)
{
    return malloc(length * sizeof(uint8_t));
}

EMSCRIPTEN_KEEPALIVE
void destroy_buffer(uint8_t *p)
{
    free(p);
}
