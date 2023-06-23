import messaging from '@react-native-firebase/messaging';
import UserServices from './UserServices';
import {SERVER_KEY} from "@env"

class NotificationServices {

    static async getToken() {
        try {
            const token = await messaging().getToken();
            console.log('Token:', token);
            return token;
        } catch (error) {
            console.log('Error getting Token');
        }

    }z

    static async requestNotificationsPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
            console.log('Authorization status:', authStatus);
        }
    }

    static listenToNotifications() {
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
            console.log('Message handled in the background!', remoteMessage);
        });
        messaging().onNotificationOpenedApp((notificationOpen) => {
            console.log('Notification opened: ', notificationOpen);
        });

        messaging().onMessage(async (remoteMessage) => {
            console.log('FCM message received:', remoteMessage);
        });
    }

    static async sendNotification(recipientId, notificationTitle, notificationBody) {
        const recipient = await UserServices.getUser(recipientId);
        const recipientFcmTokens = recipient.fcmTokens;
        for (const fcmToken of recipientFcmTokens) {
            const message = {
                token: fcmToken,
                to: fcmToken,
                notification: {
                    title: notificationTitle,
                    body: notificationBody,
                    mutable_content: true,
                },
            };
            const options = {
                method: 'POST',
                body: JSON.stringify(message),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `key=${SERVER_KEY}`,
                },
            };
            const url = 'https://fcm.googleapis.com/fcm/send';
            try {
                await fetch(url, options);
                console.log('Notification sent successfully');

            } catch (e) {
                console.log('Failed to send notification:', e);
            }
            //console.log(response.json())
            /*messaging().sendMessage(message)
                .then((response) => {
                    console.log('Notification sent successfully');
                })
                .catch((error) => {
                    console.error('Error sending notification:', error);
                });*/
        }
    }


}

export default NotificationServices;
