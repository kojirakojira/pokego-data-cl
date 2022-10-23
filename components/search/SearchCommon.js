export default {
  data () {
    return {
      searchPatternNames: {
        raid: 'レイドボスのCP検索',
        fRTask: 'フィールドリサーチCP',
        scpRankList: 'PvP順位一覧',
        scpRankMaxMin: 'PvP最高(最低)順位個体値',
        scpRank: 'PvP順位'
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
      // 検索結果画面でない場合
      const searchState = this.$store.getters.searchState
      if (searchState && searchState.routeName === routeName) {
        // 画面復元用オブジェクトが存在し、routeNameが一致する場合
        if (searchState.searchParam) {
          // stateを直接更新しないようにするため、ディープコピー
          this.$set(this, 'searchParam', JSON.parse(JSON.stringify(searchState.searchParam)))
        }
        if (searchState.psr) {
          // stateを直接更新しないようにするため、ディープコピー
          this.$set(this, 'psr', JSON.parse(JSON.stringify(searchState.psr)))
        }
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
    getToast (resData) {
      let msg = ''
      if (resData.message) {
        msg = resData.message
      } else if (resData.pokemonSearchResult.message) {
        msg = resData.pokemonSearchResult.message
      }
      if (msg) {
        this.$store.dispatch('getToast', { msg })
        this.isSearchBtnClick = false
      }
    },
    setSearchState (resData) {
      // 検索結果が0件の場合
      if (!resData.pokemonSearchResult.goPokedexList.length) {
        return
      }

      const searchState = {} // 画面復元用オブジェクト
      if (!resData.pokemonSearchResult.unique) {
        // 画面復元用のオブジェクトにpsrを設定（一覧表示のため。複数件ヒットした場合のみ。）
        searchState.psr = resData.pokemonSearchResult
      }
      searchState.routeName = this.$route.name
      searchState.searchParam = this.searchParam
      this.$store.dispatch('setSearchState', JSON.parse(JSON.stringify(searchState)))
    },
    isChangeQuery (before, after) {
      let bool = false
      for (const p in after) {
        if (before[p] !== after[p]) {
          bool = true
          break
        }
      }
      return bool
    }
  }
}
