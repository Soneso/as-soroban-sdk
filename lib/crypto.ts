import { BytesObject, VoidVal } from "./value";
import { ObjectVal } from "./value";

// TODO: add wrapper functions

/*****************************************
* hash - Functions concerned with hashes *
******************************************/

// @ts-ignore
@external("h", "_")
export declare function hash_from_bytes(x:ObjectVal): ObjectVal;

// @ts-ignore
@external("h", "0")
export declare function hash_to_bytes(x:ObjectVal): ObjectVal;

/**************************************
* key - Functions concerned with keys *
***************************************/

// @ts-ignore
@external("k", "_")
export declare function public_key_from_bytes(x:ObjectVal): ObjectVal;

// @ts-ignore
@external("k", "0")
export declare function public_key_to_bytes(x:ObjectVal): ObjectVal;

/*******************************************
* crypto - Functions concerned with crypto *
********************************************/

// @ts-ignore
@external("c", "_")
export declare function compute_hash_sha256(x:BytesObject): BytesObject;

// @ts-ignore
@external("c", "0")
export declare function verify_sig_ed25519(k:BytesObject, x:BytesObject, s:BytesObject): VoidVal;
