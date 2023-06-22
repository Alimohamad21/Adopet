import auth from '@react-native-firebase/auth';
import {extractSubstringAfterDelimiter} from '../utilities/stringUtilities';
import UserServices from './UserServices';

class AuthServices {
    // Register a new user with email and password
    static async registerWithEmailAndPassword(email, password) {
        let user=null, error=null;
        try {
            await auth().createUserWithEmailAndPassword(email, password);
            const userCredential = await auth().signInWithEmailAndPassword(email, password);
            if(userCredential)
                user=userCredential.user;
        } catch (e) {
            error = extractSubstringAfterDelimiter(e.message, ']');
            console.log("Error is: ",error)
        }
        return {error: error, authUser: user};
    }

    static async checkIfEmailAlreadyRegistered(email){
                const methods=await auth().fetchSignInMethodsForEmail(email);
                return methods.includes("password");
    }


    static async sendPhoneVerificationSMS(phoneNumber) {
        let verificationId=null, error=null;
        const isAlreadyRegistered=false;
        if(isAlreadyRegistered)
            return {error: "Phone Number is already used", verificationId: verificationId}
        try {
            const confirmation = await auth().signInWithPhoneNumber(
                phoneNumber,
            );
            if(confirmation)
                verificationId=confirmation.verificationId;
        } catch (e) {
            console.log('Error sending OTP', e);
            error = extractSubstringAfterDelimiter(e.message, ']');
        }
        return {error: error, verificationId: verificationId};
    }

    static async confirmValidOTP(verificationId, otp) {
        let isValid;
        try {
            console.log(`VERIFICATION ID: ${verificationId} OTP: ${otp}`)
            const credential = auth.PhoneAuthProvider.credential(verificationId, otp); // get the credential';
            await auth().signInWithCredential(credential);
            isValid = true;
        } catch (e) {
            console.log('ERROR IN OTP CONFIRM:', e);
            isValid = false;
        }
        return isValid;
    }

    // Sign in a user with email and password
    static async signInWithEmailAndPassword(email, password) {
        try {

            const userCredential = await auth().signInWithEmailAndPassword(email, password);

            return userCredential.user;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static async updateEmail(newEmail) {
        // Get the current user
        const user = auth().currentUser;

        // Update the user's email
        try {
            await user.updateEmail(newEmail)
                .then(() => {
                    console.log('Email updated successfully!');
                    return newEmail;
                });
        } catch (error) {
            console.error(error);
            return error.message;
        }
    }


    static async updatePassword(currentPassword, newPassword) {
        // Get the current user
        const user = auth().currentUser;

        // Create a credential with the user's current email and password
        const credential = auth.EmailAuthProvider.credential(
            user.email,
            currentPassword,
        );

        // Reauthenticate the user with the current credential
        user.reauthenticateWithCredential(credential)
            .then(() => {
                // If reauthentication is successful, update the password
                return user.updatePassword(newPassword);
            })
            .then(() => {
                console.log('Password updated successfully!');
            })
            .catch((error) => {
                console.error(error);
                return null;
            });
        //  const emailCred  = auth.EmailAuthProvider.credential(auth().currentUser, currentPassword);
        //  try {
        //    auth().currentUser.reauthenticateWithCredential(emailCred)
        //      .then(() => {
        //        return auth().currentUser.updatePassword(newPassword);
        //      })
        //  }
        //  catch(error){
        //    console.log("error in changing password");
        //    return null;
        //  }
    }

    // Sign out the currently signed-in user
    static async signOut() {
        try {
            await auth().signOut();
        } catch (error) {
            console.error(error);
        }
    }

}

export default AuthServices;
