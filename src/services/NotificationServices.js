import messaging from "@react-native-firebase/messaging";

class NotificationServices {

    static async getToken(){
        try {
            const token = await messaging().getToken();
            console.log("Token:",token)
            return token;
        }
        catch (error){
            console.log("Error getting Token")
        }

    }

}
export default NotificationServices;