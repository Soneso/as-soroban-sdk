import { Bytes } from "./bytes";
import { StringObject, U32Val, VoidVal, toU32, fromU32 } from "./value";

export class Str {
    obj: StringObject;

    constructor(obj:StringObject) {
        this.obj = obj;
    }

    /**
     * Constructs a new Str from a given string value.
     * Be careful with this, because it copies temporarily the bytes of the given string to 
     * linear memory on position 0 to be able to create a SringObject from the linear memory.
     * If you have something stored in linear memory at that range, it will override it.
     * @param val string value
     * @returns the new Str
     */
    static fromString(val:string) : Str {
        let b = Bytes.fromString(val);
        let len = b.len();
        b.copyToLinearMemory(0, 0, len);
        return new Str(string_new_from_linear_memory(fromU32(0), fromU32(len)));
    }

    /**
     * Constructs a new Str initialized with bytes copied from a linear memory slice specified at position `lm_pos` with length `len`.
     * @param lm_pos see decription (u32)
     * @param len see decription (u32)
     */
    static fromLinearMemory(lm_pos:u32, len:u32) : Str {
        return new Str(string_new_from_linear_memory(fromU32(lm_pos), fromU32(len)));
    }

    /**
     * Returns the handle to the host object as StringObject.
     * @returns handle to the host object.
     */
    getHostObject() : StringObject {
        return this.obj;
    }

    /**
     * Returns length of this Str.
     * @returns length of this Str.
     */
    len() : u32 {
        return toU32(string_len(this.obj));
    }

    /**
     * Copies a slice of bytes from this Str specified at offset `b_pos` with
     * length `len` into the linear memory at position `lm_pos`.
     * Traps if either the associated String host object or the linear memory doesn't have enough bytes.
     * @param s_pos see decription (u32)
     * @param lm_pos see decription (u32)
     * @param len see decription (u32)
     */
    copyToLinearMemory(s_pos:u32, lm_pos:u32, len:u32): void {
        string_copy_to_linear_memory(this.obj, fromU32(s_pos), fromU32(lm_pos), fromU32(len));
    }

}

/*****************
* HOST Functions *
******************/

/// Copies a slice of bytes from a `String` object specified at offset `s_pos` with length `len` into the linear memory at position `lm_pos`.
/// Traps if either the `String` object or the linear memory doesn't have enough bytes.
// @ts-ignore
@external("b", "G")
declare function string_copy_to_linear_memory(s:StringObject, s_pos:U32Val, lm_pos:U32Val, len:U32Val): VoidVal;

/// Constructs a new `String` object initialized with bytes copied from a linear memory slice specified at position `lm_pos` with length `len`.
// @ts-ignore
@external("b", "I")
declare function string_new_from_linear_memory(lm_pos:U32Val, len:U32Val): StringObject;

/// Returns length of the `String` object.
// @ts-ignore
@external("b", "K")
declare function string_len(s:StringObject): U32Val;