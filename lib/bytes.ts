import { BytesObject, RawVal, U32Val, fromU32, toU32 } from "./value";

export class Bytes {
    obj: BytesObject;

    constructor(obj:BytesObject = bytes_new()) {
      this.obj = obj;
    }

    /**
     * Returns the handle to the host object as BytesObject.
     * @returns handle to the host object.
     */
    getHostObject() : BytesObject {
        return this.obj;
    }

    /**
     * Creates a new Bytes object on the host from the given string. The string must contain only utf8 characters.
     * @param str the string to create the bytes object from
     * @returns the Bystes object created.
     */
    static fromString(str: string) : Bytes {
        let result = new Bytes();
        for (var i=0; i < str.length; i++) {
          result.push(str.charCodeAt(i));
        }
        return result;
    }

    /**
     * Creates a new Bytes object on the host from the given contract id.
     * If the contract id is shorter than 32 bytes, it fills the needed bytes with 0.
     * @param contractId contract id as hex string
     * @returns the new Bytes object created.
     */
    static fromContractId(contractId: string) : Bytes {
        let result = Bytes.fromHexString(contractId);
        let len = result.len();
        if (len == 32) {
            return result;
        }
        var fill = 32 - len;
        var filled = new Bytes();
        while(fill > 0) {
            filled.push(0);
            fill -= 1;
        }
        filled = filled.append(result);
        return filled;
    }

    /**
     * Creates a new Bytes object on the host from the given wasm hash.
     * If the wasm hash is shorter than 32 bytes, it fills the needed bytes with 0.
     * @param wasmHash wasm hash as hex string
     * @returns the new Bytes object created.
     */
    static fromWasmHash(wasmHash: string) : Bytes {
        let result = Bytes.fromHexString(wasmHash);
        let len = result.len();
        if (len == 32) {
            return result;
        }
        var fill = 32 - len;
        var filled = new Bytes();
        while(fill > 0) {
            filled.push(0);
            fill -= 1;
        }
        filled = filled.append(result);
        return filled;
    }

    /**
     * Creates a new Bytes object on the host from the given hex string.
     * @param hex the hex string to create the bytes object from
     * @returns the new Bytes object created.
     */
    static fromHexString(hex: string) : Bytes {
        let result = new Bytes();
        let length =  hex.length;
        for (var i = 0; i < (length / 2); i++) {
            let temp_high = Bytes.charToInt(hex.charCodeAt(i*2));
            let temp_low = Bytes.charToInt(hex.charCodeAt(i*2+1));
            let app = Bytes.appendNumbers(temp_high, temp_low);
            result.push(app as u32);
        }
        return result;
    }

    /**
     * Creates a new Bytes object by serializing a RawVal into XDR opaque `Bytes` object.
     * @param v value to serialize 
     * @returns the new Bytes object
     */
    static serialize(v:RawVal) : Bytes {
        return new Bytes(serialize_to_bytes(v));
    }

    /**
     * Deserialize this `Bytes` object to get back the RawVal.
     * @returns the deserialized value
     */
    deserialize(): RawVal {
        return deserialize_from_bytes(this.obj);
    }

    /**
     * Copies a slice of bytes from this `Bytes` object specified at offset `b_pos` with
     * length `len` into the linear memory at position `lm_pos`.
     * Traps if either this `Bytes` object or the linear memory doesn't have enough bytes.
     * @param b_pos see decription (u32)
     * @param lm_pos see decription (u32)
     * @param len see decription (u32)
     */
    copyToLinearMemory(b_pos:u32, lm_pos:u32, len:u32): void {
        bytes_copy_to_linear_memory(this.obj, fromU32(b_pos), fromU32(lm_pos), fromU32(len));
    }

    /**
     * Copies a segment of the linear memory specified at position `lm_pos` with
     * length `len`, into this `Bytes` object at offset `b_pos`. The `Bytes` object may
     * grow in size to accommodate the new bytes. 
     * Traps if the linear memory doesn't have enough bytes.
     * @param b_pos see description (u32)
     * @param lm_pos see description (u32)
     * @param len see description (u32)
     * @returns void
     */
    copyFromLinearMemory(b_pos:u32, lm_pos:u32, len:u32): void {
        this.obj = bytes_copy_from_linear_memory(this.obj, fromU32(b_pos), fromU32(lm_pos), fromU32(len));
    }

    /**
     * Constructs a new `Bytes` object initialized with bytes copied from a linear memory slice specified at position `lm_pos` with length `len`.
     * @param lm_pos see desctiption
     * @param len  see desctiption
     * @returns the new Bytes object.
     */
    static newFromLinearMemory(lm_pos:u32, len:u32): Bytes {
        return new Bytes(bytes_new_from_linear_memory(fromU32(lm_pos), fromU32(len)));
    }

    /**
     * Update the value at index `i` in the `Bytes` object. 
     * @param i the index to be updated
     * @param value the value to be updated (Type: RawVal)
     * @returns void. Traps if the index is out of bound. (e.g. if empty)
     */
    put(i:u32, value: u32) : void {
        this.obj = bytes_put(this.obj, fromU32(i), fromU32(value));
    }

    /**
     * Returns the element at index `i` of the `Bytes` object. Traps if the index is out of bound.
     * @param i the index
     * @returns the value (u32). Traps if the index is out of bound.
     */
    get(i:u32) : u32 {
        return toU32(bytes_get(this.obj, fromU32(i)));
    }

    /**
     * Delete an element in this `Bytes` object at index `i`, shifting all elements after it to the left.
     * @param i the index of the element to be deleted
     * @returns void. Traps if the index is out of bound.
     */
     del(i:u32) : void {
        this.obj = bytes_del(this.obj, fromU32(i));
    }

    /**
     * Returns length of this `Bytes` object.
     * @returns length of this `Bytes` object.
     */
    len() : u32 {
        return toU32(bytes_len(this.obj));
    }

    /**
     * Appends an element to the back of the `Bytes` object.
     * @param value the value to append (Type: u32)
     * @returns void.
     */
    push(value: u32) : void {
        this.obj = bytes_push(this.obj, fromU32(value));
    }

    /**
     * Removes the last element from the `Bytes` object.
     * Traps if original `Bytes` is empty.
     */
    pop(): void {
        this.obj = bytes_pop(this.obj);
    }

    /**
     * Return the first element in the `Bytes` object. Traps if the `Bytes` is empty
     * @returns the first element in the `Bytes` object (u32).
     */
    front(): u32 {
        return toU32(bytes_front(this.obj));
    }

    /**
     * Return the last element in the `Bytes` object. Traps if the `Bytes` is empty
     * @returns the last element in the `Bytes` object (u32).
     */
    back(): u32 {
        return toU32(bytes_back(this.obj));
    }

    /**
     * Inserts an element at index `i` within the `Bytes` object, shifting all elements after it to the right.
     * Traps if the index is out of bound.
     * @param i the index to insert the element to
     * @param value the element to insert (u32).
     * @returns void
     */
    insert(i: u32, value: u32) : void {
        this.obj = bytes_insert(this.obj, fromU32(i), fromU32(value));
    }

    /**
     * Clone this `Bytes` object, then moves all the elements of `Bytes` object `bytes2` into it.
     * Return the new `Bytes`. Traps if its length overflows a u32.
     * @param bytes2 the 'Bytes' object to append from
     * @returns the new `Bytes` object.
     */
    append(bytes2: Bytes) : Bytes {
        return new Bytes(bytes_append(this.obj, bytes2.getHostObject()));
    }

    /**
     * Copies the elements from `start` index until `end` index, exclusive, in the `Bytes` object and creates a new `Bytes` from it.
     * @param start see description.
     * @param end see description.
     * @returns the new `Bytes` object.
     */
    slice(start:u32, end:u32): Bytes {
        return new Bytes(bytes_slice(this.obj, fromU32(start), fromU32(end)));
    }

    /*****************
    * HELPERS *
    ******************/

    static charToInt(letter:i32) : i32
    {
        // First we want to check if its 0-9, A-F, or a-f) --> See ASCII Table
        if(letter > 47 && letter < 58) {
            // 0-9
            return letter - 48;
            // The Letter "0" is in the ASCII table at position 48 -> meaning if we subtract 48 we get 0 and so on...
        } else if(letter > 64 && letter < 71) {
            // A-F
            return letter - 55 
            // The Letter "A" (dec 10) is at Pos 65 --> 65-55 = 10 and so on..
        } else if(letter > 96 && letter < 103) {
            // a-f
            return letter - 87
            // The Letter "a" (dec 10) is at Pos 97--> 97-87 = 10 and so on...
        }
        // Not supported letter...
        return -1;
    }

    static appendNumbers(higherNibble:i32, lowerNibble:i32) : i32
    {
        var myNumber = higherNibble << 4;
        myNumber |= lowerNibble;
        return myNumber;
        // Example: higherNibble = 0x0A, lowerNibble = 0x03;  -> myNumber 0 0xA3
        // Of course you have to ensure that the parameters are not bigger than 0x0F 
    }
}

/*****************
* HOST Functions *
******************/

/// Serializes an (SC)Val into XDR opaque `Bytes` object.
// @ts-ignore
@external("b", "_")
declare function serialize_to_bytes(v:RawVal): BytesObject;

/// Deserialize a `Bytes` object to get back the (SC)Val.
// @ts-ignore
@external("b", "0")
declare function deserialize_from_bytes(b:BytesObject): RawVal;

/// Copies a slice of bytes from a `Bytes` object specified at offset `b_pos` with
/// length `len` into the linear memory at position `lm_pos`.
/// Traps if either the `Bytes` object or the linear memory doesn't have enough bytes.
// @ts-ignore
@external("b", "1")
declare function bytes_copy_to_linear_memory(b:BytesObject, b_pos:U32Val, lm_pos:U32Val, len:U32Val): RawVal;

/// Copies a segment of the linear memory specified at position `lm_pos` with
/// length `len`, into a `Bytes` object at offset `b_pos`. The `Bytes` object may
/// grow in size to accommodate the new bytes.
/// Traps if the linear memory doesn't have enough bytes.
// @ts-ignore
@external("b", "2")
declare function bytes_copy_from_linear_memory(b:BytesObject, b_pos:U32Val, lm_pos:U32Val, len:U32Val): BytesObject;

/// Constructs a new `Bytes` object initialized with bytes copied from a linear memory slice specified at position `lm_pos` with length `len`.
// @ts-ignore
@external("b", "3")
declare function bytes_new_from_linear_memory(lm_pos:U32Val, len:U32Val): BytesObject;

// --------------------------------------------------------
// These functions below ($3-$F) mirror vector operations +
// --------------------------------------------------------

/// Create an empty new `Bytes` object.
// @ts-ignore
@external("b", "4")
declare function bytes_new(): BytesObject;

/// Update the value at index `i` in the `Bytes` object. Return the new `Bytes`.
/// Trap if the index is out of bounds.
// @ts-ignore
@external("b", "5")
declare function bytes_put(v:BytesObject, i:U32Val, u:U32Val): BytesObject;

/// Returns the element at index `i` of the `Bytes` object. Traps if the index is out of bound.
// @ts-ignore
@external("b", "6")
declare function bytes_get(b:BytesObject, i:U32Val): U32Val;

/// Delete an element in a `Bytes` object at index `i`, shifting all elements after it to the left.
/// Return the new `Bytes`. Traps if the index is out of bound.
// @ts-ignore
@external("b", "7")
declare function bytes_del(v:BytesObject, i:U32Val): BytesObject;

/// Returns length of the `Bytes` object.
// @ts-ignore
@external("b", "8")
declare function bytes_len(v:BytesObject): U32Val;

/// Appends an element to the back of the `Bytes` object.
// @ts-ignore
@external("b", "9")
declare function bytes_push(v:BytesObject, u:RawVal): BytesObject;

/// Removes the last element from the `Bytes` object and returns the new `Bytes`.
/// Traps if original `Bytes` is empty.
// @ts-ignore
@external("b", "A")
declare function bytes_pop(b:BytesObject): BytesObject;

/// Return the first element in the `Bytes` object. Traps if the `Bytes` is empty
// @ts-ignore
@external("b", "B")
declare function bytes_front(b:BytesObject): U32Val;

/// Return the last element in the `Bytes` object. Traps if the `Bytes` is empty
// @ts-ignore
@external("b", "C")
declare function bytes_back(v:BytesObject): U32Val;

/// Inserts an element at index `i` within the `Bytes` object, shifting all elements after it to the right.
/// Traps if the index is out of bound
// @ts-ignore
@external("b", "D")
declare function bytes_insert(v:BytesObject, i:U32Val, u:U32Val): BytesObject;

/// Clone the `Bytes` object `b1`, then moves all the elements of `Bytes` object `b2` into it.
/// Return the new `Bytes`. Traps if its length overflows a u32.
// @ts-ignore
@external("b", "E")
declare function bytes_append(b1:BytesObject, b2:BytesObject): BytesObject;

/// Copies the elements from `start` index until `end` index, exclusive, in the `Bytes` object and creates a new `Bytes` from it.
/// Returns the new `Bytes`. Traps if the index is out of bound.
// @ts-ignore
@external("b", "F")
declare function bytes_slice(b:BytesObject, start:U32Val, end:U32Val): BytesObject;