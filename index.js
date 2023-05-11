const algosdk = require('algosdk');
const { addr2Mnemonic } = require('./accounts');

const ak = algosdk;
const MNEMONICS =
  'patrol force swarm purse razor clock next issue erode install wear rack case coast differ silver unknown order film vintage giraffe unhappy top about ahead';
const account = algosdk.mnemonicToSecretKey(MNEMONICS);
const algoClient = clientConfig();

function createAccount() {
  const account = algosdk.generateAccount();
  console.log(account);
  const mnemonics = algosdk.secretKeyToMnemonic(account.sk);
  console.log({ mnemonics });
}

function clientConfig() {
  const algodToken = '';
  const algodServer = 'https://testnet-api.algonode.cloud';
  const algodPort = undefined;
  const algoC = new ak.Algodv2(algodToken, algodServer, algodPort);
  console.log(algoC);
  return algoC;
}
async function createAsset() {
  const account = ak.mnemonicToSecretKey(MNEMONICS);
  const suggestedParams = await algoClient.getTransactionParams().do();
  //   console.log({ suggestedParams });
  const myNewTestAsset = ak.makeAssetCreateTxnWithSuggestedParamsFromObject({
    from: account.addr,
    decimals: 1,
    suggestedParams,
    defaultFrozen: false,
    total: 1000000,
    assetName: 'prz-test-01',
    assetURL: 'https://testnet-api.algonode.cloud',
    clawback: account.addr,
    freeze: account.addr,
    manager: account.addr,
    reserve: account.addr,
    unitName: 'prz01',
    assetURL: 'https://testnet-api.algonode.cloud'
  });
  let sign = myNewTestAsset.signTxn(account.sk);
  let { txId } = await algoClient.sendRawTransaction(sign).do();
  console.log({ txId });
  let results = await algosdk.waitForConfirmation(algoClient, txId, 4);
  console.log(results);
}

async function updateAsset() {
  const clawBackAccount = algosdk.mnemonicToSecretKey(addr2Mnemonic);
  console.log({ clawBackAccount });
  let assetIndex = 211214092;
  let suggestedParams = await algoClient.getTransactionParams().do();

  const updtTxn = ak.makeAssetConfigTxnWithSuggestedParamsFromObject({
    from: account.addr,
    clawback: clawBackAccount.addr,
    reserve: clawBackAccount.addr,
    assetIndex,
    suggestedParams,
    strictEmptyAddressChecking: false
  });
  const rawTrxn = updtTxn.signTxn(account.sk);
  const { txId } = algoClient.sendRawTransaction(rawTrxn).do();
  const modifiedAsset = await algosdk.waitForConfirmation(algoClient, txId, 8);
  console.log({ modifiedAsset });
}

// Function to create asset
// createAsset();

updateAsset();
