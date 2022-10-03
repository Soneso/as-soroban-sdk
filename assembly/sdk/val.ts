import * as host from "./host";

export class Animal<T> {
  static ONE: i32 = 1;
  static add(a: i32, b: i32): i32 { 
    return a + b + Animal.ONE; 
  }

  two: i16 = 2; // 6
  // @ts-ignore
  instanceSub<T>(a: T, b: T): T { return a - b + <T>Animal.ONE; } // tsc does not allow this
}

export function staticOne(): i32 {
  return Animal.ONE;
}

export type RawVal = u64;

/// Wrapper for a [RawVal] that is tagged with [Tag::Object], interpreting the
/// [RawVal]'s body as a pair of a 28-bit object-type code and a 32-bit handle
/// to a host object of the object-type. The object-type codes correspond to the
/// enumerated cases of [ScObject], and the handle values are dynamically
/// assigned by the host as new objects are allocated during execution.
export type ObjectVal = RawVal;



export type SymbolVal = RawVal;
export type VectorObject = ObjectVal;
export type MapObject = ObjectVal;
export type BinaryObject = ObjectVal;
export type StatusObject = RawVal;
export type Unsigned64BitIntObject = ObjectVal;
export type Signed64BitIntObject = ObjectVal;
export type AccountIDObject = ObjectVal;

type rawValTag = u8;

/// A 64-bit value encoding a bit-packed disjoint union between several
/// different types (numbers, booleans, symbols, object handles, etc.)
///
/// RawVals divide up the space of 64 bits according to a 2-level tagging
/// scheme. The first tag is a bit in the least-significant position, indicating
/// whether the `RawVal` is a plain "u63" 63-bit unsigned integer, or some
/// more-structured value with a second-level tag in the next most significant 3
/// bits. The 63-bit unsigned integer case can also be thought of as handling
/// the complete range of non-negative signed 64-bit integers.
///
/// The remaining 3 bit tags are assigned to cases enumerated in [Tag], of
/// which 7 are defined and one is currently reserved.
///
/// Schematically, the bit-assignment for `RawVal` looks like this:
///
/// ```text
///    0x_NNNN_NNNN_NNNN_NNNX  - u63, for any even X
///    0x_0000_000N_NNNN_NNN1  - u32
///    0x_0000_000N_NNNN_NNN3  - i32
///    0x_NNNN_NNNN_NNNN_NNN5  - static: void, true, false, ...
///    0x_IIII_IIII_TTTT_TTT7  - object: 32-bit index I, 28-bit type code T
///    0x_NNNN_NNNN_NNNN_NNN9  - symbol: up to 10 6-bit identifier characters
///    0x_NNNN_NNNN_NNNN_NNNb  - bitset: up to 60 bits
///    0x_CCCC_CCCC_TTTT_TTTd  - status: 32-bit code C, 28-bit type code T
///    0x_NNNN_NNNN_NNNN_NNNf  - reserved
/// ```

/// Tag for a [RawVal] that contains a [u32] number.
const rawValTagU32: rawValTag = 0;

/// Tag for a [RawVal] that contains an [i32] number.
const rawValTagI32: rawValTag = 1;

/// Tag for a [RawVal] that contains a "static" value like `true`, `false`, `void`; see [Static].
const rawValTagStatic: rawValTag = 2;

/// Tag for a [RawVal] that contains a host object handle; see [Object].
const rawValTagObject: rawValTag = 3;

/// Tag for a [RawVal] that contains a symbol; see [Symbol].
const rawValTagSymbol: rawValTag = 4;

/// Tag for a [RawVal] that contains a small bitset; see [BitSet].
const rawValTagBitset: rawValTag = 5;

/// Tag for a [RawVal] that contains a status code; see [Status].
const rawValTagStatus: rawValTag = 6;

/*******************************************************************************************************************
* [Static] - rawValTag 2: a static set of 60-bit values, of which the first 3 are void (0), true (1) and false (2).*
********************************************************************************************************************/
const staticVoid: u32 = 0;
const staticTrue: u32 = 1;
const staticFalse: u32 = 2;
const staticLedgerKeyContractCode = 3;

/******************************************************************************************************
* [Object] - rawValTag 3: an object reference given by a 28-bit type code followed by a 32-bit handle.*
*******************************************************************************************************/

/**
 * There are 2^28 (268,435,456) possible host object type codes, of which only the first 6 are defined in CAP-46:
 * Object type 0: a vector which contains a sequence of host values.
 * Object type 1: a map which is an ordered association from host values to host values.
 * Object type 2: an unsigned 64-bit integer.
 * Object type 3: an signed 64-bit integer.
 * Object type 4: a binary object containing unspecified bytes.
 * Object type 5: bigint
 * Object type 6: contract code
 * Object type 7: account ID
 */
type objectType = u8;

const objVec: objectType = 0;
const objMap: objectType = 1;
const objU64: objectType = 2;
const objI64: objectType = 3;
const objBytes: objectType = 4;
const objBigInt: objectType = 5;
const objContractCode: objectType = 6;
const objAccountId: objectType = 7;


/*******************
* HELPER FUNCTIONS.*
********************/

/**
 * Checks if the given value of type RawVal represents a positive signed 64-bit integer.
 * @param val the value to be checked (type: RawVal) 
 * @returns true if the given value represents a positive signed 64-bit integer. otherwise false 
 */
export function isU63(val: RawVal): bool {
  return (val & 1) == 0;
}

/**
 * Extracts the positive signed 64-bit integer from a given value of type RawVal.
 * Traps if RawVal doese not contain a positive signed 64-bit integer. To avoid, you can check it with isU63().
 * @param val the value of type RawVal
 * @returns the contained positive signed 64-bit integer.
 */
export function toU63(val: RawVal): u64 {
  if(!isU63(val)) {
    //host.fail_with_status()
  }
  return val >> 1;
}

export function fromStatusContractErr(): RawVal {
  return fromTagBody(rawValTagStatus, staticFalse);
}

export function fromU63(i: u64): RawVal {
  //assert((i >> 63) == 0);
  const v = (i << 1) as RawVal;
  return v;
}

export function isI32(v: RawVal): bool {
  return hasTag(v, rawValTagI32);
}

export function toI32(v: RawVal): i32 {
  //assert(isI32(v));
  return getBody(v) as i32;
}

export function fromI32(i: i32): RawVal {
  return fromTagBody(rawValTagI32, i as u32 as u64);
}

export function isU32(v: RawVal): bool {
  return hasTag(v, rawValTagU32);
}

export function toU32(v: RawVal): u32 {
  //assert(isU32(v));
  return getBody(v) as u32;
}

export function fromU32(i: u32): RawVal {
  return fromTagBody(rawValTagU32, i as u64);
}

export function isVoid(v: RawVal): bool {
  return hasTag(v, rawValTagStatic) && getBody(v) == staticVoid;
}

export function fromVoid(): RawVal {
  return fromTagBody(rawValTagStatic, staticVoid);
}

export function isBool(v: RawVal): bool {
  return hasTag(v, rawValTagStatic) &&
    (getBody(v) == staticTrue || getBody(v) == staticFalse);
}

export function isTrue(v: RawVal): bool {
  return hasTag(v, rawValTagStatic) && getBody(v) == staticTrue;
}

export function isFalse(v: RawVal): bool {
  return hasTag(v, rawValTagStatic) && getBody(v) == staticFalse;
}

export function toBool(v: RawVal): bool {
  //assert(isBool(v));
  return getBody(v) == staticTrue;
}

export function fromBool(b: bool): RawVal {
  return fromTagBody(rawValTagStatic, b ? staticTrue : staticFalse);
}

export function fromTrue(): RawVal {
  return fromTagBody(rawValTagStatic, staticTrue);
}

export function fromFalse(): RawVal {
  return fromTagBody(rawValTagStatic, staticFalse);
}

export function isLedgerKeyContractCode(v: RawVal): bool {
  return hasTag(v, rawValTagStatic) && getBody(v) == staticLedgerKeyContractCode;
}

export function fromLedgerKeyContractCode(): RawVal {
  return fromTagBody(rawValTagStatic, staticLedgerKeyContractCode);
}

export function isObject(v: RawVal): bool {
  return hasTag(v, rawValTagObject);
}

export function isObjectType(v: RawVal, o: objectType): bool {
  return toObjectType(v) == o;
}

export function toObjectType(v: RawVal): objectType {
  //assert(isObject(v));
  return getBody(v) as objectType;
}

export function toObjectId(v: RawVal): u32 {
  //assert(isObject(v));
  return getBody(v) as u32;
}

export function fromObject(o: objectType, id: u32): RawVal {
  return fromTagBody(rawValTagObject, (id << 8) | o);
}

export function fromU64(v:u64) : Unsigned64BitIntObject {
    return obj_from_u64(v);
}

export function toU64(v: Unsigned64BitIntObject) : u64 {
    return obj_to_u64(v);
}

export function fromI64(v:i64) : Signed64BitIntObject {
  return obj_from_i64(v);
}

export function toI64(v: Signed64BitIntObject) : i64 {
  return obj_to_i64(v);
}

function getTag(v: RawVal): rawValTag {
    return ((v >> 1) & 7) as rawValTag;
}

function hasTag(v: RawVal, t: rawValTag): bool {
    return !isU63(v) && getTag(v) == t;
}

function getBody(v: RawVal): u64 {
    return v >> 4;
}

function fromTagBody(t: rawValTag, body: u64): RawVal {
    //assert(body < (1 << 60));
    //assert(t < 8);
    return (body << 4) | ((t << 1) as u64) | 1;
}

/******************
 * HOST FUNCTIONS *
 ******************/

/// Convert an u64 to an object containing an u64.
// @ts-ignore
@external("u", "_")
declare function obj_from_u64(v:u64): Unsigned64BitIntObject;

/// Convert an object containing an u64 to an u64.
// @ts-ignore
@external("u", "0")
declare function obj_to_u64(ojb:Unsigned64BitIntObject): u64;

/// Convert an i64 to an object containing an i64.
// @ts-ignore
@external("i", "_")
declare function obj_from_i64(v:i64): ObjectVal;

/// Convert an object containing an i64 to an i64.
// @ts-ignore
@external("i", "0")
declare function obj_to_i64(ojb:ObjectVal): i64;

/***********************************************************************************************************
* [Status] - rawValTag 6: a status value consisting of a 28-bit type code followed by a 32-bit status code.*
************************************************************************************************************/
type statusType = u8;
const statusOk: statusType = 0;
const statusUnknownErr: statusType = 1;
const statusHostValErr: statusType = 2;
const statusHostObjErr: statusType = 3;
const statusHostFuncErr: statusType = 4;
const statusStorageErr: statusType = 5;
const statusContextErr: statusType = 6;
const statusVMErr: statusType = 7;
const statusContractErr: statusType = 7;

type hostValErrCode = u32;
const hostValUnknownErr: hostValErrCode = 0;
const hostValReservedTagVal: hostValErrCode = 1;
const hostValUnexpectedValType: hostValErrCode = 2;
const hostValU63OutOfRange: hostValErrCode = 3;
const hostValU32OutOfRange: hostValErrCode = 4;
const hostValStaticUnknown: hostValErrCode = 5;
const hostValMissingObj: hostValErrCode = 6;
const hostValSymbolToLong: hostValErrCode = 7;
const hostValSymbolBadChar: hostValErrCode = 8;
const hostValContainsNonUTF8: hostValErrCode = 9;
const hostValBitsetTooManyBits: hostValErrCode = 10;
const hostValStatusUnknown: hostValErrCode = 11;

type hostObjErrCode = u32;
const hostObjUnknownErr: hostObjErrCode = 0;
const hostObjUnknownReference: hostObjErrCode = 1;
const hostObjUnexpectedType: hostObjErrCode = 2;
const hostObjObjCountExceedsU32Max: hostObjErrCode = 3;
const hostObjObjNotExists: hostObjErrCode = 4;
const hostObjVecIndexOutOfBounds: hostObjErrCode = 5;
const hostObjContractHashWrongLength: hostObjErrCode = 6;

type hostFuncErrCode = u32;
const hostFuncUnknownErr: hostFuncErrCode = 0;
const hostFuncUnexpectedHostFuncAction: hostFuncErrCode = 1;
const hostFuncInputArgsWrongLenght: hostFuncErrCode = 2;
const hostFuncInputArgsWrongType: hostFuncErrCode = 3;
const hostFuncInputArgsInvalid: hostFuncErrCode = 4;

type hostStorageErrCode = u32;
const hostStorageUnknownErr: hostStorageErrCode = 0;
const hostStorageExpectCOntractData: hostStorageErrCode = 1;
const hostStorageReadWriteAccessToReadonlyEntry: hostStorageErrCode = 2;
const hostStorageAccessToUnknownEntry: hostStorageErrCode = 3;
const hostStorageMissingKeyInGet: hostStorageErrCode = 4;
const hostStorageGetOnDeletedKey: hostStorageErrCode = 5;

type hostContextErrCode = u32;
const hostContextUnknownErr: hostContextErrCode = 0;
const hostContextNoContractRunning: hostContextErrCode = 1;

type vmErrCode = u32;
const vmUnknown: vmErrCode = 0;
const vmValidation: vmErrCode = 1;
const vmInstantiation: vmErrCode = 2;
const vmFunction: vmErrCode = 3;
const vmTable: vmErrCode = 4;
const vmMemory: vmErrCode = 5;
const vmGlobal: vmErrCode = 6;
const vmValue: vmErrCode = 7;
const vmTrapUnreachable: vmErrCode = 8;
const vmTrapMemoryAccessOutOfBounds: vmErrCode = 9;
const vmTrapTableAccessOutOfBounds: vmErrCode = 10;
const vmTrapElemUninitialized: vmErrCode = 11;
const vmTrapDivisionByZero: vmErrCode = 12;
const vmTrapIntegerOverflow: vmErrCode = 13;
const vmTrapInvalidConversionToInt: vmErrCode = 14;
const vmTrapStackOverflow: vmErrCode = 15;
const vmTrapUnexpectedSignature: vmErrCode = 16;
const vmTrapMemLimitExceeded: vmErrCode = 17;
const vmTrapCPULimitExceeded: vmErrCode = 18;

type unknownErrCode = u32;
const unknownErrGeneral: unknownErrCode = 0;
const unknownErrXDR: unknownErrCode = 1