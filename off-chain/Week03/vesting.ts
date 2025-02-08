
import { 
  Lucid, 
  Blockfrost,
  Address,
  SpendingValidator,
  Data, 
  AddressDetails,
  Datum,
  TxHash,
  UTxO
} from "@lucid-evolution/lucid";
import { secretSeed } from "./seed.ts";

import {
  validatorToAddress,
  getAddressDetails
} from "@lucid-evolution/utils";

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

// Defining the spending script 
const vestingScript: SpendingValidator = {
  type: "PlutusV3",
  script: "590ed20101003232323232323232323232323232259932323255333573466e1d20000021132323232328009919192a999ab9a3370e9000001089919191919191919191919191919191919999999999991999199199111111111111111400404201f00e806c03201700a804c02200f006802c0120070028008c004d5d080a18009aba10133025232323255333573466e1d200000211800980e9aba100198029aba13574400211302c4901035054310035573c0046aae74004dd5000998128009aba1011232323255333573466e1d20000021132328009919192a999ab9a3370e900000108c004c0b8d5d0800ccc0bc8c8c8c954ccd5cd19b87480000084600260646ae8400422aa666ae68cdc3a40040042265003375a6ae8400a6eb4d5d0800cdd69aba135744002357440022260689201035054310035573c0046aae74004dd50009aba135744002113030491035054310035573c0046aae74004dd51aba100398039aba10029919192a999ab9a3370e900000108c0004554ccd5cd19b87480080084600a6eb8d5d080084554ccd5cd19b8748010008460066ae840042260609201035054310035573c0046aae74004dd51aba1001998163ae357426ae880046ae88004d5d1000889815a49035054310035573c0046aae74004dd50009bad3574201e60026ae84038c004c005d69981180a9aba100c33302702475a6ae8402cc8c8c954ccd5cd19b874800000846002646464aa666ae68cdc3a4000004230013302775a6ae84006604c6ae84d5d1000844c0b1241035054310035573c0046aae74004dd51aba10019919192a999ab9a3370e900000108c004cc09dd69aba100198131aba13574400211302c4901035054310035573c0046aae74004dd51aba1357440021130294901035054310035573c0046aae74004dd51aba100a3302375c6ae84024ccc09c8c8c8c954ccd5cd19b8748000008460066eb8d5d080084554ccd5cd19b87480080084601260366ae8400422aa666ae68cdc3a4008004230073028357420021155333573466e1d2006002118009bad357420033019357426ae8800422aa666ae68cdc3a40100042300b301a357420021155333573466e1d200a002118029bad357420033018357426ae880042260549201035054310035573c0046aae74004dd500080f9aba10083300101f3574200e6eb8d5d080319981380b1981381111919192a999ab9a3370e900000108c0084554ccd5cd19b87480080084600822aa666ae68cdc3a40080042300011302a491035054310035573c0046aae74004dd50009aba1005330230143574200860046ae8400cc008d5d09aba2003302675c6046eb4d5d10009aba2001357440026ae88004d5d10009aba2001357440026ae88004d5d10009aba2001357440026ae88004d5d10009aba20011130164901035054310035573c0046aae74004dd51aba10069aba10059919192a999ab9a3370e900000108c00cdd71aba100108aa999ab9a3370e900100108c024c01cd5d0800ccc05403cd5d09aba200108aa999ab9a3370e900200108c01cc050d5d080084554ccd5cd19b8748018008460026eb4d5d0800cc014d5d09aba200108aa999ab9a3370e900400108c02cc018d5d080084554ccd5cd19b87480280084600a6eb4d5d0800cc010d5d09aba200108980b2481035054310035573c0046aae74004dd51aba13574400a232323255333573466e1d200000211328009bad3574200530153574200332323255333573466e1d200000211328049980d00b9aba10029aba10019980d3ae357426ae880046ae880044554ccd5cd19b8748008008460026603202c6ae84006646464aa666ae68cdc3a400000423001375a6ae840066eb4d5d09aba200108980ea481035054310035573c0046aae74004dd51aba1357440021155333573466e1d20040021180599980d80c3ad357420033301975c6ae84d5d100084554ccd5cd19b87480180084600e6603202c6ae8400422aa666ae68cdc3a401000422646500d3301b018357420073301901a3574200533301d01a75a6ae840072646464aa666ae68cdc3a400000423001375a6ae840066eb4d5d09aba200108980fa481035054310035573c0046aae74004dd51aba13574400322330150020010d5d10009aba20011155333573466e1d200a002118029980c80b1aba10019919192a999ab9a3370e9000001089980e3ae3574200222603a9201035054310035573c0046aae74004dd51aba1357440021155333573466e1d200c0021180108980d2481035054310035573c0046aae74004dd51aba1357440023574400222602c9201035054310035573c0046aae74004dd500091919192a999ab9a3370e900000108c034c04cd5d0800ccc051d69aba1357440021155333573466e1d20020021180998099aba10019980a3ad357426ae8800422a64a666ae68cdc3a4008006230033014357420053001357426ae8800822aa666ae68cdc3a400c006226500b301535742007300235742003375a6ae84d5d10008d5d100108aa999ab9a3370e900400188c024c050d5d08014dd69aba1357440041155333573466e1d200a0031180a980a1aba100208aa999ab9a3370e900600188c044c050d5d08014dd69aba1357440041155333573466e1d200e003118029bae35742005375c6ae84d5d100104554ccd5cd19b874804000c4600e6eb8d5d08014dd69aba1357440041155333573466e1d201200311800980a1aba1002980a1aba1357440041155333573466e1d201400311807980a1aba100208980b24810350543100232323255333573466e1d2000002118009bae35742002115325333573466e1d20020031180298009aba100208aa999ab9a3370e900200188c00cdd71aba100298009aba13574400411301a49010350543100232323255333573466e1d200000211800980d9aba100108aa999ab9a3370e900100108c0084554ccd5cd19b87480100084600822603a9201035054310035573c0046aae74004dd50009aab9e00235573a0026ea8004d55cf0011aab9d00137540024646464aa666ae68cdc3a4000004230013012357420021155333573466e1d20020021180198091aba100108aa999ab9a3370e900200108c014dd71aba100108980a2481035054310035573c0046aae74004dd500091919192a999ab9a3370e900000108c004dd71aba10019bad357426ae880042260269201035054310035573c0046aae74004dd50009aba200111300e4901035054310035573c0046aae74004dd5000c88a400e44444444444444453202322693489a4d225900190ac99999919800801112a999ab9a3370e900000108ac9999aab9f0012801140060026ae8400a6ae88008800486400644b266666600c00445002280114008a004500100148564cccd55cf801140088c8ca002004357440086ae8400e00121593333330080012280114008a00450010011400a43001800801c0048c0091801230022300208c008888888ccccccd5d2003119198039aab9d00135573c0026ea801c8c014dd5803918021bac00723003375a00e460046eb801e0005002280114008a005210018b22c932464646464644646464b2b3203b2222222222222222301500846001180122b20031800460048c008b2600202518004564c00400a30028c80148a405244a65266601405f200b22590018801456400a43001330100310014400a20042400e44b200310028ac8014860026602006200288014400845400630028a8008564ccc0240ba400644b200310028ac8014860026601c0600028801440084801c8964006200515900290c004cc0380c00051002880108c00230028c00005200322900291299194801c56401242600400b132801280144c0040111590049098014004cc03c0c0005132801280144c00600812994a801c85400a30008a800856400642b2a007215933300e0320020018c00a30008c009168c009168aca801486001168c00819003912c800c400a2b20052180099807018000a20051002040060030010016000c0060098000604e44b20031801488554ccd5cd19b8f0090021180008980200088894c8ca401242a00515900390c01230008c011150010ac801485400a30028a800856400a42b2005213330060050020018b460088b4564006430028b4600014800c8888888801c5200322222200514800c888888018229344c02d241035054350018069112a999ab9a3370e9000000889806248103505433001155333573466e200052000113300333702900000119b814800000444ca00266e1000c00666e10008004660080040026018444aa666ae68cdc3a400000222004226600600266e1800800480048c8c8c954ccd5cd19b87480000084600422aa666ae68cdc3a40040042300011300a4901035054310035573c0046aae74004dd5000911919192a999ab9a3370e900000108c0084554ccd5cd19b874800800846002600a6ae8400422aa666ae68cdc3a40080042300411300a491035054310035573c0046aae74004dd500091919192a999ab9a3370e900000108c004dd71aba10019bad357426ae880042260109201035054310035573c0046aae74004dd5000919118011bac00130082233335573e0025000280198021aba100298019aba200240008c8c8c954ccd5cd19b8748000008460026eb8d5d080084554ccd5cd19b8748008008460066eb8d5d0800844c0192401035054310035573c0046aae74004dd5000911919192a999ab9a3370e900100108c0084554ccd5cd19b874800000846002600a6ae8400422600c921035054310035573c0046aae74004dd5000919319ab9c0018001119118011bab00130052233335573e0025000232801c004c018d55ce800cc014d55cf000a60086ae8800c6ae8400a0010012337009001000c8cdc0800a400520019000cc00888954ccd5cd19b89002001118018014cc00ccdc024004004002118004888c8c8c954ccd5cd19b880034800044c00801844c004018c01c8954ccd5cd19b8900100511801800cc008cdc0000802046000600c44aa666ae68cdc400080208c000460060033002337000020063370200400680091199ab9a3370e00400300080148954ccd5cd19b870020011180008aa999ab9a337120040022300411801488ccd5cd19b88002001800400a44666ae68cdc4801000c00200522333573466e2400800600500091199ab9a3371000400300280048954ccd5cd19b890020011100111002912a999ab9a33712004002220042200223230010012300223300200200101"
};
const vestingAddress = validatorToAddress("Preview", vestingScript);

// Create the vesting datum type
const DatumSchema = Data.Object({
  beneficiary: Data.Bytes(),
  deadline: Data.Integer(),
});
type DatumType = Data.Static<typeof DatumSchema>;
const DatumType = DatumSchema as unknown as DatumType;

// Set the vesting deadline
const deadlineDate: Date = new Date("2025-02-05T00:00:00Z")
const deadlinePOSIX = BigInt(deadlineDate.getTime());

// Set the vesting beneficiary to our own key.
const details: AddressDetails = getAddressDetails(addr);
const beneficiaryPKH: string = details.paymentCredential?.hash!;

// Creating a datum with a beneficiary and deadline
const datum: DatumType = {
  beneficiary: beneficiaryPKH,
  deadline: deadlinePOSIX
};

// Function that sends an amount of lovelace to the script with the above datum.
async function vestFunds(amount: bigint): Promise<TxHash> {
  const dtm: Datum = Data.to<DatumType>(datum,DatumType);
  const tx = await lucid
    .newTx()
    .pay.ToContract(vestingAddress, { kind: "inline", value: dtm }, { lovelace: amount })
    .complete();
  const signedTx = await tx.sign.withWallet().complete();
  const txHash = await signedTx.submit();
  return txHash
}

// Function for claiming vested funds from script 
async function claimVestedFunds(): Promise<TxHash> {
  const dtm: Datum = Data.to<DatumType>(datum,DatumType);
  const utxoAtScript: UTxO[] = await lucid.utxosAt(vestingAddress);
  const ourUTxO: UTxO[] = utxoAtScript.filter((utxo) => utxo.datum == dtm);

  if (ourUTxO && ourUTxO.length > 0) {
    const tx = await lucid
      .newTx()
      .collectFrom(ourUTxO, Data.void()) // we use void for redeemer 
      .addSignerKey(beneficiaryPKH)
      .attach.SpendingValidator(vestingScript)
      .validFrom(Date.now()-30*1000) // 30 sec before now
      .complete();

    const signedTx = await tx.sign.withWallet().complete();
    const txHash = await signedTx.submit();
    return txHash
  }
  else return "No UTxO's found that can be claimed"
}

//console.log(await vestFunds(5_000_000n));
//console.log(await claimVestedFunds());

