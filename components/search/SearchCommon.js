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
      // if (this.searchParam) {
      //   Object.entries(this.searchParam).forEach(([k, v]) => {
      //     console.log(`${k}: ${typeof v}`)
      //     console.log(v)
      //   })
      // }
      if (this.$route.query) {
        for (const [k, v] of Object.entries(this.$route.query)) {
          let value = null
          if (typeof this.searchParam[k] === 'boolean') {
            value = v !== 'false'
          } else if (Array.isArray(this.searchParam[k])) {
            value = []
            value.push(...v)
          } else {
            value = v
          }
          this.$set(this.searchParam, k, value)
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
    /**
     * ダイアログを表示する。
     * resData.msgLevelが'error'の場合はtrueを返却する。
     *
     * @param {Object} resData
     * @returns
     */
    dispDialog (resData) {
      if (resData.message) {
        // メッセージがある場合はalertで表示する。
        alert(resData.message)
      }
      if (resData.msgLevel === 'error') {
        // errorの場合は画面を描画せず前画面に戻す。
        this.$router.back()
        return true
      }
      return false
    },
    getToast (resData) {
      const msg = resData.pokemonSearchResult.message ? resData.pokemonSearchResult.message : ''
      if (msg) {
        this.$store.dispatch('getToast', { msg })
        this.isSearchBtnClick = false
      }
    },
    getToastForMulti (resData) {
      const msg = resData.msr.message ? resData.msr.message : ''
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
    setVuexState (resData) {
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
     * ResultListでポケモンを選択したときの処理
     * @param {String} pid
     * @see ResultList.vue
     */
    clickRowResultList (pid) {
      // 遷移前の画面のqueryを更新しておく
      this.replaceState(this.searchParam)
      // 遷移後の画面のqueryを作成する
      const query = this.makeQuery(pid)
      // 遷移
      this.$router.push({
        name: `search-result-${this.searchPattern}Result`,
        query
      })
    },
    /**
     * Result画面用のquery（連想配列）を作成する。
     * 遷移前の画面のクエリからnameを削除。pidを追加して返却する。
     * @param {String} pid
     * @returns {Object} query
     */
    makeQuery (pid) {
      const query = {}
      const urlSearchParams = new URLSearchParams(location.search)
      for (const [k, v] of urlSearchParams.entries()) {
        if (query[k]) {
          // queryパラメータにキーが重複している場合は、配列を表現している。
          if (Array.isArray(query[k])) {
            // 既に配列に入っている場合
            query[k].push(v)
          } else {
            // 配列でない場合は配列を作成して追加する。
            const tmpV = query[k]
            query[k] = [tmpV, v]
          }
        } else {
          // 配列項目以外のすべての場合
          query[k] = v
        }
      }

      query.pid = pid
      delete query.name

      return query
    },
    /**
     * APIへのGET送信用。配列があった場合展開する。
     * 例：values=[a, b]→values=a&values=b
     *
     * @param {Object} dictionary
     * @returns {String} queryStr
     */
    spreadArray (dictionary) {
      const entries = Object.entries(dictionary)
      if (!entries.length) {
        return ''
      }
      let queryStr = '?'
      entries.forEach(([k, v]) => {
        if (v) {
          if (Array.isArray(v)) {
            v.forEach((e) => {
              queryStr += `${k}=${e}&`
            })
          } else {
            queryStr += `${k}=${v}&`
          }
        }
      })
      return queryStr.slice(0, -1)
    },
    /**
     * クエリパラメータを更新する。
     *
     * @param {Object} searchParam
     */
    replaceState (searchParam) {
      const url = new URL(window.location)
      url.search = this.spreadArray(searchParam)
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
