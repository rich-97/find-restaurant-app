import auth, { firebase } from '@react-native-firebase/auth';
 
export const register = (email, password) => {
  return auth().createUserWithEmailAndPassword(email, password);
}

export const logIn = (email, password) => {
  return auth().signInWithEmailAndPassword(email, password);
}

export const signOut = async () => {
  await firebase.auth().signOut()
}
