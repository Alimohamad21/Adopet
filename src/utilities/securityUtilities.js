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
    let decryption='';
    try{
        decryption= await RSA.decrypt(ciphertext, privateKey);
    }
    catch (e){
        console.log("error in decryption: ",e)
    }
    return decryption;
}

export async function sign(privateKey,message){
    let signature=''
    try {
        signature = await RSA.sign(message, privateKey);
    }
    catch (e) {
        console.log('Error in signature:',e)
    }
    return signature;
}

export async function verifySignature(signature,message,publicKey){
    let verified=false;
    try{
        verified= await RSA.verify(signature,message,publicKey);
    }
    catch (e){
        console.log("error in verify:",e);
    }
    return verified;
}
