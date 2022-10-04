import { RawVal } from "./val";
import { ObjectVal } from "./val";

// TODO: separate files + types

/*****************************************
* bytes - Functions concerned with bytes *
******************************************/

/// Serializes an (SC)Val into XDR opaque `Bytes` object.
// @ts-ignore
@external("b", "_")
export declare function serialize_to_bytes(v:RawVal): ObjectVal;

/// Deserialize a `Bytes` object to get back the (SC)Val.
// @ts-ignore
@external("b", "0")
export declare function deserialize_from_bytes(b:ObjectVal): RawVal;

/// Copies a slice of bytes from a `Bytes` object specified at offset `b_pos` with
/// length `len` into the linear memory at position `lm_pos`.
/// Traps if either the `Bytes` object or the linear memory doesn't have enough bytes.
// @ts-ignore
@external("b", "1")
export declare function bytes_copy_to_linear_memory(b:ObjectVal, b_pos:RawVal, lm_pos:RawVal, len:RawVal): RawVal;

/// Copies a segment of the linear memory specified at position `lm_pos` with
/// length `len`, into a `Bytes` object at offset `b_pos`. The `Bytes` object may
/// grow in size to accommodate the new bytes.
/// Traps if the linear memory doesn't have enough bytes.
// @ts-ignore
@external("b", "2")
export declare function bytes_copy_from_linear_memory(b:ObjectVal, b_pos:RawVal, lm_pos:RawVal, len:RawVal): ObjectVal;

/// Constructs a new `Bytes` object initialized with bytes copied from a linear memory slice specified at position `lm_pos` with length `len`.
// @ts-ignore
@external("b", "3")
export declare function bytes_new_from_linear_memory(lm_pos:RawVal, len:RawVal): ObjectVal;

// --------------------------------------------------------
// These functions below ($3-$F) mirror vector operations +
// --------------------------------------------------------

/// Create an empty new `Bytes` object.
// @ts-ignore
@external("b", "4")
export declare function bytes_new(): ObjectVal;

/// Update the value at index `i` in the `Bytes` object. Return the new `Bytes`.
/// Trap if the index is out of bounds.
// @ts-ignore
@external("b", "5")
export declare function bytes_put(v:ObjectVal, i:RawVal, u:RawVal): ObjectVal;

/// Returns the element at index `i` of the `Bytes` object. Traps if the index is out of bound.
// @ts-ignore
@external("b", "6")
export declare function bytes_get(b:ObjectVal, i:RawVal): RawVal;

/// Delete an element in a `Bytes` object at index `i`, shifting all elements after it to the left.
/// Return the new `Bytes`. Traps if the index is out of bound.
// @ts-ignore
@external("b", "7")
export declare function bytes_del(v:ObjectVal, i:RawVal): ObjectVal;

/// Returns length of the `Bytes` object.
// @ts-ignore
@external("b", "8")
export declare function bytes_len(v:ObjectVal): RawVal;

/// Appends an element to the back of the `Bytes` object.
// @ts-ignore
@external("b", "9")
export declare function bytes_push(v:ObjectVal, u:RawVal): ObjectVal;

/// Removes the last element from the `Bytes` object and returns the new `Bytes`.
/// Traps if original `Bytes` is empty.
// @ts-ignore
@external("b", "A")
export declare function bytes_pop(b:ObjectVal): ObjectVal;

/// Return the first element in the `Bytes` object. Traps if the `Bytes` is empty
// @ts-ignore
@external("b", "B")
export declare function bytes_front(b:ObjectVal): RawVal;

/// Return the last element in the `Bytes` object. Traps if the `Bytes` is empty
// @ts-ignore
@external("b", "C")
export declare function bytes_back(v:ObjectVal): RawVal;

/// Inserts an element at index `i` within the `Bytes` object, shifting all elements after it to the right.
/// Traps if the index is out of bound
// @ts-ignore
@external("b", "D")
export declare function bytes_insert(v:ObjectVal, i:RawVal, u:RawVal): ObjectVal;

/// Clone the `Bytes` object `b1`, then moves all the elements of `Bytes` object `b2` into it.
/// Return the new `Bytes`. Traps if its length overflows a u32.
// @ts-ignore
@external("b", "E")
export declare function bytes_append(b1:ObjectVal, b2:ObjectVal): ObjectVal;

/// Copies the elements from `start` index until `end` index, exclusive, in the `Bytes` object and creates a new `Bytes` from it.
/// Returns the new `Bytes`. Traps if the index is out of bound.
// @ts-ignore
@external("b", "F")
export declare function bytes_slice(b:ObjectVal, start:RawVal, end:RawVal): ObjectVal;


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
export declare function compute_hash_sha256(x:ObjectVal): ObjectVal;

// @ts-ignore
@external("c", "0")
export declare function verify_sig_ed25519(x:ObjectVal, k:ObjectVal, s:ObjectVal): RawVal;
