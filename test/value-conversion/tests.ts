import * as val from "../../lib/value";
import { Vec } from "../../lib/vec";
import { Map } from "../../lib/map";
import { Bytes } from "../../lib/bytes";
import { BigInt } from "../../lib/bigint";

export function testU32(): val.RawVal {

  const U32VAL = 12;
  let au32 = val.fromU32(U32VAL);
  if(!val.isU32(au32) || val.toU32(au32) != U32VAL) {
    return val.fromFalse();
  }
  return val.fromTrue();
}

export function testI32(): val.RawVal {

    const I32VAL = -112;
    let ai32 = val.fromI32(I32VAL);
    if(!val.isI32(ai32) || val.toI32(ai32) != I32VAL) {
      return val.fromFalse();
    }
    return val.fromTrue();
}

export function testStatic(): val.RawVal {

  let aVoid = val.fromVoid();
  if(!val.isStatic(aVoid) || !val.isVoid(aVoid)) {
    return val.fromFalse();
  }

  let aTrue = val.fromTrue();
  if(!val.isStatic(aTrue) || !val.isTrue(aTrue) || !val.toBool(aTrue)) {
    return val.fromFalse();
  }

  let aFalse = val.fromFalse();
  if(!val.isStatic(aFalse) || !val.isFalse(aFalse) || val.toBool(aFalse)) {
    return val.fromFalse();
  }

  let aBool = val.fromBool(true);
  if(!val.isStatic(aBool) || !val.isTrue(aBool) || !val.toBool(aBool)) {
    return val.fromFalse();
  }

  let alk = val.fromLedgerKeyContractCode();
  if(!val.isStatic(alk) || !val.isLedgerKeyContractCode(alk)) {
    return val.fromFalse();
  }

  return val.fromTrue();
}

export function testObject(): val.RawVal {

  let vec = new Vec();
  let vecObject = vec.getHostObject();
  if(!val.isObject(vecObject) || !val.isVector(vecObject) || !val.hasObjectType(vecObject, val.objTypeVec)) {
    return val.fromFalse();
  }

  let map = new Map();
  let mapObject = map.getHostObject();
  if(!val.isObject(mapObject) || !val.isMap(mapObject) || !val.hasObjectType(mapObject, val.objTypeMap)) {
    return val.fromFalse();
  }

  const U64VAL = 12;
  let u64Object = val.fromU64(U64VAL);
  if(!val.isObject(u64Object) || !val.isU64(u64Object) || val.toU64(u64Object) != U64VAL || !val.hasObjectType(u64Object, val.objTypeU64)) {
    return val.fromFalse();
  }

  const I64VAL = -112;
  let i64Object = val.fromI64(I64VAL);
  if(!val.isObject(i64Object) || !val.isI64(i64Object) || val.toI64(i64Object) != I64VAL || !val.hasObjectType(i64Object, val.objTypeI64)) {
    return val.fromFalse();
  }

  let bytes = Bytes.fromString("test");
  let bytesObject = bytes.getHostObject();
  if(!val.isObject(bytesObject) || !val.isBinary(bytesObject) || !val.hasObjectType(bytesObject, val.objTypeBytes)) {
    return val.fromFalse();
  }

  let bigInt = BigInt.fromU64(12);
  let bigIntObject = bigInt.getHostObject();
  if(!val.isObject(bigIntObject) || !val.isBigInt(bigIntObject) || !val.hasObjectType(bigIntObject, val.objTypeBigInt) || val.getObjectType(bigIntObject) != val.objTypeBigInt) {
    return val.fromFalse();
  }
  
  let handle = val.getObjectHandle(bigIntObject);
  let bigIntObject2 = val.fromObject(val.objTypeBigInt, handle);
  let bigInt2 = new BigInt(bigIntObject2);
  if (bigInt.toU64() != bigInt2.toU64()) {
    return val.fromFalse();
  }

  // TODO Public Key

  return val.fromTrue();
}

export function testStatus(): val.RawVal {

  const errCode = 33;
  let contractErr = val.contractError(errCode);
  if(!val.isStatus(contractErr) || val.getStatusType(contractErr) != val.statusContractErr || val.getStatusCode(contractErr) != errCode) {
    return val.fromFalse();
  }

  let contractErr2 = val.fromStatus(val.statusContractErr, errCode);
  if (val.getStatusType(contractErr2) != val.getStatusType(contractErr) || val.getStatusCode(contractErr2) != val.getStatusCode(contractErr)) {
    return val.fromFalse();
  }

  let statusOk = val.fromStatus(val.statusOk, 0);
  if(!val.isStatus(statusOk)) {
    return val.fromFalse();
  }

  return val.fromTrue();
}

export function testSymbol(): val.RawVal {

  let symbol = val.fromSymbolStr("test_123")
  if(!val.isSymbol(symbol)) {
    return val.fromFalse();
  }
  
  return symbol;
}