export function createShares(data: Uint8Array, n: number, k: number): Promise<Array<Uint8Array>>
export function combineShares(shares: Array<Uint8Array>): Promise<Uint8Array>
export function createKeyshares(data: Uint8Array, n: number, k: number): Promise<Array<Uint8Array>>
export function combineKeyshares(shares: Array<Uint8Array>): Promise<Uint8Array>
