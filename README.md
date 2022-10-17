# [Stellar Soroban SDK for AssemblyScript](https://github.com/Soneso/as-soroban-sdk)

![v0.0.1](https://img.shields.io/badge/v0.0.1-yellow.svg)

This AssemblyScript SDK is for writing contracts for [Soroban](https://soroban.stellar.org).

**This repository contains code that is in early development, incomplete, not tested, and not recommended for use. The API is unstable, experimental, and is receiving breaking changes frequently.**

## Quick Start

### 1. Setup a new project

Set up a new AS project as described in the [AssemblyScript Book](https://www.assemblyscript.org/getting-started.html#setting-up-a-new-project)

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
You can now write your contract in the ```./assembly/index.ts``` file.

E.g.

```typescript
import * as val from 'as-soroban-sdk/lib/value';
import {Vec} from 'as-soroban-sdk/lib/vec';

export function hello(to: val.SymbolVal): val.VectorObject {

  let vec = new Vec();
  vec.push_front(val.fromString("Hello"));
  vec.push_back(to);
  
  return vec.getHostObject();
}
```

Next you need to add a contract.json file to the project. It must contain the metadata for your contract.

E.g.

```json
{
    "name": "hello word",
    "version": "0.0.1",
    "description": "my first contract",
    "host_functions_version": 23,
    "functions": [
        {
            "name" : "hello",
            "arguments": [{"name": "to", "type": "symbol"}],
            "returns" : "val"
        }
    ]
}
```

Next, edit the asconfig.json file of your project. Replace its content with following:

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

Now you should be able to compile your contract:

```shell
$ asc assembly/index.ts --target release
```

You can find the generated ```.wasm``` (WebAssembly) file in the ```build``` folder. You can also find the ```.wat``` file there (Text format of the .wasm).

### 5. Run your contract (sandbox)

To run the contract, you must first install the official soroban cli as described here: [stellar soroban cli](https://github.com/stellar/soroban-cli).

```shell
$ cargo install --locked soroban-cli
```

Now you can run your contract:

```shell
$ soroban invoke --wasm build/release.wasm --id 6 --fn hello --arg friend
```

## Examples
You can find examples in our [as-soroban-examples](https://github.com/Soneso/as-soroban-examples) repository.

## Understanding contract metadata

To be able to run a contract, the compiled ```.wasm``` file needs to contain the web assembly module metadata.

The metadata needs to be attached to the module by the compiler. Therefore we need the ```contract.json``` file.

The SDK parses the ```contract.json``` file when compiling the contract and converts it to the needed data structure to be added to the ```.wasm``` module. This is done by usingd an AssemblyScript transform (see: transforms.mjs). 

Required fields are ```host_functions_version``` and the ```functions``` array in the ```contract.json``` file.

Example:

```json
{
    "name": "hello word",
    "version": "0.0.1",
    "description": "my first contract",
    "host_functions_version": 23,
    "functions": [
        {
            "name" : "hello",
            "arguments": [{"name": "to", "type": "symbol"}],
            "returns" : "val"
        }
    ]
}
```

To find out the needed ```host_functions_version``` you can execute the ```soroban version``` command of the soroban cli.

``` shell
$ soroban version
```
output at the time of writing:

``` shell
soroban-cli 0.1.2 (1b5786d5f4b895e7ed70315efcb987d38426539c)
soroban-env-interface-version: 23
```

Additionally you must define the metadata for each function exported by your contract. In the upper example there is only one function named ```hello```.
You must define the name, the arguments and the return value of the function so that the host environment can execute it.

```json
{
    //...

    "functions": [
        {
            "name" : "hello",
            "arguments": [{"name": "to", "type": "symbol"}],
            "returns" : "val"
        }
    ]
}
```

Supported argument types are currently: ```val``` (any type of host value), ```u32```, ```i32```, ```u64```, ```i64```, ```bool```, ```symbol```, ```bitset```, ```status```, ```bytes```, ```bigint``` and ```invoker```. If your function has no arguments, you can pass an empty array.

Supported return values are the same as the supported arguments. If your function has no return value you can use ```void``` or provide no ```returns``` field.

See also (Meta Generation)[https://soroban.stellar.org/docs/SDKs/byo#meta-generation] and (Contract Spec Generation)[https://soroban.stellar.org/docs/SDKs/byo#contract-spec-generation]


## Features and limitations

In the [Build your own SDK](https://soroban.stellar.org/docs/SDKs/byo) chapter of the official Soroban documentation one can find the requirements for a soroban sdk.

This SDK supports:
- Value Conversions
- Host functions
- SDK Types
- User Defined Errors
- Meta Generation
- Contract Spec Generation

This SDK currently doese not fully support:
- User Defined Types
- Testing

Testing must be currently done with the soroban-cli. As a helping feature one can use ```context.log(string)``` to generate outputs during the execution of the contract.

```typescript
import * as context from 'as-soroban-sdk/lib/context';

///...
context.log("test");
```
