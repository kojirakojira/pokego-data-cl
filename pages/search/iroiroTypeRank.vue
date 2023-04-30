<template>
  <div>
    <H2Common>
      {{ getSearchPatternName(searchPattern) }}
    </H2Common>
    <v-container v-if="!isLoading">
      <v-row align="center">
        <v-col cols="12" md="5" lg="4" xl="4" class="col-title">
          何のランキングがみたい？
        </v-col>
        <v-col cols="12" md="7" lg="8" xl="8">
          <v-select
            v-model="searchParam.sp"
            :items="iroiroTypeSearchPatternArr"
            item-text="jpn"
            item-value="id"
            clearable
            prepend-icon="mdi-filter-multiple"
            hide-details
          />
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col cols="12" align="center">
          <v-btn
            rounded
            min-width="50%"
            color="success"
            :disabled="isSearchBtnClick"
            @click="clickSearchBtn()"
          >
            検索
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import H2Common from '~/components/utils/H2Common'
import SearchCommon from '~/components/search/SearchCommon'
export default {
  name: 'IroiroTypeRank',
  components: {
    H2Common
  },
  mixins: [SearchCommon],
  data () {
    return {
      searchPattern: 'iroiroTypeRank',
      searchParam: {
        sp: ''
      },
      iroiroTypeSearchPatternArr: [],
      isSearchBtnClick: false,
      isLoading: true
    }
  },
  async beforeMount () {
    const spArr = await this.getSearchPatternArr()
    this.iroiroTypeSearchPatternArr.push(...spArr)
    this.isLoading = false
  },
  methods: {
    async clickSearchBtn () {
      this.isSearchBtnClick = true
      const res = await this.get()
      this.handleApiResult(res)
    },
    async get () {
      // 送信
      return await this.$axios
        .get('/api/iroiroTypeRank', { params: this.searchParam })
        .catch(this.$processUtils.onErrorNot401)
    },
    async getSearchPatternArr () {
      // 送信
      const res = await this.$axios
        .get('/api/iroiroTypeSearchPattern')
        .catch(this.$processUtils.onErrorNot401)
      return Object.entries(res.data).map(([k, v]) => ({ id: k, jpn: v }))
    },
    /**
     * get関数で取得した、APIのレスポンスを処理する。
     *
     * @param {Object} res
     */
    handleApiResult (res) {
      const resData = res.data
      // タイプから検索した場合
      this.replaceState(this.searchParam)
      this.$router.push({
        name: 'search-result-iroiroTypeRankResult',
        query: this.makeQuery(),
        params: {
          rd: resData
        }
      })
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
        { property: 'og:description', content: 'タイプについての色々なランキングを確認することができます。' },
        { property: 'og:image', content: process.env.VUE_APP_STATIC_URL + '/pokego/peripper-eyes.png' }
      ]
    }
  }
}
</script>

<style lang="scss" >
.arrow-down {
  transform: rotate(90deg);

  @include display_pc {
    transform: rotate(0deg);
  }
}
</style>
