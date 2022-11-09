import { RawVal, MapObject, toU32, toBool, VectorObject } from "./value";
import { Vec } from "./vec";

export class Map {
    obj: MapObject;

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
}

/******************
 * HOST FUNCTIONS *
 ******************/

// @ts-ignore
@external("m", "_")
declare function map_new(): MapObject;

/// Insert a key/value mapping into an existing map, and return the map object handle.
/// If the map already has a mapping for the given key, the previous value is overwritten.
// @ts-ignore
@external("m", "0")
declare function map_put(m:MapObject, k:RawVal, v:RawVal): MapObject;

/// Get the value for a key from a map. Traps if key is not found.
// @ts-ignore
@external("m", "1")
declare function map_get(m:MapObject, k:RawVal): RawVal;

/// Remove a key/value mapping from a map if it exists, traps if doesn't.
// @ts-ignore
@external("m", "2")
declare function map_del(m:MapObject, k:RawVal): MapObject;

/// Get the size of a map.
// @ts-ignore
@external("m", "3")
declare function map_len(m:MapObject): RawVal;

/// Test for the presence of a key in a map. Returns (SCStatic) TRUE/FALSE.
// @ts-ignore
@external("m", "4")
declare function map_has(m:MapObject, k:RawVal): RawVal;

/// Given a key, find the first key less than itself in the map's sorted order.
/// If such a key does not exist, return an SCStatus containing the error code (TBD).
// @ts-ignore
@external("m", "5")
declare function map_prev_key(m:MapObject, k:RawVal): RawVal;

/// Given a key, find the first key greater than itself in the map's sorted order.
/// If such a key does not exist, return an SCStatus containing the error code (TBD).
// @ts-ignore
@external("m", "6")
declare function map_next_key(m:MapObject, k:RawVal): RawVal;

/// Find the minimum key from a map.
/// If the map is empty, return an SCStatus containing the error code (TBD).
// @ts-ignore
@external("m", "7")
declare function map_min_key(m:MapObject): RawVal;

/// Find the maximum key from a map.
/// If the map is empty, return an SCStatus containing the error code (TBD).
// @ts-ignore
@external("m", "8")
declare function map_max_key(m:MapObject): RawVal;

/// Return a new vector containing all the keys in a map.
/// The new vector is ordered in the original map's key-sorted order.
// @ts-ignore
@external("m", "9")
declare function map_keys(m:MapObject): VectorObject;

/// Return a new vector containing all the values in a map.
/// The new vector is ordered in the original map's key-sorted order.
// @ts-ignore
@external("m", "A")
declare function map_values(m:MapObject): VectorObject;