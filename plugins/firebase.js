import firebase from 'firebase/app'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBA6CaIJCPYybCZh0xPgLOtTiGhrh5yymU',
  authDomain: 'brain-juice-5ac93.firebaseapp.com',
  databaseURL: 'https://brain-juice-5ac93.firebaseio.com',
  projectId: 'brain-juice-5ac93',
  storageBucket: 'brain-juice-5ac93.appspot.com',
  messagingSenderId: '440606456737',
  appId: '1:440606456737:web:d1409c6a20e091d5cfe9e0',
  measurementId: 'G-M96B9N10B7'
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export const authProviders = {
//   Email: firebase.auth.EmailAuthProvider.PROVIDER_ID,
//   Google: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//   Facebook: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  Twitter: firebase.auth.TwitterAuthProvider.PROVIDER_ID
//   Github: firebase.auth.GithubAuthProvider.PROVIDER_ID
}

export const auth = firebase.auth()
