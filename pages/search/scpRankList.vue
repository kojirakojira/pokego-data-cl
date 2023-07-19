<template>
  <div>
    <H2Common>
      {{ getSearchPatternName(searchPattern) }}
    </H2Common>
    <v-container>
      <v-row>
        <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
          <v-icon>
            mdi-pen
          </v-icon>
          ポケモン
        </v-col>
        <v-col cols="12" md="8" lg="8" xl="8">
          <v-text-field
            v-model="searchParam.name"
            label="例：ミュウツー"
            outlined
            dense
            rows="1"
            :rules="rules.name"
            :counter="20"
            maxlength="20"
            autocomplete="off"
            @keyup.enter.exact="clickSearchBtn"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
          <v-icon>
            mdi-pen
          </v-icon>
          リーグ
        </v-col>
        <v-col cols="12" md="8" lg="8" xl="8">
          <v-select
            v-model="searchParam.league"
            :items="leagueArr"
            item-value="id"
            item-text="name"
            label="リーグを選択"
            dense
            outlined
            hide-details
          />
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
    <ResultList
      v-if="psr.goPokedexList.length !== 0"
      :psr="psr"
      :search-pattern="searchPattern"
      @clickRow="clickRowResultList"
    />
  </div>
</template>

<script>
import H2Common from '~/components/utils/H2Common'
import SearchCommon from '~/components/search/SearchCommon'
import ResultList from '~/components/search/ResultList'
export default {
  name: 'ScpRankList',
  components: {
    H2Common,
    ResultList
  },
  mixins: [SearchCommon],
  data () {
    return {
      searchPattern: 'scpRankList',
      searchParam: {
        name: '',
        league: 'sl'
      },
      psr: {
        goPokedexList: [],
        maybe: false
      },
      leagueArr: [
        { id: 'sl', name: 'スーパーリーグ' },
        { id: 'hl', name: 'ハイパーリーグ' },
        { id: 'ml', name: 'マスターリーグ' }
      ],
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
      msg += this.$checkRequired({ item: this.searchParam.name, itemName: 'ポケモン' })
      msg += this.$checkRequired({ item: this.searchParam.league, itemName: 'リーグ' })
      return msg
    },
    async get () {
      return await this.$axios
        .get('/api/scpRankList', { params: this.searchParam })
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

      if (resData.success) {
        this.setVuexState(resData)
        this.replaceState(this.searchParam)
        if (resData.pokemonSearchResult.unique) {
          // 1件のみヒットした場合
          this.$router.push({
            name: 'search-result-scpRankListResult',
            query: this.makeQuery(resData.pokedexId),
            params: {
              rd: resData
            }
          })
        } else {
          // 複数件 or 0件ヒットした場合
          this.psr = resData.pokemonSearchResult
          this.isSearchBtnClick = false
        }
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
        { property: 'og:description', content: 'PvP順位のランキングを確認できます。' },
        { property: 'og:image', content: process.env.VUE_APP_STATIC_URL + '/pokego/peripper-eyes.png' }
      ]
    }
  }
}
</script>
