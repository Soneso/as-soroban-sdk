import { RawVal, MapObject, VectorObject, toU32, toBool } from "./host_value";

/**
 * Creates a new map on the host.
 * @returns the map object to be used for further map operations (type: MapObject)
 */
export function new_map(): MapObject {
    return map_new();
}

/**
 * Inserts a key/value mapping into an existing map, and returns the new map object.
 * If the map already has a mapping for the given key, the previous value is overwritten.
 * @param map the map to be updated (type: MapObject)
 * @param key the key of the key/value mapping (type: RawVal)
 * @param value the value to put (type: RawVal)
 * @returns the new map object to be used for further map operations (type: MapObject)
 */
export function put(map: MapObject, key: RawVal, value: RawVal) : MapObject {
    return map_put(map, key, value);
}

/**
 * Get the value for a key from a map. Traps if key is not found.
 * @param map the map to get the value from (type: MapObject)
 * @param key the key to get the value for (type: RawVal)
 * @returns the value if key found, otherwise traps (type: RawVal)
 */
export function get(map: MapObject, key:RawVal) : RawVal {
    return map_get(map, key);
}

/**
 * Remove a key/value mapping from a map if it exists, traps if doesn't.
 * @param map the map to remove from (type: MapObject)
 * @param key the key of the key/value mapping to be removed (type: RawVal)
 * @returns the new map object to be used for further map operations (type: MapObject)
 */
export function del(map: MapObject, key:RawVal) : RawVal {
    return map_del(map, key);
}

/**
 * Returns the size of the given map.
 * @param map the map to get the size for (type: MapObject)
 * @returns the size as u32
 */
export function len(map: MapObject) : u32 {
    let l = map_len(map);
    return toU32(l);
}

/**
 * Test for the presence of a key in a map. Returns true or false
 * @param map the map to check (type: MapObject)
 * @param key the key to search for (type: RawVal)
 * @returns true if the key was found, false otherwise
 */
export function has(map: MapObject, key: RawVal) : bool {
    let present = map_has(map, key);
    return toBool(present);
}

/**
 * Given a key, finds the first key lower than itself in the map's sorted order.
 * If such a key does not exist, returns an SCStatus containing the error code (TBD).
 * @param map the map to check (type: MapObject)
 * @param key the key to search for (type: RawVal)
 * @returns the key if found, otherwise an error of SCStatus (type: RawVal)
 */
export function prev_key(map: MapObject, key: RawVal) : RawVal {
    return map_prev_key(map, key);
}

/**
 * Given a key, finds the first key greater than itself in the map's sorted order.
 * If such a key does not exist, returns an SCStatus containing the error code (TBD).
 * @param map the map to check (type: MapObject)
 * @param key the key to search for (type: RawVal)
 * @returns the key if found, otherwise an error of SCStatus (type: RawVal)
 */
export function next_key(map: MapObject, key: RawVal) : RawVal {
    return map_next_key(map, key);
}

/**
 * Finds the minimum key from a map.
 * If the map is empty, returns an SCStatus containing the error code (TBD).
 * @param map the map to check (type: MapObject)
 * @returns the key if found, otherwise an error of SCStatus (type: RawVal)
 */
export function min_key(map: MapObject) : RawVal {
    return map_min_key(map);
}

/**
 * Finds the maximum key from a map.
 * If the map is empty, returns an SCStatus containing the error code (TBD).
 * @param map the map to check (type: MapObject)
 * @returns the key if found, otherwise an error of SCStatus (type: RawVal)
 */
export function max_key(map: MapObject) : RawVal {
    return map_max_key(map);
}

/**
 * Return a new vector containing all the keys in a map.
 * The new vector is ordered in the original map's key-sorted order.
 * @param map the map to get the keys for (type: MapObject)
 * @returns the vector containing the keys (type: VectorObject)
 */
export function keys(map: MapObject) : VectorObject {
    return map_keys(map);
}

/**
 * Return a new vector containing all the values in a map.
 * The new vector is ordered in the original map's key-sorted order.
 * @param map the map to get the values for (type: MapObject)
 * @returns the vector containing the values (type: VectorObject)
 */
export function values(map: MapObject) : VectorObject {
    return map_values(map);
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