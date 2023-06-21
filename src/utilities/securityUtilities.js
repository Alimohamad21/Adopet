import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';
import UserServices from '../services/UserServices';
import {RSA, RSAKeychain} from 'react-native-rsa-native';


export async function storeKeyPair(uid, privateKey, publicKey) {
    RNSecureKeyStore.set('privateKey', privateKey, {accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY})
        .then((res) => {
            console.log(res);
        }, (err) => {
            console.log(err);
        });
    await UserServices.addPublicKey(uid, publicKey);
}

export async function getPrivateKey(){
    return await RNSecureKeyStore.get('privateKey');
}



export async function generateRSAKeyPair() {
    const keyPair=await RSA.generateKeys(4096);
    const privateKey=keyPair.private;
    const publicKey=keyPair.public;
    return {privateKey,publicKey};
}

export async function encryptRSA(publicKey, message) {
    return await RSA.encrypt(message, publicKey);
}

export async function decryptRSA(privateKey, ciphertext) {
    return await RSA.decrypt(ciphertext, privateKey);
}

export async function sign(privateKey,message){
    return await RSAKeychain.sign(message,privateKey);
}

export async function verifySignature(signature,message,publicKey){
    return await RSAKeychain.verify(message,signature,publicKey);
}
