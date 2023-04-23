class Chat {
    constructor(id, messages, petName, postType, userThatPostedFullName, userThatPostedId, userThatPostedProfilePicture, userThatRequestedFullName, userThatRequestedId, userThatRequestedProfilePicture, postId) {
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
        this.postId=postId;
    }

    static fromJson(json) {
        return new Chat(
            json.id,
            json.messages,
            json.petName,
            json.postType,
            json.userThatPostedFullName,
            json.userThatPostedId,
            json.userThatPostedProfilePicture,
            json.userThatRequestedFullName,
            json.userThatRequestedId,
            json.userThatRequestedProfilePicture,
            json.postId
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
            postId:chat.postId
        };
    }


}

export default Chat;
