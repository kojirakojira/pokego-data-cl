export default {
  data () {
    return {
      searchPatternNames: {
        raid: 'レイドボスのCP検索'
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
    if (!/search-resultList/.test(routeName) && !/search-result-[A-Z,a-z,0-9]*Result/.test(routeName)) {
      // 検索結果一覧画面または、検索結果画面でない場合は、storeのpsrStateを削除する。
      this.$store.dispatch('setPsrState', null)
    }
  },
  methods: {
    getSearchPatternName (searchPattern) {
      return this.searchPatternNames[searchPattern]
    }
  }
}
