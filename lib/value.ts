import * as context from "./context";
import { obj_from_i128_pieces, obj_from_i256_pieces, obj_from_i64, obj_from_u128_pieces, 
  obj_from_u256_pieces, obj_from_u64, obj_to_i128_hi64, obj_to_i128_lo64, obj_to_i256_hi_hi, 
  obj_to_i256_hi_lo, obj_to_i256_lo_hi, obj_to_i256_lo_lo, obj_to_i64, obj_to_u128_hi64, 
  obj_to_u128_lo64, obj_to_u256_hi_hi, obj_to_u256_hi_lo, obj_to_u256_lo_hi, 
  obj_to_u256_lo_lo, obj_to_u64 } from "./env";

export type RawVal = u64;

/// Define types for better code readability

// Values
export type BoolVal = RawVal;
export type FalseVal = BoolVal;
export type TrueVal = BoolVal;
export type VoidVal = RawVal;
export type ErrorVal = RawVal;
export type U32Val = RawVal;
export type I32Val = RawVal;
export type U64Val = RawVal;
export type I64Val = RawVal;
export type U64SmallVal = U64Val;
export type I64SmallVal = I64Val;
export type TimepointSmallVal = RawVal;
export type DurationSmallVal = RawVal;
export type I128Val = RawVal; // can be I128SmallVal or I128Object
export type U128Val = RawVal; // can be U128SmallVal or U128Object
export type U128SmallVal = RawVal;
export type I128SmallVal = I128Val;
export type U256Val = RawVal;
export type U256SmallVal = U256Val;
export type I256Val = RawVal;
export type I256SmallVal = I256Val;
export type Symbol = RawVal;
export type SmallSymbolVal = Symbol;
export type LedgerKeyContractExecutableVal = RawVal;
export type StorageType = RawVal;

// Objects
export type ObjectVal = RawVal;
export type U64Object = U64Val;
export type I64Object = I64Val;
export type TimepointObject = RawVal;
export type DurationObject = RawVal;
export type U128Object = U128Val;
export type I128Object = I128Val;
export type U256Object = U256Val;
export type I256Object = I256Val;
export type BytesObject = ObjectVal;
export type StringObject = ObjectVal;
export type SymbolObject = Symbol;
export type VecObject = ObjectVal;
export type MapObject = ObjectVal;
export type ContractExecutableObject = ObjectVal;
export type AddressObject = ObjectVal;
export type LedgerKeyNonceObject = ObjectVal;

// Tags
type rawValTag = u8;

// We fix a maximum of 128 value types in the system for two reasons: we want to
// keep the codes relatively small (<= 8 bits) when bit-packing values into a
// u64 at the environment interface level, so that we keep many bits for
// payloads (small strings, small numeric values, object handles); and then we
// actually want to go one step further and ensure (for code-size) that our
// codes fit in a single ULEB128-code byte, which means we can only use 7 bits.
//
// We also reserve several type codes from this space because we want to _reuse_
// the SCValType codes at the environment interface level (or at least not
// exceed its number-space) but there are more types at that level, assigned to
// optimizations/special case representations of values abstract at this level.


/// Code values for the 8 `tag` bits in the bit-packed representation
/// of [RawVal]. These don't coincide with tag numbers in the SCVal XDR
/// but cover all those cases as well as some optimized refinements for
/// special cases (boolean true and false, small-value forms).

/// Tag for a [RawVal] that encodes [bool] `false`.
const rawValTagFalse: rawValTag = 0;

/// Tag for a [RawVal] that encodes [bool] `true`.
const rawValTagTrue: rawValTag = 1;

/// Tag for a [RawVal] that is empty/absent (eg. void, null, nil, undefined, None)
const rawValTagVoid: rawValTag = 2;

/// Tag for a [RawVal] that contains an error code.
const rawValTagError: rawValTag = 3;

/// Tag for a [RawVal] that contains a [u32] number.
const rawValTagU32: rawValTag = 4;

/// Tag for a [RawVal] that contains an [i32] number.
const rawValTagI32: rawValTag = 5;

/// Tag for a [RawVal] that contains a [u64] small enough to fit in 56 bits.
const rawValTagU64Small: rawValTag = 6;

/// Tag for a [RawVal] that contains an [i64] small enough to fit in 56 bits.
const rawValTagI64Small: rawValTag = 7;

/// Tag for a [RawVal] that contains a [u64] timepoint small enough to fit
/// in 56 bits.
const rawValTagTimepointSmall: rawValTag = 8;

/// Tag for a [RawVal] that contains a [u64] duration small enough to fit
/// in 56 bits.
const rawValTagDurationSmall: rawValTag = 9;

/// Tag for a [RawVal] that contains a [u128] small enough to fit in 56 bits.
const rawValTagU128Small: rawValTag = 10;

/// Tag for a [RawVal] that contains a [i128] small enough to fit in 56 bits.
const rawValTagI128Small: rawValTag = 11;

/// Tag for a [RawVal] that contains a [u256] small enough to fit in 56 bits.
const rawValTagU256Small: rawValTag = 12;

/// Tag for a [RawVal] that contains a [i256] small enough to fit in 56 bits.
const rawValTagI256Small: rawValTag = 13;

/// Tag for a [RawVal] that contains up to 9 character symbols.
const rawValTagSmallSymbol: rawValTag = 14;
    
/// Tag for a [RawVal] that corresponds to
/// [stellar_xdr::ScVal::LedgerKeyContractExecutable]
const rawValTagLedgerKeyContractExecutable: rawValTag = 15;

/// Code delimiting the upper boundary of "small" types.
const rawValTagSmallCodeUpperBound: rawValTag = 16;

/// Tag reserved to indicate boundary between tags for "small" types with
/// their payload packed into the remaining 56 bits of the [RawVal] and
/// "object" types that are stored as host objects and referenced by
/// [Object] handle.
const rawValTagObjectCodeLowerBound: rawValTag = 63;

/// Tag for a [RawVal] that refers to a host-side [u64] number.
const rawValTagU64Object: rawValTag = 64;

/// Tag for a [RawVal] that refers to a host-side [i64] number.
const rawValTagI64Object: rawValTag = 65;

/// Tag for a [RawVal] that refers to a host-side [u64] number encoding a
/// time-point (a count of seconds since the Unix epoch, Jan 1 1970 UTC).
const rawValTagTimepointObject: rawValTag = 66;

/// Tag for a [RawVal] that refers to a host-side [i64] number encoding a
/// duration (a count of seconds).
const rawValTagDurationObject: rawValTag = 67;

/// Tag for a [RawVal] that refers to a host-side [u128] number.
const rawValTagU128Object: rawValTag = 68;

/// Tag for a [RawVal] that refers to a host-side [u128] number.
const rawValTagI128Object: rawValTag = 69;

/// Tag for a [RawVal] that refers to a host-side [u256] number.
const rawValTagU256Object: rawValTag = 70;

/// Tag for a [RawVal] that refers to a host-side [i256] number.
const rawValTagI256Object: rawValTag = 71;

/// Tag for a [RawVal] that refers to a host-side bytes object.
const rawValTagBytesObject: rawValTag = 72;

/// Tag for a [RawVal] that refers to a host-side string object.
const rawValTagStringObject: rawValTag = 73;

/// Tag for a [RawVal] that refers to a host-side symbol object.
const rawValTagSymbolObject: rawValTag = 74;

/// Tag for a [RawVal] that refers to a host-side vector object.
const rawValTagVecObject: rawValTag = 75;

/// Tag for a [RawVal] that refers to a host-side map object.
const rawValTagMapObject: rawValTag = 76;

/// Tag for a [RawVal] that refers to a host-side address object.
const rawValTagAddressObject: rawValTag = 77;

/// Tag for a [RawVal] that corresponds to
/// [stellar_xdr::ScVal::LedgerKeyNonce] and refers to a host-side
/// address object that specifies which address it's the nonce for.
const rawValTagLedgerKeyNonceObject: rawValTag = 79;

const rawValTagObjectCodeUpperBound: rawValTag = 80;

const rawValTagBad: rawValTag = 0x7f;

/*****************
* [Storage Types] *
******************/
export const storageTypeTemporary: StorageType = 0;
export const storageTypePersistent: StorageType = 1;
export const storageTypeInstance: StorageType = 2;

/***********************************************************************************************************
* [Errors] - rawValTag 6: an error value consisting of a 28-bit error type code followed by a 32-bit error code.*
************************************************************************************************************/
export type errorType = u8;
export const errorTypeContract: errorType = 0;
export const errorTypeWasmVm: errorType = 1;
export const errorTypeContext: errorType = 2;
export const errorTypeStorage: errorType = 3;
export const errorTypeObject: errorType = 4
export const errorTypeCrypto: errorType = 5;
export const errorTypeEvents: errorType = 6;
export const errorTypeBudget: errorType = 7;
export const errorTypeValue: errorType = 8;
export const errorTypeAuth: errorType = 9;

export type errorCode = u32;
export const errorCodeArithDomain: errorCode = 0;
export const errorCodeIndexBounds: errorCode = 1;
export const errorCodeInvalidInput: errorCode = 2;
export const errorCodeMissingValue: errorCode = 3;
export const errorCodeExistingValue: errorCode = 4;
export const errorCodeExceededLimit: errorCode = 5;
export const errorCodeInvalidAction: errorCode = 6;
export const errorCodeInternalError: errorCode = 7;
export const errorCodeUnexpectedType: errorCode = 8;
export const errorCodeUnexpectedSize: errorCode = 9;

// Booleans

/**
 * Checks if a host value represents a boolean. 
 * @param val the host value to check.
 * @returns true if boolean, otherwise false.
 */
export function isBool(val: RawVal): bool {
  return hasTag(val, rawValTagFalse) || hasTag(val, rawValTagTrue);
}

/**
 * Checks if a host value represents "true". 
 * @param val the host value to check.
 * @returns true if boolean of "true", otherwise false.
 */
export function isTrue(val: RawVal): bool {
  return hasTag(val, rawValTagTrue);
}

/**
 * Checks if a host value represents "false". 
 * @param val the host value to check.
 * @returns true if boolean of "false", otherwise false.
 */
export function isFalse(val: RawVal): bool {
  return hasTag(val, rawValTagFalse);
}

/**
 * Extracts the value from a given host value that represents a boolean value.
 * Traps if the host value doese not represent a boolean value. To avoid, you can check it with isBool().
 * @param val the host value to extract the boolean from.
 * @returns true if the host value represents true. Otherwise returns false.
 */
export function toBool(val: RawVal): bool {
  if(!isBool(val)) {
    context.fail();
  }
  return hasTag(val, rawValTagTrue);
}

/**
 * Creates a host value that represents a value of the given bool.
 * @param b the bool to set. 
 * @returns the created host value (Type: TrueVal or FalseVal)
 */
export function fromBool(b: bool): RawVal {
  return b ? fromTrue() : fromFalse();
}

/**
 * Creates a host value that represents a value of "true".
 * @returns the created host value (Type: TrueVal)
 */
export function fromTrue(): TrueVal {
  return fromBodyAndTag(0, rawValTagTrue);
}

/**
 * Creates a host value that represents a value of "false".
 * @returns the created host value (Type: FalseVal)
 */
export function fromFalse(): FalseVal {
  return fromBodyAndTag(0, rawValTagFalse);
}

// Void

/**
 * Checks if a host value that represents "void". 
 * @param val the host value to check.
 * @returns true if "void", otherwise false.
 */
export function isVoid(val: RawVal): bool {
  return hasTag(val, rawValTagVoid);
}

/**
 * Creates a host value that represents "void".
 * @returns the created host value (Type: VoidVal)
 */
export function fromVoid(): VoidVal {
  return fromBodyAndTag(0, rawValTagVoid);
}

// U32

/**
 * Checks if the given host value represents a 32-bit unsigned integer.
 * @param val host value to check (Type: RawVal).
 * @returns true if the host value represents a 32-bit unsigned integer. Otherwise false.
 */
export function isU32(val: RawVal): bool {
  return hasTag(val, rawValTagU32);
}

/**
 * Extracts the 32-bit unsigned integer from a host value that represents a 32-bit unsigned integer.
 * Traps if the host value doese not represent a 32-bit unsigned integer. To avoid, you can check it with isU32().
 * @param v the host value to extract the 32-bit unsigned integer from.
 * @returns the extracted 32-bit unsigned integer.
 */
export function toU32(v: U32Val): u32 {
  if (!isU32(v)) {
    context.fail();
  }
  return getMajor(v) as u32;
}

/**
 * Creates a host value that represents a 32-bit unsigned integer.
 * @param u the 32-bit unsigned integer to be included into the host value.
 * @returns the created host value (Type: U32Val).
 */
export function fromU32(u: u32): U32Val {
  return fromMajorMinorAndTag(u, 0, rawValTagU32);
}

// I32

/**
 * Checks if the given host value represents a 32-bit signed integer.
 * @param val host value to check (Type: RawVal) 
 * @returns true if the host value represents a 32-bit signed integer. otherwise false.
 */
export function isI32(val: RawVal): bool {
  return hasTag(val, rawValTagI32);
}

/**
 * Extracts the 32-bit signed integer from a host value that represents a 32-bit signed integer.
 * Traps if the host value doese not represent a 32-bit signed integer. To avoid, you can check it with isI32().
 * @param v the host value to extract the 32-bit signed integer from.
 * @returns the extracted 32-bit signed integer.
 */
export function toI32(v: I32Val): i32 {
  if(!isI32(v)) {
    context.fail();
  }
  return getMajor(v) as i32;
}

/**
 * Creates a host value that represents a 32-bit signed integer.
 * @param i the 32-bit signed integer to be included into the host value.
 * @returns the created host value (Type: I32Val).
 */
export function fromI32(i: i32): I32Val {
  return fromMajorMinorAndTag(i, 0, rawValTagI32);
}

// U64 small enough to fit in 56 bits.

/**
 * Checks if the given host value represents an u64 small enough to fit in 56 bits.
 * @param val host value to check (Type: RawVal) 
 * @returns true if the host value represents an u64 small enough to fit in 56 bits. Otherwise false.
 */
export function isU64Small(val: RawVal): bool {
  return hasTag(val, rawValTagU64Small);
}

/**
 * Extracts the u64 from a host value that represents an u64 small enough to fit in 56 bits.
 * Traps if the host value doese not represent an u64 small enough to fit in 56 bits. To avoid, you can check it with isU64Small().
 * @param v the host value to extract the u64 from
 * @returns the extracted u64.
 */
export function toU64Small(v: U64SmallVal): u64 {
  if(!isU64Small(v)) {
    context.fail();
  }
  return getBody(v) as u64;
}

/**
 * Creates a host value that represents an u64 small enough to fit in 56 bits.
 * @param u the small enough u64 to be included into the host value
 * @returns the created host value (Type: U64SmallVal)
 */
export function fromU64Small(u: u64): U64SmallVal {
  return fromBodyAndTag(u, rawValTagU64Small);
}

/// I64 small enough to fit in 56 bits.

/**
 * Checks if the given host value represents an i64 small enough to fit in 56 bits.
 * @param val host value to check (Type: RawVal) 
 * @returns true if the host value represents an i64 small enough to fit in 56 bits. otherwise false.
 */
export function isI64Small(val: RawVal): bool {
  return hasTag(val, rawValTagI64Small);
}

/**
 * Extracts the i64 from a host value that represents an i64 small enough to fit in 56 bits.
 * Traps if the host value doese not represent an i64 small enough to fit in 56 bits. To avoid, you can check it with isI64Small().
 * @param v the host value to extract the i64 from
 * @returns the extracted i64.
 */
export function toI64Small(v: I64SmallVal): i64 {
  if(!isI64Small(v)) {
    context.fail();
  }
  return getSignedBody(v);
}

/**
 * Creates a host value that represents an i64 small enough to fit in 56 bits.
 * @param i the small enough i64 to be included into the host value
 * @returns the created host value (Type: I64SmallVal)
 */
export function fromI64Small(i: i64): I64SmallVal {
  return fromBodyAndTag(i, rawValTagI64Small);
}

/// Timepoint small enough to fit in 56 bits.

/**
 * Checks if the given host value represents a timepoint (u64) small enough to fit in 56 bits.
 * @param val host value to check (Type: RawVal) 
 * @returns true if the host value represents a timepoint (u64) small enough to fit in 56 bits. otherwise false.
 */
export function isTimepointSmall(val: RawVal): bool {
  return hasTag(val, rawValTagTimepointSmall);
}

/**
 * Extracts the timepoint (u64) from a host value that represents a timepoint small enough to fit in 56 bits.
 * Traps if the host value doese not represent a timepoint (u64) small enough to fit in 56 bits. To avoid, you can check it with isTimepointSmall().
 * @param v the host value to extract the u64 from
 * @returns the extracted u64.
 */
export function toTimepointSmall(v: TimepointSmallVal): u64 {
  if(!isTimepointSmall(v)) {
    context.fail();
  }
  return getBody(v);
}

/**
 * Creates a host value that represents a timepoint (u64) small enough to fit in 56 bits.
 * @param t the small enough timepoint (u64) to be included into the host value
 * @returns the created host value (Type: RawVal)
 */
export function fromTimepointSmall(t: u64): TimepointSmallVal {
  return fromBodyAndTag(t, rawValTagTimepointSmall);
}

/// Duration small enough to fit in 56 bits.

/**
 * Checks if the given host value represents a duration (u64) small enough to fit in 56 bits.
 * @param val host value to check (Type: RawVal).
 * @returns true if the host value represents a duration (u64) small enough to fit in 56 bits. Otherwise false.
 */
export function isDurationSmall(val: RawVal): bool {
  return hasTag(val, rawValTagDurationSmall);
}

/**
 * Extracts the duration (u64) from a host value that represents a duration small enough to fit in 56 bits.
 * Traps if the host value doese not represent a duration (u64) small enough to fit in 56 bits. To avoid, you can check it with isDurationSmall().
 * @param v the host value to extract the u64 from.
 * @returns the extracted u64.
 */
export function toDurationSmall(v: DurationSmallVal): u64 {
  if(!isDurationSmall(v)) {
    context.fail();
  }
  return getBody(v);
}

/**
 * Creates a host value that represents a duration (u64) small enough to fit in 56 bits.
 * @param t the small enough duration (u64) to be included into the host value.
 * @returns the created host value (Type: DurationSmallVal).
 */
export function fromDurationSmall(t: u64): DurationSmallVal {
  return fromBodyAndTag(t, rawValTagDurationSmall);
}

/// U128 small enough to fit in 56 bits.

/**
 * Checks if the given host value represents an u128 small enough to fit in 56 bits.
 * @param val host value to check (Type: RawVal).
 * @returns true if the host value represents an u128 small enough to fit in 56 bits. Otherwise false.
 */
export function isU128Small(val: RawVal): bool {
  return hasTag(val, rawValTagU128Small);
}

/**
 * Extracts the u128 from a host value that represents an u128 small enough to fit in 56 bits.
 * Traps if the host value doese not represent an u128 small enough to fit in 56 bits. To avoid, you can check it with isU128Small().
 * @param v the host value to extract the u128 from.
 * @returns the extracted u128 as u64.
 */
export function toU128Small(v: U128SmallVal): u64 {
  if(!isU128Small(v)) {
    context.fail();
  }
  return getBody(v) as u64;
}

/**
 * Creates a host value that represents an u128 small enough to fit in 56 bits.
 * @param u the small enough u128 (as u64) to be included into the host value.
 * @returns the created host value (Type: U128SmallVal).
 */
export function fromU128Small(u: u64): U128SmallVal {
  return fromBodyAndTag(u, rawValTagU128Small);
}

/// I128 small enough to fit in 56 bits.

/**
 * Checks if the given host value represents an i128 small enough to fit in 56 bits.
 * @param val host value to check (Type: RawVal).
 * @returns true if the host value represents an i128 small enough to fit in 56 bits. Otherwise false.
 */
export function isI128Small(val: RawVal): bool {
  return hasTag(val, rawValTagI128Small);
}

/**
 * Extracts the i128 from a host value that represents an i128 small enough to fit in 56 bits.
 * Traps if the host value doese not represent an i128 small enough to fit in 56 bits. To avoid, you can check it with isI128Small().
 * @param v the host value to extract the i128 from.
 * @returns the extracted i128 (as i64).
 */
export function toI128Small(v: I128SmallVal): i64 {
  if(!isI128Small(v)) {
    context.fail();
  }
  return getSignedBody(v);
}

/**
 * Creates a host value that represents an i128 small enough to fit in 56 bits.
 * @param i the small enough i128 to be included into the host value.
 * @returns the created host value (Type: I128SmallVal).
 */
export function fromI128Small(i: i64): I128SmallVal {
  return fromBodyAndTag(i, rawValTagI128Small);
}

/// U256 small enough to fit in 56 bits.

/**
 * Checks if the given host value represents an u256 small enough to fit in 56 bits.
 * @param val host value to check (Type: RawVal).
 * @returns true if the host value represents an u256 small enough to fit in 56 bits. Otherwise false.
 */
export function isU256Small(val: RawVal): bool {
  return hasTag(val, rawValTagU256Small);
}

/**
 * Extracts the u256 from a host value that represents an u256 small enough to fit in 56 bits.
 * Traps if the host value doese not represent an u256 small enough to fit in 56 bits. To avoid, you can check it with isU128Small().
 * @param v the host value to extract the u256 from.
 * @returns the extracted u256 as u64.
 */
export function toU256Small(v: U256SmallVal): u64 {
  if(!isU256Small(v)) {
    context.fail();
  }
  return getBody(v) as u64;
}

/**
 * Creates a host value that represents an u256 small enough to fit in 56 bits.
 * @param u the small enough u256 (as u64) to be included into the host value.
 * @returns the created host value (Type: U256SmallVal).
 */
export function fromU256Small(u: u64): U256SmallVal {
  return fromBodyAndTag(u, rawValTagU256Small);
}

/// I256 small enough to fit in 56 bits.

/**
 * Checks if the given host value represents an i256 small enough to fit in 56 bits.
 * @param val host value to check (Type: RawVal). 
 * @returns true if the host value represents an i256 small enough to fit in 56 bits. otherwise false.
 */
export function isI256Small(val: RawVal): bool {
  return hasTag(val, rawValTagI256Small);
}

/**
 * Extracts the i256 from a host value that represents an i256 small enough to fit in 56 bits.
 * Traps if the host value doese not represent an i256 small enough to fit in 56 bits. To avoid, you can check it with isI256Small().
 * @param v the host value to extract the i256 from.
 * @returns the extracted i256 (as i64).
 */
export function toI256Small(v: I256SmallVal): i64 {
  if(!isI256Small(v)) {
    context.fail();
  }
  return getSignedBody(v);
}

/**
 * Creates a host value that represents an i256 small enough to fit in 56 bits.
 * @param i the small enough i256 to be included into the host value.
 * @returns the created host value (Type: I256SmallVal).
 */
export function fromI256Small(i: i64): I256SmallVal {
  return fromBodyAndTag(i, rawValTagI256Small);
}

/// SmallSymbolVal -> up to 9 character symbols.

/**
 * Checks if the given host value represents a small symbol value.
 * @param val host value to check (Type: RawVal).
 * @returns true if the host value represents a small symbol value. otherwise false. 
 */
export function isSmallSymbol(val: RawVal): bool {
  return hasTag(val, rawValTagSmallSymbol);
}

/**
 * Creates a SmallSymbolVal from the given string.
 * @param str the string to create the SmallSymbolVal from. max 9 characters. [_0-9A-Za-z]
 * @returns the created SmallSymbolVal.
 */
export function fromSmallSymbolStr(str: string) : SmallSymbolVal {
  if (str.length > 9) {
    context.fail();
  }

  var accum: u64 = 0;
  let codeBits:u8 = 6;
  for (var i=0; i < str.length; i++) {
    let charcode = str.charCodeAt(i);
    if (charcode >= 48 && charcode <= 122){
      let cu8 = charcode as u8;
      accum <<= codeBits;
      var v:u64 = 0;
      if (cu8 == 95) { // "_"
        v = 1;
      } else if (cu8 >= 48 && cu8 <= 57) { // 0..9
        v = 2 + ((cu8 as u64) - 48);
      } else if (cu8 >= 65 && cu8 <= 90) { // A..Z
        v = 12 + ((cu8 as u64) - 65);
      } else if (cu8 >= 97 && cu8 <= 122) { // a..z
        v = 38 + ((cu8 as u64) - 97);
      } else {
        context.fail(); // bad char.
      }
      accum |= v;
    } else {
      context.fail(); // bad char.
    }
  }
  
  return fromBodyAndTag(accum, rawValTagSmallSymbol);
}

/**
 * Extracts the string from a SmallSymbolVal. Traps if the given value is not a SmallSymbolVal. To avoid, one can check with isSmallSymbol().
 * @param symbol the SmallSymbolVal to extract the string from.
 * @returns the extracted string.
 */
export function smallSymbolToString(symbol: SmallSymbolVal) : string {
    if (!isSmallSymbol(symbol)) {
      context.fail();
    }
    var result:string = "";
    let codeBits:u8 = 6;
    var val:u64 = 0;
    var body = getBody(symbol);
    for (var i=0; i < 10; i++) {
      val = body & 63;
      body = body >> codeBits;
      if (val == 1) {
        val = 95;
      } else if (val > 1 && val < 12) {
        val += 46;
      } else if (val > 11 && val < 38) {
        val += 53;
      } else if (val > 37 && val < 64) {
        val += 59;
      } else if (val == 0) {
        break;
      } else {
        context.fail(); // Bad val.
      }
      //context.log(fromI32(val as i32));
      // TODO - gives Status(VmError(Instantiation))
      //result = String.fromCharCode(val as i32) + result;
    }
    return result;
}

// LedgerKeyContractExecutable

/**
 * Checks if the given host value represenst a LedgerKeyContractExecutable.
 * @param val the host value to check (type: RawVal).
 * @returns true if the given host value represenst a LedgerKeyContractExecutable otherwise false.
 */
export function isLedgerKeyContractCode(val: RawVal): bool {
  return hasTag(val, rawValTagLedgerKeyContractExecutable);
}

/**
 * Creates a host value that represents a value of "LedgerKeyContractExecutable".
 * @returns the created host value (Type: LedgerKeyContractExecutableVal).
 */
export function fromLedgerKeyContractCode(): LedgerKeyContractExecutableVal {
  return fromBodyAndTag(0, rawValTagLedgerKeyContractExecutable);
}


// objects

/**
 * Checks if the given host value represents an object. 
 * @param val the host value to check. 
 * @returns true if represents an object. Otherwise false.
 */
export function isObject(val: RawVal): bool {
  let tag = getTagU8(val);
  return tag > (rawValTagObjectCodeLowerBound as u8) && tag < (rawValTagObjectCodeUpperBound as u8);
}

/**
 * Returns the object handle of a host value that represents an object.
 * Traps if the host value doese not represent an object. To avoid you can check it with isObject().
 * @param val host value to get the handle for. 
 * @returns the handle of the object from the host value that represents the object.
 */
export function getObjectHandle(val: ObjectVal): u64 {
  if(!isObject(val)){
    context.fail();
  }
  return getBody(val);
}

/**
 * Creates a host value that represents an object.
 * @param objTag the raw value tag of the object to be represented.
 * @param handle the handle of the object to be represented. 
 * @returns the host value created.
 */
export function fromObject(objTag: rawValTag, handle: u64): ObjectVal {
  return fromBodyAndTag(handle, objTag);
}

// U64Object

/**
 * Checks if the given host value represents an object that contains an unsigned 64-bit integer.
 * @param val host value to check.
 * @returns true if the host value represents an object that contains an unsigned 64-bit integer. Otherwise false.
 */
export function isU64(val:RawVal) : bool {
  return hasTag(val, rawValTagU64Object);
}

/**
 * Creates an host value that represents an object containing an unsigned 64-bit integer.
 * @param val the unsigned 64-bit integer value to include.
 * @returns the created host value as U64Object.
 */
export function fromU64(val: u64) : U64Object {
    return obj_from_u64(val);
}

/**
 * Extracts the unsigned 64-bit integer from a host value that represents an object containing an unsigned 64-bit integer.
 * Traps if the host value doese not represent an object that conatains an unsigned 64-bit integer. To avoid, you can check it with isU64().
 * @param val the host value (Type: U64Object).
 * @returns the extracted unsigned 64-bit integer.
 */
export function toU64(val: U64Object) : u64 {
    if(!isU64(val)){
      context.fail();
    }
    return obj_to_u64(val);
}

// I64Object

/**
 * Checks if the given host value represents an object that contains a signed 64-bit integer.
 * @param val host value to check.
 * @returns true if the host value represents an object that contains a signed 64-bit integer. Otherwise false.
 */
 export function isI64(val: RawVal) : bool {
  return hasTag(val, rawValTagI64Object);
}

/**
 * Creates an host value that represents an object containing a signed 64-bit integer.
 * @param v the signed 64-bit integer value to include.
 * @returns the created host value as I64Object.
 */
export function fromI64(v:i64) : I64Object {
  return obj_from_i64(v);
}

/**
 * Extracts the signed 64-bit integer from a host value that represents an object containing a signed 64-bit integer.
 * Traps if the host value doese not represent an object that conatains a signed 64-bit integer. To avoid, you can check it with isI64().
 * @param val the host value (Type: I64Object).
 * @returns the extracted signed 64-bit integer.
 */
export function toI64(val: I64Object) : i64 {
  if(!isI64(val)){
    context.fail();
  }
  return obj_to_i64(val);
}


// TimepointObject refers to a host-side [u64] number encoding a
// time-point (a count of seconds since the Unix epoch, Jan 1 1970 UTC).

/**
 * Checks if the given host value represents an object that contains a timepoint.
 * @param val host value to check.
 * @returns true if the host value represents an object that contains a timepoint. otherwise false.
 */
export function isTimepoint(val: RawVal) : bool {
  return hasTag(val, rawValTagTimepointObject);
}

/// DurationObject refers to a host-side [i64] number encoding a
/// duration (a count of seconds).

/**
 * Checks if the given host value represents an object that contains a duration.
 * @param val host value to check.
 * @returns true if the host value represents an object that contains a duration. Otherwise false.
 */
export function isDuration(val: RawVal) : bool {
  return hasTag(val, rawValTagDurationObject);
}

// U128

/**
 * Checks if the given host value represents an u128. It can either be an U128Object or an U128SmallVal.
 * @param val host value to check.
 * @returns true if the host value represents an represents an u128. Otherwise false.
 */
export function isU128Val(val:RawVal) : bool {
  return (hasTag(val, rawValTagU128Object) || hasTag(val, rawValTagU128Small));
}

/**
 * Checks if the given host value represents an object that contains an unsigned 128-bit integer.
 * @param val host value to check.
 * @returns true if the host value represents an object that contains an unsigned 128-bit integer. Otherwise false.
 */
export function isU128Object(val: RawVal) : bool {
  return hasTag(val, rawValTagU128Object);
}

/**
 * Creates an host value that represents an object containing an unsigned 128-bit integer.
 * Convert the high and low 64-bit words of a u128 to an object containing a u128.
 * @param hi high 64-bit words.
 * @param lo low 64-bit words.
 * @returns the created host value as U128Object
 */
export function fromU128Pieces(hi:u64, lo: u64) : U128Object {
    return obj_from_u128_pieces(hi, lo);
}

/**
 * Extract the low 64 bits from an object containing a u128.
 * Traps if the host value doese not represent an object that conatains an unsigned 128-bit integer. To avoid, you can check it with isU128().
 * @param val the host value (Type: U128Object) 
 * @returns the extracted unsigned low 64 bits integer.
 */
export function toU128Low64(val: U128Object) : u64 {
    if(!isU128Object(val)){
      context.fail();
    }
    return obj_to_u128_lo64(val);
}

/**
 * Extract the high 64 bits from an object containing a u128.
 * Traps if the host value doese not represent an object that conatains an unsigned 128-bit integer. To avoid, you can check it with isU128().
 * @param val the host value (Type: U128Object) 
 * @returns the extracted unsigned high 64 bits integer.
 */
export function toU128High64(val: U128Object) : u64 {
  if(!isU128Object(val)){
    context.fail();
  }
  return obj_to_u128_hi64(val);
}

/// I128

/**
 * Checks if the given host value represents an i128. It can either be an I128Object or an I128SmallVal.
 * @param val host value to check.
 * @returns true if the host value represents an represents an i128. Otherwise false.
 */
export function isI128Val(val:RawVal) : bool {
  return (hasTag(val, rawValTagI128Object) || hasTag(val, rawValTagI128Small));
}

/**
 * Checks if the given host value represents an object that contains a signed 128-bit integer.
 * @param val host value to check.
 * @returns true if the host value represents an object that contains a signed 128-bit integer. Otherwise false.
 */
export function isI128Object(val:RawVal) : bool {
  return hasTag(val, rawValTagI128Object);
}

/**
 * Creates an host value that represents an object containing a signed 128-bit integer.
 * Convert the high and low 64-bit words of a i128 to an object containing a i128.
 * @param hi high 64-bit words.
 * @param lo low 64-bit words.
 * @returns the created host value as I128Object.
 */
export function fromI128Pieces(hi:i64, lo: u64) : I128Object {
    return obj_from_i128_pieces(hi, lo);
}

/**
 * Extract the low 64 bits from an object containing a i128.
 * Traps if the host value doese not represent an object that conatains a signed 128-bit integer. To avoid, you can check it with isI128().
 * @param val the host value (Type: I128Object).
 * @returns the extracted unsigned low 64 bits integer.
 */
export function toI128Low64(val: I128Object) : u64 {
    if(!isI128Object(val)){
      context.fail();
    }
    return obj_to_i128_lo64(val);
}

/**
 * Extract the high 64 bits from an object containing a i128.
 * Traps if the host value doese not represent an object that conatains a signed 128-bit integer. To avoid, you can check it with isI128().
 * @param val the host value (Type: I128Object).
 * @returns the extracted high 64 bits integer.
 */
export function toI128High64(val: I128Object) : i64 {
  if(!isI128Object(val)){
    context.fail();
  }
  return obj_to_i128_hi64(val);
}


// U256

/**
 * Checks if the given host value represents an u256. It can either be an U256Object or an U256SmallVal.
 * @param val host value to check.
 * @returns true if the host value represents an represents an u256. Otherwise false.
 */
export function isU256Val(val:RawVal) : bool {
  return (hasTag(val, rawValTagU256Object) || hasTag(val, rawValTagU256Small));
}

/**
 * Checks if the given host value represents an object that contains an u256 integer.
 * @param val host value to check.
 * @returns true if the host value represents an object that contains an u256 integer. Otherwise false.
 */
export function isU256Object(val: RawVal) : bool {
  return hasTag(val, rawValTagU256Object);
}

/**
 * Creates an host value that represents an object containing an unsigned 256-bit integer.
 * Convert the four 64-bit words of an u256 (big-endian) to an object containing an u256.
 * @param hi_hi high of high part - bits 192-255.
 * @param hi_lo low of high part - bits 128-191.
 * @param lo_hi high of low part - bits 64-127.
 * @param lo_lo low of low part - bits 0-63.
 * @returns the created host value as U256Object
 */
export function fromU256Pieces(hi_hi: u64, hi_lo:u64, lo_hi: u64, lo_lo:u64, ) : U256Object {
  return obj_from_u256_pieces(hi_hi, hi_lo, lo_hi, lo_lo);
}

/**
 * Extract the highest 64-bits (bits 192-255) from an object containing an u256.
 * Traps if the host value doese not represent an object that conatains an unsigned 256-bit integer. To avoid, you can check it with isU256().
 * @param val the host value (Type: U256Object) 
 * @returns the extracted unsigned 64 bits integer.
 */
export function toU256HiHi(val: U256Object) : u64 {
  if(!isU256Object(val)){
    context.fail();
  }
  return obj_to_u256_hi_hi(val)
}

/**
 * Extract bits 128-191 from an object containing an u256.
 * Traps if the host value doese not represent an object that conatains an unsigned 256-bit integer. To avoid, you can check it with isU256().
 * @param val the host value (Type: U256Object) 
 * @returns the extracted unsigned 64 bits integer.
 */
export function toU256HiLo(val: U256Object) : u64 {
  if(!isU256Object(val)){
    context.fail();
  }
  return obj_to_u256_hi_lo(val)
}

/**
 * Extract bits 64-127 from an object containing an u256.
 * Traps if the host value doese not represent an object that conatains an unsigned 256-bit integer. To avoid, you can check it with isU256().
 * @param val the host value (Type: U256Object) 
 * @returns the extracted unsigned 64 bits integer.
 */
export function toU256LoHi(val: U256Object) : u64 {
  if(!isU256Object(val)){
    context.fail();
  }
  return obj_to_u256_lo_hi(val)
}

/**
 * Extract the lowest 64-bits (bits 0-63) from an object containing an u256.
 * Traps if the host value doese not represent an object that conatains an unsigned 256-bit integer. To avoid, you can check it with isU256().
 * @param val the host value (Type: U256Object) 
 * @returns the extracted unsigned 64 bits integer.
 */
export function toU256LoLo(val: U256Object) : u64 {
  if(!isU256Object(val)){
    context.fail();
  }
  return obj_to_u256_lo_lo(val)
}

// I256

/**
 * Checks if the given host value represents an i256. It can either be an I256Object or an I256SmallVal.
 * @param val host value to check.
 * @returns true if the host value represents an represents an i256. Otherwise false.
 */
export function isI256Val(val:RawVal) : bool {
  return (hasTag(val, rawValTagI256Object) || hasTag(val, rawValTagI256Small));
}

/**
 * Checks if the given host value represents an object that contains an i256 integer.
 * @param val host value to check.
 * @returns true if the host value represents an object that contains an i256 integer. Otherwise false.
 */
export function isI256Object(val: RawVal) : bool {
  return hasTag(val, rawValTagI256Object);
}

/**
 * Creates an host value that represents an object containing a signed 256-bit integer.
 * Convert the four 64-bit words of an i256 (big-endian) to an object containing an i256.
 * @param hi_hi high of high part - bits 192-255.
 * @param hi_lo low of high part - bits 128-191.
 * @param lo_hi high of low part - bits 64-127.
 * @param lo_lo low of low part - bits 0-63.
 * @returns the created host value as U256Object
 */
export function fromI256Pieces(hi_hi: i64, hi_lo:u64, lo_hi: u64, lo_lo:u64, ) : I256Object {
  return obj_from_i256_pieces(hi_hi, hi_lo, lo_hi, lo_lo);
}

/**
 * Extract the highest 64-bits (bits 192-255) from an object containing an i256.
 * Traps if the host value doese not represent an object that conatains a signed 256-bit integer. To avoid, you can check it with isI256().
 * @param val the host value (Type: I256Object) 
 * @returns the extracted signed 64 bits integer.
 */
export function toI256HiHi(val: I256Object) : i64 {
  if(!isI256Object(val)){
    context.fail();
  }
  return obj_to_i256_hi_hi(val)
}

/**
 * Extract bits 128-191 from an object containing an i256.
 * Traps if the host value doese not represent an object that conatains a signed 256-bit integer. To avoid, you can check it with isI256().
 * @param val the host value (Type: I256Object) 
 * @returns the extracted unsigned 64 bits integer.
 */
export function toI256HiLo(val: U256Object) : u64 {
  if(!isI256Object(val)){
    context.fail();
  }
  return obj_to_i256_hi_lo(val)
}

/**
 * Extract bits 64-127 from an object containing an i256.
 * Traps if the host value doese not represent an object that conatains a signed 256-bit integer. To avoid, you can check it with isI256().
 * @param val the host value (Type: I256Object) 
 * @returns the extracted unsigned 64 bits integer.
 */
export function toI256LoHi(val: I256Object) : u64 {
  if(!isI256Object(val)){
    context.fail();
  }
  return obj_to_i256_lo_hi(val)
}

/**
 * Extract the lowest 64-bits (bits 0-63) from an object containing an i256.
 * Traps if the host value doese not represent an object that conatains a signed 256-bit integer. To avoid, you can check it with isI256().
 * @param val the host value (Type: I256Object) 
 * @returns the extracted unsigned 64 bits integer.
 */
export function toI256LoLo(val: U256Object) : u64 {
  if(!isI256Object(val)){
    context.fail();
  }
  return obj_to_i256_lo_lo(val)
}

// BytesObject

/**
 * Checks if the given host value represents an object that contains unspecified bytes (BytesObject).
 * @param val host value to check
 * @returns true if the host value represents a BytesObject. otherwise false.
 */
export function isBytesObject(val: RawVal) : bool {
  return hasTag(val, rawValTagBytesObject);
}


// StringObject

/**
 * Checks if the given host value represents an object that contains a string (StringObject).
 * @param val host value to check.
 * @returns true if the host value represents a StringObject. Otherwise false.
 */
export function isStringObject(val: RawVal) : bool {
  return hasTag(val, rawValTagStringObject);
}

// SymbolObject

/**
 * Checks if the given host value represents an object that contains a symbol string (SymbolObject).
 * @param val host value to check.
 * @returns true if the host value represents a SymbolObject. Otherwise false.
 */
export function isSymbolObject(val: RawVal) : bool {
  return hasTag(val, rawValTagSymbolObject);
}

// VecObject

/**
 * Checks if the given host value represents an object that contains a vector.
 * @param val host value to check.
 * @returns true if the host value represents an object that contains a vector. Otherwise false.
 */
 export function isVecObject(val: RawVal) : bool {
  return hasTag(val, rawValTagVecObject);
}


// MapObject

/**
 * Checks if the given host value represents an object that contains a map.
 * @param val host value to check.
 * @returns true if the host value represents an object that contains a map. Otherwise false.
 */
 export function isMapObject(val: RawVal) : bool {
  return hasTag(val, rawValTagMapObject);
}

/**
 * Checks if the given host value represents an object that contains an address.
 * @param val host value to check.
 * @returns true if the host value represents an object that contains an address. Otherwise false.
 */
export function isAddressObject(val: RawVal) : bool {
  return hasTag(val, rawValTagAddressObject);
}

/**
 * Checks if the given host value represents an object that contains a nonce key.
 * @param val host value to check.
 * @returns true if the host value represents an object that contains a nonce key. Otherwise false.
 */
export function isLedgerKeyNonceObject(val: RawVal) : bool {
  return hasTag(val, rawValTagLedgerKeyNonceObject);
}

/**
 * Builds a ErrorVal for a contract error for the given error code.
 * @param errCode the error code to create the ErrorVal from
 * @returns the created ErrorVal.
 */
export function contractError(errCode: u32) : ErrorVal {
    return fromMajorMinorAndTag(errCode, errorTypeContract, rawValTagError);
}

/**
 * Creates a ErrorVal from a given error type and error code.
 * @param type error type. e.g. errorTypeStorage
 * @param code status code. e.g. errorCodeInvalidInput
 * @returns the created StatusVal
 */
export function fromError(type: errorType, code: errorCode) : ErrorVal {
  return fromMajorMinorAndTag(code, type, rawValTagError);
}

/**
 * Checks if the given host value represents an error value.
 * @param val host value to check (Type: RawVal)
 * @returns true if the host value represents an error value. otherwise false. 
 */
export function isError(val: RawVal): bool {
  return hasTag(val, rawValTagError);
}

/**
 * Retruns the error type from a given ErrorVal. Traps if no ErrorVal. To avoid, you can check it with isError().
 * @param error the error to get the type from (ErrorVal)
 * @returns the error type
 */
export function getErrorType(error: ErrorVal) : errorType {
  if (!isError(error)) {
    context.fail();
  }
  return getMinor(error) as u8;
}

/**
 * Retruns the status type from a given ErrorVal. Traps if no ErrorVal. To avoid, you can check it with isError().
 * @param error the error to get the code from
 * @returns the error code
 */
export function getErrorCode(status: ErrorVal) : u32 {
  if (!isError(status)) {
    context.fail();
  }
  return getMajor(status);
}

/***********
 * HELPERS *
 ***********/
const WORD_BITS: usize = 64;
const TAG_BITS: usize = 8;
const ONE: u64 = 1;
const TAG_MASK: u64 = (ONE << TAG_BITS) - 1;
const BODY_BITS: usize = WORD_BITS - TAG_BITS;

const MAJOR_BITS: u32 = 32;
const MINOR_BITS: u32 = 24;

const MAJOR_MASK: u64 = (ONE << MAJOR_BITS) - 1;
const MINOR_MASK: u64 = (ONE << MINOR_BITS) - 1;

/**
 * returns the tag of the host value. 
 * @param val the value to get the tag for.
 * @returns the tag
 */
function getTagU8(val: RawVal): u8 {
  return (val & TAG_MASK) as u8;
}

/**
 * Checks if the given host value has a specific tag.
 * @param val host value to check
 * @param tag tag to check
 * @returns true if the value has the given tag set
 */
function hasTag(val: RawVal, tag: rawValTag): bool {
    return getTagU8(val) == tag as u8;
}

/**
 * Returns the body of the host value by removing its tag.
 * @param val the host value to get the body from
 * @returns the body of the host value.
 */
function getBody(val: RawVal): u64 {
    return val >> TAG_BITS;
}

function getSignedBody(val: RawVal): i64 {
  return (val as i64 ) >> TAG_BITS;
}

/**
 * Adds a given tag to a host value body. 
 * @param body the body of the host value.
 * @param tag the tag to add
 * @returns the resulting host value.
 */
function fromBodyAndTag(body: u64, tag: rawValTag): RawVal {
  return ((body << TAG_BITS) | (tag as u64))
}

function fromMajorMinorAndTag(major: u32, minor: u32, tag:rawValTag) : RawVal {
   let maj:u64 = major as u64;
   let min:u64 = minor as u64;
   return fromBodyAndTag((maj << MINOR_BITS) | min,tag);
}

function getMinor(val:RawVal) : u32 {
  return (getBody(val) & MINOR_MASK) as u32;
}

function getMajor(val:RawVal) : u32 {
  return (getBody(val) >> MINOR_BITS) as u32;
}
