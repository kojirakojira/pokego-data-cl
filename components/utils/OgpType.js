/**
 * OGP情報を取得する。
 * （リンクを叩いたとき、リロードしたときはサーバ側で実行される。それ以外はクライアント側で実行される。
 */
export default {
  async asyncData ({ $axios, query }) {
    // OGP情報の取得
    const data = await $axios
      .get(process.env.VUE_APP_API_URL + '/api/ogpType', {
        params: {
          id: query.pid,
          type1: query.type1,
          type2: query.type2
        }
      })
      .then((res) => {
        return {
          type: res.data.type
        }
      })
      .catch(() => {
        return { type: '' }
      })

    return {
      ogp_type: data.type
    }
  }
}
