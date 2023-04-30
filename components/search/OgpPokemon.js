/**
 * OGP情報を取得する。
 * （リンクを叩いたとき、リロードしたときはサーバ側で実行される。それ以外はクライアント側で実行される。
 */
export default {
  async asyncData ({ $axios, query }) {
    const defaultImagePath = '/pokego/peripper-eyes.png'
    // OGP情報の取得
    const data = await $axios
      .get(process.env.VUE_APP_API_URL + '/api/ogpPokemon', { params: { id: query.pid } })
      .then((res) => {
        return {
          name: res.data.name,
          image: res.data.image ? res.data.image : defaultImagePath
        }
      })
      .catch(() => {
        return { name: '', image: defaultImagePath }
      })

    return {
      ogp_name: data.name,
      ogp_image: process.env.VUE_APP_STATIC_URL + data.image
    }
  }
}
