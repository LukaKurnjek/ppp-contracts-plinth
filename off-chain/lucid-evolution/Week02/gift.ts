
/*
Off-chain code for the always true validator (mkGiftValidator) defined in 
https://github.com/LukaKurnjek/ppp-plutusV3-plinth/blob/main/src/Week02/Validators.hs
*/

import { 
  Lucid, 
  Blockfrost,
  SpendingValidator,
  Data, 
  TxHash,
  Address,
  AddressDetails
} from "@lucid-evolution/lucid";
import {
  validatorToAddress,
  getAddressDetails
} from "@lucid-evolution/utils";
import { secretSeed } from "./seed.ts";
// seed.ts has to be in form of: 
// export const secretSeed = "seed1 seed2 seedN"

const lucid = await Lucid(
  new Blockfrost(
    "https://cardano-preview.blockfrost.io/api/v0", 
    "<blockfrost-key>"
  ),
  "Preview"
);

// Load local stored seed as a wallet into lucid
lucid.selectWallet.fromSeed(secretSeed);
const addr: Address = await lucid.wallet().address();

// Defining our public key hash
const details: AddressDetails = getAddressDetails(addr);
const ourPKH: string = details.paymentCredential?.hash!;

// Defining the gift spending script 
const giftScript: SpendingValidator = {
  type: "PlutusV3",
  script: "450101002499"
};
const giftAddress = validatorToAddress("Preview", giftScript);

// Function that sends an amount of lovelace to the script 
async function sendFunds(amount: bigint): Promise<TxHash> {
  const tx = await lucid
    .newTx()
    .pay.ToContract(giftAddress, { kind: "inline", value: Data.void() }, { lovelace: amount })
    .complete();
  const signedTx = await tx.sign.withWallet().complete();
  const txHash = await signedTx.submit();
  return txHash
}

// Get the UTXO that contains the previous created funds at the gift script 
// NOTE: Input the correct transaction hash that sendFunds() returns
async function getUTxO() {
  const utxos = await lucid.utxosByOutRef([{
      txHash:
        "<transaction_hash>",
      outputIndex: 0
  }]);
  return utxos;
}

// Function for claiming funds from script 
async function claimFunds(): Promise<TxHash> {
  const ourUTxO = await getUTxO();
  
  if (ourUTxO && ourUTxO.length > 0) {
    const tx = await lucid
      .newTx()
      .collectFrom(ourUTxO, Data.void()) // we use void for redeemer 
      .addSignerKey(ourPKH)
      .attach.SpendingValidator(giftScript)
      .complete();

    const signedTx = await tx.sign.withWallet().complete();
    const txHash = await signedTx.submit();
    return txHash
  }
  else return "No UTxO's found that can be claimed"
}

// Function calls: 
//console.log(await sendFunds(5_000_000n));
//console.log(await claimFunds());
