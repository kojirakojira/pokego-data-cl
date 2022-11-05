export default {
  data () {
    return {
      searchPatternNames: {
        raid: 'レイドボスCP',
        fRTask: 'フィールドリサーチCP',
        scpRank: 'PvP順位',
        scpRankList: 'PvP順位一覧',
        scpRankMaxMin: 'PvP最高(最低)順位',
        race: '種族値検索',
        raceDiff: '種族値比較',
        plList: 'PLごとのCP一覧',
        unimplPokemon: '未実装ポケモン一覧'
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
        if (searchState.psr) {
          // stateを直接更新しないようにするため、ディープコピー
          this.$set(this, 'psr', JSON.parse(JSON.stringify(searchState.psr)))
        }
      }
    }
    // queryをsearchParamに反映する
    if (this.$route.query) {
      this.searchParam = {}
      for (const [key, value] of Object.entries(this.$route.query)) {
        this.searchParam[key] = value
      }
    }
  },
  methods: {
    getSearchPatternName (searchPattern) {
      return this.searchPatternNames[searchPattern]
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
      const searchState = {} // 画面復元用オブジェクト
      if (resData.pokemonSearchResult) {
        // psrを使用している場合

        if (!resData.pokemonSearchResult.goPokedexList.length) {
          // 検索結果が0件の場合
          return
        }

        if (!resData.pokemonSearchResult.unique) {
        // 画面復元用のオブジェクトにpsrを設定（一覧表示のため。複数件ヒットした場合のみ。）
          searchState.psr = resData.pokemonSearchResult
        }
      }
      searchState.routeName = this.$route.name
      searchState.searchParam = this.searchParam
      this.$store.dispatch('setSearchState', JSON.parse(JSON.stringify(searchState)))
    },
    isChangeQuery (before, after) {
      let bool = false
      // 相互比較
      Object.entries(before).forEach(([k, v]) => { if (before[k] !== after[k]) { bool = true } })
      Object.entries(after).forEach(([k, v]) => { if (before[k] !== after[k]) { bool = true } })
      return bool
    }
  }
}
