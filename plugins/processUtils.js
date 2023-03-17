export default ({ app }, inject) => {
  /**
   * AxiosにおけるHTTP statusが401以外のエラーだった場合の挙動
   * @param {*} err
   */
  const onErrorNot401 = (err) => {
    if (err.response.status !== 401) {
      alert('何らかのエラーが発生しました。')
      app.$router.back()
    }
  }
  const processUtils = {
    onErrorNot401
  }
  inject('processUtils', processUtils)
}
