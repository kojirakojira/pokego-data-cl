export default {
  data () {
    return {
      searchPatternNames: {
        raid: 'レイドボスのCP検索',
        scpRankList: 'PvP順位一覧',
        scpRankMaxMin: 'PvP最高(最低)順位個体値'
      },
      rules: {
        name: [
          v =>
            (v || '').length <= 10 || 'ポケモンは10文字以内で入力してください。'
        ]
      }
    }
  },
  filters: {
    dispPdx (pdxId) {
      return pdxId ? Number(('' + pdxId).substring(0, 4)) : ''
    }
  },
  mounted () {
    const routeName = this.$route.name
    if (!/search-result-[A-Z,a-z,0-9]*Result/.test(routeName)) {
      const searchState = this.$store.getters.searchState
      if (searchState && searchState.routeName === routeName) {
        if (searchState.searchParam) { this.$set(this, 'searchParam', searchState.searchParam) }
        if (searchState.psr) { this.$set(this, 'psr', searchState.psr) }
      }
    }
  },
  methods: {
    getSearchPatternName (searchPattern) {
      return this.searchPatternNames[searchPattern]
    },
    pushResultList (resData, searchParam) {
      searchParam.sp = this.searchPattern
      this.$router.push({
        name: 'search-result-resultList',
        query: searchParam,
        params: {
          psr: resData.pokemonSearchResult
        }
      })
    },
    setSearchState (resData) {
      const searchState = {} // 画面復元用オブジェクト
      if (!resData.pokemonSearchResult.unique) {
        // 画面復元用のオブジェクトにpsrを設定（一覧表示のため。複数件ヒットした場合のみ。）
        searchState.psr = this.psr
      }
      searchState.routeName = this.$route.name
      searchState.searchParam = this.searchParam
      this.$store.dispatch('setSearchState', searchState)
    },
    isChangeQuery (before, after) {
      let bool = true
      for (const b in before) {
        if (b !== after[b]) {
          bool = false
        }
      }
      return bool
    }
  }
}
