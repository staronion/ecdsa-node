const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require('ethereum-cryptography/utils');

const secp = require('ethereum-cryptography/secp256k1');


app.use(cors());
app.use(express.json());

//private key : b26b5d01482363b5efb636eafc540197b109db709992f4169fc86b382bf18e5c
//public key : 040148c11b19b6008222d4675d199bcac280b1ff9ccf76c2da92c9d416ec4cfdd7695176c765d84a3a103afa833c26c4df85220faddd97bd029f75397daab31634

//private key : 3e4ea523952b8a266fe7af0a89ef425bc6790db64a4026fb48d14c1e03125e78
//public key : 046c5df58daca2f0a07d8cd60df01951691fbdd1eb7a86c85d5c19c15fec912bee207bd8df27fc83e13e1d3e8fa0d892229478ea6ccaf09d3474ce9f6f23620319

//private key : 89ce9d33c70dd2e040761f545386b352f2ecef9ccd130cabf7367b1233c8d693
//public key : 043e685c707abbbd3c4f5974bc705cb276173b06816eb25e073cf0da6b00226e7feec0d74c80c2be709cdc96ff2ce43cdda957d447df2f8aeb5e27a43dac468eb7


const balances = {
  "040148c11b19b6008222d4675d199bcac280b1ff9ccf76c2da92c9d416ec4cfdd7695176c765d84a3a103afa833c26c4df85220faddd97bd029f75397daab31634": 100,
  "046c5df58daca2f0a07d8cd60df01951691fbdd1eb7a86c85d5c19c15fec912bee207bd8df27fc83e13e1d3e8fa0d892229478ea6ccaf09d3474ce9f6f23620319": 50,
  "043e685c707abbbd3c4f5974bc705cb276173b06816eb25e073cf0da6b00226e7feec0d74c80c2be709cdc96ff2ce43cdda957d447df2f8aeb5e27a43dac468eb7": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {

  const {
    message,
    sender,
    amount,
    recipient,
    signature,
    recoveryBit
   } = req.body;


  setInitialBalance(sender);
  setInitialBalance(recipient);

  const msgHash = hashMessage(JSON.stringify(message));

  const recoveredPublicKey = secp.recoverPublicKey(msgHash, signature, recoveryBit);

  if (sender != toHex(recoveredPublicKey)){
    console.log("sender public address not the same as the recoveredPublicKey");
  } else{
    console.log("recoveredPublicKey OK");
  }


  const recoveredAddress = getAddress(recoveredPublicKey);


  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});


function getAddress(publickey) {

  const sliced = publickey.slice(1);

  const hash = keccak256(sliced);

  const addr = hash.slice(-20);


  return addr;
}

function hashMessage(message) {
  const msgBytes = utf8ToBytes(message);

  const hash = keccak256(msgBytes);

  return hash;
}

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
