import { map_del, map_get, map_has, map_keys, map_len, map_max_key, map_min_key, map_new, 
    map_new_from_linear_memory, map_next_key, map_prev_key, map_put, 
    map_unpack_to_linear_memory, map_values } from "./env";
import { RawVal, MapObject, toU32, toBool, fromU32 } from "./value";
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
     * @param key the key of the key/value mapping (type: RawVal)
     * @param value the value to put (type: RawVal)
     * @returns void
     */
    put(key: RawVal, value: RawVal) : void {
        this.obj = map_put(this.obj, key, value);
    }

    /**
     * Get the value for a key from a map. Traps if key is not found.
     * @param key the key to get the value for (type: RawVal)
     * @returns the value if key found, otherwise traps (type: RawVal)
     */
    get(key:RawVal) : RawVal {
        return map_get(this.obj, key);
    }

    /**
     * Remove a key/value mapping from this map if it exists, traps if doesn't.
     * @param key the key of the key/value mapping to be removed (type: RawVal)
     * @returns void
     */
    del(key:RawVal) : void {
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
     * @param key the key to search for (type: RawVal)
     * @returns true if the key was found, false otherwise
     */
    has(key: RawVal) : bool {
        return toBool(map_has(this.obj, key));
    }

    /**
     * Given a key, finds the first key lower than itself in the map's sorted order.
     * If such a key does not exist, returns an SCStatus containing the error code (TBD).
     * @param key the key to search for (type: RawVal)
     * @returns the key if found, otherwise an error of SCStatus (type: RawVal)
     */
    getPrevKey(key: RawVal) : RawVal {
        return map_prev_key(this.obj, key);
    }

    /**
     * Given a key, finds the first key greater than itself in the map's sorted order.
     * If such a key does not exist, returns an SCStatus containing the error code (TBD).
     * @param key the key to search for (type: RawVal)
     * @returns the key if found, otherwise an error of SCStatus (type: RawVal)
     */
    getNextKey(key: RawVal) : RawVal {
        return map_next_key(this.obj, key);
    }

    /**
     * Finds the minimum key from this map.
     * If the map is empty, returns an SCStatus containing the error code (TBD).
     * @returns the key if found, otherwise an error of SCStatus (type: RawVal)
     */
    getMinKey() : RawVal {
        return map_min_key(this.obj);
    }

    /**
     * Finds the maximum key from this map.
     * If the map is empty, returns an SCStatus containing the error code (TBD).
     * @returns the key if found, otherwise an error of SCStatus (type: RawVal)
     */
    getMaxKey() : RawVal {
        return map_max_key(this.obj);
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
     * Copy the RawVal values of this map, as described by set of input keys, into an array at a given linear-memory address.
     * @param keys_pos address of the keys.
     * @param vals_pos address of the vals.
     * @param len lenght.
     */
    unpackToLinearMemory(keys_pos: u32, vals_pos:u32, len:u32) : void  {
        map_unpack_to_linear_memory(this.obj, fromU32(keys_pos), fromU32(vals_pos), fromU32(len));
    }
}