import * as val from "../../lib/value";
import * as context from "../../lib/context";
import { Map } from "../../lib/map";
import { Vec } from "../../lib/vec";
import { Bytes } from "../../lib/bytes";
import { Sym } from "../../lib/sym";
import * as u128 from "../../lib/u128_math";
import * as val128 from "../../lib/val128";

export function maps(): val.BoolVal {

  let map = new Map();

  let key1 = val.fromSmallSymbolStr("key1");
  let value1 = val.fromSmallSymbolStr("value1");
  map.put(key1, value1);

  let key2 = val.fromU32(12);
  let value2 = val.fromU32(122);
  map.put(key2, value2); // in front!

  if (map.len() != 2) {
    return val.fromFalse();
  }

  let value1test = map.get(key1);
  let value2test = map.get(key2);

  if (value1 != value1test || value2 != value2test) {
    return val.fromFalse();
  }
  
  map.del(key2);
  if (map.len() != 1 || !map.has(key1)) {
    return val.fromFalse();
  }

  map.put(key2, value2); //in front!

  let minKey = map.getKeyByPos(0);
  let maxKey = map.getKeyByPos(1);
  if (key1 != maxKey || key2 != minKey) {
    return val.fromFalse();
  }

  let minVal = map.getValueByPos(0);
  let maxVal = map.getValueByPos(1);
  if (value1 != maxVal || value2 != minVal) {
    return val.fromFalse();
  }

  let keys = map.keys();
  let front = keys.front();
  let back = keys.back();
  
  if (key1 != back || key2 != front) {
    return val.fromFalse();
  }
  
  let values = map.values();
  let vFront = values.front();
  let vBack = values.back();
  
  if (value1 != vBack || value2 != vFront) {
    return val.fromFalse();
  }
  
  let map2 = new Map();
  map2.put(key1, value1);
  map2.put(key2, value2);

  let map3 = new Map(map.getHostObject());

  let comp = context.compareObj(map2.getHostObject(), map3.getHostObject());
  if (comp != 0) {
    return val.fromFalse();
  }

  return val.fromTrue();
}

export function vecs(): val.BoolVal {

    let vec = new Vec();
    let val1 = val.fromU32(12);
    let val2 = new Map();
    val2.put(val.fromI32(-11), val.fromSmallSymbolStr("hello"));
    vec.pushFront(val1);
    vec.pushBack(val2.getHostObject());

    vec.insert(0, vec.getHostObject());

    if(vec.len() != 3) {
        return val.fromFalse();
    }

    vec.popFront();
    vec.popBack();
    if(vec.len() != 1) {
        return val.fromFalse();
    }

    vec.pushBack(val2.getHostObject());

    let val1Test = vec.front();
    if (val1Test != val1) {
        return val.fromFalse();
    }

    let val2Test = vec.back();
    if (context.compareObj(val2Test, val2.getHostObject()) != 0) {
        return val.fromFalse();
    }

    vec.put(0, val2.getHostObject());
    vec.put(1, val1);
    
    let v2Test = vec.get(0);
    let v1Test = vec.get(1);
    if (context.compareObj(v2Test, val2.getHostObject()) != 0 || v1Test != val1) {
        return val.fromFalse();
    }

    vec.del(0);
    v1Test = vec.get(0);
    if (vec.len() != 1 || v1Test != val1) {
        return val.fromFalse();
    }

    vec.del(0);

    let t0 = val.fromU32(0);
    let t1 = val.fromU32(1);
    let t2 = val.fromU32(2);
    let t3 = val.fromU32(3);
    let t4 = val.fromU32(4);
    let t5 = val.fromU32(5);

    vec.pushBack(t0);
    vec.pushBack(t1);
    vec.pushBack(t2);
    vec.pushBack(t3);
    vec.pushBack(t4);
    vec.pushBack(t5);
    vec.pushBack(t2);

    let slice = vec.slice(1,4);
    if (slice.len() != 3 || slice.get(0) != vec.get(1) || slice.get(2) != vec.get(3)) {
        return val.fromFalse();
    }

    let firstIndexTest = vec.getFirstIndexOf(t2);
    let lastIndexTest = vec.getLastIndexOf(t2);

    let voidVal = val.fromVoid();

    if (firstIndexTest == voidVal || lastIndexTest == voidVal 
        || val.toU32(firstIndexTest) != 2 || val.toU32(lastIndexTest) != 6) {
        return val.fromFalse();
    }

    vec.append(slice);
    if (vec.len() != 10 || vec.get(9) != vec.get(3)) {
        return val.fromFalse();
    }

    let b = vec.binarySearch(t3) as u32;
    if (b != 3) {
        return val.fromFalse();
    }

    return val.fromTrue();
}

export function bytes(): val.BoolVal {


    let val1 = val.fromU32(12);
    let sb = Bytes.serialize(val1);
    let val2 = sb.deserialize();

    if(val1 != val2) {
        return val.fromFalse();
    }


    let c = Bytes.fromString("hello");
    c.copyToLinearMemory(0, 0, 5);
    let d = Bytes.newFromLinearMemory(0, 5);
    if(context.compareObj(c.getHostObject(), d.getHostObject()) != 0) {
        return val.fromFalse();
    }
    let e = new Bytes();
    e.copyFromLinearMemory(0, 0, 5);
    if(context.compareObj(e.getHostObject(), d.getHostObject()) != 0) {
        return val.fromFalse();
    }

    let b = new Bytes();
    let t0 = 0;
    let t1 = 1;
    let t2 = 2;
    let t3 = 3;
    let t4 = 4;
    let t5 = 5;
    b.push(t0);
    b.push(t1);
    b.push(t2);
    b.push(t3);
    b.push(t4);
    b.push(t5);
    b.push(t2);

    if(b.len() != 7) {
        return val.fromFalse();
    }
    b.del(6);
    b.pop();
    if(b.len() != 5 || b.front() != t0 || b.back() != t4) {
        return val.fromFalse();
    }

    b.insert(2, t5);
    if(b.len() != 6 || b.get(2) != t5) {
        return val.fromFalse();
    }
    b.del(2);

    let b2 = new Bytes();
    b2.push(t5);
    b2.push(t2);

    let b3 = b.append(b2);
    if(b3.len() != 7 || b3.back() != t2) {
        return val.fromFalse();
    }

    let b4 = b3.slice(0, 3);
    let b5 = b.slice(0, 3);
    if (context.compareObj(b4.getHostObject(), b5.getHostObject()) != 0) {
        return val.fromFalse();
    }

    b4.put(1,t3);
    if (b4.get(1) != t3) {
        return val.fromFalse();
    }

    return val.fromTrue();
}

export function symbols() : val.BoolVal {

    let sym1 = Sym.fromSymbolString("hola");
    let sym2 = Sym.fromSymbolString("hola");

    if (context.compareObj(sym1.getHostObject(), sym2.getHostObject()) != 0) {
        return val.fromFalse();
    }
    return val.fromTrue();
}

export function math128() : val.BoolVal {
    
    // @ts-ignore
    const max = u64.MAX_VALUE;

    // Should compare less two numbers 1
    if (!u128.lt(50, 100, 100, 100)) {
        return val.fromFalse();
    }

    // Should compare less two numbers 2
    if (u128.lt(100, 100, 100, 100)) {
        return val.fromFalse();
    }

    // Should compare less two numbers 3
    if (!u128.lt(0, 0, max, max)) {
        return val.fromFalse();
    }

    // Should compare less two U128Val
    var u128ValA  = val.fromU128Small(40);
    var u128ValB = val.fromU128Small(50);
    if (!val128.u128lt(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Small(40);
    u128ValB = val.fromU128Pieces(100, 50);
    if (!val128.u128lt(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Pieces(0, 40);
    u128ValB = val.fromU128Pieces(100, 50);
    if (!val128.u128lt(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Pieces(0,40);
    u128ValB = val.fromU128Small(50);
    if (!val128.u128lt(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    // Should compare less two I128Val
    var i128ValA  = val.fromI128Small(40);
    var i128ValB = val.fromI128Small(50);
    if (!val128.i128lt(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Small(40);
    i128ValB = val.fromI128Pieces(100, 50);
    if (!val128.i128lt(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Pieces(0, 40);
    i128ValB = val.fromI128Pieces(100, 50);
    if (!val128.i128lt(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Pieces(0, 40);
    i128ValB = val.fromI128Small(50);
    if (!val128.i128lt(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    // Should compare less or equal two numbers 1
    if (!u128.le(50, 100, 100, 100)) {
        return val.fromFalse();
    }

    // Should compare less or equal two numbers 2
    if (!u128.le(100, 100, 100, 100)) {
        return val.fromFalse();
    }

    // Should compare less or equal two U128Val
    u128ValA  = val.fromU128Small(40);
    u128ValB = val.fromU128Small(50);
    if (!val128.u128le(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Small(40);
    u128ValB = val.fromU128Pieces(100, 50);
    if (!val128.u128le(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Pieces(0, 40);
    u128ValB = val.fromU128Pieces(100, 50);
    if (!val128.u128le(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Pieces(0, 40);
    u128ValB = val.fromU128Small(40);
    if (!val128.u128le(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Small(40);
    u128ValB = val.fromU128Small(40);
    if (!val128.u128le(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Small(40);
    u128ValB = val.fromU128Pieces(0, 40);
    if (!val128.u128le(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Pieces(0, 40);
    u128ValB = val.fromU128Pieces(0, 40);
    if (!val128.u128le(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Pieces(0, 40);
    u128ValB = val.fromU128Small(40);
    if (!val128.u128le(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    // Should compare less two I128Val
    i128ValA  = val.fromI128Small(40);
    i128ValB = val.fromI128Small(50);
    if (!val128.i128le(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Small(40);
    i128ValB = val.fromI128Pieces(100, 50);
    if (!val128.i128le(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Pieces(0, 40);
    i128ValB = val.fromI128Pieces(100, 50);
    if (!val128.i128le(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Pieces(0, 40);
    i128ValB = val.fromI128Small(40);
    if (!val128.i128le(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Small(40);
    i128ValB = val.fromI128Small(40);
    if (!val128.i128le(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Small(40);
    i128ValB = val.fromI128Pieces(0, 40);
    if (!val128.i128le(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Pieces(0, 40);
    i128ValB = val.fromI128Pieces(0, 40);
    if (!val128.i128le(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Pieces(0, 40);
    i128ValB = val.fromI128Small(40);
    if (!val128.i128le(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    // Should compare greater two numbers 1
    if (!u128.gt(100, 100, 50, 100)) {
        return val.fromFalse();
    }

    // Should compare greater two numbers 2
    if (u128.gt(100, 100, 100, 100)) {
        return val.fromFalse();
    }

    // Should compare greater two U128Val
    u128ValA  = val.fromU128Small(50);
    u128ValB = val.fromU128Small(40);
    if (!val128.u128gt(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Small(50);
    u128ValB = val.fromU128Pieces(0, 40);
    if (!val128.u128gt(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Pieces(100, 50);
    u128ValB = val.fromU128Pieces(100, 40);
    if (!val128.u128gt(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Pieces(100, 40);
    u128ValB = val.fromU128Small(50);
    if (!val128.u128gt(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    // Should compare greater two I128Val
    i128ValA  = val.fromI128Small(50);
    i128ValB = val.fromI128Small(40);
    if (!val128.i128gt(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Small(50);
    i128ValB = val.fromI128Pieces(0, 40);
    if (!val128.i128gt(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Pieces(100, 40);
    i128ValB = val.fromI128Pieces(100, 30);
    if (!val128.i128gt(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Pieces(100, 40);
    i128ValB = val.fromI128Small(50);
    if (!val128.i128gt(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    // Should compare greater or equal two numbers 1
    if (!u128.ge(100, 100, 50, 100)) {
        return val.fromFalse();
    }

    // Should compare greater or equal two numbers 2
    if (!u128.ge(100, 100, 100, 100)) {
        return val.fromFalse();
    }

    // Should compare greater or equal two U128Val
    u128ValA  = val.fromU128Small(50);
    u128ValB = val.fromU128Small(40);
    if (!val128.u128ge(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Small(50);
    u128ValB = val.fromU128Pieces(0, 40);
    if (!val128.u128ge(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Pieces(100, 50);
    u128ValB = val.fromU128Pieces(100, 40);
    if (!val128.u128ge(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Pieces(0, 40);
    u128ValB = val.fromU128Small(40);
    if (!val128.u128ge(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Small(40);
    u128ValB = val.fromU128Small(40);
    if (!val128.u128ge(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Small(40);
    u128ValB = val.fromU128Pieces(0, 40);
    if (!val128.u128ge(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Pieces(100, 40);
    u128ValB = val.fromU128Pieces(100, 40);
    if (!val128.u128ge(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Pieces(0, 40);
    u128ValB = val.fromU128Small(40);
    if (!val128.u128ge(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    // Should compare greater or equal two I128Val
    i128ValA  = val.fromI128Small(50);
    i128ValB = val.fromI128Small(40);
    if (!val128.i128ge(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Small(50);
    i128ValB = val.fromI128Pieces(0, 40);
    if (!val128.i128ge(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Pieces(100, 40);
    i128ValB = val.fromI128Pieces(100, 30);
    if (!val128.i128ge(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Pieces(0, 40);
    i128ValB = val.fromI128Small(40);
    if (!val128.i128ge(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Small(40);
    i128ValB = val.fromI128Small(40);
    if (!val128.i128ge(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Small(40);
    i128ValB = val.fromI128Pieces(0, 40);
    if (!val128.i128ge(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Pieces(100, 40);
    i128ValB = val.fromI128Pieces(100, 40);
    if (!val128.i128ge(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Pieces(0, 40);
    i128ValB = val.fromI128Small(40);
    if (!val128.i128ge(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    // Should compare equal two U128Val
    u128ValA  = val.fromU128Pieces(0, 40);
    u128ValB = val.fromU128Small(40);
    if (!val128.u128eq(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Small(40);
    u128ValB = val.fromU128Small(40);
    if (!val128.u128eq(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Small(40);
    u128ValB = val.fromU128Pieces(0, 40);
    if (!val128.u128eq(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Pieces(100, 40);
    u128ValB = val.fromU128Pieces(100, 40);
    if (!val128.u128eq(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Pieces(0, 40);
    u128ValB = val.fromU128Small(40);
    if (!val128.u128eq(u128ValA, u128ValB)) {
        return val.fromFalse();
    }

    // Should compare equal two I128Val
    i128ValA  = val.fromI128Pieces(0, 40);
    i128ValB = val.fromI128Small(40);
    if (!val128.i128eq(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Small(40);
    i128ValB = val.fromI128Small(40);
    if (!val128.i128eq(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Small(40);
    i128ValB = val.fromI128Pieces(0, 40);
    if (!val128.i128eq(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Pieces(100, 40);
    i128ValB = val.fromI128Pieces(100, 40);
    if (!val128.i128eq(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Pieces(0, 40);
    i128ValB = val.fromI128Small(40);
    if (!val128.i128eq(i128ValA, i128ValB)) {
        return val.fromFalse();
    }

    // ordering
    i128ValA  = val.fromI128Pieces(0, 40);
    i128ValB = val.fromI128Small(40);
    if (val128.i128ord(i128ValA, i128ValB) != 0) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Pieces(0, 20);
    i128ValB = val.fromI128Small(40);
    if (val128.i128ord(i128ValA, i128ValB) != -1) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Pieces(0, 50);
    i128ValB = val.fromI128Small(40);
    if (val128.i128ord(i128ValA, i128ValB) != 1) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Pieces(2, 50);
    i128ValB = val.fromI128Pieces(0, 50);
    if (val128.i128ord(i128ValA, i128ValB) != 1) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Small(40);
    i128ValB = val.fromI128Pieces(1, 50);
    if (val128.i128ord(i128ValA, i128ValB) != -1) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Small(40);
    i128ValB = val.fromI128Small(40);
    if (val128.i128ord(i128ValA, i128ValB) != 0) {
        return val.fromFalse();
    }

    u128ValA  = val.fromI128Pieces(0, 40);
    u128ValB = val.fromI128Small(40);
    if (val128.i128ord(u128ValA, u128ValB) != 0) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Pieces(0, 20);
    u128ValB = val.fromU128Small(40);
    if (val128.u128ord(u128ValA, u128ValB) != -1) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Pieces(0, 50);
    u128ValB = val.fromU128Small(40);
    if (val128.u128ord(u128ValA, u128ValB) != 1) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Pieces(2, 50);
    u128ValB = val.fromU128Pieces(0, 50);
    if (val128.u128ord(u128ValA, u128ValB) != 1) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Small(40);
    u128ValB = val.fromU128Pieces(1, 50);
    if (val128.u128ord(u128ValA, u128ValB) != -1) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Small(40);
    u128ValB = val.fromU128Small(40);
    if (val128.u128ord(u128ValA, u128ValB) != 0) {
        return val.fromFalse();
    }

    // Should add two u128 numbers test 1
    var b_lo = u128.add(100, 255, 255, 100);
    var b_hi = u128.__hi;

    if (!u128.eq(b_lo, b_hi, 355, 355)) {
        return val.fromFalse();
    }

    // Should add two u128 numbers test 2
    b_lo = u128.add(max, 0, 1, 0);
    b_hi = u128.__hi;

    if (!u128.eq(b_lo, b_hi, 0, 1)) {
        return val.fromFalse();
    }

    // Should add two u128 numbers with owerflow
    b_lo = u128.add(max, max, 1, 1);
    b_hi = u128.__hi;

    if (!u128.eq(b_lo, b_hi, 0, 1)) {
        return val.fromFalse();
    }

    // Should add two U128Val
    u128ValA  = val.fromU128Pieces(0, 40);
    u128ValB = val.fromU128Small(40);
    var u128ValR = val.fromU128Small(80);
    if (!val128.u128eq(u128ValR, val128.u128add(u128ValA, u128ValB))) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Small(40);
    u128ValB = val.fromU128Small(40);
    if (!val128.u128eq(u128ValR, val128.u128add(u128ValA, u128ValB))) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Small(40);
    u128ValB = val.fromU128Pieces(0, 40);
    if (!val128.u128eq(u128ValR, val128.u128add(u128ValA, u128ValB))) {
        return val.fromFalse();
    }
    
    u128ValA  = val.fromU128Pieces(0, 40);
    u128ValB = val.fromU128Small(40);
    if (!val128.u128eq(u128ValR, val128.u128add(u128ValA, u128ValB))) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Pieces(100, 40);
    u128ValB = val.fromU128Pieces(100, 40);
    u128ValR = val.fromU128Pieces(200, 80);
    if (!val128.u128eq(u128ValR, val128.u128add(u128ValA, u128ValB))) {
        return val.fromFalse();
    }

    
    // Should add two I128Val
    i128ValA  = val.fromI128Pieces(0, 40);
    i128ValB = val.fromI128Small(40);
    var i128ValR = val.fromI128Small(80);
    if (!val128.i128eq(i128ValR, val128.i128add(i128ValA, i128ValB))) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Small(40);
    i128ValB = val.fromI128Small(40);
    if (!val128.i128eq(i128ValR, val128.i128add(i128ValA, i128ValB))) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Small(40);
    i128ValB = val.fromI128Pieces(0, 40);
    if (!val128.i128eq(i128ValR, val128.i128add(i128ValA, i128ValB))) {
        return val.fromFalse();
    }
    
    i128ValA  = val.fromI128Pieces(0, 40);
    i128ValB = val.fromI128Small(40);
    if (!val128.i128eq(i128ValR, val128.i128add(i128ValA, i128ValB))) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Pieces(100, 40);
    i128ValB = val.fromI128Pieces(100, 40);
    i128ValR = val.fromI128Pieces(200, 80);
    if (!val128.i128eq(i128ValR, val128.i128add(i128ValA, i128ValB))) {
        return val.fromFalse();
    }

    // Should subtract two numbers
    b_lo = u128.sub(355, 355, 100, 255);
    b_hi = u128.__hi;

    if (!u128.eq(b_lo, b_hi, 255, 100)) {
        return val.fromFalse();
    }

    // Should sub [0, 0] and [1, 1]
    
    b_lo = u128.sub(0, 0, 1, 1);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, max, max - 1)) {
        return val.fromFalse();
    }

    // Should sub [0, 0] and [max, max]
    // @ts-ignore
    b_lo = u128.sub(0, 0, max, max);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 1, 0)) {
        return val.fromFalse();
    }

    // Should sub [max, max] and [1, 0]
    // @ts-ignore
    b_lo = u128.sub(max, max, 1, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, max - 1, max)) {
        return val.fromFalse();
    }

    // Should sub [1, 2] and [max - 1, max - 2]
    // @ts-ignore
    b_lo = u128.sub(1, 2, max - 1, max - 2);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 3, 4)) {
        return val.fromFalse();
    }

    // Should sub two U128Val
    u128ValA  = val.fromU128Pieces(0, 40);
    u128ValB = val.fromU128Small(20);
    u128ValR = val.fromU128Small(20);
    if (!val128.u128eq(u128ValR, val128.u128sub(u128ValA, u128ValB))) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Small(40);
    u128ValB = val.fromU128Small(20);
    if (!val128.u128eq(u128ValR, val128.u128sub(u128ValA, u128ValB))) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Small(40);
    u128ValB = val.fromU128Pieces(0, 20);
    if (!val128.u128eq(u128ValR, val128.u128sub(u128ValA, u128ValB))) {
        return val.fromFalse();
    }
    
    u128ValA  = val.fromU128Pieces(0, 40);
    u128ValB = val.fromU128Small(20);
    if (!val128.u128eq(u128ValR, val128.u128sub(u128ValA, u128ValB))) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Pieces(100, 40);
    u128ValB = val.fromU128Pieces(100, 40);
    u128ValR = val.fromU128Pieces(0, 0);
    if (!val128.u128eq(u128ValR, val128.u128sub(u128ValA, u128ValB))) {
        return val.fromFalse();
    }

    // Should sub two I128Val
    i128ValA  = val.fromI128Pieces(0, 40);
    i128ValB = val.fromI128Small(20);
    i128ValR = val.fromI128Small(20);
    if (!val128.i128eq(i128ValR, val128.i128sub(i128ValA, i128ValB))) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Small(40);
    i128ValB = val.fromI128Small(20);
    if (!val128.i128eq(i128ValR, val128.i128sub(i128ValA, i128ValB))) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Small(40);
    i128ValB = val.fromI128Pieces(0, 20);
    if (!val128.i128eq(i128ValR, val128.i128sub(i128ValA, i128ValB))) {
        return val.fromFalse();
    }
    
    i128ValA  = val.fromI128Pieces(0, 40);
    i128ValB = val.fromI128Small(20);
    if (!val128.i128eq(i128ValR, val128.i128sub(i128ValA, i128ValB))) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Pieces(100, 40);
    i128ValB = val.fromI128Pieces(100, 40);
    i128ValR = val.fromI128Pieces(0, 0);
    if (!val128.i128eq(i128ValR, val128.i128sub(i128ValA, i128ValB))) {
        return val.fromFalse();
    }

    // Should multiply two numbers
    // @ts-ignore
    b_lo = u128.mul(43545453452, 0, 2353454354, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 10248516654965971928, 5)) {
        return val.fromFalse();
    }

    // Should multiply two numbers 1
    // @ts-ignore
    b_lo = u128.mul(max, max, 1, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, max, max)) {
        return val.fromFalse();
    }

    // Should multiply two numbers with overflow 1
    // @ts-ignore
    b_lo = u128.mul(0, 1, 0, 1);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 0, 0)) {
        return val.fromFalse();
    }

    // Should multiply two numbers with overflow 2
    // @ts-ignore
    b_lo = u128.mul(1, 1, 1, 1);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 1, 2)) {
        return val.fromFalse();
    }

    // Should mul two U128Val
    u128ValA  = val.fromU128Pieces(0, 40);
    u128ValB = val.fromU128Small(20);
    u128ValR = val.fromU128Small(800);
    if (!val128.u128eq(u128ValR, val128.u128mul(u128ValA, u128ValB))) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Small(40);
    u128ValB = val.fromU128Small(20);
    if (!val128.u128eq(u128ValR, val128.u128mul(u128ValA, u128ValB))) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Small(40);
    u128ValB = val.fromU128Pieces(0, 20);
    if (!val128.u128eq(u128ValR, val128.u128mul(u128ValA, u128ValB))) {
        return val.fromFalse();
    }
    
    u128ValA  = val.fromU128Pieces(0, 40);
    u128ValB = val.fromU128Small(20);
    if (!val128.u128eq(u128ValR, val128.u128mul(u128ValA, u128ValB))) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Pieces(0, 40);
    u128ValB = val.fromU128Pieces(0, 20);
    u128ValR = val.fromU128Pieces(0, 800);
    if (!val128.u128eq(u128ValR, val128.u128mul(u128ValA, u128ValB))) {
        return val.fromFalse();
    }

    // Should mul two I128Val
    i128ValA  = val.fromI128Pieces(0, 40);
    i128ValB = val.fromI128Small(20);
    i128ValR = val.fromI128Small(800);
    if (!val128.i128eq(i128ValR, val128.i128mul(i128ValA, i128ValB))) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Small(40);
    i128ValB = val.fromI128Small(20);
    if (!val128.i128eq(i128ValR, val128.i128mul(i128ValA, i128ValB))) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Small(40);
    i128ValB = val.fromI128Pieces(0, 20);
    if (!val128.i128eq(i128ValR, val128.i128mul(i128ValA, i128ValB))) {
        return val.fromFalse();
    }
    
    i128ValA  = val.fromI128Pieces(0, 40);
    i128ValB = val.fromI128Small(20);
    if (!val128.i128eq(i128ValR, val128.i128mul(i128ValA, i128ValB))) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Pieces(0, 40);
    i128ValB = val.fromI128Pieces(0, 20);
    i128ValR = val.fromI128Pieces(0, 800);
    if (!val128.i128eq(i128ValR, val128.i128mul(i128ValA, i128ValB))) {
        return val.fromFalse();
    }

    // Should increment number 1
    b_lo = u128.inc(10248516654965971928, 5);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 10248516654965971929, 5)) {
        return val.fromFalse();
    }

    // Should increment number 2
    b_lo = u128.inc(0xFFFFFFFFFFFFFFFF, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 0, 1)) {
        return val.fromFalse();
    }

    // Should increment number 3
    b_lo = u128.inc(0, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 1, 0)) {
        return val.fromFalse();
    }

    // Should increment number 4
    // @ts-ignore
    b_lo = u128.inc(<u64>-2, <u64>-1);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, max, max)) {
        return val.fromFalse();
    }

    // Should decrement number 1
    b_lo = u128.dec(10248516654965971928, 5);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 10248516654965971927, 5)) {
        return val.fromFalse();
    }

    // Should decrement number 2
    b_lo = u128.dec(0, 1);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 0xFFFFFFFFFFFFFFFF, 0)) {
        return val.fromFalse();
    }

    // Should number binary not
    b_lo = u128.not(1, 2);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, ~1, ~2)) {
        return val.fromFalse();
    }

    // Should binary or numbers
    b_lo = u128.or(0, 123, 111, 222);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 0 | 111, 123 | 222)) {
        return val.fromFalse();
    }

    // Should binary xor numbers
    b_lo = u128.xor(111, 123, 111, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 111 ^ 111, 123 ^ 0)) {
        return val.fromFalse();
    }

    // Should binary and numbers
    b_lo = u128.and(0xFF00, 123, 0x00FF, 234);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 0xFF00 & 0x00FF, 123 & 234)) {
        return val.fromFalse();
    }

    // Should left shift one number
    b_lo = u128.shl(1, 0, 65);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 0, 2)) {
        return val.fromFalse();
    }

    // Should periodic left shift one number
    b_lo = u128.shl(1, 0, 65 + 128);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 0, 2)) {
        return val.fromFalse();
    }

    // Should invariant left shift zero number
    b_lo = u128.shl(1, 1, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 1, 1)) {
        return val.fromFalse();
    }

    // Should right shift one number
    b_lo = u128.shr(0, 100, 65);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 50, 0)) {
        return val.fromFalse();
    }

    // Should periodic right shift one number
    b_lo = u128.shr(0, 100, 65 + 128);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 50, 0)) {
        return val.fromFalse();
    }

    // Should invariant right shift zero number
    b_lo = u128.shr(1, 1, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 1, 1)) {
        return val.fromFalse();
    }

    // Should divide two numbers without remainder 1
    b_lo = u128.div(10248516657319426282, 5, 2353454354, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 43545453453, 0)) {
        return val.fromFalse();
    }

    // Should divide two numbers without remainder 2
    b_lo = u128.div(10248516654965971928, 5, 43545453452, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 2353454354, 0)) {
        return val.fromFalse();
    }

    // Should divide two numbers without remainder 3
    b_lo = u128.div(3152652666208173568, 2, 4354545345312, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 9196400, 0)) {
        return val.fromFalse();
    }

    // Should divide two numbers with remainder 1
    b_lo = u128.div(3152652666208173568, 2, 43543534534534, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 919680, 0)) {
        return val.fromFalse();
    }

    // Should divide two numbers with remainder 2
    b_lo = u128.div(3152652666208178, 0, 43543534534534, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 72, 0)) {
        return val.fromFalse();
    }

    // Should divide zero with number
    b_lo = u128.div(0, 0, 10248516654965971928, 5);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 0, 0)) {
        return val.fromFalse();
    }

    // Should divide number with 1
    b_lo = u128.div(10248516654965971928, 5, 1, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 10248516654965971928, 5)) {
        return val.fromFalse();
    }

     // Should div two U128Val
     u128ValA  = val.fromU128Pieces(0, 40);
     u128ValB = val.fromU128Small(20);
     u128ValR = val.fromU128Small(2);
     if (!val128.u128eq(u128ValR, val128.u128div(u128ValA, u128ValB))) {
         return val.fromFalse();
     }
 
     u128ValA  = val.fromU128Small(40);
     u128ValB = val.fromU128Small(20);
     if (!val128.u128eq(u128ValR, val128.u128div(u128ValA, u128ValB))) {
         return val.fromFalse();
     }
 
     u128ValA  = val.fromU128Small(40);
     u128ValB = val.fromU128Pieces(0, 20);
     if (!val128.u128eq(u128ValR, val128.u128div(u128ValA, u128ValB))) {
         return val.fromFalse();
     }
     
     u128ValA  = val.fromU128Pieces(0, 40);
     u128ValB = val.fromU128Small(20);
     if (!val128.u128eq(u128ValR, val128.u128div(u128ValA, u128ValB))) {
         return val.fromFalse();
     }
 
     u128ValA  = val.fromU128Pieces(0, 40);
     u128ValB = val.fromU128Pieces(0, 20);
     u128ValR = val.fromU128Pieces(0, 2);
     if (!val128.u128eq(u128ValR, val128.u128div(u128ValA, u128ValB))) {
         return val.fromFalse();
     }
 
     // Should div two I128Val
     i128ValA  = val.fromI128Pieces(0, 40);
     i128ValB = val.fromI128Small(20);
     i128ValR = val.fromI128Small(2);
     if (!val128.i128eq(i128ValR, val128.i128div(i128ValA, i128ValB))) {
         return val.fromFalse();
     }
 
     i128ValA  = val.fromI128Small(40);
     i128ValB = val.fromI128Small(20);
     if (!val128.i128eq(i128ValR, val128.i128div(i128ValA, i128ValB))) {
         return val.fromFalse();
     }
 
     i128ValA  = val.fromI128Small(40);
     i128ValB = val.fromI128Pieces(0, 20);
     if (!val128.i128eq(i128ValR, val128.i128div(i128ValA, i128ValB))) {
         return val.fromFalse();
     }
     
     i128ValA  = val.fromI128Pieces(0, 40);
     i128ValB = val.fromI128Small(20);
     if (!val128.i128eq(i128ValR, val128.i128div(i128ValA, i128ValB))) {
         return val.fromFalse();
     }
 
     i128ValA  = val.fromI128Pieces(0, 40);
     i128ValB = val.fromI128Pieces(0, 20);
     i128ValR = val.fromI128Pieces(0, 2);
     if (!val128.i128eq(i128ValR, val128.i128div(i128ValA, i128ValB))) {
         return val.fromFalse();
     }

    // Should muldiv return zero 1
    b_lo = u128.muldiv(10248516654965971928, 5, 0, 0, 22972907047680, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 0, 0)) {
        return val.fromFalse();
    }

    // Should muldiv return zero 2
    b_lo = u128.muldiv(0, 0, 1, 0, 22972907047680, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 0, 0)) {
        return val.fromFalse();
    }

    // Should muldiv same number 1
    b_lo = u128.muldiv(10248516654965971928, 5, 22972907047680, 0, 22972907047680, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 10248516654965971928, 5)) {
        return val.fromFalse();
    }

    // Should muldiv same number 2
    b_lo = u128.muldiv(max, max, max, max, max, max);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, max, max)) {
        return val.fromFalse();
    }

    // Should muldiv small arguments without overflow 64-bits
    b_lo = u128.muldiv(498419840516515123, 0, 6132198419878046132, 0, 9156498145135109843, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 333796753956109993, 0)) {
        return val.fromFalse();
    }

    // Should muldiv small arguments without overflow 64-bits
    b_lo = u128.muldiv(9223372032559808512, 0, 9223372036854775807, 0, 12, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 11529215046426383701, 384307168023325354)) {
        return val.fromFalse();
    }

    // Should muldiv with small b and huge c
    b_lo = u128.muldiv(9223372032559808512, 123456, 123456, 0, 0xFFFFFFFFFFFFFFFF, 123456);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 123455, 0)) {
        return val.fromFalse();
    }

    // Should muldiv big arguments with overflow 128-bits 1
    b_lo = u128.muldiv(17368525644200112449, 244614, 4017580189248773693, 12699, 3434515, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 12770041117111790654, 8684128842189806128)) {
        return val.fromFalse();
    }

    // Should muldiv big arguments with overflow 128-bits 2
    b_lo = u128.muldiv(max, max, 0x7FFFFFFFFFFFFFFF, 0x8111111111111111, 0x3333333333333333, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 9223372036854775803, 384307168202282322)) {
        return val.fromFalse();
    }

    // Should muldiv U128Val values
    u128ValA  = val.fromU128Pieces(0, 40);
    u128ValB = val.fromU128Small(20);
    var u128ValC = val.fromU128Small(20);
    u128ValR = val.fromU128Small(40);
    if (!val128.u128eq(u128ValR, val128.u128muldiv(u128ValA, u128ValB, u128ValC))) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Small(40);
    u128ValB = val.fromU128Small(20);
    if (!val128.u128eq(u128ValR, val128.u128muldiv(u128ValA, u128ValB, u128ValC))) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Small(40);
    u128ValB = val.fromU128Pieces(0, 20);
    if (!val128.u128eq(u128ValR, val128.u128muldiv(u128ValA, u128ValB, u128ValC))) {
        return val.fromFalse();
    }
    
    u128ValA  = val.fromU128Pieces(0, 40);
    u128ValB = val.fromU128Small(20);
    if (!val128.u128eq(u128ValR, val128.u128muldiv(u128ValA, u128ValB, u128ValC))) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Pieces(0, 40);
    u128ValB = val.fromU128Pieces(0, 20);
    u128ValR = val.fromU128Pieces(0, 40);
    if (!val128.u128eq(u128ValR, val128.u128muldiv(u128ValA, u128ValB, u128ValC))) {
        return val.fromFalse();
    }

    // Should muldiv I128Val values
    i128ValA  = val.fromI128Pieces(0, 40);
    i128ValB = val.fromI128Small(20);
    var i128ValC = val.fromI128Small(20);
    i128ValR = val.fromI128Small(40);
    if (!val128.i128eq(i128ValR, val128.i128muldiv(i128ValA, i128ValB, i128ValC))) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Small(40);
    i128ValB = val.fromI128Small(20);
    if (!val128.i128eq(i128ValR, val128.i128muldiv(i128ValA, i128ValB, i128ValC))) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Small(40);
    i128ValB = val.fromI128Pieces(0, 20);
    if (!val128.i128eq(i128ValR, val128.i128muldiv(i128ValA, i128ValB, i128ValC))) {
        return val.fromFalse();
    }
    
    i128ValA  = val.fromI128Pieces(0, 40);
    i128ValB = val.fromI128Small(20);
    if (!val128.i128eq(i128ValR, val128.i128muldiv(i128ValA, i128ValB, i128ValC))) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Pieces(0, 40);
    i128ValB = val.fromI128Pieces(0, 20);
    i128ValR = val.fromI128Pieces(0, 40);
    if (!val128.i128eq(i128ValR, val128.i128muldiv(i128ValA, i128ValB, i128ValC))) {
        return val.fromFalse();
    }

    // Should sqrt zero number
    b_lo = u128.sqrt(0,0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 0, 0)) {
        return val.fromFalse();
    }

    // Should sqrt one number
    b_lo = u128.sqrt(1, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 1, 0)) {
        return val.fromFalse();
    }

    // Should sqrt three number
    b_lo = u128.sqrt(3, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 1, 0)) {
        return val.fromFalse();
    }

    // Should sqrt four number
    b_lo = u128.sqrt(4, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 2, 0)) {
        return val.fromFalse();
    }

    // Should sqrt five number
    b_lo = u128.sqrt(5, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 2, 0)) {
        return val.fromFalse();
    }

    // Should sqrt six number
    b_lo = u128.sqrt(6, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 2, 0)) {
        return val.fromFalse();
    }

    // Should sqrt nine number
    b_lo = u128.sqrt(9, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 3, 0)) {
        return val.fromFalse();
    }
    
    // Should sqrt 1000 number
    b_lo = u128.sqrt(1000, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 31, 0)) {
        return val.fromFalse();
    }

    // Should sqrt 0x33333333333333333333333333333333 number
    b_lo = u128.sqrt(0x3333333333333333, 0x3333333333333333);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 0x727C9716FFB764D5, 0)) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Pieces(0x3333333333333333, 0x3333333333333333);
    i128ValR = val.fromI128Pieces(0, 0x727C9716FFB764D5);
    if (!val128.i128eq(i128ValR, val128.i128sqrt(i128ValA))) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Pieces(0x3333333333333333, 0x3333333333333333);
    u128ValR = val.fromU128Pieces(0, 0x727C9716FFB764D5);
    if (!val128.u128eq(u128ValR, val128.u128sqrt(u128ValA))) {
        return val.fromFalse();
    }

    // Should sqrt max value number
    b_lo = u128.sqrt(max, max);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, max, 0)) {
        return val.fromFalse();
    }

    // Should power of zero with zero return one number
    b_lo = u128.pow(0, 0, 0);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 1, 0)) {
        return val.fromFalse();
    }

    // Should power of one with negative return one number
    b_lo = u128.pow(1, 0, -2);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 1, 0)) {
        return val.fromFalse();
    }


    // Should any power for zero return zero
    b_lo = u128.pow(0, 0, 10);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 0, 0)) {
        return val.fromFalse();
    }
    b_lo = u128.pow(0, 0, 2);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 0, 0)) {
        return val.fromFalse();
    }
    b_lo = u128.pow(0, 0, 1);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 0, 0)) {
        return val.fromFalse();
    }

    // Should power of one return same number
    b_lo = u128.pow(192, 192, 1);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 192, 192)) {
        return val.fromFalse();
    }

    // Should power of two return squared number 1
    b_lo = u128.pow(1, 0, 2);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 1, 0)) {
        return val.fromFalse();
    }

    // Should power of two return squared number 2
    b_lo = u128.pow(0xFFFFFFFF, 0, 2);
    b_hi = u128.__hi;
    var c_lo = u128.mul(0xFFFFFFFF, 0, 0xFFFFFFFF, 0);
    var c_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, c_lo, c_hi)) {
        return val.fromFalse();
    }

    // Should power of two return squared number 3
    b_lo = u128.pow(0xFFFF, 0, 2);
    b_hi = u128.__hi;
    c_lo = u128.mul(0xFFFF, 0, 0xFFFF, 0);
    c_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, c_lo, c_hi)) {
        return val.fromFalse();
    }

    // Should power of two return squared number 4
    b_lo = u128.pow(0xFFFF - 1, 0, 2);
    b_hi = u128.__hi;
    c_lo = u128.mul(0xFFFF - 1, 0, 0xFFFF - 1, 0);
    c_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, c_lo, c_hi)) {
        return val.fromFalse();
    }

    // Should power of two return squared number with overflow
    b_lo = u128.pow(0, 1, 2);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 0, 0)) {
        return val.fromFalse();
    }

    // Should power of two return squared number with overflow 2
    b_lo = u128.pow(0, 3, 2);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 0, 0)) {
        return val.fromFalse();
    }

    // Should power of three return number
    b_lo = u128.pow(0xFFFF, 0, 3);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 0xFFFD0002FFFF, 0)) {
        return val.fromFalse();
    }

    // Should power of three return number 2
    b_lo = u128.pow(12345678, 0, 3);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 0x017FEC50E04509B8, 0x66)) {
        return val.fromFalse();
    }

    i128ValA  = val.fromI128Pieces(0, 12345678);
    i128ValR = val.fromI128Pieces(0x66, 0x017FEC50E04509B8);
    if (!val128.i128eq(i128ValR, val128.i128pow(i128ValA, 3))) {
        return val.fromFalse();
    }

    u128ValA  = val.fromU128Pieces(0, 12345678);
    u128ValR = val.fromU128Pieces(0x66, 0x017FEC50E04509B8);
    if (!val128.u128eq(u128ValR, val128.u128pow(u128ValA, 3))) {
        return val.fromFalse();
    }

    // Should power of four return number 
    b_lo = u128.pow(0, 1, 4);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 0, 0)) {
        return val.fromFalse();
    }

    // Should power of 18 return number
    b_lo = u128.pow(123, 0, 18);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 0xB8C3F9BBD49E3CD9, 0x1F3D196F2C2AF26A)) {
        return val.fromFalse();
    }

    // Should power of 127 return number
    b_lo = u128.pow(2, 0, 127);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 0, 0x8000000000000000)) {
        return val.fromFalse();
    }

    // Should power of 128 return zero number
    b_lo = u128.pow(2, 0, 128);
    b_hi = u128.__hi;
    if (!u128.eq(b_lo, b_hi, 0, 0)) {
        return val.fromFalse();
    }
    
    return val.fromTrue();
    
}
