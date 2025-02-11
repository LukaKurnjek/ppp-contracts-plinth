
/*
Off-chain code for the 2 times parameterized validator (param2VestingVal) defined in 
https://github.com/LukaKurnjek/ppp-plutusV3-plinth/blob/main/src/Week03/Vesting.hs
*/

import { 
  Lucid, 
  Blockfrost,
  Address,
  SpendingValidator,
  Data, 
  AddressDetails,
  TxHash,
  UTxO
} from "@lucid-evolution/lucid";
import {
  validatorToAddress,
  getAddressDetails,
  applyParamsToScript
} from "@lucid-evolution/utils";
import { secretSeed } from "./seed.ts";

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

// Set the vesting deadline
const deadlineDate: Date = new Date("2025-02-05T00:00:00Z")
const deadlinePOSIX = BigInt(deadlineDate.getTime());

// Set the vesting beneficiary to our own key.
const details: AddressDetails = getAddressDetails(addr);
const beneficiaryPKH: string = details.paymentCredential?.hash!;

// Defining the spending script 
// NOTE: Applying vestData instead of vestingParamAsData gives the same validator address
const vestingScript: SpendingValidator = {
  type: "PlutusV3",
  script: applyParamsToScript(
    "590dd901010032323232323232323232323232322225932323232323232323232323232932323255333573466e1d200000211328009919192a999ab9a3370e90000010899191919191919191919191919191919194004c00cd5d08094c00cd5d0808ccc0bc07cd5d08084dd69aba100f9980128101aba100e9981780e1aba100d9998198183ad3574201932323255333573466e1d2000002118009919192a999ab9a3370e900000108c004cc0cdd69aba100198191aba1357440021130384901035054310035573c0046aae74004dd51aba10019919192a999ab9a3370e900000108c004cc0cdd69aba100198191aba1357440021130384901035054310035573c0046aae74004dd51aba1357440021130354901035054310035573c0046aae74004dd51aba100b99817bae35742015333033232323255333573466e1d2000002118019bae357420021155333573466e1d20020021180498111aba100108aa999ab9a3370e900200108c01cc0d0d5d080084554ccd5cd19b8748018008460026eb4d5d0800cc080d5d09aba200108aa999ab9a3370e900400108c02cc084d5d080084554ccd5cd19b87480280084600a6eb4d5d0800cc07cd5d09aba200108981b2481035054310035573c0046aae74004dd50008159aba1009998010159aba10089bae3574200f33303301d3303302e232323255333573466e1d20000021180108aa999ab9a3370e900100108c0104554ccd5cd19b87480100084600022606c9201035054310035573c0046aae74004dd50009aba10069981780d9aba100598009aba100498009aba135744008303075a6062eb8c0b08c8c8c954ccd5cd19b874800000846002603e6ae8400660406ae84d5d1000844c0cd241035054310035573c0046aae74004dd50009aba2001357440026ae88004d5d10009aba2001357440026ae88004d5d10009aba2001357440026ae88004d5d10009aba200135744002226042921035054310035573c0046aae74004dd51aba10029aba10019919192a999ab9a3370e900000108c00cdd71aba100108aa999ab9a3370e900100108c024c034d5d0800ccc080068d5d09aba200108aa999ab9a3370e900200108c01cc07cd5d080084554ccd5cd19b8748018008460026eb4d5d0800cc02cd5d09aba200108aa999ab9a3370e900400108c02cc030d5d080084554ccd5cd19b87480280084600a6eb4d5d0800cc028d5d09aba2001089810a481035054310035573c0046aae74004dd51aba1357440023574400222603a9201035054310035573c0046aae74004dd5007488a400e44444444444444446464b2b2602e0151800460048ac800c60011801230022c98008054600115930010158c00a3202b22900c91299499981101b4802c8964006200515900290c004cc0a00e00051002880109003912c800c400a2b2005218009981401c000a200510021150018c00a2a0021593330210359001912c800c400a2b2005218009981301b800a200510021200722590018801456400a43001330260370014400a2004230008c00a3000014800c8a400a44a64652007159004909801002c4ca004a0051300100445640124260050013302703700144ca004a0051300180204a652a0072150028c0022a00215900190aca801c8564ccc0980e400800630028c002300245a300245a2b2a0052180045a300206400e44b200310028ac8014860026604c06e00288014400804006003001375a01cc001800c0130000c07089640063002910aa999ab9a3371e01e0042300011300400111919192a999ab9a3370e900000108994004dd69aba1002980d1aba10019919192a999ab9a3370e900000108994024cc07c070d5d08014d5d0800ccc07dd71aba1357440023574400222aa666ae68cdc3a4004004230013301e01b3574200332323255333573466e1d2000002118009bad35742003375a6ae84d5d1000844c0892401035054310035573c0046aae74004dd51aba1357440021155333573466e1d20040021180599981000ebad357420033301e75c6ae84d5d100084554ccd5cd19b87480180084600e6603c0366ae8400422aa666ae68cdc3a401000422646500d3302001d357420073301e01f3574200533302201f75a6ae840072646464aa666ae68cdc3a400000423001375a6ae840066eb4d5d09aba20010898122481035054310035573c0046aae74004dd51aba135744003223301a0020010d5d10009aba20011155333573466e1d200a002118029980f00d9aba10019919192a999ab9a3370e90000010899810bae357420022260449201035054310035573c0046aae74004dd51aba1357440021155333573466e1d200c0021180108980fa481035054310035573c0046aae74004dd51aba135744002357440022260369201035054310035573c0046aae74004dd500091919192a999ab9a3370e900000108c034c060d5d0800ccc065d69aba1357440021155333573466e1d200200211809980c1aba10019980cbad357426ae8800422a64a666ae68cdc3a4008006230033019357420053001357426ae8800822aa666ae68cdc3a400c006226500b301a35742007300235742003375a6ae84d5d10008d5d100108aa999ab9a3370e900400188c024c064d5d08014dd69aba1357440041155333573466e1d200a0031180a980c9aba100208aa999ab9a3370e900600188c044c064d5d08014dd69aba1357440041155333573466e1d200e003118029bae35742005375c6ae84d5d100104554ccd5cd19b874804000c4600e6eb8d5d08014dd69aba1357440041155333573466e1d201200311800980c9aba1002980c9aba1357440041155333573466e1d201400311807980c9aba100208980da4810350543100232323255333573466e1d2000002118009bae35742002115325333573466e1d20020031180298009aba100208aa999ab9a3370e900200188c00cdd71aba100298009aba13574400411301f49010350543100232323255333573466e1d20000021180098101aba100108aa999ab9a3370e900100108c0084554ccd5cd19b8748010008460082260449201035054310035573c0046aae74004dd50009aab9e00235573a0026ea8004d55cf0011aab9d00137540024646464aa666ae68cdc3a4000004230013017357420021155333573466e1d200200211801980b9aba100108aa999ab9a3370e900200108c014dd71aba100108980ca481035054310035573c0046aae74004dd500091919192a999ab9a3370e900000108c004dd71aba10019bad357426ae880042260309201035054310035573c0046aae74004dd500091919192a999ab9a3370e90000010899194004c8c8c954ccd5cd19b87480000084600260346ae84006660364646464aa666ae68cdc3a400000423001301e357420021155333573466e1d200200211328019bad35742005375a6ae840066eb4d5d09aba20011aba20011130204901035054310035573c0046aae74004dd50009aba13574400211301c491035054310035573c0046aae74004dd51aba100399980d3ae50073574200532323255333573466e1d20000021180008aa999ab9a3370e900100108c014dd71aba100108aa999ab9a3370e900200108c00cd5d0800844c071241035054310035573c0046aae74004dd51aba10019980c3ae357426ae880046ae88004d5d100088980ba49035054310035573c0046aae74004dd5000899809bae75a444a646520092150028ac801c860091800460088a800856400a42a00518014540042b2005215900290999803002801000c5a300445a2b20032180145a30000a40064444444400e290019111110028a400644444400c375c007149a2601a921035054350018069112a999ab9a3370e9000000889806248103505433001155333573466e200052000113300333702900000119b814800000444ca00266e1000c00666e10008004660080040026018444aa666ae68cdc3a400000222004226600600266e1800800480048c8c8c954ccd5cd19b87480000084600422aa666ae68cdc3a40040042300011300a4901035054310035573c0046aae74004dd5000911919192a999ab9a3370e900000108c0084554ccd5cd19b874800800846002600a6ae8400422aa666ae68cdc3a40080042300411300a491035054310035573c0046aae74004dd500091919192a999ab9a3370e900000108c004dd71aba10019bad357426ae880042260109201035054310035573c0046aae74004dd5000919118011bac00130082233335573e0025000280198021aba100298019aba200240008c8c8c954ccd5cd19b8748000008460026eb8d5d080084554ccd5cd19b8748008008460066eb8d5d0800844c0192401035054310035573c0046aae74004dd5000911919192a999ab9a3370e900100108c0084554ccd5cd19b874800000846002600a6ae8400422600c921035054310035573c0046aae74004dd5000919319ab9c0018001119118011bab00130052233335573e0025000232801c004c018d55ce800cc014d55cf000a60086ae8800c6ae8400a0010012337009001000c8cdc0800a400520019000cc00888954ccd5cd19b89002001118018014cc00ccdc024004004002118004888c8c8c954ccd5cd19b880034800044c00801844c004018c01c8954ccd5cd19b8900100511801800cc008cdc0000802046000600c44aa666ae68cdc400080208c000460060033002337000020063370200400680091199ab9a3370e00400300080148954ccd5cd19b870020011180008aa999ab9a337120040022300411801488ccd5cd19b88002001800400a44666ae68cdc4801000c00200522333573466e2400800600500091199ab9a3371000400300280048954ccd5cd19b890020011100111002912a999ab9a33712004002220042200223230010012300223300200200101",
    [beneficiaryPKH, deadlinePOSIX]
  )
};
const vestingAddress = validatorToAddress("Preview", vestingScript);

// Defining the burn script 
const burnScript: SpendingValidator = {
  type: "PlutusV3",
  script: "450101002601"
};
const burnAddress = validatorToAddress("Preview", burnScript);

// Function that sends an amount of lovelace to the vesting script 
async function vestFunds(amount: bigint): Promise<TxHash> {
  const tx = await lucid
    .newTx()
    .pay.ToContract(vestingAddress, { kind: "inline", value: Data.void() }, { lovelace: amount })
    .complete();

  const signedTx = await tx.sign.withWallet().complete();
  const txHash = await signedTx.submit();
  return txHash
}

// Deploy a reference script 
async function deployVestingScript(): Promise<TxHash>{
  const tx = await lucid
    .newTx()
    .pay.ToAddressWithData(
      burnAddress,
      { kind: "inline", value: Data.void() },
      { lovelace: 10_000_000n },
      vestingScript // The script to be stored as a reference for subsequent transactions
    )
    .complete();

    const signedTx = await tx.sign.withWallet().complete();
    const txHash = await signedTx.submit();
    return txHash
}

// Get the UTXO that contains our vesting script 
async function getReferenceUTxO() {
  const utxos = await lucid.utxosByOutRef([{
      txHash:
        "80415cfff585bc286080ff17df449c042746e3d029f165236e3b94d1986131ff",
      outputIndex: 0
  }]);
  return utxos[0];
}
const referenceUTxO = await getReferenceUTxO();

// Function for claiming vested funds from script 
async function claimVestedFunds(): Promise<TxHash> {
  const vestedUTxO: UTxO[] = await lucid.utxosAt(vestingAddress);

  if (vestedUTxO && vestedUTxO.length > 0) {
    const tx = await lucid
      .newTx()
      .collectFrom(vestedUTxO, Data.void()) //we use void for redeemer
      .addSignerKey(beneficiaryPKH)
      .readFrom([referenceUTxO]) 
      .validFrom(Date.now()-30*1000) // 30 sec before now
      .complete();

    const signedTx = await tx.sign.withWallet().complete();
    const txHash = await signedTx.submit();
    return txHash
  }
  else return "No UTxO's found that can be claimed"
}

// Function calls 
//console.log(vestingAddress);
//console.log(await vestFunds(4_000_000n));
//console.log(await deployVestingScript());
//console.log(await claimVestedFunds());

