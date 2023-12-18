const util = require('util');
const exec = util.promisify(require('child_process').exec);
let assert = require('assert');

const adminSeed = 'SAIPPNG3AGHSK2CLHIYQMVBPHISOOPT64MMW2PQGER47SDCN6C6XFWQM'; 
const adminId = 'GAYFL6MVOSXY4FYRZ7QSYVBA7RNIW3YVT2TLZAF2UBOUGUCATLSWWKWY';
const rpcUrl = ' --rpc-url https://soroban-testnet.stellar.org';
const networkPassphrase = ' --network-passphrase "Test SDF Network ; September 2015"';
//const rpcUrl = ' --rpc-url https://rpc-futurenet.stellar.org';
//const networkPassphrase = ' --network-passphrase "Test SDF Future Network ; October 2022"';

const cmdDeploy = 'soroban contract deploy' + rpcUrl + networkPassphrase;
const cmdInvoke = 'soroban contract invoke' + rpcUrl + networkPassphrase + ' --source-account ' + adminSeed + ' --id ';
const cmdVVInvoke = 'soroban --very-verbose contract invoke' + rpcUrl + networkPassphrase + ' --source-account ' + adminSeed + ' --id ';
const deployExamples = cmdDeploy  + ' --wasm test/examples/build/release.wasm';
const deployValConversions = cmdDeploy +  ' --wasm test/value-conversion/build/release.wasm';
const deploySDKTypes = cmdDeploy + ' --wasm test/sdk-types/build/release.wasm';
const jsonrpcErr = 'error: jsonrpc error:';

async function startTest() {

    // build the contract.
    await buildTests();
    
    let valueConversionsCId  = await deployContract(deployValConversions);
    console.log('Value conversions contract id: ' + valueConversionsCId);
    await testValueConversion(valueConversionsCId);

    let examplesCId  = await deployContract(deployExamples);
    console.log('Examples contract id: ' + examplesCId);
    await testExamples(examplesCId);

    let sdkTypesCId  = await deployContract(deploySDKTypes);
    console.log('SDK Types contract id: ' + sdkTypesCId);
    await testSdkTypes(sdkTypesCId);

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

async function deployContract(cmd) {
    console.log(`deploy contract ...`);
    try {
        const { error, stdout, stderr } = await exec(cmd);
        if (error) {
            assert.fail(`error: ${error.message}`);
        }
        if (stderr) {
            //assert.fail(`stderr: ${stderr}`);
        }
        let cId = stdout.trim();
        return cId;
    } catch(error) {
        if (error.message.includes(jsonrpcErr)) {
            console.log(`Catched err ` + error);
            console.log("retrying after 5 seconds")
            await sleep(5000); 
            return await deployContract(cmd);
        } else {
            assert.fail(`error: ${error.message}`);
        }
    }
}

async function testValueConversion(cid) {
    let cmd = cmdInvoke + cid;
    console.log(`test value conversions ...`);
    await testC(`test I32 ...`, cmd + ' -- testI32', 'true');
    await testC(`test U32 ...`, cmd + ' -- testU32', 'true');
    await testC(`test Static ...`, cmd + ' -- testStatic', 'true');
    await testC(`test Small ...`, cmd + ' -- testSmall', 'true');
    await testC(`test Small Symbol ...`, cmd + ' -- testSSym', '"test_123"');
    await testC(`test Object ...`, cmd + ' -- testObject', 'true');
    await testC(`test Errors ...`, cmd + ' -- testErrors', 'true');
    console.log(`test value conversions -> OK`);
}

async function testExamples(cid) {
    let cmd = cmdInvoke + cid;
    console.log(`test examples ...`);
    await testC(`test add ...`, cmd + ' -- add --a 2 --b 40', '42');
    await testC(`test hello ...`, cmd + ' -- hello --to friend', '["Hello","friend"]');
    await testC(`test increment (1) ...`, cmd + ' -- increment', '1');
    await testC(`test increment (2) ...`, cmd + ' -- increment', '2');
    await testC(`test events ...`, cmd + ' -- eventTest', 'true');
    await testLoggingExample(cmdVVInvoke + cid);
    await testC(`test check age (1) ...`, cmd + ' -- checkAge --age 19', '"OK"');
    await testCheckAge2(cmd);
    let examples2CId  = await deployContract(deployExamples);
    await testC(`test call contract ...`, cmd + ' -- callctr --addr '  + examples2CId, '42');
    await testC('test auth ...', cmd + ' -- auth --user ' + adminId, '{"\\"' + adminId + '\\"":1}');
    await testC('test auth with args ...', cmd + ' -- authArgs --user ' + adminId +  ' --value 3', '{"\\"' + adminId + '\\"":4}');
    console.log(`test examples -> OK`);
}

async function testSdkTypes(cid) {
    let cmd = cmdInvoke + cid;
    console.log(`test sdk types ...`);
    await testC(`test maps ...`, cmd + ' -- maps', 'true');
    await testC(`test vectors ...`, cmd + ' -- vecs', 'true');
    await testC(`test bytes ...`, cmd + ' -- bytes', 'true');
    await testC(`test symbols ...`, cmd + ' -- symbols', 'true');
    await testC(`test math128 ...`, cmd + ' -- math128', 'true');
    console.log(`test sdk types -> OK`);
}

async function testC(info, cmd, res) {
    console.log(info);
    try {
        const { error, stdout, stderr } = await exec(cmd);
        if (error) {
            assert.fail(`error: ${error.message}`);
        } if (stderr) {
            //assert.fail(`stderr: ${stderr}`);
        }
        assert.equal(stdout.trim(), res);
        console.log(`OK`);
    } catch(error) {
        if (error.message.includes(jsonrpcErr)) {
            console.log(`Catched err ` + error);
            console.log("retrying after 5 seconds")
            await sleep(5000); 
            return await testC(info, cmd, res);
        } else {
            assert.fail(`error: ${error.message}`);
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function testLoggingExample(cmd) {
    console.log(`test logging ...`);
    const { error, stdout, stderr } = await exec(cmd + ' -- logging');
    if (error) {
        assert.fail(`error: ${error.message}`);
    }
    assert.equal(true, stderr.includes('today'));
    console.log(`OK`);
}

async function testCheckAge2(cmd) {
    console.log(`test check age (2) ...`);
    try {
        const { error, stdout, stderr } = await exec(cmd + ' -- checkAge --age 10');
        if (error) {
            assert.fail(`error: ${error.message}`);
        }
    } catch (error) {
        assert(error.message.includes('Error(Contract, #1)'));
        console.log(`OK`);
    }
}

startTest()
