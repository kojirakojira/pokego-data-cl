import firebase from 'firebase/app'
import 'firebase/auth'

export default function ({ store }) {
  if (process.client) {
    firebase.auth().onAuthStateChanged((currentUser) => {
      if (currentUser) {
        store.dispatch('setUserId', currentUser.providerData[0].uid)
      } else {
        store.dispatch('setUserId', null)
        store.dispatch('setJwt', '')
      }
    })
  }
}
