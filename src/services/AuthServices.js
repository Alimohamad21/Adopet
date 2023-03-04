import auth from '@react-native-firebase/auth';

class AuthServices {
  // Register a new user with email and password
  static async registerWithEmailAndPassword(email, password) {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Sign in a user with email and password
  static async signInWithEmailAndPassword(email, password) {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (error) {
      console.error(error);
      return null;
    }
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
