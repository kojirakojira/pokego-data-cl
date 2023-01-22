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
        unimplPokemon: '未実装ポケモン一覧',
        evolution: '進化ツリーと別のすがた'
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
    // 画面を復元する。
    const routeName = this.$route.name
    if (!/search-result-[A-Z,a-z,0-9]*Result/.test(routeName)) {
      // 検索結果画面でない場合

      // クエリパラメータから検索パラメータを復元する。
      if (this.$route.query) {
        this.searchParam = {}
        for (const [key, value] of Object.entries(this.$route.query)) {
          this.searchParam[key] = value
        }
      }

      // Vuexからpsrを復元する。
      const searchState = this.$store.getters.searchState
      if (searchState && searchState.psr && searchState.routeName === routeName) {
        // stateを直接更新しないようにするため、ディープコピー
        this.$set(this, 'psr', JSON.parse(JSON.stringify(searchState.psr)))
      }
    }
  },
  methods: {
    getSearchPatternName (searchPattern) {
      return this.searchPatternNames[searchPattern]
    },
    appendRemarks (name, remarks) {
      let val = name
      if (remarks) {
        val = val + `(${remarks})`
      }
      return val
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
    /**
     * Vuex(ローカルストレージ)に"SearchState"をセットする。
     * 検索パターン(routeName)、検索パラメータ(searchParam)、ポケモン検索結果（psr)を設定する。
     *
     * @param {Object} resData
     * @returns
     */
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
    /**
     * クエリパラメータを更新する。
     *
     * @param {Object} searchParam
     */
    replaceState (searchParam) {
      const url = new URL(window.location)
      Object.entries(searchParam).forEach(([k, v]) => {
        url.searchParams.set(k, v)
      })
      window.history.replaceState({}, '', url)
    },
    /**
     * クエリパラメータに差分があるかどうかを判定する。
     *
     * @param {Object} before
     * @param {Object} after
     * @returns
     */
    isChangeQuery (before, after) {
      let bool = false
      // 相互比較
      Object.entries(before).forEach(([k, v]) => { if (before[k] !== after[k]) { bool = true } })
      Object.entries(after).forEach(([k, v]) => { if (before[k] !== after[k]) { bool = true } })
      return bool
    }
  }
}
