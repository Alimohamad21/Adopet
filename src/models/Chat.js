import {decryptRSA, getPrivateKey, verifySignature} from '../utilities/securityUtilities';

class Chat {
    constructor(id, messages, petName, postType, userThatPostedFullName, userThatPostedId, userThatPostedProfilePicture, userThatRequestedFullName, userThatRequestedId, userThatRequestedProfilePicture, postId, userThatPostedUnReadMessagesCount, userThatRequestedUnReadMessagesCount, userThatPostedPublicKey, userThatRequestedPublicKey) {
        this.id = id;
        this.messages = messages;
        this.petName = petName;
        this.postType = postType;
        this.userThatPostedFullName = userThatPostedFullName;
        this.userThatPostedId = userThatPostedId;
        this.userThatPostedProfilePicture = userThatPostedProfilePicture;
        this.userThatRequestedFullName = userThatRequestedFullName;
        this.userThatRequestedId = userThatRequestedId;
        this.userThatRequestedProfilePicture = userThatRequestedProfilePicture;
        this.postId = postId;
        this.userThatPostedUnReadMessagesCount = userThatPostedUnReadMessagesCount;
        this.userThatRequestedUnReadMessagesCount = userThatRequestedUnReadMessagesCount;
        this.userThatPostedPublicKey = userThatPostedPublicKey;
        this.userThatRequestedPublicKey = userThatRequestedPublicKey;
    }

    static async decrypt(messages, currentUserId,otherUserPublicKey) {
        const privateKey = await getPrivateKey();
        const decryptedMessages = [];
        for (const message of messages) {
            let cipher = '';
            for (let [id, cipherText] of Object.entries(message.text)) {
                if (id === currentUserId) {
                    cipher = cipherText;
                }
            }
            let text=await decryptRSA(privateKey,cipher);
            if(message.uid!==currentUserId) {
                const isVerified=await verifySignature(message.signature,text,otherUserPublicKey);
                console.log("VERIFY SIGNATURE RESULT: ",isVerified);
                if(!isVerified){
                    text='Malicious Message: This message has been sent from an unknown source'
                }
            }
            decryptedMessages.push({
                text:text,
                createdAt:message.createdAt,
                _id:message._id,
                uid:message.uid
            })
        }
        console.log('decryptedMessages: ',decryptedMessages);
        return decryptedMessages;
    }

    static async fromJson(json, currentUserId) {
        const otherUserPublicKey=currentUserId!==json.userThatPostedId?json.userThatRequestedPublicKey:json.userThatPostedPublicKey;
        const decryptedMessages= await this.decrypt(json.messages,currentUserId,otherUserPublicKey)
        return new Chat(
            json.id,
            decryptedMessages,
            json.petName,
            json.postType,
            json.userThatPostedFullName,
            json.userThatPostedId,
            json.userThatPostedProfilePicture,
            json.userThatRequestedFullName,
            json.userThatRequestedId,
            json.userThatRequestedProfilePicture,
            json.postId,
            json.userThatPostedUnReadMessagesCount,
            json.userThatRequestedUnReadMessagesCount,
            json.userThatRequestedPublicKey,
            json.userThatPostedPublicKey,
        );
    }

    static toJson(chat) {
        return {
            messages: chat.messages,
            petName: chat.petName,
            postType: chat.postType,
            userThatPostedFullName: chat.userThatPostedFullName,
            userThatPostedId: chat.userThatPostedId,
            userThatPostedProfilePicture: chat.userThatPostedProfilePicture,
            userThatRequestedFullName: chat.userThatRequestedFullName,
            userThatRequestedId: chat.userThatRequestedId,
            userThatRequestedProfilePicture: chat.userThatRequestedProfilePicture,
            postId: chat.postId,
            userThatPostedUnReadMessagesCount: chat.userThatPostedUnReadMessagesCount,
            userThatRequestedUnReadMessagesCount: chat.userThatRequestedUnReadMessagesCount,
            userThatPostedPublicKey: chat.userThatPostedPublicKey,
            userThatRequestedPublicKey: chat.userThatRequestedPublicKey,
        };
    }


}

export default Chat;
