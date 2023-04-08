import * as val from "../../lib/value";
import * as ledger from "../../lib/ledger";
import { Vec } from "../../lib/vec";
import { Map } from "../../lib/map";
import * as context from '../../lib/context';
import * as contract from "../../lib/contract";
import * as address from '../../lib/address';

export function hello(to: val.SmallSymbolVal): val.VecObject {

  let vec = new Vec();
  vec.pushFront(val.fromSmallSymbolStr("Hello"));
  vec.pushBack(to);
  
  return vec.getHostObject();
  
}

export function add(a: val.I32Val, b: val.I32Val): val.I32Val {

  let ai32 = val.toI32(a);
  let bi32 = val.toI32(b);

  return (val.fromI32(ai32 + bi32));
}

export function logging(): val.VoidVal {

  context.logStr("Hello, today is a sunny day!");

  let args = new Vec();
  args.pushBack(val.fromI32(30));
  args.pushBack(val.fromSmallSymbolStr("celsius"));
  context.logFtm("We have {} degrees {}!", args);
  return val.fromVoid();

}

export function increment(): val.U32Val {
  let key = "COUNTER";
  var counter = 0;
  if (ledger.hasDataFor(key)) {
    let dataObj = ledger.getDataFor(key);
    counter = val.toU32(dataObj);
  }
  counter += 1;
  let counterObj = val.fromU32(counter);
  ledger.putDataFor(key, counterObj);
  return counterObj;
}

enum ALLOWED_AGE_RANGE {
  MIN = 18,
  MAX = 99
}
enum AGE_ERR_CODES {
  TOO_YOUNG = 1,
  TOO_OLD = 2
}

export function checkAge(age: val.I32Val): val.SmallSymbolVal {
  
  let age2check = val.toI32(age);

  if (age2check < ALLOWED_AGE_RANGE.MIN) {
    context.failWithErrorCode(AGE_ERR_CODES.TOO_YOUNG);
  }

  if (age2check > ALLOWED_AGE_RANGE.MAX) {
    context.failWithErrorCode(AGE_ERR_CODES.TOO_OLD);
  }
  return val.fromSmallSymbolStr("OK");
}

export function eventTest(): val.BoolVal {

  let topicsVec = new Vec();

  topicsVec.pushBack(val.fromSmallSymbolStr("TEST"));
  topicsVec.pushBack(val.fromSmallSymbolStr("THE"));
  topicsVec.pushBack(val.fromSmallSymbolStr("EVENTS"));

  let dataVec = new Vec();
  dataVec.pushBack(val.fromU32(223));
  dataVec.pushBack(val.fromU32(222));
  dataVec.pushBack(val.fromU32(221));

  context.publishEvent(topicsVec, dataVec.getHostObject());


  let statusTest = val.fromStatus(val.statusContractErr, val.unknownErrGeneral)
  if (val.isStatus(statusTest)) {
    context.publishSimpleEvent("STATUS", val.fromU32(1));
  }
  if (val.getStatusType(statusTest) == val.statusContractErr) {
    context.publishSimpleEvent("STATUS", val.fromU32(2));
  }
  if (val.getStatusCode(statusTest) == val.unknownErrGeneral) {
    context.publishSimpleEvent("STATUS", val.fromU32(3));
  }

  return val.fromTrue();

}

export function callctr(): val.RawVal {

  let args = new Vec();
  args.pushBack(val.fromI32(2));
  args.pushBack(val.fromI32(40));

  return contract.callContractById("c13d9beb5f7031bf2de3fcbcbd76bfcba93b48f11da3e538839a33b234b6a674", "add", args.getHostObject());

}

export function auth(user: val.AddressObject): val.MapObject {

  address.requireAuth(user);
  
  let key = user;
  var counter = 0;
  if (ledger.hasData(key)) {
    let dataVal = ledger.getData(key);
    counter = val.toU32(dataVal);
  }
  counter += 1;
  let counterVal = val.fromU32(counter);
  ledger.putData(key, counterVal);

  let map = new Map();
  map.put(key, counterVal);
  return map.getHostObject();

}

export function authArgs(user: val.AddressObject, value: val.RawVal): val.MapObject {

  let argsVec = new Vec();
  argsVec.pushFront(value);

  address.requireAuthForArgs(user, argsVec);
  
  let key = user;
  var counter = 0;
  if (ledger.hasData(key)) {
    let dataVal = ledger.getData(key);
    counter = val.toU32(dataVal);
  }
  counter += val.toU32(value);
  let counterVal = val.fromU32(counter);
  ledger.putData(key, counterVal);

  let map = new Map();
  map.put(key, counterVal);
  return map.getHostObject();

}

export function callctr2(user: val.AddressObject): val.MapObject {

  let args = new Vec();
  args.pushFront(user);
  return contract.callContractById("c13d9beb5f7031bf2de3fcbcbd76bfcba93b48f11da3e538839a33b234b6a674", "auth", args.getHostObject());

}

export function deploy(wasm_hash: val.BytesObject, salt: val.BytesObject, 
  fn_name: val.SmallSymbolVal, args:val.VecObject): val.RawVal {

  let id = ledger.deployContract(wasm_hash, salt);
  return contract.callContract(id, fn_name, args);
}
