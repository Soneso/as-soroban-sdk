import * as val from "../../lib/value";
import * as context from "../../lib/context";
import { Map } from "../../lib/map";
import { Vec } from "../../lib/vec";
import { Bytes } from "../../lib/bytes";
import { BigInt } from "../../lib/bigint";

export function maps(): val.RawVal {

  let map = new Map();

  let key1 = val.fromSymbolStr("key1");
  let value1 = val.fromSymbolStr("value1");
  map.put(key1, value1);

  let key2 = val.fromU32(12);
  let value2 = val.fromU32(122);
  map.put(key2, value2); // in front!

  if (map.len() != 2) {
    return val.fromFalse();
  }

  let value1test = map.get(key1);
  let value2test = map.get(key2);
  if (context.compare(value1, value1test) != 0 || context.compare(value2, value2test) != 0) {
    return val.fromFalse();
  }

  map.del(key2);
  if (map.len() != 1 || !map.has(key1)) {
    return val.fromFalse();
  }

  map.put(key2, value2); //in front!

  let minKey = map.getMinKey();
  let maxKey = map.getMaxKey();
  if (key1 != maxKey || key2 != minKey) {
    return val.fromFalse();
  }

  let k2Test = map.getPrevKey(key1);
  let k1Test = map.getNextKey(key2);
  
  if (k2Test != key2 || k1Test != key1) {
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

  let comp = context.compare(map2.getHostObject(), map3.getHostObject());
  if (comp != 0) {
    return val.fromFalse();
  }

  return val.fromTrue();
}

export function vecs(): val.RawVal {

    let vec = new Vec();
    let val1 = val.fromU32(12);
    let val2 = new Map();
    val2.put(val.fromI32(-11), val.fromSymbolStr("hello"));
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
    if (context.compare(val2Test, val2.getHostObject()) != 0) {
        return val.fromFalse();
    }

    vec.put(0, val2.getHostObject());
    vec.put(1, val1);
    
    let v2Test = vec.get(0);
    let v1Test = vec.get(1);
    if (context.compare(v2Test, val2.getHostObject()) != 0 || v1Test != val1) {
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

    let vec2 = Vec.newWithCapacity(3);
    vec2.append(slice);
    if (vec2.len() != 3) {
        return val.fromFalse();
    }

    if(context.compare(vec2.getHostObject(), slice.getHostObject()) != 0) {
        return val.fromFalse();
    }
    return val.fromTrue();
}

export function bytes(): val.RawVal {


    let val1 = val.fromU32(12);
    let sb = Bytes.serialize(val1);
    let val2 = sb.deserialize();

    if(val1 != val2) {
        return val.fromFalse();
    }


    let c = Bytes.fromString("hello");
    c.copyToLinearMemory(val.fromU32(0), val.fromU32(0), val.fromU32(5));
    let d = Bytes.newFromLinearMemory(val.fromU32(0), val.fromU32(5));
    if(context.compare(c.getHostObject(), d.getHostObject()) != 0) {
        return val.fromFalse();
    }
    let e = new Bytes();
    e.copyFromLinearMemory(val.fromU32(0), val.fromU32(0), val.fromU32(5));
    if(context.compare(e.getHostObject(), d.getHostObject()) != 0) {
        return val.fromFalse();
    }

    let b = new Bytes();
    let t0 = val.fromU32(0);
    let t1 = val.fromU32(1);
    let t2 = val.fromU32(2);
    let t3 = val.fromU32(3);
    let t4 = val.fromU32(4);
    let t5 = val.fromU32(5);
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
    if (context.compare(b4.getHostObject(), b5.getHostObject()) != 0) {
        return val.fromFalse();
    }

    b4.put(1,t3);
    if (b4.get(1) != t3) {
        return val.fromFalse();
    }

    return val.fromTrue();
}

export function bigInts(): val.RawVal {

    let b1 = BigInt.fromI64(9007199254740991);
    let b2 = BigInt.fromU64(9007199254740991);
    if (context.compare(b1.getHostObject(), b2.getHostObject()) != 0) {
        return val.fromFalse();
    }

    let testVal = 9007199254740991;
    if (b1.toI64() != testVal || b2.toU64() != testVal) {
        return val.fromFalse();
    }

    let b3 = b1.add(b2);
    if (context.compare(b3.getHostObject(), b2.getHostObject()) != 1) {
        return val.fromFalse();
    }

    b3 = b3.sub(b2);
    if (context.compare(b3.getHostObject(), b2.getHostObject()) != 0) {
        return val.fromFalse();
    }
    
    b3.addAssign(b2);
    if (context.compare(b3.getHostObject(), b2.getHostObject()) != 1) {
        return val.fromFalse();
    }

    b3.subAssign(b2);
    if (context.compare(b3.getHostObject(), b2.getHostObject()) != 0) {
        return val.fromFalse();
    }

    b3 = b1.mul(b2);
    if (context.compare(b3.getHostObject(), b2.getHostObject()) != 1) {
        return val.fromFalse();
    }

    b3 = b3.div(b2);
    if (context.compare(b3.getHostObject(), b2.getHostObject()) != 0) {
        return val.fromFalse();
    }

    b3.mulAssign(b2);
    if (context.compare(b3.getHostObject(), b2.getHostObject()) != 1) {
        return val.fromFalse();
    }

    b3.divAssign(b2);
    if (context.compare(b3.getHostObject(), b2.getHostObject()) != 0) {
        return val.fromFalse();
    }

    let x2 = BigInt.fromU64(2);
    let b4 = b2.pow(x2);
    let b5 = b4.sqrt();
    if (context.compare(b5.getHostObject(), b2.getHostObject()) != 0) {
        return val.fromFalse();
    }

    b5.powAssign(x2);
    b5.sqrtAssign();
    if (context.compare(b5.getHostObject(), b2.getHostObject()) != 0) {
        return val.fromFalse();
    }

    let b6 = BigInt.fromU64(3);
    let b7 = b6.powMod(x2, x2);
    if (b7.toU64() != 1) {
        return val.fromFalse();
    }
    b6.powModAssign(x2,x2);
    if (b6.toU64() != 1) {
        return val.fromFalse();
    }

    if(b2.bits() != 53) {
        return val.fromFalse();
    }

    let byBe = b2.toBytesBe();
    let b22 = BigInt.fromBytesBe(1, byBe);
    if (context.compare(b22.getHostObject(), b2.getHostObject()) != 0) {
        return val.fromFalse();
    }

    let byRx = b2.toRadixBe(256);
    let b23 = BigInt.fromRadixBe(1, byRx, 256);
    if (context.compare(b23.getHostObject(), b2.getHostObject()) != 0) {
        return val.fromFalse();
    }

    let b8 = b1.sub(b2); 
    if (!b8.isZero()) {
        return val.fromFalse();
    }

    let b9 = BigInt.fromU64(9);
    let b10 = b9.rem(x2);
    if (b10.toU64() != 1) {
        return val.fromFalse();
    }
    b9.remAssign(x2);
    if (b9.toU64() != 1) {
        return val.fromFalse();
    }

    b3 = BigInt.fromU64(4); // 100
    b4 = BigInt.fromU64(7); // 111
    b5 = b3.and(b4);
    if (context.compare(b3.getHostObject(), b5.getHostObject()) != 0) {
        return val.fromFalse();
    }
    b3.andAssign(b4);
    if (context.compare(b3.getHostObject(), b5.getHostObject()) != 0) {
        return val.fromFalse();
    }
    b5 = b3.or(b4);
    if (context.compare(b4.getHostObject(), b5.getHostObject()) != 0) {
        return val.fromFalse();
    }
    b4.orAssign(b3);
    if (context.compare(b4.getHostObject(), b5.getHostObject()) != 0) {
        return val.fromFalse();
    }
    
    b6 = BigInt.fromU64(3);
    b5 = b3.xor(b4);
    if (context.compare(b6.getHostObject(), b5.getHostObject()) != 0) {
        return val.fromFalse();
    }

    b3.xorAssign(b4);
    if (context.compare(b6.getHostObject(), b3.getHostObject()) != 0) {
        return val.fromFalse();
    }

    b3 = BigInt.fromU64(4);
    b6 = BigInt.fromU64(16);
    b4 = b3.shl(x2);
    if (context.compare(b6.getHostObject(), b4.getHostObject()) != 0) {
        return val.fromFalse();
    }

    b3.shlAssign(x2);
    if (context.compare(b6.getHostObject(), b3.getHostObject()) != 0) {
        return val.fromFalse();
    }

    b3 = BigInt.fromU64(4);
    b4 = b6.shr(x2);
    if (context.compare(b4.getHostObject(), b3.getHostObject()) != 0) {
        return val.fromFalse();
    }

    b6.shrAssign(x2);
    if (context.compare(b6.getHostObject(), b3.getHostObject()) != 0) {
        return val.fromFalse();
    }

    b4 = b3.neg();
    b6 = b4.add(b3);
    if(!b6.isZero()) {
        return val.fromFalse();
    }

    b3 = BigInt.fromU64(3);
    b4 = BigInt.fromU64(3);
    b3.negAssign();
    b6 = b3.add(b4);
    if(!b6.isZero()) {
        return val.fromFalse();
    }
    
    b6 = BigInt.fromU64(1);
    b3 = b6.not();
    if (context.compare(b6.getHostObject(), b3.getHostObject()) == 0) {
        return val.fromFalse();
    }
    b4 = BigInt.fromU64(1);
    b6.notAssign();
    if (context.compare(b6.getHostObject(), b4.getHostObject()) == 0) {
        return val.fromFalse();
    }

    b3 = BigInt.fromU64(4);
    b4 = BigInt.fromU64(6);
    b6 = b3.gcd(b4);
    if (context.compare(x2.getHostObject(), b6.getHostObject()) != 0) {
        return val.fromFalse();
    }
    b3.gcdAssign(b4);
    if (context.compare(x2.getHostObject(), b3.getHostObject()) != 0) {
        return val.fromFalse();
    }

    b3 = BigInt.fromU64(4);
    b6 = b3.lcm(b4);
    b5 = BigInt.fromU64(12);
    if (context.compare(b5.getHostObject(), b6.getHostObject()) != 0) {
        return val.fromFalse();
    }
    b3.lcmAssign(b4);
    if (context.compare(b5.getHostObject(), b3.getHostObject()) != 0) {
        return val.fromFalse();
    }
    return val.fromTrue();

}