import auth, { firebase } from '@react-native-firebase/auth';
 
export const register = async (email, password) => {
  try {
    await auth().createUserWithEmailAndPassword(email, password);
  } catch (e) {
    console.error(e.message);
  }
}

export const logIn = async (email, password) => {
  try {
    await auth().signInWithEmailAndPassword(email, password);
  } catch (e) {
    console.error(e.message);
  }
}

export const signOut = async () => {
  await firebase.auth().signOut()
}
