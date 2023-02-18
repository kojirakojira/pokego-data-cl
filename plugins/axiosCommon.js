import firebase from 'firebase/app'

export default function ({ app, store, $axios }) {
  // baseURL
  $axios.setBaseURL(process.env.VUE_APP_API_URL)

  // request
  $axios.onRequest((config) => {
    config.headers.common.Authorization = store.getters.jwt
  })

  // response
  $axios.onResponse((res) => {
    if (res) {
      const auth = res.headers.authorization
      if (auth) {
        store.dispatch('setJwt', auth)
      }
    }

    return Promise.resolve(res)
  })

  // error
  $axios.onError((err) => {
    if (!err.response) {
      store.dispatch('getToast', { msg: 'サーバとの通信に失敗しました。' })
    } else if (err.response.status === 401) {
      store.dispatch('getToast', { msg: '再ログインが必要です。' })
      if (!store.getters.jwt) {
        store.dispatch('setJwt', null)
        app.router.push({ name: 'login' })
        return
      }
      firebase
        .auth()
        .signOut()
        .then(() => {
          // jwtのトークンを削除してAPIサーバからログアウト
          store.dispatch('setJwt', null)
          app.router.push({ name: 'login' })
        })
        .catch(() => {
          store.dispatch('setJwt', null)
          app.router.push({ name: 'login' })
        })
    }
  })
}
