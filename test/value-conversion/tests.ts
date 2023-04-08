import * as val from "../../lib/value";
import * as context from "../../lib/context";
import { Vec } from "../../lib/vec";
import { Map } from "../../lib/map";
import { Bytes } from "../../lib/bytes";

export function testU32(): val.BoolVal {
  const U32VAL = 12;
  let au32 = val.fromU32(U32VAL);
  if(!val.isU32(au32) || val.toU32(au32) != U32VAL) {
    return val.fromFalse();
  }
  return val.fromTrue();
}

export function testI32(): val.BoolVal {
    const I32VAL = -112;
    let ai32 = val.fromI32(I32VAL);
    if(!val.isI32(ai32) || val.toI32(ai32) != I32VAL) {
      return val.fromFalse();
    }
    return val.fromTrue();
}

export function testStatic(): val.BoolVal {

  let aVoid = val.fromVoid();
  if(!val.isVoid(aVoid)) {
    return val.fromFalse();
  }

  let aTrue = val.fromTrue();
  if(!val.isTrue(aTrue) || !val.toBool(aTrue)) {
    return val.fromFalse();
  }

  let aFalse = val.fromFalse();
  if(!val.isFalse(aFalse) || val.toBool(aFalse)) {
    return val.fromFalse();
  }

  let aBool = val.fromBool(true);
  if(!val.isTrue(aBool) || !val.toBool(aBool)) {
    return val.fromFalse();
  }

  let alk = val.fromLedgerKeyContractCode();
  if(!val.isLedgerKeyContractCode(alk)) {
    return val.fromFalse();
  }
  return val.fromTrue();
}

export function testSmall(): val.BoolVal {

  const U64SVAL = 12;
  let au64S = val.fromU64Small(U64SVAL);
  if(!val.isU64Small(au64S) || val.toU64Small(au64S) != U64SVAL) {
    return val.fromFalse();
  }

  const I64SVAL = -12;
  let ai64S = val.fromI64Small(I64SVAL);
  if(!val.isI64Small(ai64S) || val.toI64Small(ai64S) != I64SVAL) {
    return val.fromFalse();
  }

  const TS = 10919092912
  let xt = val.fromTimepointSmall(TS);
  if(!val.isTimepointSmall(xt) || val.toTimepointSmall(xt) != TS) {
    return val.fromFalse();
  }

  const DUR = 109
  let dt = val.fromDurationSmall(DUR);
  if(!val.isDurationSmall(dt) || val.toDurationSmall(dt) != DUR) {
    return val.fromFalse();
  }
  
  const U128S = 10919092912
  let au128S = val.fromU128Small(U128S);
  if(!val.isU128Small(au128S) || val.toU128Small(au128S) != U128S) {
    return val.fromFalse();
  }

  const I128S = -10919092912
  let ai128S = val.fromI128Small(I128S);
  if(!val.isI128Small(ai128S) || val.toI128Small(ai128S) != I128S) {
    return val.fromFalse();
  }

  const U256S = 10919092912
  let au256S = val.fromU256Small(U256S);
  if(!val.isU256Small(au256S) || val.toU256Small(au256S) != U256S) {
    return val.fromFalse();
  }

  const I256S = -10919092912
  let ai256S = val.fromI256Small(I256S);
  if(!val.isI256Small(ai256S) || val.toI256Small(ai256S) != I256S) {
    return val.fromFalse();
  }

  return val.fromTrue();
}

export function testSSym(): val.SmallSymbolVal {

  let symbol = val.fromSmallSymbolStr("test_123")
  if(!val.isSmallSymbol(symbol)) {
    return val.fromFalse();
  }
  return symbol;
}


export function testObject(): val.BoolVal {

  let vec = new Vec();
  let vecObject = vec.getHostObject();
  if(!val.isObject(vecObject) || !val.isVecObject(vecObject)) {
    return val.fromFalse();
  }

  let map = new Map();
  let mapObject = map.getHostObject();
  if(!val.isObject(mapObject) || !val.isMapObject(mapObject)) {
    return val.fromFalse();
  }

  const U64VAL = 12;
  let u64Object = val.fromU64(U64VAL);
  if(!val.isObject(u64Object) || !val.isU64(u64Object) || val.toU64(u64Object) != U64VAL) {
    return val.fromFalse();
  }
  
  const I64VAL = -112;
  let i64Object = val.fromI64(I64VAL);
  if(!val.isObject(i64Object) || !val.isI64(i64Object) || val.toI64(i64Object) != I64VAL) {
    return val.fromFalse();
  }

  const ULO128VAL = 18446744073709551610;
  const UHI128VAL = 18446744073709551611;
  let u128Object = val.fromU128Pieces(ULO128VAL, UHI128VAL);
  if(!val.isObject(u128Object) || !val.isU128(u128Object) || val.toU128Low64(u128Object) != ULO128VAL || val.toU128High64(u128Object) != UHI128VAL) {
    return val.fromFalse();
  }

  const ILO128VAL = -1844674407370955161;
  const IHI128VAL = 18446744073709551611;
  let i128Object = val.fromI128Pieces(ILO128VAL, IHI128VAL);
  if(!val.isObject(i128Object) || !val.isI128(i128Object) || val.toI128Low64(i128Object) != ILO128VAL || val.toI128High64(i128Object) != IHI128VAL) {
    return val.fromFalse();
  }

  let bytes = Bytes.fromString("test");
  let bytesObject = bytes.getHostObject();
  if(!val.isObject(bytesObject) || !val.isBytesObject(bytesObject)) {
    return val.fromFalse();
  }

  let currAddress = context.getCurrentContractAddress();
  if(!val.isAddressObject(currAddress)) {
    return val.fromFalse();
  }

  return val.fromTrue();
}

export function testStatus(): val.BoolVal {

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