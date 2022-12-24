import * as secp from 'ethereum-cryptography/secp256k1';
import { toHex } from 'ethereum-cryptography/utils';
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";



export async function signMessage(msg, privateKey) {
    const hashedMessage = hashMessage(msg);
  
    const [signature, recoveryBit] = await secp.sign(hashedMessage, privateKey, {
      recovered: true,
    });
    return { signature: toHex(signature), recoveryBit };
  }

  
export function hashMessage(message) {
    const msgBytes = utf8ToBytes(message);
  
    const hash = keccak256(msgBytes);
  
    return (hash);
  }


 export async function recoverKey(message, signature, recoveryBit) {
    const hashmsg = hashMessage(message);


    const ret = await secp.recoverPublicKey(hashmsg, signature, recoveryBit);

    return ret;
}
