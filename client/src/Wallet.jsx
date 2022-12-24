import server from "./server";
import * as secp from 'ethereum-cryptography/secp256k1';
import { toHex } from 'ethereum-cryptography/utils';


function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {

    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    const address = toHex(secp.getPublicKey(privateKey));
    setAddress(address);

    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }


  return (
    <div className="container wallet">
      <h1>Your Wallet : b26b5d01482363b5efb636eafc540197b109db709992f4169fc86b382bf18e5c</h1>

      <p>046c5df58daca2f0a07d8cd60df01951691fbdd1eb7a86c85d5c19c15fec912bee207bd8df27fc83e13e1d3e8fa0d892229478ea6ccaf09d3474ce9f6f23620319</p>

      <label className="privateKey">
        <span className="boldText">
          Private Key :
        </span>
        <input placeholder="Type your private key" value={privateKey} onChange={onChange}></input>
      </label>

      <div className="address">
        <span className="boldText">
          Public Address :
        </span>
          {address.slice(0,20)}...
      </div>

      <div className="balance">
        <span className="boldText">
          Balance :
        </span>
        { balance}
      </div>


    </div>


  );
}



export default Wallet;
