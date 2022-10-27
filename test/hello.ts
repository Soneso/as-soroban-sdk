import * as val from "../lib/value";
import * as ledger from "../lib/ledger";
import { Vec } from "../lib/vec";
import * as context from '../lib/context';
import * as contract from "../lib/contract";

export function hello(to: val.SymbolVal): val.VectorObject {

  let vec = new Vec();
  vec.pushFront(val.fromSymbolStr("Hello"));
  vec.pushBack(to);
  
  return vec.getHostObject();
  
}

export function add(a: val.RawVal, b: val.RawVal): val.RawVal {

  let ai32 = val.toI32(a);
  let bi32 = val.toI32(b);

  return (val.fromI32(ai32 + bi32));
}

export function increment(): val.RawVal {

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

export function logging(): val.RawVal {

  context.logStr("Hello, today is a sunny day!");

  let args = new Vec();
  args.pushBack(val.fromI32(30));
  args.pushBack(val.fromSymbolStr("celsius"));
  context.logFtm("We have {} degrees {}!", args);

  return val.fromVoid();

}

export function callctr(): val.RawVal {

  let args = new Vec();
  args.pushBack(val.fromI32(3));
  args.pushBack(val.fromI32(12));

  return contract.callContractById("11", "add", args.getHostObject());

}

enum ALLOWED_AGE_RANGE {
  MIN = 18,
  MAX = 99
}
enum AGE_ERR_CODES {
  TOO_YOUNG = 1,
  TOO_OLD = 2
}

export function checkAge(age: val.RawVal): val.RawVal {

  let age2check = val.toI32(age);

  if (age2check < ALLOWED_AGE_RANGE.MIN) {
    context.failWithErrorCode(AGE_ERR_CODES.TOO_YOUNG);
  }

  if (age2check > ALLOWED_AGE_RANGE.MAX) {
    context.failWithErrorCode(AGE_ERR_CODES.TOO_OLD);
  }

  return val.fromSymbolStr("OK");
}

export function eventTest(): val.RawVal {

  let topicsVec = new Vec();

  topicsVec.pushBack(val.fromSymbolStr("TEST"));
  topicsVec.pushBack(val.fromSymbolStr("THE"));
  topicsVec.pushBack(val.fromSymbolStr("EVENTS"));

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

  return val.fromVoid();

}

export function auth(): val.RawVal {

  let key = context.getInvokerType() == 0 ? context.getInvokingAccount() : context.getInvokingContract();
  var counter = 0;
  if (ledger.hasData(key)) {
    let dataObj = ledger.getData(key);
    counter = val.toU32(dataObj);
  }
  counter += 1;
  let counterObj = val.fromU32(counter);
  ledger.putData(key, counterObj);

  let vec = new Vec();
  vec.pushFront(key);
  vec.pushBack(counterObj);
  return vec.getHostObject();
}