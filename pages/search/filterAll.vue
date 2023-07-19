<template>
  <div>
    <H2Common>
      {{ getSearchPatternName(searchPattern) }}
    </H2Common>
    <FilterInput
      :search-param="searchParam"
      :is-search-btn-click="isSearchBtnClick"
      @click="clickSearchBtn"
    />
  </div>
</template>

<script>
import H2Common from '~/components/utils/H2Common'
import SearchCommon from '~/components/search/SearchCommon'
import FilterInput from '~/components/search/FilterInput'
export default {
  name: 'FilterAll',
  components: {
    H2Common,
    FilterInput
  },
  mixins: [SearchCommon],
  data () {
    return {
      searchPattern: 'filterAll',
      searchParam: {
        name: '',
        type1: '',
        type2: '',
        finEvo: false,
        negaFinEvo: false,
        mega: false,
        negaMega: false,
        impled: false,
        negaImpled: false,
        tooStrong: false,
        negaTooStrong: false,
        region: [],
        negaRegion: false,
        gen: [],
        negaGen: false
      },
      pfr: {},

      isSearchBtnClick: false,
      isLoading: true
    }
  },
  methods: {
    async clickSearchBtn () {
      this.isSearchBtnClick = true
      const res = await this.get()
      this.handleApiResult(res)
      this.isSearchBtnClick = false
    },
    async get () {
      return await this.$axios
        .get('/api/filterAll' + this.spreadArray(this.searchParam))
    },
    /**
     * APIのレスポンスを処理する。
     *
     * @param {Object} res
     */
    handleApiResult (res) {
      const resData = res.data

      // メッセージ、メッセージレベルによるハンドリング
      const success = this.handleApiMessage(resData)
      if (!success) { return }

      if (resData.success && resData.pfr.hit) {
        // 取得成功かつ1件以上ヒットした場合
        this.replaceState(this.searchParam)
        this.$router.push({
          name: 'search-list-filterAllList',
          query: this.makeQuery(),
          params: {
            rd: resData
          }
        })
      }
    }
  },
  head () {
    return {
      title: this.getSearchPatternName(this.searchPattern),
      meta: [
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: `${this.getSearchPatternName(this.searchPattern)} - ペリずかん` },
        { property: 'og:url', content: process.env.VUE_APP_URL + this.$route.path },
        { property: 'og:site_name', content: 'ペリずかん' },
        { property: 'og:description', content: '様々な絞り込み条件を複合的に設定し、対象のポケモンの一覧を確認することができます。' },
        { property: 'og:image', content: process.env.VUE_APP_STATIC_URL + '/pokego/peripper-eyes.png' }
      ]
    }
  }
}
</script>
