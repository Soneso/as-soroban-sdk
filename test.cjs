const util = require('util');
const exec = util.promisify(require('child_process').exec);
var assert = require('assert');
const invokeValConversions = 'soroban invoke --id 1 --wasm test/value-conversion/build/release.wasm --fn ';
const invokeExamples = 'soroban invoke --id 2 --wasm test/examples/build/release.wasm --fn ';
const invokeSDKTypes = 'soroban invoke --id 3 --wasm test/sdk-types/build/release.wasm --fn ';

async function startTest() {

    // build the contract.
    await buildTests();

    // execute the tests
    await testValueConversion();
    await testExamples();
    await testSdkTypes();
} 

async function buildTests() {
    const { error, stdout, stderr } = await exec('npm run asbuild:tests');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        assert.fail(`stderr: ${stderr}`);
    }
    console.log(stdout);
}

async function testValueConversion() {
    console.log(`test value conversions ...`);
    await testI32();
    await testU32();
    await testStatic();
    await testObject();
    await testStatus();
    await testSymbol();
    console.log(`test value conversions -> OK`);
}


async function testI32() {
    console.log(`test I32 ...`);
    const { error, stdout, stderr } = await exec(invokeValConversions + 'testI32');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        assert.fail(`stderr: ${stderr}`);
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
        assert.fail(`stderr: ${stderr}`);
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
        assert.fail(`stderr: ${stderr}`);
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
        assert.fail(`stderr: ${stderr}`);
    }
    assert.equal(stdout.trim(), "true");
    console.log(`OK`);
}

async function testStatus() {
    console.log(`test Status ...`);
    const { error, stdout, stderr } = await exec(invokeValConversions + 'testStatus');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        assert.fail(`stderr: ${stderr}`);
    }
    assert.equal(stdout.trim(), "true");
    console.log(`OK`);
}

async function testSymbol() {
    console.log(`test Symbol ...`);
    const { error, stdout, stderr } = await exec(invokeValConversions + 'testSymbol');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        assert.fail(`stderr: ${stderr}`);
    }
    assert.equal(stdout.trim(), "test_123");
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
    await testAuthExampleP1();
    await testAuthExampleP2();
    console.log(`test examples -> OK`);
}

async function testAddExample() {
    console.log(`test add example ...`);
    const { error, stdout, stderr } = await exec(invokeExamples + 'add --arg 2 --arg 40');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        assert.fail(`stderr: ${stderr}`);
    }
    assert.equal(stdout.trim(), "42");
    console.log(`OK`);
}

async function testHelloExample() {
    console.log(`test hello example ...`);
    const { error, stdout, stderr } = await exec(invokeExamples + 'hello --arg friend');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        assert.fail(`stderr: ${stderr}`);
    }
    assert.equal(stdout.trim(), '["Hello","friend"]');
    console.log(`OK`);
}

async function testEventsExample() {
    console.log(`test events example ...`);
    const { error, stdout, stderr } = await exec(invokeExamples + 'eventTest');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    let res = '#0: event: {"ext":"v0","contractId":"0000000000000000000000000000000000000000000000000000000000000002","type":"contract","body":{"v0":{"topics":[{"symbol":"TEST"},{"symbol":"THE"},{"symbol":"EVENTS"}],"data":{"object":{"vec":[{"u32":223},{"u32":222},{"u32":221}]}}}}}\n' +
    '#1: event: {"ext":"v0","contractId":"0000000000000000000000000000000000000000000000000000000000000002","type":"contract","body":{"v0":{"topics":[{"symbol":"STATUS"}],"data":{"u32":1}}}}\n' +
    '#2: event: {"ext":"v0","contractId":"0000000000000000000000000000000000000000000000000000000000000002","type":"contract","body":{"v0":{"topics":[{"symbol":"STATUS"}],"data":{"u32":2}}}}\n' +
    '#3: event: {"ext":"v0","contractId":"0000000000000000000000000000000000000000000000000000000000000002","type":"contract","body":{"v0":{"topics":[{"symbol":"STATUS"}],"data":{"u32":3}}}}';
    assert.equal(stderr.trim(), res);
    assert.equal(stdout.trim(), "true");
    console.log(`OK`);
}

async function testIncrementExample() {
    console.log(`test increment example ...`);
    const { error, stdout, stderr } = await exec(invokeExamples + 'increment');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        assert.fail(`stderr: ${stderr}`);
    }
    let val = parseInt(stdout.trim())
    assert(val > 0);
    console.log(`OK`);
}

async function testLoggingExample() {
    console.log(`test logging example ...`);
    const { error, stdout, stderr } = await exec(invokeExamples + 'logging');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }

    let res = '#0: debug: Hello, today is a sunny day!\n' +
    '#1: debug: We have I32(30) degrees Symbol(celsius)!';
    assert.equal(stderr.trim(), res);
    assert.equal(stdout.trim(), "true");
    console.log(`OK`);
}

async function testCheckAgeExampleP1() {
    console.log(`test check age example part 1...`);
    const { error, stdout, stderr } = await exec(invokeExamples + 'checkAge --arg 19');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        assert.fail(`stderr: ${stderr}`);
    }
    assert.equal(stdout.trim(), 'OK');
    console.log(`OK`);
}

async function testCheckAgeExampleP2() {
    console.log(`test check age example part 2...`);
    const { error, stdout, stderr } = await exec(invokeExamples + 'checkAge --arg 10');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    let res = 'error: HostError\n' +
    'Value: Status(ContractError(1))\n' +
    '\n' +
    'Debug events (newest first):\n' +
    '   0: "VM trapped with host error"\n' +
    `   1: "escalating error 'Status(ContractError(1))' to VM trap"\n` +
    `   2: "failing with contract error status code 'Status(ContractError(1))'"\n` +
    '\n' +
    'Backtrace (newest first):\n' +
    '   0: backtrace::capture::Backtrace::new_unresolved\n' +
    '   1: soroban_env_host::host::err_helper::<impl soroban_env_host::host::Host>::err\n' +
    '   2: soroban_env_host::host::Host::with_frame\n' +
    '   3: soroban_env_host::vm::Vm::invoke_function_raw\n' +
    '   4: soroban_env_host::host::Host::call_n\n' +
    '   5: soroban_env_host::host::Host::with_frame\n' +
    '   6: soroban_env_host::host::Host::invoke_function_raw\n' +
    '   7: soroban_env_host::host::Host::invoke_function\n' +
    '   8: soroban::invoke::Cmd::run_in_sandbox\n' +
    '   9: soroban::run::{{closure}}\n' +
    '  10: <core::future::from_generator::GenFuture<T> as core::future::future::Future>::poll\n' +
    '  11: std::thread::local::LocalKey<T>::with\n' +
    '  12: tokio::park::thread::CachedParkThread::block_on\n' +
    '  13: tokio::runtime::scheduler::multi_thread::MultiThread::block_on\n' +
    '  14: soroban::main'
    assert.equal(stderr.trim(), res);
    console.log(`OK`);
}

async function deployExamplesTest() {
    const { error, stdout, stderr } = await exec('soroban deploy --id c13d9beb5f7031bf2de3fcbcbd76bfcba93b48f11da3e538839a33b234b6a674 --wasm test/examples/build/release.wasm');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        assert.fail(`stderr: ${stderr}`);
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
        assert.fail(`stderr: ${stderr}`);
    }
    assert.equal(stdout.trim(), "42");
    console.log(`OK`);
}

async function testAuthExampleP1() {
    console.log(`test auth example part 1 ...`);
    const { error, stdout, stderr } = await exec(invokeExamples + 'auth --account GBX2MZM4HIUK4QQ4F37SIAAILKS2QAUSTYAM4IXMXTPND2L6TCV4FZAS');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        assert.fail(`stderr: ${stderr}`);
    }
    assert(stdout.startsWith('["GBX2MZM4HIUK4QQ4F37SIAAILKS2QAUSTYAM4IXMXTPND2L6TCV4FZAS",'));
    console.log(`OK`);
}

async function testAuthExampleP2() {
    console.log(`test auth example part 2 ...`);
    const { error, stdout, stderr } = await exec(invokeExamples + 'callctr2');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        assert.fail(`stderr: ${stderr}`);
    }
    assert(stdout.startsWith('[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],'));
    console.log(`OK`);
}

async function testSdkTypes() {
    console.log(`test sdk types ...`);
    await testMaps();
    await testVectors();
    await testBytes();
    await testBigInts();
    console.log(`test sdk types -> OK`);
}

async function testMaps() {
    console.log(`test maps ...`);
    const { error, stdout, stderr } = await exec(invokeSDKTypes + 'maps');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        assert.fail(`stderr: ${stderr}`);
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
        assert.fail(`stderr: ${stderr}`);
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
        assert.fail(`stderr: ${stderr}`);
    }
    assert.equal(stdout.trim(), "true");
    console.log(`OK`);
}

async function testBigInts() {
    console.log(`test big int ...`);
    const { error, stdout, stderr } = await exec(invokeSDKTypes + 'bigInts');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    if (stderr) {
        assert.fail(`stderr: ${stderr}`);
    }
    assert.equal(stdout.trim(), "true");
    console.log(`OK`);
}

startTest()
