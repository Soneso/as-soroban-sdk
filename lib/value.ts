import * as context from "./context";

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
export type BytesObject = ObjectVal;
export type StatusVal = RawVal;
export type Unsigned64BitIntObject = ObjectVal;
export type Signed64BitIntObject = ObjectVal;
export type BigIntObject = ObjectVal;
export type HashObject = ObjectVal;
export type PublicKeyObject = ObjectVal;

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

/// Tag for a [RawVal] that is reserved for future use.
const rawValTagReserved: rawValTag = 7;

/*******************************************************************************************************************
* [Static] - rawValTag 2: a static set of 60-bit values, of which the first 3 are void (0), true (1) and false (2).*
********************************************************************************************************************/
const staticVoidBody: u32 = 0;
const staticTrueBody: u32 = 1;
const staticFalseBody: u32 = 2;
const staticLedgerKeyContractCodeBody = 3;

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

export const objTypeVec: objectType = 0;
export const objTypeMap: objectType = 1;
export const objTypeU64: objectType = 2;
export const objTypeI64: objectType = 3;
export const objTypeBytes: objectType = 4;
export const objTypeBigInt: objectType = 5;
export const objTypeHash: objectType = 6;
export const objTypePublicKey: objectType = 7;


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
 * Extracts the positive signed 64-bit integer from a given host value.
 * Traps if the host value doese not contain a positive signed 64-bit integer. To avoid, you can check it with isU63().
 * @param val the host value (Type: RawVal)
 * @returns the contained positive signed 64-bit integer.
 */
export function toU63(val: RawVal): u64 {
  if(!isU63(val)) {
    context.fail();
  }
  return val >> 1;
}

/**
 * Creates a host value from a given positive signed 64-bit integer.
 * @param i the positive signed 64-bit integer
 * @returns the created host value (Type: RawVal)
 */
export function fromU63(i: u64): RawVal {
  if((i >> 63) != 0) {
    context.fail();
  }
  const v = (i << 1) as RawVal;
  return v;
}

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
 * @param v the host value to extract the 32-bit signed integer from
 * @returns the extracted 32-bit signed integer.
 */
export function toI32(v: RawVal): i32 {
  if(!isI32(v)) {
    context.fail();
  }
  return getBody(v) as i32;
}

/**
 * Creates a host value that represents a 32-bit signed integer.
 * @param i the 32-bit signed integer to be included into the host value
 * @returns the created host value (Type: RawVal)
 */
export function fromI32(i: i32): RawVal {
  return addTagToBody(rawValTagI32, i as u32 as u64);
}

/**
 * Checks if the given host value represents a 32-bit unsigned integer.
 * @param val host value to check (Type: RawVal) 
 * @returns true if the host value represents a 32-bit unsigned integer. otherwise false.
 */
export function isU32(val: RawVal): bool {
  return hasTag(val, rawValTagU32);
}

/**
 * Extracts the 32-bit unsigned integer from a host value that represents a 32-bit unsigned integer.
 * Traps if the host value doese not represent a 32-bit unsigned integer. To avoid, you can check it with isU32().
 * @param v the host value to extract the 32-bit unsigned integer from
 * @returns the extracted 32-bit unsigned integer.
 */
export function toU32(v: RawVal): u32 {
  if (!isU32(v)) {
    context.fail();
  }
  return getBody(v) as u32;
}

/**
 * Creates a host value that represents a 32-bit unsigned integer.
 * @param i the 32-bit unsigned integer to be included into the host value
 * @returns the created host value (Type: RawVal)
 */
export function fromU32(i: u32): RawVal {
  return addTagToBody(rawValTagU32, i as u64);
}

/**
 * Checks if the given host value represents a static value.
 * @param val host value to check (Type: RawVal) 
 * @returns true if the host value represents a static value. otherwise false.
 */
export function isStatic(val: RawVal): bool {
  return hasTag(val, rawValTagStatic);
}

/**
 * Checks if a host value that represents a static value and has the value of "void". 
 * @param val the host value to check.
 * @returns true if static with value "void", otherwise false.
 */
export function isVoid(val: RawVal): bool {
  return isStatic(val) && getBody(val) == staticVoidBody;
}

/**
 * Creates a host value that represents a static value of "void".
 * @returns the created host value (Type: RawVal)
 */
export function fromVoid(): RawVal {
  return addTagToBody(rawValTagStatic, staticVoidBody);
}

/**
 * Checks if a host value represents a static value and contains a boolean. 
 * @param val the host value to check.
 * @returns true if boolean, otherwise false.
 */
export function isBool(val: RawVal): bool {
  return isStatic(val) &&
    (getBody(val) == staticTrueBody || getBody(val) == staticFalseBody);
}

/**
 * Checks if a host value represents a static value and holds the value of "true". 
 * @param val the host value to check.
 * @returns true if boolean of "true", otherwise false.
 */
export function isTrue(val: RawVal): bool {
  return isStatic(val) && getBody(val) == staticTrueBody;
}

/**
 * Checks if a host value represents a static value and holds the value of "false". 
 * @param val the host value to check.
 * @returns true if boolean of "false", otherwise false.
 */
export function isFalse(val: RawVal): bool {
  return isStatic(val) && getBody(val) == staticFalseBody;
}

/**
 * Extracts the boolean value from a given host value that represents a static value.
 * Traps if the host value doese not represent a static value. To avoid, you can check it with isStatic() or isBool().
 * @param val the host value to extract the boolean from
 * @returns true if the host value represents the static value of true. otherwise returns false (e.g. for false, void, ledgerkey...)
 */
export function toBool(val: RawVal): bool {
  if(!isBool(val)) {
    context.fail();
  }
  return getBody(val) == staticTrueBody;
}

/**
 * Creates a host value that represents a static value of the given bool.
 * @param b the bool to set. 
 * @returns the created host value (Type: RawVal)
 */
export function fromBool(b: bool): RawVal {
  return addTagToBody(rawValTagStatic, b ? staticTrueBody : staticFalseBody);
}

/**
 * Creates a host value that represents a static value of "true".
 * @returns the created host value (Type: RawVal)
 */
export function fromTrue(): RawVal {
  return addTagToBody(rawValTagStatic, staticTrueBody);
}

/**
 * Creates a host value that represents a static value of "false".
 * @returns the created host value (Type: RawVal)
 */
export function fromFalse(): RawVal {
  return addTagToBody(rawValTagStatic, staticFalseBody);
}

/**
 * Checks if the given host value represenst a static value of "LedgerKeyContractCode"
 * @param val the host value to check (type: RawVal)
 * @returns true if the given host value represenst a static value of "LedgerKeyContractCode". otherwise false
 */
export function isLedgerKeyContractCode(val: RawVal): bool {
  return isStatic(val) && getBody(val) == staticLedgerKeyContractCodeBody;
}

/**
 * Creates a host value that represents a static value of "LedgerKeyContractCode".
 * @returns the created host value (Type: RawVal)
 */
export function fromLedgerKeyContractCode(): RawVal {
  return addTagToBody(rawValTagStatic, staticLedgerKeyContractCodeBody);
}

/**
 * Checks if the given host value represents an object. 
 * @param val the host value to check. 
 * @returns true if represents an object. otherwise false
 */
export function isObject(val: RawVal): bool {
  return hasTag(val, rawValTagObject);
}

/**
 * Checks if the given host value that represents an object has the given object type.
 * Traps if the host value doese not represent an object. To avoid you can check it with isObject().
 * @param val host value to check 
 * @param objType object type to check
 * @returns true if the host value represents an object with the given type. otherwise false.
 */
export function hasObjectType(val: RawVal, objType: objectType): bool {
  if(!isObject(val)){
    context.fail();
  }
  return getObjectType(val) == objType;
}

/**
 * Returns the object type of a host value that represents an object. 
 * Traps if the host value doese not represent an object. To avoid you can check it with isObject().
 * @param val host value to get the type for. 
 * @returns the type of the object represented by the host value.
 */
export function getObjectType(val: ObjectVal): objectType {
  if(!isObject(val)){
    context.fail();
  }
  return getBody(val) as objectType;
}

/**
 * Returns the object handle of a host value that represents an object.
 * Traps if the host value doese not represent an object. To avoid you can check it with isObject().
 * @param val host value to get the handle for. 
 * @returns the handle of the object from the host value that represents the object
 */
export function getObjectHandle(val: ObjectVal): u32 {
  if(!isObject(val)){
    context.fail();
  }
  return (getBody(val) >> 8) as u32;
}

/**
 * Creates a host value that represents an object.
 * @param objType the type of the object to be represented.
 * @param handle the handle of the object to be represented. 
 * @returns the host value created.
 */
export function fromObject(objType: objectType, handle: u32): ObjectVal {
  return addTagToBody(rawValTagObject, ((handle as u64) << 8) | objType);
}

/**
 * Checks if the given host value represents an object that contains an unsigned 64-bit integer.
 * @param val host value to check
 * @returns true if the host value represents an object that contains an unsigned 64-bit integer. otherwise flase.
 */
export function isU64(val:RawVal) : bool {
  return isObject(val) && getObjectType(val) == objTypeU64;
}

/**
 * Creates an host value that represents an object containing an unsigned 64-bit integer.
 * @param val the unsigned 64-bit integer value to include.
 * @returns the created host value as Unsigned64BitIntObject
 */
export function fromU64(val: u64) : Unsigned64BitIntObject {
    return obj_from_u64(val);
}

/**
 * Extracts the unsigned 64-bit integer from a host value that represents an object containing an unsigned 64-bit integer.
 * Traps if the host value doese not represent an object that conatains an unsigned 64-bit integer. To avoid, you can check it with isU64().
 * @param val the host value (Type: Unsigned64BitIntObject) 
 * @returns the extracted unsigned 64-bit integer.
 */
export function toU64(val: Unsigned64BitIntObject) : u64 {
    if(!isU64(val)){
      context.fail();
    }
    return obj_to_u64(val);
}

/**
 * Checks if the given host value represents an object that contains a signed 64-bit integer.
 * @param val host value to check
 * @returns true if the host value represents an object that contains a signed 64-bit integer. otherwise flase.
 */
 export function isI64(val: RawVal) : bool {
  return isObject(val) && getObjectType(val) == objTypeI64;
}

/**
 * Creates an host value that represents an object containing a signed 64-bit integer.
 * @param v the signed 64-bit integer value to include.
 * @returns the created host value as Signed64BitIntObject
 */
export function fromI64(v:i64) : Signed64BitIntObject {
  return obj_from_i64(v);
}

/**
 * Extracts the signed 64-bit integer from a host value that represents an object containing a signed 64-bit integer.
 * Traps if the host value doese not represent an object that conatains a signed 64-bit integer. To avoid, you can check it with isI64().
 * @param val the host value (Type: Signed64BitIntObject) 
 * @returns the extracted signed 64-bit integer.
 */
export function toI64(val: Signed64BitIntObject) : i64 {
  if(!isI64(val)){
    context.fail();
  }
  return obj_to_i64(val);
}

/**
 * Checks if the given host value represents an object that contains a vector.
 * @param val host value to check
 * @returns true if the host value represents an object that contains a vector. otherwise flase.
 */
 export function isVector(val:RawVal) : bool {
  return isObject(val) && getObjectType(val) == objTypeVec;
}

/**
 * Checks if the given host value represents an object that contains a map.
 * @param val host value to check
 * @returns true if the host value represents an object that contains a map. otherwise flase.
 */
 export function isMap(val:RawVal) : bool {
  return isObject(val) && getObjectType(val) == objTypeMap;
}

/**
 * Checks if the given host value represents an object that contains unspecified bytes (binary object).
 * @param val host value to check
 * @returns true if the host value represents a binary object. otherwise flase.
 */
 export function isBinary(val:RawVal) : bool {
  return isObject(val) && getObjectType(val) == objTypeBytes;
}

/**
 * Checks if the given host value represents a bigint object.
 * @param val host value to check
 * @returns true if the host value represents a bigint object. otherwise flase.
 */
 export function isBigInt(val:RawVal) : bool {
  return isObject(val) && getObjectType(val) == objTypeBigInt;
}

/**
 * Checks if the given host value represents a public key object.
 * @param val host value to check
 * @returns true if the host value represents a public key object. otherwise flase.
 */
 export function isPublicKey(val:RawVal) : bool {
  return isObject(val) && getObjectType(val) == objTypePublicKey;
}

/**
 * Builds a StatusVal for a contract error for the given error code.
 * @param errCode the error code to create the StatusVal from
 * @returns the created StatusVal.
 */
export function contractError(errCode: u32) : StatusVal {
    return fromMajorMinorAndTag(errCode, statusContractErr, rawValTagStatus);
}

/**
 * Checks if the given value is of type status and represents status ok.
 * @param value the StatusVal to check
 * @returns true if status ok, otherwise false
 */
export function isStatusOK(value: StatusVal) : bool {
  if (!isStatus(value) || getStatusType(value) != statusOk) {
    return false;
  }
  return true;
}

/**
 * Creates a StatusVal from a given status type and status code.
 * @param type status type. e.g. statusContractErr, or statusOk
 * @param code status code. e.g. unknownErrGeneral
 * @returns the created StatusVal
 */
export function fromStatus(type: statusType, code: u32) : StatusVal {
  return fromMajorMinorAndTag(code, type, rawValTagStatus);
}

/**
 * Checks if the given host value represents a status value.
 * @param val host value to check (Type: RawVal)
 * @returns true if the host value represents a status value. otherwise false. 
 */
export function isStatus(val: RawVal): bool {
  return hasTag(val, rawValTagStatus);
}

/**
 * Retruns the status type from a given StatusVal. Traps if no StatusVal. To avoid, you can check it with isStatus().
 * @param status the status to get the type from
 * @returns the status type
 */
export function getStatusType(status: StatusVal) : statusType {
  if (!isStatus(status)) {
    context.fail();
  }
  return getMinor(status) as u8;
}

/**
 * Retruns the status type from a given StatusVal. Traps if no StatusVal. To avoid, you can check it with isStatus().
 * @param status the status to get the code from
 * @returns the status code
 */
export function getStatusCode(status: StatusVal) : u32 {
  if (!isStatus(status)) {
    context.fail();
  }
  return getMajor(status);
}

/**
 * Checks if the given host value represents a symbol value.
 * @param val host value to check (Type: RawVal)
 * @returns true if the host value represents a symbol value. otherwise false. 
 */
 export function isSymbol(val: RawVal): bool {
  return hasTag(val, rawValTagSymbol);
}

/**
 * Creates a SymbolVal from the given string.
 * @param str the string to create the SymbolVal from. max 10 characters. [_0-9A-Za-z]
 * @returns the created SymbolVal
 */
export function fromSymbolStr(str: string) : SymbolVal {
  if (str.length > 10) {
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
  return addTagToBody(rawValTagSymbol, accum);
}

export function toString(symbol: SymbolVal) : string {
    if (!hasTag(symbol, rawValTagSymbol)) {
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

/***********
 * HELPERS *
 ***********/

/**
 * returns the tag of the host value. 
 * @param val the value to get the tag for.
 * @returns the tag
 */
function getTag(val: RawVal): rawValTag {
    return ((val >> 1) & 7) as rawValTag;
}

/**
 * Checks if the given host value has a specific tag.
 * @param val host value to check
 * @param tag tag to check
 * @returns true if the value has the given tag set
 */
function hasTag(val: RawVal, tag: rawValTag): bool {
    return !isU63(val) && getTag(val) == tag;
}

/**
 * Returns the body of the host value by removing its tag.
 * @param val the host value to get the body from
 * @returns the body of the host value.
 */
function getBody(val: RawVal): u64 {
    return val >> 4;
}

/**
 * Adds a given tag to a host value body. 
 * @param tag the tag to add
 * @param body the body of the host value
 * @returns the resulting host value.
 */
function addTagToBody(tag: rawValTag, body: u64): RawVal {
    if (!(body < (1 << 60) && tag < 8)) {
      context.fail();
    }
    return (body << 4) | ((tag << 1) as u64) | 1;
    
}

const MINOR_BITS: u32 = 28;
const MAJOR_BITS: u32 = 32;
const MAJOR_MASK: u64 = ((1 as u64) << MAJOR_BITS) - 1;
const MINOR_MASK: u64 = ((1 as u64) << MINOR_BITS) - 1;

function fromMajorMinorAndTag(major: u32, minor: u32, tag:rawValTag) : RawVal {
   let maj = major as u64;
   let min = minor as u64;
   return addTagToBody(tag, maj << MINOR_BITS | min);
}

function getMinor(val:RawVal) : u32 {
  return (getBody(val) & MINOR_MASK) as u32;
}

function getMajor(val:RawVal) : u32 {
  return (getBody(val) >> MINOR_BITS) as u32;
}


/***********************************************************************************************************
* [Status] - rawValTag 6: a status value consisting of a 28-bit type code followed by a 32-bit status code.*
************************************************************************************************************/
export type statusType = u8;
export const statusOk: statusType = 0;
export const statusUnknownErr: statusType = 1;
export const statusHostValErr: statusType = 2;
export const statusHostObjErr: statusType = 3;
export const statusHostFuncErr: statusType = 4;
export const statusStorageErr: statusType = 5;
export const statusContextErr: statusType = 6;
export const statusVMErr: statusType = 7;
export const statusContractErr: statusType = 8;

export type hostValErrCode = u32;
export const hostValUnknownErr: hostValErrCode = 0;
export const hostValReservedTagVal: hostValErrCode = 1;
export const hostValUnexpectedValType: hostValErrCode = 2;
export const hostValU63OutOfRange: hostValErrCode = 3;
export const hostValU32OutOfRange: hostValErrCode = 4;
export const hostValStaticUnknown: hostValErrCode = 5;
export const hostValMissingObj: hostValErrCode = 6;
export const hostValSymbolToLong: hostValErrCode = 7;
export const hostValSymbolBadChar: hostValErrCode = 8;
export const hostValContainsNonUTF8: hostValErrCode = 9;
export const hostValBitsetTooManyBits: hostValErrCode = 10;
export const hostValStatusUnknown: hostValErrCode = 11;

export type hostObjErrCode = u32;
export const hostObjUnknownErr: hostObjErrCode = 0;
export const hostObjUnknownReference: hostObjErrCode = 1;
export const hostObjUnexpectedType: hostObjErrCode = 2;
export const hostObjObjCountExceedsU32Max: hostObjErrCode = 3;
export const hostObjObjNotExists: hostObjErrCode = 4;
export const hostObjVecIndexOutOfBounds: hostObjErrCode = 5;
export const hostObjContractHashWrongLength: hostObjErrCode = 6;

export type hostFuncErrCode = u32;
export const hostFuncUnknownErr: hostFuncErrCode = 0;
export const hostFuncUnexpectedHostFuncAction: hostFuncErrCode = 1;
export const hostFuncInputArgsWrongLenght: hostFuncErrCode = 2;
export const hostFuncInputArgsWrongType: hostFuncErrCode = 3;
export const hostFuncInputArgsInvalid: hostFuncErrCode = 4;

export type hostStorageErrCode = u32;
export const hostStorageUnknownErr: hostStorageErrCode = 0;
export const hostStorageExpectCOntractData: hostStorageErrCode = 1;
export const hostStorageReadWriteAccessToReadonlyEntry: hostStorageErrCode = 2;
export const hostStorageAccessToUnknownEntry: hostStorageErrCode = 3;
export const hostStorageMissingKeyInGet: hostStorageErrCode = 4;
export const hostStorageGetOnDeletedKey: hostStorageErrCode = 5;

export type hostContextErrCode = u32;
export const hostContextUnknownErr: hostContextErrCode = 0;
export const hostContextNoContractRunning: hostContextErrCode = 1;

export type vmErrCode = u32;
export const vmUnknown: vmErrCode = 0;
export const vmValidation: vmErrCode = 1;
export const vmInstantiation: vmErrCode = 2;
export const vmFunction: vmErrCode = 3;
export const vmTable: vmErrCode = 4;
export const vmMemory: vmErrCode = 5;
export const vmGlobal: vmErrCode = 6;
export const vmValue: vmErrCode = 7;
export const vmTrapUnreachable: vmErrCode = 8;
export const vmTrapMemoryAccessOutOfBounds: vmErrCode = 9;
export const vmTrapTableAccessOutOfBounds: vmErrCode = 10;
export const vmTrapElemUninitialized: vmErrCode = 11;
export const vmTrapDivisionByZero: vmErrCode = 12;
export const vmTrapIntegerOverflow: vmErrCode = 13;
export const vmTrapInvalidConversionToInt: vmErrCode = 14;
export const vmTrapStackOverflow: vmErrCode = 15;
export const vmTrapUnexpectedSignature: vmErrCode = 16;
export const vmTrapMemLimitExceeded: vmErrCode = 17;
export const vmTrapCPULimitExceeded: vmErrCode = 18;

export type unknownErrCode = u32;
export const unknownErrGeneral: unknownErrCode = 0;
export const unknownErrXDR: unknownErrCode = 1;

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
declare function obj_from_i64(v:i64): Signed64BitIntObject;

/// Convert an object containing an i64 to an i64.
// @ts-ignore
@external("i", "0")
declare function obj_to_i64(ojb:Signed64BitIntObject): i64;