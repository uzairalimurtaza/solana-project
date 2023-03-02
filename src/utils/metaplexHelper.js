import { Metaplex } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";
import express from 'express';
let app = express();
import mintedNfts from "./response.json" assert {type: "json"};
const connection = new Connection(
  "https://compatible-aged-voice.solana-mainnet.discover.quiknode.pro/cf46462efd2dc6d8fbfbaa763476f986bc758212/",
  "confirmed"
);
var stakeholders = []
// Getting all minted accounts through candymachine ID
const getMintedAccounts = async () => {
  const metaplex = new Metaplex(connection);
  const candyMachineId = new PublicKey("D1MZXMC57y5a8oart9fYNqA77qHi6bvHw4ZSHmE3w4RB");
  const mintedNfts = await metaplex.nfts().findAllByCreator(candyMachineId).run();
  return mintedNfts
}
// Getting owner addresses of all minted accounts
const getOwnerAddresses = async (tokenMint) => {
  // console.log("Getting owner address",tokenMint)
  const largestAccounts = await connection.getTokenLargestAccounts(new PublicKey(tokenMint));
  // console.log(largestAccounts?.value[0]?.address)
  if (largestAccounts?.value[0]?.address) {
    const largestAccountInfo = await connection.getParsedAccountInfo(largestAccounts?.value[0]?.address);
  } else {
    return
  }
  // console.log(largestAccountInfo);
  let dataObj = {
    mintAddress: largestAccountInfo?.value?.data?.parsed?.info?.mint,
    owner: largestAccountInfo?.value?.data?.parsed?.info?.owner
  }
  return dataObj;
};
// Getting transaction history finding stakeholders
const getStakeholders = async (address, index) => {
  const pubKey = new PublicKey(address);
  let transactionList = await connection.getSignaturesForAddress(pubKey, { limit: 5 });
  for (let i = 0; i < transactionList.length; i++) {
    {
      const trxObj = Promise.resolve(connection.getConfirmedTransaction(transactionList[i].signature))
      trxObj.then((value) => {
        // console.log(value.transaction.instructions[0].programId.toString())
        if (value.transaction.instructions[0].programId.toString() == "9LRZq7vU3hCSPxY6JUMTM4SsBkjGQgUFnKWFr6eYsPqS") {
          if (!stakeholders[index]) {
            stakeholders.push(value.transaction.feePayer.toBase58())
          }
        }
      });
    }
  }
}
// Data modelling grouping owners and mitned accounts
function groupArrayOfObjects(list, key) {
  return list.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
(async () => {
  let owners = []
  // const mintedNfts = getMintedAccounts()
  let total = mintedNfts.length;
  // console.log(mintedNfts.data)
  let remainder = 14; // 85
  let qoutient = mintedNfts.length % 20; // 7
  console.log(' ---------- ', remainder)
  for (let i = 0; i < remainder; i++) {
    let terminator = i * 20
    console.log('---------------', terminator)
    for (let j = 0; j < 20; j++) {
      let ownerAddress = await getOwnerAddresses(mintedNfts.data[terminator + j].mintAddress)
      owners.push(ownerAddress)
    }
    setTimeout(function () {
      console.log("Timeout------")
    }, 2000);
  }
  // for (let i = 0; i < 20; i++) {
  //   let ownerAddress = await getOwnerAddresses(mintedNfts.data[i].mintAddress)
  //   owners.push(ownerAddress)
  // }
  const groupedWallets = groupArrayOfObjects(owners, "owner")
  var holders = {}
  let keys = Object.keys(groupedWallets)
  for (let k in keys) {
    var currentOwner = keys[k]
    var mints = groupedWallets[currentOwner].map(data => data.mintAddress)
    var amount = mints.length
    holders[currentOwner] = { mints, amount }
  }
  console.log("Holders List", holders)
  let stakingWalletMints = holders.BiV7oam9fVnhBFt8d8oQWZJU3QmV45reKsmNJHcPhZVp.mints
  for (let i = 0; i < stakingWalletMints.length; i++) {
    await getStakeholders(stakingWalletMints[i], i)
  }
  console.log("Stakeholders list", stakeholders)
})();
// app.get('/', async(req, res) =>{
//   let owners = []
//   // const mintedNfts = getMintedAccounts()
//   let total = mintedNfts.length;
//   // console.log(mintedNfts.data)
//   let remainder = Math.floor(mintedNfts.data.length / 20); // 85
//   let qoutient = mintedNfts.data.length % 20; // 7
//   console.log(qoutient)
//   let lastRem = (remainder * 20) + qoutient
//   console.log(lastRem);
//   console.log(' ---------- ',remainder)
//   for (let i = 11; i < remainder; i++) {
//     let terminator = i * 20
//     console.log('---------------', i)
//     for (let j = 0; j < 20; j++) {
//       console.log('---------------', j)
//       setTimeout(async function(){
//         let ownerAddress = await getOwnerAddresses(mintedNfts.data[terminator + j].mintAddress)
//         owners.push(ownerAddress)
//      }, 1000);
//     }
//   }
//   // for(let i = remainder * 20 ; i< (remainder * 20) + qoutient; i++){
//   //   let ownerAddress = await getOwnerAddresses(mintedNfts.data[terminator + j].mintAddress)
//   //     owners.push(ownerAddress)
//   // }
//   // for (let i = 0; i < 20; i++) {
//   //   let ownerAddress = await getOwnerAddresses(mintedNfts.data[i].mintAddress)
//   //   owners.push(ownerAddress)
//   // }
//   const groupedWallets = groupArrayOfObjects(owners, "owner")
//   var holders = {}
//   let keys = Object.keys(groupedWallets)
//   for (let k in keys) {
//     var currentOwner = keys[k]
//     var mints = groupedWallets[currentOwner].map(data => data.mintAddress)
//     var amount = mints.length
//     holders[currentOwner] = { mints, amount }
//   }
//   console.log("Holders List", holders)
//   let stakingWalletMints = holders.BiV7oam9fVnhBFt8d8oQWZJU3QmV45reKsmNJHcPhZVp.mints
//   for (let i = 0; i < stakingWalletMints.length; i++) {
//     await getStakeholders(stakingWalletMints[i], i)
//   }
//   res.status(200).json({
//     status: 1,
//     stakeholders,
//     holders
//   })
//   // console.log("Stakeholders list", stakeholders)
// })
// app.listen(3000, () => console.log('done'))