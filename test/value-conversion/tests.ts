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

  const UA128VAL = 39;
  var au128 = val.fromU128Small(UA128VAL);
  if(!val.isU128Val(au128) || !val.isU128Small(au128) || val.toU128Small(au128) != UA128VAL) {
    return val.fromFalse();
  }

  const UHI128VAL = 18446744073709551611;
  const ULO128VAL = 18446744073709551610;
  let u128Object = val.fromU128Pieces(UHI128VAL, ULO128VAL);
  if(!val.isObject(u128Object) || !val.isU128Val(u128Object) || !val.isU128Object(u128Object) || val.toU128Low64(u128Object) != ULO128VAL || val.toU128High64(u128Object) != UHI128VAL) {
    return val.fromFalse();
  }

  const IA128VAL = -39;
  let ai128 = val.fromI128Small(IA128VAL);
  if(!val.isI128Val(ai128) || !val.isI128Small(ai128) || val.toI128Small(ai128) != IA128VAL) {
    return val.fromFalse();
  }

  const IHI128VAL = 18446744073709551611;
  const ILO128VAL = -1844674407370955161;
  let i128Object = val.fromI128Pieces(IHI128VAL, ILO128VAL);
  if(!val.isObject(i128Object) || !val.isI128Val(i128Object) || !val.isI128Object(i128Object) || val.toI128Low64(i128Object) != ILO128VAL || val.toI128High64(i128Object) != IHI128VAL) {
    return val.fromFalse();
  }

  const UA256VAL = 39;
  var au256 = val.fromU256Small(UA256VAL);
  if(!val.isU256Val(au256) || !val.isU256Small(au256) || val.toU256Small(au256) != UA256VAL) {
    return val.fromFalse();
  }

  const U256HIHIVAL = 10;
  const U256HILOVAL = 11;
  const U256LOHIVAL = 12;
  const U256LOLOVAL = 13;
  let u256Object = val.fromU256Pieces(U256HIHIVAL, U256HILOVAL, U256LOHIVAL, U256LOLOVAL);
  if(!val.isObject(u256Object) || !val.isU256Val(u256Object) || !val.isU256Object(u256Object)) {
    return val.fromFalse();
  }
  if(val.toU256HiHi(u256Object) != U256HIHIVAL || val.toU256HiLo(u256Object) != U256HILOVAL) {
    return val.fromFalse();
  }
  if(val.toU256LoHi(u256Object) != U256LOHIVAL || val.toU256LoLo(u256Object) != U256LOLOVAL) {
    return val.fromFalse();
  }

  const IA256VAL = -39;
  var iu256 = val.fromI256Small(IA256VAL);
  if(!val.isI256Val(iu256) || !val.isI256Small(iu256) || val.toI256Small(iu256) != IA256VAL) {
    return val.fromFalse();
  }

  const I256HIHIVAL = -10;
  const I256HILOVAL = 11;
  const I256LOHIVAL = 12;
  const I256LOLOVAL = 13;
  let i256Object = val.fromI256Pieces(I256HIHIVAL, I256HILOVAL, I256LOHIVAL, I256LOLOVAL);
  if(!val.isObject(i256Object) || !val.isI256Val(i256Object) || !val.isI256Object(i256Object)) {
    return val.fromFalse();
  }
  if(val.toI256HiHi(i256Object) != I256HIHIVAL || val.toI256HiLo(i256Object) != I256HILOVAL) {
    return val.fromFalse();
  }
  if(val.toI256LoHi(i256Object) != I256LOHIVAL || val.toI256LoLo(i256Object) != I256LOLOVAL) {
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

export function testErrors(): val.BoolVal {

  const errCode = 33;
  let contractErr = val.contractError(errCode);
  if(!val.isError(contractErr) || val.getErrorType(contractErr) != val.errorTypeContract || val.getErrorCode(contractErr) != errCode) {
    return val.fromFalse();
  }

  let contractErr2 = val.fromError(val.errorTypeContract, errCode);
  if (val.getErrorType(contractErr2) != val.getErrorType(contractErr) || val.getErrorCode(contractErr2) != val.getErrorCode(contractErr)) {
    return val.fromFalse();
  }

  return val.fromTrue();
}