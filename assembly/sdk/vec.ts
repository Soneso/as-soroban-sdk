import { VectorObject, RawVal, fromVoid, fromU32, toU32 } from "./host_value";


/**
 * Creates a new empty vector on the host.
 * @returns the handle of the created vector (Type: VectorObject)
 */
export function new_empty(): VectorObject {
    return vec_new(fromVoid());
}

/**
 * Creates a new vector on the host with the capacity given.
 * @param capacity capacity of the new vector to be created.
 * @returns the handle of the created vector (Type: VectorObject)
 */
export function new_with_capacity(capacity: u32): VectorObject {
    return vec_new(fromU32(capacity));
}

/**
 * Update the value at index `i` in the vector.
 * @param vec the handle of the vector to be updated (Type: VectorObject)
 * @param i the index to be updated
 * @param value the value to be updated (Type: RawVal)
 * @returns the handle of the new vector (Type: VectorObject)
 */
export function put(vec: VectorObject, i:u32, value: RawVal) : VectorObject {
    return vec_put(vec, fromU32(i), value);
}

/**
 *  Returns the element at index `i` of the vector. Traps if the index is out of bound.
 * @param vec the handle of the vector (Type: VectorObject)
 * @param i the index
 * @returns the value (Type: RawVal). Traps if the index is out of bound.
 */
export function get(vec: VectorObject, i:u32) : RawVal {
    return vec_get(vec, fromU32(i));
}

/**
 * Deletes an element in a vector at index `i`, shifting all elements after it to the left.
 * @param vec the handle of the vector (Type: VectorObject)
 * @param i the index of the element to be deleted
 * @returns the handle of the new vector (Type: VectorObject). Traps if the index is out of bound.
 */
export function del(vec: VectorObject, i:u32) : VectorObject {
    return vec_del(vec, fromU32(i));
}

/**
 *  Returns length of the vector.
 * @param vec the handle of the vector (Type: VectorObject)
 * @returns length of the vector.
 */
export function len(vec: VectorObject) : u32 {
    return toU32(vec_len(vec));
}

/**
 * Pushes a value to the front of a vector.
 * @param vec the handle of the vector (Type: VectorObject)
 * @param value the value to push (Type: RawVal)
 * @returns the handle of the new vector (Type: VectorObject).
 */
export function push_front(vec: VectorObject, value: RawVal) : VectorObject {
    return vec_push_front(vec, value);
}

/**
 * Removes the first element from the vector and returns the new vector.
 * Traps if original vector is empty.
 * @param vec the handle of the vector (Type: VectorObject)
 * @returns the handle of the new vector (Type: VectorObject).
 */
export function pop_front(vec: VectorObject) : VectorObject {
    return vec_pop_front(vec);
}

/**
 *  Appends an element to the back of the vector.
 * @param vec the handle of the vector (Type: VectorObject)
 * @param value the element to be appended (Type: RawVal)
 * @returns the handle of the new vector (Type: VectorObject).
 */
export function push_back(vec: VectorObject, value: RawVal) : VectorObject {
    return vec_push_back(vec, value);
}

/**
 * Removes the last element from the vector and returns the new vector. 
 * Traps if original vector is empty.
 * @param vec the handle of the vector (Type: VectorObject)
 * @returns the handle of the new vector (Type: VectorObject).
 */
export function pop_back(vec: VectorObject) : VectorObject {
    return vec_pop_back(vec);
}

/**
 * Returns the first element in the vector. Traps if the vector is empty.
 * @param vec the handle of the vector (Type: VectorObject) 
 * @returns the first element (Type: RawVal)
 */
export function front(vec: VectorObject) : RawVal {
    return vec_front(vec);
}

/**
 * Return the last element in the vector. Traps if the vector is empty.
 * @param vec the handle of the vector (Type: VectorObject) 
 * @returns the last element (Type: RawVal)
 */
export function back(vec: VectorObject) : RawVal {
    return vec_back(vec);
}

/**
 * Inserts an element at index `i` within the vector, shifting all elements after it to the right.
 * Traps if the index is out of bound
 * @param vec the handle of the vector (Type: VectorObject)
 * @param i the index to insert the element to
 * @param value the element to insert (Type:RawVal).
 * @returns the handle of the new vector (Type: VectorObject)
 */
export function insert(vec: VectorObject, i:u32, value: RawVal) : VectorObject {
    return vec_insert(vec, fromU32(i), value);
}

/**
 * Clones the vector `vec1`, then moves all the elements of vector `vec2` into it.
 * Traps if number of elements in the vector overflows a u32.
 * @param vec1 the handle of the vector to append to (Type: VectorObject)
 * @param vec2 the handle of the vector to append from (Type: VectorObject)
 * @returns the handle of the new vector (Type: VectorObject)
 */
export function append(vec1: VectorObject, vec2: VectorObject) : VectorObject {
    return vec_append(vec1, vec2);
}

/**
 * Copy the elements from `start` index until `end` index, exclusive, in the vector and create a new vector from it.
 * Traps if the index is out of bound.
 * @param vec the handle of the vector to slice (Type: VectorObject)
 * @param start start index
 * @param end end index (exclusive)
 * @returns the handle of the new vector (Type: VectorObject)
 */
export function slice(vec: VectorObject, start: u32, end: u32) : VectorObject {
    return vec_slice(vec, fromU32(start), fromU32(end));
}

/**
 * Returns the index of the first occurrence of a given element in the vector.
 * @param vec the handle of the vector to slice (Type: VectorObject)
 * @param value the value to search for (Type: RawVal)
 * @returns u32 (as RawVal) index of the value if it's there. Otherwise, it returns `ScStatic::Void` (as RawVal).
 */
export function first_index_of(vec: VectorObject, value: RawVal) : RawVal {
    return vec_first_index_of(vec, value);
}

/**
 * Returns the index of the last occurrence of a given element in the vector.
 * @param vec the handle of the vector to slice (Type: VectorObject)
 * @param value the value to search for (Type: RawVal)
 * @returns u32 (as RawVal) index of the value if it's there. Otherwise, it returns `ScStatic::Void` (as RawVal).
 */
export function last_index_of(vec: VectorObject, value: RawVal) : RawVal {
    return vec_last_index_of(vec, value);
}

/**
 * Binary search a sorted vector for a given element.
 * If it exists, the high-32 bits of the return value is 0x0001 and the low-32 bits
 * contain the u32 index of the element.
 * If it does not exist, the high-32 bits of the return value is 0x0000 and the low-32 bits
 * contain the u32 index at which the element would need to be inserted into the vector to
 * maintain sorted order.
 * @param vec the handle of the vector to slice (Type: VectorObject)
 * @param value the value to search for (Type: RawVal)
 * @returns see description.
 */
export function binary_search(vec: VectorObject, value: RawVal) : u64 {
    return vec_binary_search(vec, value);
}

/******************
 * HOST FUNCTIONS *
 ******************/

/// Creates a new vector with an optional capacity hint `c`.
/// If `c` is `ScStatic::Void`, no hint is assumed and the new vector is empty.
/// Otherwise, `c` is parsed as an `u32` that represents the initial capacity of the new vector.
// @ts-ignore
@external("v", "_")
declare function vec_new(c: RawVal): VectorObject;

/// Update the value at index `i` in the vector. Return the new vector.
/// Trap if the index is out of bounds.
// @ts-ignore
@external("v", "0")
declare function vec_put(v: VectorObject, i: RawVal, x: RawVal): VectorObject;

/// Returns the element at index `i` of the vector. Traps if the index is out of bound.
// @ts-ignore
@external("v", "1")
declare function vec_get(v: VectorObject, i: RawVal): RawVal;

/// Delete an element in a vector at index `i`, shifting all elements after it to the left.
/// Return the new vector. Traps if the index is out of bound.
// @ts-ignore
@external("v", "2")
declare function vec_del(v: VectorObject, i: RawVal): VectorObject;

/// Returns length of the vector.
// @ts-ignore
@external("v", "3")
declare function vec_len(v: VectorObject): RawVal;

/// Push a value to the front of a vector.
// @ts-ignore
@external("v", "4")
declare function vec_push_front(v: VectorObject, x: RawVal): VectorObject;

/// Removes the first element from the vector and returns the new vector.
/// Traps if original vector is empty.
// @ts-ignore
@external("v", "5")
declare function vec_pop_front(v: VectorObject): VectorObject;

/// Appends an element to the back of the vector.
// @ts-ignore
@external("v", "6")
declare function vec_push_back(v: VectorObject, x: RawVal): VectorObject;

/// Removes the last element from the vector and returns the new vector.
/// Traps if original vector is empty.
// @ts-ignore
@external("v", "7")
declare function vec_pop_back(v: VectorObject): VectorObject;

/// Return the first element in the vector. Traps if the vector is empty
// @ts-ignore
@external("v", "8")
declare function vec_front(v: VectorObject): RawVal;

/// Return the last element in the vector. Traps if the vector is empty
// @ts-ignore
@external("v", "9")
declare function vec_back(v: VectorObject): RawVal;

/// Inserts an element at index `i` within the vector, shifting all elements after it to the right.
/// Traps if the index is out of bound
// @ts-ignore
@external("v", "A")
declare function vec_insert(v: VectorObject, i: RawVal, x: RawVal): VectorObject;

/// Clone the vector `v1`, then moves all the elements of vector `v2` into it.
/// Return the new vector. Traps if number of elements in the vector overflows a u32.
// @ts-ignore
@external("v", "B")
declare function vec_append(v1: VectorObject, v2: VectorObject): VectorObject;

/// Copy the elements from `start` index until `end` index, exclusive, in the vector and create a new vector from it.
/// Return the new vector. Traps if the index is out of bound.
// @ts-ignore
@external("v", "C")
declare function vec_slice(v: VectorObject, start: RawVal, end: RawVal): VectorObject;


/// Get the index of the first occurrence of a given element in the vector.
/// Returns the u32 index of the value if it's there. Otherwise, it returns `ScStatic::Void`.
// @ts-ignore
@external("v", "D")
declare function vec_first_index_of(v: VectorObject, x: RawVal): RawVal;

/// Get the index of the last occurrence of a given element in the vector.
/// Returns the u32 index of the value if it's there. Otherwise, it returns `ScStatic::Void`.
// @ts-ignore
@external("v", "E")
declare function vec_last_index_of(v: VectorObject, x:RawVal): RawVal;

/// Binary search a sorted vector for a given element.
/// If it exists, the high-32 bits of the return value is 0x0001 and the low-32 bits
/// contain the u32 index of the element.
/// If it does not exist, the high-32 bits of the return value is 0x0000 and the low-32 bits
/// contain the u32 index at which the element would need to be inserted into the vector to
/// maintain sorted order.
// @ts-ignore
@external("v", "F")
declare function vec_binary_search(v: VectorObject, x: RawVal): u64;