import { Bytes } from "./bytes";
import { symbol_copy_to_linear_memory, symbol_index_in_linear_memory, symbol_len, symbol_new_from_linear_memory } from "./env";
import { SymbolObject, toU32, fromU32 } from "./value";

export class Sym {
    obj: SymbolObject;

    constructor(obj:SymbolObject) {
        this.obj = obj;
    }

    /**
     * Constructs a new Sym from a given string value. Only this caracters are allowed: [_0-9A-Za-z]
     * @param val string value (containig only [_0-9A-Za-z]) up to 32 characters long
     * @returns the new Sym
     */
    static fromSymbolString(val:string) : Sym {
        let b = Bytes.fromString(val);
        let len = b.len();
        b.copyToLinearMemory(0, 0, len);
        return new Sym(symbol_new_from_linear_memory(fromU32(0), fromU32(len)));
    }

    /**
     * Constructs a new Sym initialized with bytes copied from a linear memory slice specified at position `lm_pos` with length `len`.
     * @param lm_pos see decription (u32)
     * @param len see decription (u32)
     */
    static fromLinearMemory(lm_pos:u32, len:u32) : Sym {
        return new Sym(symbol_new_from_linear_memory(fromU32(lm_pos), fromU32(len)));
    }

    /**
     * Returns the handle to the host object as SymbolObject.
     * @returns handle to the host object.
     */
    getHostObject() : SymbolObject {
        return this.obj;
    }

    /**
     * Returns length of this Sym.
     * @returns length of this Sym.
     */
    len() : u32 {
        return toU32(symbol_len(this.obj));
    }

    /**
     * Copies a slice of bytes from this Sym specified at offset `b_pos` with
     * length `len` into the linear memory at position `lm_pos`.
     * Traps if either the associated Symbol host object or the linear memory doesn't have enough bytes.
     * @param s_pos see decription (u32)
     * @param lm_pos see decription (u32)
     * @param len see decription (u32)
     */
    copyToLinearMemory(s_pos:u32, lm_pos:u32, len:u32): void {
        symbol_copy_to_linear_memory(this.obj, fromU32(s_pos), fromU32(lm_pos), fromU32(len));
    }

    /**
     * Return the index of a Symbol in an array of linear-memory byte-slices, or trap if not found.
     * @param slices_pos see decription (u32)
     * @param len see decription (u32)
     * @returns position as u32
     */
    symbolIndexInLinearMemory(slices_pos:u32, len:u32) : u32 {
        let res = symbol_index_in_linear_memory(this.obj, fromU32(slices_pos), fromU32(len));
        return toU32(res);
    }
}