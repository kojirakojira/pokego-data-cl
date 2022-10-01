export default function ({ store, app }) {
  app.router.beforeEach((to, from, next) => {
    const jwt = store.getters.jwt
    if (!jwt && to.path.match(/^\/manage/g)) {
      // "/manage/*"のURLにアクセスしてきたとき、認証済みでなかったらリダイレクトする。
      alert('認証されていません。不正な操作です。')
      next('/search')
    } else {
      next()
    }
  })
}
