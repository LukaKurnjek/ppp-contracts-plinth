
/*
Off-chain code for the always true validator (mkGiftValidator) defined in 
https://github.com/LukaKurnjek/ppp-plutusV3-plinth/blob/main/src/Week02/Validators.hs
*/

import { 
  BlockfrostProvider, 
  MeshWallet, 
  Transaction, 
  PlutusScript,
  resolvePlutusScriptAddress
} from "@meshsdk/core";
import { UTxO } from "@meshsdk/common";
import { secretSeed } from "./seed.ts";
/* seed.ts has to be in form of: 
   export const secretSeed = ["seed1", "seed2", ... ] */

// Define blockchain provider and wallet 
const provider = new BlockfrostProvider("<blockfrost-key>");
const wallet = new MeshWallet({
  networkId: 0, //0=testnet, 1=mainnet
  fetcher: provider,
  submitter: provider,
  key: {
    type: "mnemonic",
    words: secretSeed
  }
});

// Define address and public key hash of it 
const ourAddr = await wallet.getChangeAddress();

// Defining our gift script 
const trueScript: PlutusScript = {
  code: "450101002499",
  version: "V3"
};
const scriptAddr = resolvePlutusScriptAddress(trueScript, 0);

// Function for creating UTXO at gift script 
async function sendFunds(amount: string) {
  const tx = new Transaction({ initiator: wallet })
    .sendLovelace({address: scriptAddr, datum: {value: "", inline: true }}, amount)
    .setChangeAddress(ourAddr);

  const txUnsigned = await tx.build();
  const txSigned = await wallet.signTx(txUnsigned);
  const txHash = await wallet.submitTx(txSigned);
  return txHash
}

// Function that retunrs the UTXO created with sendFunds
// The correct <transaction_hash> needs to be added 
async function getAssetUtxo(scriptAddress) {
  const utxos = await provider.fetchAddressUTxOs(scriptAddress);
  if (utxos.length == 0) {
    throw 'No listing found.';
  }
  let filteredUtxo = utxos.find((utxo: any) => {
    return utxo.input.txHash == "<transaction_hash>";
  })!;
  return filteredUtxo
}

// Function for claiming funds 
async function claimFunds() {
  const assetUtxo: UTxO = await getAssetUtxo(scriptAddr);
  const redeemer = { data: { alternative: 1, fields: [] } };
  
  const tx = new Transaction({ initiator: wallet, fetcher: provider, verbose: true })
    .redeemValue({ value: assetUtxo, 
                   script: trueScript,
                   redeemer: redeemer})
    .setRequiredSigners([ourAddr]);

  const txUnsigned = await tx.build();
  const txSigned = await wallet.signTx(txUnsigned);
  const txHash = await wallet.submitTx(txSigned);
  return txHash
}

// Function calls 
//console.log(await sendFunds("5000000"));
//console.log(await getAssetUtxo(scriptAddr));
//console.log(await claimFunds());
