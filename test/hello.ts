import * as val from "../lib/value";
import * as ledger from "../lib/ledger";
import { Vec } from "../lib/vec";
import * as context from '../lib/context';
import * as contract from "../lib/contract";

export function hello(to: val.SymbolVal): val.VectorObject {

  let vec = new Vec();
  vec.push_front(val.fromSymbolStr("Hello"));
  vec.push_back(to);
  
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
  if (ledger.has_data_for(key)) {
    let dataObj = ledger.get_data_for(key);
    counter = val.toU32(dataObj);
  }
  counter += 1;
  let counterObj = val.fromU32(counter);
  ledger.put_data_for(key, counterObj);
  return counterObj;
}

export function logging(): val.RawVal {

  context.log_str("Hello, today is a sunny day!");

  let args = new Vec();
  args.push_back(val.fromI32(30));
  args.push_back(val.fromSymbolStr("celsius"));
  context.log_ftm("We have {} degrees {}!", args);

  return val.fromVoid();

}

export function callctr(): val.RawVal {

  let args = new Vec();
  args.push_back(val.fromI32(3));
  args.push_back(val.fromI32(12));

  return contract.call_by_id("11", "add", args.getHostObject());

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
    context.fail_with_error_code(AGE_ERR_CODES.TOO_YOUNG);
  }

  if (age2check > ALLOWED_AGE_RANGE.MAX) {
    context.fail_with_error_code(AGE_ERR_CODES.TOO_OLD);
  }

  return val.fromSymbolStr("OK");
}

export function eventTest(): val.RawVal {

  let topicsVec = new Vec();

  topicsVec.push_back(val.fromSymbolStr("TEST"));
  topicsVec.push_back(val.fromSymbolStr("THE"));
  topicsVec.push_back(val.fromSymbolStr("EVENTS"));

  let dataVec = new Vec();
  dataVec.push_back(val.fromU32(223));
  dataVec.push_back(val.fromU32(222));
  dataVec.push_back(val.fromU32(221));

  context.publish_event(topicsVec, dataVec.getHostObject());


  let statusTest = val.fromStatus(val.statusContractErr, val.unknownErrGeneral)
  if (val.isStatus(statusTest)) {
    context.publish_simple_event("STATUS", val.fromU32(1));
  }
  if (val.getStatusType(statusTest) == val.statusContractErr) {
    context.publish_simple_event("STATUS", val.fromU32(2));
  }
  if (val.getStatusCode(statusTest) == val.unknownErrGeneral) {
    context.publish_simple_event("STATUS", val.fromU32(3));
  }

  return val.fromVoid();

}