# [Stellar Soroban SDK for AssemblyScript](https://github.com/Soneso/as-soroban-sdk)

![v0.0.1](https://img.shields.io/badge/v0.0.1-yellow.svg)

This AssemblyScript SDK is for writing contracts for [Soroban](https://soroban.stellar.org).

**This repository contains code that is in early development, incomplete, not tested, and not recommended for use. The API is unstable, experimental, and is receiving breaking changes frequently.**

## Quick Start

### 1. Setup a new project

Set up the AS project as described in the [AssemblyScript Book](https://www.assemblyscript.org/getting-started.html#setting-up-a-new-project)

```shell
$ mkdir hello
$ cd hello
$ npm init
$ npm install --save-dev assemblyscript
$ npx asinit .

```

Install the SDK:

```shell
$ npm install as-soroban-sdk

```

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

Now you should be able to compile your contract:

```shell
$ asc assembly/index.ts --target release
```

You can find the generated ```.wasm``` (WebAssembly) file in the ```build``` folder. You can also find the ```.wat``` file there (Text format of the .wasm).

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