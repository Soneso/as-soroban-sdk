import { VectorObject, RawVal, fromVoid, fromU32, toU32 } from "./value";

export class Vec {
    obj: VectorObject;

    constructor(obj:VectorObject = vec_new(fromVoid())) {
      this.obj = obj;
    }

    /**
     * Returns the handle to the host object as MapObject.
     * @returns handle to the host object.
     */
    getHostObject(): VectorObject {
        return this.obj;
    }

    /**
     * Creates a new vector with the given capacity.
     * @param capacity capacity of the Vector
     * @returns the new Vector.
     */
    static new_with_capacity(capacity: u32) : Vec {
        return new Vec(vec_new(fromU32(capacity)));
    }
 
    /**
     * Inserts an element at index `i` within the vector, shifting all elements after it to the right.
     * Traps if the index is out of bound.
     * @param i the index to insert the element to
     * @param value the element to insert (Type:RawVal).
     * @returns void
     */
     insert(i: u32, value: RawVal) : void {
        this.obj = vec_insert(this.obj, fromU32(i), value);
    }

    /**
     * Moves all the elements of vector `vec2` into this vector.
     * Traps if number of elements in the vector overflows a u32.
     * @param vec2 the vector to append from
     * @returns void
     */
    append(vec2: Vec) : void {
        this.obj = vec_append(this.obj, vec2.getHostObject());
    }

    /**
     *  Returns length of the vector.
     * @returns length of the vector.
     */
    len() : u32 {
        return toU32(vec_len(this.obj));
    }

    /**
     * Pushes a value to the front of the vector.
     * @param value the value to push (Type: RawVal)
     * @returns void.
     */
    push_front(value: RawVal) : void {
        this.obj = vec_push_front(this.obj, value);
    }

    /**
     * Removes the first element from the vector.
     * Traps if original vector is empty.
     * @returns void.
     */
    pop_front() : void {
        this.obj = vec_pop_front(this.obj);
    }

    /**
     * Appends an element to the back of the vector.
     * @param value the element to be appended (Type: RawVal)
     * @returns void
     */
    push_back(value: RawVal) : void {
        this.obj = vec_push_back(this.obj, value);
    }

    /**
     * Removes the last element from the vector. 
     * Traps if original vector is empty.
     * @returns void.
     */
    pop_back() : void {
        this.obj = vec_pop_back(this.obj);
    }

    /**
     * Returns the first element in the vector. Traps if the vector is empty.
     * @returns the first element (Type: RawVal)
     */
    front() : RawVal {
        return vec_front(this.obj);
    }

    /**
     * Return the last element in the vector. Traps if the vector is empty.
     * @returns the last element (Type: RawVal)
     */
    back() : RawVal {
        return vec_back(this.obj);
    }

    /**
     * Update the value at index `i` in the vector.
     * @param i the index to be updated
     * @param value the value to be updated (Type: RawVal)
     * @returns void. Traps if there is no value at the given index. Traps if the index is out of bound.
     */
     put(i:u32, value: RawVal) : void {
        this.obj = vec_put(this.obj, fromU32(i), value);
    }

    /**
     * Returns the element at index `i` of the vector. Traps if the index is out of bound.
     * @param i the index
     * @returns the value (Type: RawVal). Traps if the index is out of bound.
     */
    get(i:u32) : RawVal {
        return vec_get(this.obj, fromU32(i));
    }

    /**
     * Deletes an element in the vector at index `i`, shifting all elements after it to the left.
     * @param i the index of the element to be deleted
     * @returns void. Traps if the index is out of bound.
     */
    del(i:u32) : void {
        this.obj = vec_del(this.obj, fromU32(i));
    }

    /**
     * Copy the elements from `start` index until `end` index, exclusive, in the vector and create a new vector from it.
     * Traps if the index is out of bound.
     * @param start start index
     * @param end end index (exclusive)
     * @returns the handle of the new vector (Type: VectorObject)
     */
    slice(start: u32, end: u32) : Vec {
        return new Vec(vec_slice(this.obj, fromU32(start), fromU32(end)));
    }

    /**
     * Returns the index of the first occurrence of a given element in the vector.
     * @param value the value to search for (Type: RawVal)
     * @returns u32 (as RawVal) index of the value if it's there. Otherwise, it returns `ScStatic::Void` (as RawVal).
     */
    first_index_of(value: RawVal) : RawVal {
        return vec_first_index_of(this.obj, value);
    }

    /**
     * Returns the index of the last occurrence of a given element in the vector.
     * @param value the value to search for (Type: RawVal)
     * @returns u32 (as RawVal) index of the value if it's there. Otherwise, it returns `ScStatic::Void` (as RawVal).
     */
    last_index_of(value: RawVal) : RawVal {
        return vec_last_index_of(this.obj, value);
    }

    /**
     * Binary search the vector for a given element.
     * If it exists, the high-32 bits of the return value is 0x0001 and the low-32 bits
     * contain the u32 index of the element.
     * If it does not exist, the high-32 bits of the return value is 0x0000 and the low-32 bits
     * contain the u32 index at which the element would need to be inserted into the vector to
     * maintain sorted order.
     * @param value the value to search for (Type: RawVal)
     * @returns see description.
     */
    binary_search(value: RawVal) : u64 {
        return vec_binary_search(this.obj, value);
    }
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