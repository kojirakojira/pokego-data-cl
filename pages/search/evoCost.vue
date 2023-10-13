<template>
  <div>
    <H2Common>
      {{ getSearchPatternName(searchPattern) }}
    </H2Common>
    <v-container>
      <v-row>
        <v-col>
          <h3>進化コストから一覧を確認する</h3>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
          進化コストを選択
        </v-col>
        <v-col cols="12" md="8" lg="8" xl="8">
          <v-radio-group v-model="searchParam.costs" row>
            <v-radio label="アメの個数ごとの一覧を表示します。" value="candy" />
            <v-radio label="条件（進化アイテム等）ごとの一覧を表示します。" value="othrCosts" />
          </v-radio-group>
        </v-col>
      </v-row>
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
  name: 'EvoCost',
  components: {
    H2Common
  },
  mixins: [SearchCommon],
  data () {
    return {
      searchPattern: 'evoCost',
      searchParam: {
        costs: 'candy'
      },
      isSearchBtnClick: false
    }
  },
  methods: {
    async clickSearchBtn () {
      this.isSearchBtnClick = true
      const msg = this.check()
      if (msg) {
        alert(msg)
        this.isSearchBtnClick = false
        return
      }
      const res = await this.get()
      this.handleApiResult(res)
    },
    check () {
      let msg = ''
      if (this.poke) {
        msg += this.$checkRequired({ item: this.searchParam.name, itemName: 'ポケモン' })
      }
      return msg
    },
    async get () {
      return await this.$axios
        .get('/api/evoCost', { params: this.searchParam })
    },
    /**
     * APIのレスポンスを処理する。
     *
     * @param {Object} res
     */
    handleApiResult (res) {
      console.log(res)
      const resData = res.data

      // 個別機能由来のメッセージ
      if (!this.getToast(resData.message, resData.msgLevel)) {
        return
      }

      if (resData.success) {
        this.setVuexState(resData)
        this.replaceState(this.searchParam)
        this.$router.push({
          name: 'search-result-evoCostResult',
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
        { property: 'og:description', content: 'ポケモンの進化条件を確認することができます。アメでの絞り込みと、特殊な進化条件を持つポケモンの一覧の確認ができます。' },
        { property: 'og:image', content: process.env.VUE_APP_STATIC_URL + '/pokego/peripper-eyes.png' }
      ]
    }
  }
}
</script>
