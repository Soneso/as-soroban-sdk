# [Stellar Soroban SDK for AssemblyScript](https://github.com/Soneso/as-soroban-sdk)

![v0.1.0](https://img.shields.io/badge/v0.1.0-yellow.svg)

This AssemblyScript SDK is for writing contracts for [Soroban](https://soroban.stellar.org). Soroban is a smart contracts platform from Stellar that is designed with purpose and built to perform.

**This repository contains code that is in very early development, incomplete, not tested, and not recommended for use. The API is unstable, experimental, and is receiving breaking changes frequently.**

## Quick Start

### 1. Setup a new project

Set up a new AssemblyScript project as described in the [AssemblyScript Book](https://www.assemblyscript.org/getting-started.html#setting-up-a-new-project)

```shell
$ mkdir hello
$ cd hello
$ npm init
$ npm install --save-dev assemblyscript
$ npx asinit .

```

### 2. Install the SDK

```shell
$ npm install as-soroban-sdk

```

### 3. Write your contract
You can now write your contract in the ```./assembly/index.ts``` file. For example:

```typescript
import {SymbolVal, VectorObject, fromSymbolStr} from 'as-soroban-sdk/lib/value';
import {Vec} from 'as-soroban-sdk/lib/vec';

export function hello(to: SymbolVal): VectorObject {

  let vec = new Vec();
  vec.pushFront(fromSymbolStr("Hello"));
  vec.pushBack(to);
  
  return vec.getHostObject();
}
```

Next you need to add a ```contract.json``` file to the project. It must contain the metadata for your contract.

```json
{
    "name": "hello word",
    "version": "0.0.1",
    "description": "my first contract",
    "host_functions_version": 29,
    "functions": [
        {
            "name" : "hello",
            "arguments": [{"name": "to", "type": "symbol"}],
            "returns" : "vec[symbol]"
        }
    ]
}
```

Finally, edit the ```asconfig.json``` file of your project. Replace its content with the following:

```json
{
  "extends": "as-soroban-sdk/sdkasconfig",
  "targets": {
    "release": {
      "outFile": "build/release.wasm",
      "textFile": "build/release.wat"
    },
    "debug": {
      "outFile": "build/debug.wasm",
      "textFile": "build/debug.wat"
    }
  }
}
```

### 4. Compile your contract

```shell
$ asc assembly/index.ts --target release
```

You can find the generated ```.wasm``` (WebAssembly) file in the ```build``` folder. You can also find the ```.wat``` file there (Text format of the ```.wasm```).

### 5. Run your contract (sandbox)

To run the contract, you must first install the official soroban cli as described here: [stellar soroban cli](https://github.com/stellar/soroban-cli).

```shell
$ cargo install --locked --version 0.6.0 soroban-cli
```

Run your contract:

```shell
$ soroban contract invoke --wasm build/release.wasm --id 1 --fn hello -- --to friend
```

You can also use one of our Stellar SDKs to deploy and invoke contracts:

- [Stellar iOS SDK](https://github.com/Soneso/stellar-ios-mac-sdk/blob/master/soroban.md)
- [Stellar Flutter SDK](https://github.com/Soneso/stellar_flutter_sdk/blob/master/soroban.md)
- [Stellar PHP SDK](https://github.com/Soneso/stellar-php-sdk/blob/main/soroban.md)


## Features and limitations

In the [Build your own SDK](https://soroban.stellar.org/docs/SDKs/byo) chapter of the official [Soroban documentation](https://soroban.stellar.org), one can find the requirements for a Soroban SDK.

This assembly script Soroban SDK **can** help you with:
- Value Conversions
- Host functions
- SDK Types
- User Defined Errors
- Meta Generation
- Contract Spec Generation
- Testing

As helping features for testing one can use **logging** to generate outputs during the execution of the contract in the sandbox (only sandbox - soroban-cli). The assembly script Soroban SDK also provided the possibility to **publish events**. 

### Value Conversions

When calling a contract function the host will only pass ```u64``` raw values. The raw values can encode different types of values (e.g. ```i32```, ```u32```, ```symbol```, ```bitset```, etc.) or ```object handles```. Please read more details about them in [CAP-46](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0046.md#host-value-type).

The SDK can encode and decode these values.


```RawVals``` divide up the space of 64 bits according to a 2-level tagging scheme. The first tag is a bit in the least-significant position, indicating whether the `RawVal` is a plain ```u63``` 63-bit unsigned integer, or some more-structured value with a second-level tag in the next most significant 3 bits. The 63-bit unsigned integer case can also be thought of as handling the complete range of non-negative signed 64-bit integers.

The remaining 3 bit tags are assigned to cases, of which 7 are defined and one is currently reserved.

Schematically, the bit-assignment for `RawVal` looks like this:

```text
0x_NNNN_NNNN_NNNN_NNNX  - u63, for any even X
0x_0000_000N_NNNN_NNN1  - u32
0x_0000_000N_NNNN_NNN3  - i32
0x_NNNN_NNNN_NNNN_NNN5  - static: void, true, false, ...
0x_IIII_IIII_TTTT_TTT7  - object: 32-bit index I, 28-bit type code T
0x_NNNN_NNNN_NNNN_NNN9  - symbol: up to 10 6-bit identifier characters
0x_NNNN_NNNN_NNNN_NNNb  - bitset: up to 60 bits
0x_CCCC_CCCC_TTTT_TTTd  - status: 32-bit code C, 28-bit type code T
0x_NNNN_NNNN_NNNN_NNNf  - reserved
```

The AssemblyScript Soroban SDK can convert these values back and forth. For example converting primitives like i32:

```typescript
import * as val from "as-soroban-sdk/lib/value";

// primitives
let xi32 = val.toI32(rawValue);
let xRaw = val.fromI32(xi32); 

// static values
let isTrue = val.fromBool(rawVal);
let rawStaticBool = val.toBool(isTrue);

// objects
let isObject = val.isObject(rawVal);

if (isObject && val.getObjectType(rawVal) == val.objTypeVec) {
    let myVec = new Vec(rawVal);
    myVec.pushFront(val.fromSymbolStr("Hello"));
    let rawVecObj = myVec.getHostObject();
}

// symbols
let myRawSymbol = val.fromSymbolStr("Hello");

// status
if (val.getStatusType(rawVal) == val.statusOk) {
    ...
}
// etc.
```

### Host functions

The host functions defined in [env.json](https://github.com/stellar/rs-soroban-env/blob/main/soroban-env-common/env.json) are functions callable from within the WASM Guest environment. The SDK makes them available to contracts to call in a wrapped form so that contracts have a nicer interface and less abstraction.

For example:

```typescript
function callContractById(id: string, func: string, args: VectorObject): RawVal 
```
or 

```typescript
function putDataFor(symbolKey: string, value: RawVal) : void
```

### SDK Types

Following types are supported by this SDK: `Map`, `Vec`, `Bytes`.

For example work with a vector:

``` typescript
let vec = new Vec();

vec.pushFront(fromSymbolStr("Hello"));
vec.pushBack(fromSymbolStr("friend"));

return vec.getHostObject();
```

or a map:
``` typescript
let myMap = new Map();

myMap.put(fromU32(1), fromSymbolStr("Hello"));
myMap.put(fromU32(2), fromSymbolStr("friend"));
myMap.put(vec.getHostObject(), fromTrue());

return myMap.getHostObject();
```

### User Defined Errors

Errors are u32 values that are translated into a Status. This SDK helps you to create and parse such errors. For example:

```typescript
context.failWithErrorCode(AGE_ERR_CODES.TOO_YOUNG);
```

or 
```typescript
if(isStatus(rawVal) && getStatusType(rawVal) == statusStorageErr) {
    return fromU32(getStatusCode(rawVal))
}
```

See also: [as-soroban-examples](https://github.com/Soneso/as-soroban-examples)

### Meta generation

Contracts must contain a WASM custom section with name ```contractenvmetav0``` and containing a serialized ```SCEnvMetaEntry```. The interface version stored within should match the version of the host functions supported.

The AssemblyScript Soroban SDK simplifies this by providing the possibility to enter the interface version number in the ```contract.json``` file. See also [Understanding contract metadata](https://github.com/Soneso/as-soroban-sdk#understanding-contract-metadata).


### Contract spec generation

Contracts should contain a WASM custom section with name ```contractspecv0``` and containing a serialized stream of ```SCSpecEntry```. There should be a ```SCSpecEntry``` for every function, struct, and union exported by the contract.

The AS Soroban SDK simplifies this by providing the possibility to enter the functions spec in the ```contract.json``` file. See also [Understanding contract metadata](https://github.com/Soneso/as-soroban-sdk#understanding-contract-metadata).


### User Defined Types

Currently the SDK supports only simple enums from scratch.

For example:

```typescript
enum ALLOWED_AGE_RANGE {
  MIN = 18,
  MAX = 99
}
enum AGE_ERR_CODES {
  TOO_YOUNG = 1,
  TOO_OLD = 2
}

export function checkAge(age: RawVal): RawVal {

  let age2check = toI32(age);

  if (age2check < ALLOWED_AGE_RANGE.MIN) {
    failWithErrorCode(AGE_ERR_CODES.TOO_YOUNG);
  }

  if (age2check > ALLOWED_AGE_RANGE.MAX) {
    failWithErrorCode(AGE_ERR_CODES.TOO_OLD);
  }

  return fromSymbolStr("OK");
}
```

However, one can create own user defined types with ease by translating them into Maps or Vectors using the SDK.

## Testing

Testing can be done to some extent by using **logging**, **events** and the **soroban-cli**.

See the [testing example](https://github.com/Soneso/as-soroban-examples/tree/main/testing) that demonstrates a simple way to test a contract.

## Logging

You can log for purpose of debugging. Logs are only visible when executing contracts using ```soroban-cli```. Do not use logs elsewhere.

### Log an utf8 string

```typescript
import * as context from 'as-soroban-sdk/lib/context';

context.logStr("Today is a sunny day!");
```

### Log a formatted utf8 string message

```typescript
import * as context from 'as-soroban-sdk/lib/context';

let args = new Vec();
args.pushBack(val.fromI32(30));
args.pushBack(val.fromSymbolStr("celsius"));
context.logFtm("We have {} degrees {}!", args);

```

See also: [as-soroban-examples](https://github.com/Soneso/as-soroban-examples)

## Publishing events

This AssemblyScript Soroban SDK makes it easy to publish events from a contract. This can also be very useful for testing.

```typescript
context.publishSimpleEvent("STATUS", val.fromU32(1));
```
or
```typescript
let topicsVec = new Vec();

topicsVec.pushBack(val.fromSymbolStr("TOPIC1"));
topicsVec.pushBack(val.fromSymbolStr("TOPIC2"));
topicsVec.pushBack(val.fromSymbolStr("TOPIC3"));

let dataVec = new Vec();
dataVec.pushBack(val.fromU32(223));
dataVec.pushBack(val.fromU32(222));
dataVec.pushBack(val.fromU32(221));

context.publishEvent(topicsVec, dataVec.getHostObject());
```

See also: [as-soroban-examples](https://github.com/Soneso/as-soroban-examples)


## Understanding contract metadata

To be able to run a contract, the compiled ```.wasm``` file needs to contain the web assembly module metadata and contract spec.

They need to be attached to the ```.wasm``` module. Therefore we need the ```contract.json``` file.

The SDK parses the ```contract.json``` file when compiling the contract and converts it to the needed data structures to be added to the ```.wasm``` module. This is done by using an AssemblyScript transform (see: [transforms.mjs](https://github.com/Soneso/as-soroban-sdk/blob/main/transforms.mjs)). 

Required fields are ```host_functions_version``` and the ```functions``` array in a ```contract.json``` file located in the root directory of your assembly script project.

Example:

```json
{
    "name": "hello word",
    "version": "0.1.0",
    "description": "my first contract",
    "host_functions_version": 29,
    "functions": [
        {
            "name" : "hello",
            "arguments": [{"name": "to", "type": "symbol"}],
            "returns" : "vec[symbol]"
        }
    ]
}
```

To find out the needed ```host_functions_version``` you can execute the ```soroban version``` command of the soroban-cli. The interface version stored within should match the version of the host functions supported.

``` shell
$ soroban version
```
output at the time of writing:

``` shell
soroban-env interface version 29
```

Additionally you must define the metadata for each function exported by your contract. In the upper example there is only one function named ```hello```.
You must define the name, the arguments and the return value of the function, so that the host environment can execute it.

```json
{
    "functions": [
        {
            "name" : "hello",
            "arguments": [{"name": "to", "type": "symbol"}],
            "returns" : "vec[symbol]"
        }
    ]
}
```

Supported argument types are currently: `val` (any type of host value), `u32`, `i32`, `u64`, `i64`, `u128`, `i128`,`bool`, `symbol`, `bitset`, `status`, `bytes`, `invoker`, `address`, `option[valueType]`, `result[okType, errorType]`, `vec[elementType]`, `map[keyType, valueType]`, `set[elementType]` ,`bytesN[size]`. If your function has no arguments, you can pass an empty array.

Supported return value types are the same as the supported argument types. If your function has no return value you must return void as a static raw value. You can obtain it by using ```val.fromVoid()```. For this case you should set ```"returns" : "void"``` or remove `"returns"` in the contract.json.

See also [Meta Generation](https://soroban.stellar.org/docs/SDKs/byo#meta-generation) and [Contract Spec Generation](https://soroban.stellar.org/docs/SDKs/byo#contract-spec-generation)


## Examples
You can find examples in our [as-soroban-examples](https://github.com/Soneso/as-soroban-examples) repository:

| Example | Description |
| :--- | :--- |
| [add example](https://github.com/Soneso/as-soroban-examples/tree/main/add)| Demonstrates how to write a simple contract, with a single function that takes two i32 inputs and returns their sum as an output. |
| [hello word example](https://github.com/Soneso/as-soroban-examples/tree/main/hello_word)| Demonstrates how to write a simple contract, with a single function that takes one input and returns it as an output. |
| [increment example](https://github.com/Soneso/as-soroban-examples/tree/main/increment)| Demonstrates how to write a simple contract that stores data, with a single function that increments an internal counter and returns the value.| 
| [logging example](https://github.com/Soneso/as-soroban-examples/tree/main/logging)| Demonstrates how to log for the purpose of debugging.|
| [cross contract call example](https://github.com/Soneso/as-soroban-examples/tree/main/cross_contract)| Demonstrates how to call a contract from another contract.|
| [auth example](https://github.com/Soneso/as-soroban-examples/tree/main/auth)| Demonstrates how to implement authentication and authorization using the [Soroban Host-managed auth framework](https://soroban.stellar.org/docs/learn/authorization).|
| [deployer example](https://github.com/Soneso/as-soroban-examples/tree/main/deployer)| Demonstrates how to deploy contracts using a contract.|
| [errors example](https://github.com/Soneso/as-soroban-examples/tree/main/errors)| Demonstrates how to define and generate errors in a contract that invokers of the contract can understand and handle.|
| [events example](https://github.com/Soneso/as-soroban-examples/tree/main/contract_events)| Demonstrates how to publish events from a contract.|
| [testing example](https://github.com/Soneso/as-soroban-examples/tree/main/testing)| Shows a simple way to test your contract.|

More examples can be found in the [test cases](https://github.com/Soneso/as-soroban-sdk/tree/main/test)
