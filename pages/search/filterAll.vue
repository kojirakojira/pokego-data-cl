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
    clickSearchBtn () {
      this.isSearchBtnClick = true
      this.get()
      this.isSearchBtnClick = false
    },
    async get () {
      await this.$axios
        .get('/api/filterAll' + this.spreadArray(this.searchParam))
        .then((res) => {
          const resData = res.data
          this.getToast(resData.pfr)
          if (this.dispDialog(resData)) {
            return
          }
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
        })
        .catch(this.$processUtils.onErrorNot401)
    }
  }
}
</script>
