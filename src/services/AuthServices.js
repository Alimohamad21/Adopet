import auth from '@react-native-firebase/auth';

class AuthServices {
  // Register a new user with email and password
  static async registerWithEmailAndPassword(email, password) {
    try {
     await auth().createUserWithEmailAndPassword(email, password);
      const userCredential =  await auth().signInWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (error) {
      console.error(error);
      return error.message; // return the error message instead of null
    }
  }

  static async sendPhoneVerificationSMS(phoneNumber){
      let confirmation;
      try {
          confirmation = await auth().signInWithPhoneNumber(
              phoneNumber,
          );
          console.log('Verification ID:', confirmation);
      } catch (error) {
          console.log('Error sending OTP', error);
      }
      return confirmation;
  }

  static async confirmValidOTP(confirmation,otp){
      let isValid;
      try{
          isValid = await confirmation.confirm(otp);
      }
      catch (e) {
          console.log("ERROR IN OTP CONFIRM:",e)
          isValid=false;
      }
      return isValid;
  }
  // Sign in a user with email and password
  static async signInWithEmailAndPassword(email, password) {
    try {

      const userCredential = await auth().signInWithEmailAndPassword(email, password);

      return userCredential.user;
    } catch (error) {
        console.log(error)
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
        console.log("Email updated successfully!");
        return newEmail;
      })
    }
    catch(error) {
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
      currentPassword
    );

    // Reauthenticate the user with the current credential
    user.reauthenticateWithCredential(credential)
      .then(() => {
        // If reauthentication is successful, update the password
        return user.updatePassword(newPassword);
      })
      .then(() => {
        console.log("Password updated successfully!");
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
