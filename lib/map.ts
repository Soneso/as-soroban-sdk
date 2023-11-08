import { map_del, map_get, map_has, map_keys, map_len, map_key_by_pos, map_new, 
    map_new_from_linear_memory, map_val_by_pos, map_put, 
    map_unpack_to_linear_memory, map_values } from "./env";
import { Val, MapObject, toU32, toBool, fromU32 } from "./value";
import { Vec } from "./vec";

export class Map {
    obj: MapObject;

    /// Constructs from a given MapObject, otherwise creates an empty new map.
    constructor(obj:MapObject = map_new()) {
      this.obj = obj;
    }
  
    /**
     * Returns the handle to the host object as MapObject.
     * @returns handle to the host object.
     */
    getHostObject(): MapObject {
        return this.obj;
    }

    /**
     * Inserts a key/value mapping into the map (in front)
     * If the map already has a mapping for the given key, the previous value is overwritten.
     * @param key the key of the key/value mapping (type: Val)
     * @param value the value to put (type: Val)
     * @returns void
     */
    put(key: Val, value: Val) : void {
        this.obj = map_put(this.obj, key, value);
    }

    /**
     * Get the value for a key from a map. Traps if key is not found.
     * @param key the key to get the value for (type: Val)
     * @returns the value if key found, otherwise traps (type: Val)
     */
    get(key:Val) : Val {
        return map_get(this.obj, key);
    }

    /**
     * Remove a key/value mapping from this map if it exists, traps if doesn't.
     * @param key the key of the key/value mapping to be removed (type: Val)
     * @returns void
     */
    del(key:Val) : void {
        this.obj = map_del(this.obj, key);
    }

    /**
     * Returns the size of this map.
     * @returns the size as u32
     */
    len() : u32 {
        return toU32(map_len(this.obj));
    }

    /**
     * Test for the presence of a key in this map. Returns true or false
     * @param key the key to search for (type: Val)
     * @returns true if the key was found, false otherwise
     */
    has(key: Val) : bool {
        return toBool(map_has(this.obj, key));
    }

    /**
     * Get the key from a map at position `i`. If `i` is an invalid position, return ScError.
     * @param i position
     * @returns the key if found, otherwise an error
     */
    getKeyByPos(i:u32) : Val {
        return map_key_by_pos(this.obj, fromU32(i));
    }

    /**
     * Return a new vector containing all the keys in the map.
     * The new vector is ordered in the original map's key-sorted order.
     * @returns the vector containing the keys (type: VectorObject)
     */
    keys() : Vec {
        return new Vec(map_keys(this.obj));
    }

    /**
     * Return a new vector containing all the values in a map.
     * The new vector is ordered in the original map's key-sorted order.
     * @returns the vector containing the values (type: VectorObject)
     */
    values() : Vec {
        return new Vec(map_values(this.obj));
    }

    /**
     * Get the value from a map at position `i`. If `i` is an invalid position, return ScError.
     * @param i position
     * @returns the value if found, otherwise an error
     */
    getValueByPos(i:u32) : Val {
        return map_val_by_pos(this.obj, fromU32(i));
    }

    /**
     * Creates a new map initialized from a set of input slices given by linear-memory addresses and lengths.
     * @param keys_pos address of the keys.
     * @param vals_pos address of the vals.
     * @param len lenght. 
     * @returns the new map.
     */
    static newFromLinearMemory(keys_pos: u32, vals_pos:u32, len:u32) : Map {
        let obj = map_new_from_linear_memory(fromU32(keys_pos), fromU32(vals_pos), fromU32(len))
        return new Map(obj);
    }

    /**
     * Copy the Val values of this map, as described by set of input keys, into an array at a given linear-memory address.
     * @param keys_pos address of the keys.
     * @param vals_pos address of the vals.
     * @param len lenght.
     */
    unpackToLinearMemory(keys_pos: u32, vals_pos:u32, len:u32) : void  {
        map_unpack_to_linear_memory(this.obj, fromU32(keys_pos), fromU32(vals_pos), fromU32(len));
    }
}