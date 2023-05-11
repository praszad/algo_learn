const algosdk = require('algosdk');
const ak = algosdk;
const MNEMONICS =
  'patrol force swarm purse razor clock next issue erode install wear rack case coast differ silver unknown order film vintage giraffe unhappy top about ahead';

async function main() {
  //   const account = algosdk.generateAccount();
  //   console.log(account);
  //   const mnemonics = algosdk.secretKeyToMnemonic(account.sk);
  //   console.log({ mnemonics });
  const account = ak.mnemonicToSecretKey(MNEMONICS);
  //   console.log({ account });
  const algodToken = '';
  const algodServer = 'https://testnet-api.algonode.cloud';
  const algodPort = undefined;
  const algoClient = new ak.Algodv2(algodToken, algodServer, algodPort);
  //   console.log(algoClient);
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

main();
