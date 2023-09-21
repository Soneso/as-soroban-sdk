const util = require('util');
const exec = util.promisify(require('child_process').exec);
let assert = require('assert');
const invokeValConversions = 'soroban contract invoke --id 4 --wasm test/value-conversion/build/release.wasm -- ';
const invokeExamples = 'soroban contract invoke --id 2 --wasm test/examples/build/release.wasm -- ';
const installExamples = 'soroban contract install --wasm test/examples/build/release.wasm';
const invokeSDKTypes = 'soroban contract invoke --id 3 --wasm test/sdk-types/build/release.wasm -- ';
const createIdentity1 = 'soroban config identity generate acc1 && soroban config identity address acc1';
const createIdentity2 = 'soroban config identity generate acc2 && soroban config identity address acc2';

async function startTest() {

    await clean();

    // build the contract.
    await buildTests();

    // execute the tests
    await testValueConversion();
    await testExamples();
    await testSdkTypes();
} 

async function clean() {
    const { error, stdout, stderr } = await exec('rm -rf .soroban');
    console.log(stdout);
}

async function buildTests() {
    const { error, stdout, stderr } = await exec('npm run asbuild:tests');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        // TODO: find out how to avoid "stderr: Last converge was suboptimal." in u128 test
        //assert.fail(`stderr: ${stderr}`);
    }
    console.log(stdout);
}

async function testValueConversion() {
    console.log(`test value conversions ...`);
    await testI32();
    await testU32();
    await testStatic();
    await testSmall();
    await testSmallSymbol();
    await testObject();
    await testErrors();
    console.log(`test value conversions -> OK`);
}

async function testI32() {
    console.log(`test I32 ...`);
    const { error, stdout, stderr } = await exec(invokeValConversions + 'testI32');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        //assert.fail(`stderr: ${stderr}`);
    }
    assert.equal(stdout.trim(), "true");
    console.log(`OK`);
}

async function testU32() {
    console.log(`test U32 ...`);
    const { error, stdout, stderr } = await exec(invokeValConversions + 'testU32');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        //assert.fail(`stderr: ${stderr}`);
    }
    assert.equal(stdout.trim(), "true");
    console.log(`OK`);
}

async function testStatic() {
    console.log(`test Static ...`);
    const { error, stdout, stderr } = await exec(invokeValConversions + 'testStatic');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        //assert.fail(`stderr: ${stderr}`);
    }
    assert.equal(stdout.trim(), "true");
    console.log(`OK`);
}

async function testSmall() {
    console.log(`test Small ...`);
    const { error, stdout, stderr } = await exec(invokeValConversions + 'testSmall');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
       //assert.fail(`stderr: ${stderr}`);
    }
    assert.equal(stdout.trim(), "true");
    console.log(`OK`);
}

async function testObject() {
    console.log(`test Object ...`);
    const { error, stdout, stderr } = await exec(invokeValConversions + 'testObject');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        //assert.fail(`stderr: ${stderr}`);
    }
    assert.equal(stdout.trim(), "true");
    console.log(`OK`);
}

async function testErrors() {
    console.log(`test Errors ...`);
    const { error, stdout, stderr } = await exec(invokeValConversions + 'testErrors');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        //assert.fail(`stderr: ${stderr}`);
    }
    assert.equal(stdout.trim(), "true");
    console.log(`OK`);
}

async function testSmallSymbol() {
    console.log(`test Small Symbol ...`);
    const { error, stdout, stderr } = await exec(invokeValConversions + 'testSSym');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        //assert.fail(`stderr: ${stderr}`);
    }
    assert.equal(stdout.trim(), '"test_123"');
    console.log(`OK`);
}

async function testExamples() {
    console.log(`test examples ...`);
    
    await testAddExample();
    await testHelloExample();
    await testIncrementExample();
    await testEventsExample();
    await testLoggingExample();
    await testCheckAgeExampleP1();
    await testCheckAgeExampleP2();
    await deployExamplesTest()
    await testCallContractExample();
    let acc1 = await setUpIdentity1();
    await testAuthExampleP1(acc1);
    await testAuthExampleP1(acc1);
    await testAuthExampleArgs(acc1);
    await testAuthExampleArgs(acc1);
    let acc2 = await setUpIdentity2();
    await testAuthExampleP2(acc2);
    
    console.log(`test examples -> OK`);
}

async function testAddExample() {
    console.log(`test add example ...`);
    const { error, stdout, stderr } = await exec(invokeExamples + 'add --a 2 --b 40');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        //assert.fail(`stderr: ${stderr}`);
    }
    assert.equal(stdout.trim(), "42");
    console.log(`OK`);
}

async function testHelloExample() {
    console.log(`test hello example ...`);
    const { error, stdout, stderr } = await exec(invokeExamples + 'hello --to friend');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        //assert.fail(`stderr: ${stderr}`);
    }
    assert.equal(stdout.trim(), '["Hello","friend"]');
    console.log(`OK`);
}

async function testIncrementExample() {
    console.log(`test increment example ...`);
    const { error, stdout, stderr } = await exec(invokeExamples + 'increment');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        //assert.fail(`stderr: ${stderr}`);
    }
    console.log(stdout.trim());
    let val = parseInt(stdout.trim())
    assert(val > 0);
    console.log(`OK`);
}

async function testEventsExample() {
    console.log(`test events example ...`);
    const { error, stdout, stderr } = await exec(invokeExamples + 'eventTest');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        // assert.fail(`stderr: ${stderr}`);
    }
    assert.equal(stdout.trim(), "true");
    console.log(`OK`);
}

async function testLoggingExample() {
    console.log(`test logging example ...`);
    const { error, stdout, stderr } = await exec(invokeExamples + 'logging');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    assert.equal(true, stderr.includes('today'));
    console.log(`OK`);
}

async function testCheckAgeExampleP1() {
    console.log(`test check age example part 1...`);
    const { error, stdout, stderr } = await exec(invokeExamples + 'checkAge --age 19');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        //assert.fail(`stderr: ${stderr}`);
    }
    assert.equal(stdout.trim(), '"OK"');
    console.log(`OK`);
}

async function testCheckAgeExampleP2() {
    console.log(`test check age example part 2...`);
    try {
        const { error, stdout, stderr } = await exec(invokeExamples + 'checkAge --age 10');
        if (error) {
            assert.fail(`error: ${error.message}`);
        }
    } catch (error) {
        assert(error.message.includes('Error(Contract, #1)'));
        console.log(`OK`);
    }
}

async function deployExamplesTest() {
    const { error, stdout, stderr } = await exec('soroban contract deploy --id c13d9beb5f7031bf2de3fcbcbd76bfcba93b48f11da3e538839a33b234b6a674 --wasm test/examples/build/release.wasm');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        //assert.fail(`stderr: ${stderr}`);
    }
    console.log("deployed: " + stdout);
}

async function testCallContractExample() {
    console.log(`test call contract example ...`);
    const { error, stdout, stderr } = await exec(invokeExamples + 'callctr');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        //assert.fail(`stderr: ${stderr}`);
    }
    assert.equal(stdout.trim(), "42");
    console.log(`OK`);
}

async function setUpIdentity1() {
    console.log(`setup identity 1 ...`);
    const { error, stdout, stderr } = await exec(createIdentity1);
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        //assert.fail(`stderr: ${stderr}`);
    }
    let acc1 = stdout.trim();
    return acc1;
}

async function testAuthExampleP1(acc) {
    console.log(`test auth example part 1 ...`);
    
    let cmd = 'soroban contract invoke --source acc1 --id 2 --wasm test/examples/build/release.wasm -- auth --user ' + acc; 
    console.log(cmd);
    const { error, stdout, stderr } = await exec(cmd);
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        //assert.fail(`stderr: ${stderr}`);
    }
    assert(stdout.indexOf(acc) != -1);
    console.log(`OK`);
}

async function testAuthExampleArgs(acc) {
    console.log(`test auth args example ...`);
    let cmd = 'soroban contract invoke --source acc1 --id 2 --wasm test/examples/build/release.wasm -- authArgs --user ' + acc + ' --value 3'; 
    const { error, stdout, stderr } = await exec(cmd);
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        //assert.fail(`stderr: ${stderr}`);
    }
    assert(stdout.indexOf(acc) != -1);
    console.log(`OK`);
}

async function setUpIdentity2() {
    console.log(`setup identity 2 ...`);
    const { error, stdout, stderr } = await exec(createIdentity2);
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        //assert.fail(`stderr: ${stderr}`);
    }
    let acc2 = stdout.trim();
    return acc2;
}

async function testAuthExampleP2(acc) {
    try {
        console.log(`test auth example part 2 ...`);
        let cmd = 'soroban contract invoke --source acc2 --id 2 --wasm test/examples/build/release.wasm -- callctr2 --user ' + acc; 
        const { error, stdout, stderr } = await exec(cmd);
        if (error) {
            assert.fail(`error: ${error.message}`);
        }
      } catch (error) {
        assert(error.message.indexOf(acc) != -1);
        console.log(`OK`);
      }
}

async function installExamplesContract() {
    console.log(`install examples contract ...`);
    const { error, stdout, stderr } = await exec(installExamples);
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        //assert.fail(`stderr: ${stderr}`);
    }
    let wasmHash = stdout.trim();
    return wasmHash;
}

async function testSdkTypes() {
    console.log(`test sdk types ...`);
    await testMaps();
    await testVectors();
    await testBytes();
    await testSymbols();
    await testMath128();
    console.log(`test sdk types -> OK`);
}

async function testMaps() {
    console.log(`test maps ...`);
    const { error, stdout, stderr } = await exec(invokeSDKTypes + 'maps');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        //assert.fail(`stderr: ${stderr}`);
    }
    assert.equal(stdout.trim(), "true");
    console.log(`OK`);
}

async function testVectors() {
    console.log(`test vectors ...`);
    const { error, stdout, stderr } = await exec(invokeSDKTypes + 'vecs');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        //assert.fail(`stderr: ${stderr}`);
    }
    assert.equal(stdout.trim(), "true");
    console.log(`OK`);
}

async function testBytes() {
    console.log(`test bytes ...`);
    const { error, stdout, stderr } = await exec(invokeSDKTypes + 'bytes');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        //assert.fail(`stderr: ${stderr}`);
    }
    assert.equal(stdout.trim(), "true");
    console.log(`OK`);
}

async function testSymbols() {
    console.log(`test symbols ...`);
    const { error, stdout, stderr } = await exec(invokeSDKTypes + 'symbols');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        //assert.fail(`stderr: ${stderr}`);
    }
    assert.equal(stdout.trim(), "true");
    console.log(`OK`);
}

async function testMath128() {
    console.log(`test math128 ...`);
    const { error, stdout, stderr } = await exec(invokeSDKTypes + 'math128');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        //assert.fail(`stderr: ${stderr}`);
    }
    assert.equal(stdout.trim(), "true");
    console.log(`OK`);
}

startTest()
