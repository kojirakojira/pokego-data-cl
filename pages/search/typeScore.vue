<template>
  <div>
    <H2Common>
      {{ getSearchPatternName(searchPattern) }}
    </H2Common>
    <v-container>
      <v-row>
        <v-col>
          <v-btn
            rounded
            small
            color="info"
            @click="searchParam.isPoke = !searchParam.isPoke"
          >
            <v-icon small>
              mdi-swap-horizontal
            </v-icon>
            入力方法を切り替える
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-show="!searchParam.isPoke" align="center">
        <v-col cols="12" md="5" lg="4" xl="4" class="col-title">
          <v-icon>
            mdi-pen
          </v-icon>
          タイプ
        </v-col>
        <v-col cols="12" md="7" lg="8" xl="8">
          <v-select
            v-model="searchParam.type1"
            :items="$CONST.TYPE"
            item-text="v"
            item-value="k"
            clearable
            prepend-icon="mdi-filter-multiple"
            hide-details
          />
        </v-col>
      </v-row>
      <v-row v-show="!searchParam.isPoke">
        <v-spacer />
        <v-col cols="12" md="7" lg="8" xl="8">
          <v-select
            v-model="searchParam.type2"
            :items="$CONST.TYPE"
            item-text="v"
            item-value="k"
            clearable
            prepend-icon="mdi-filter-multiple"
            hide-details
          />
        </v-col>
      </v-row>
      <v-row v-show="searchParam.isPoke">
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
      v-if="searchParam.isPoke && psr.goPokedexList.length !== 0"
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
  name: 'TypeScore',
  components: {
    H2Common,
    ResultList
  },
  mixins: [SearchCommon],
  data () {
    return {
      searchPattern: 'typeScore',
      searchParam: {
        type1: '',
        type2: '',
        name: '',
        isPoke: false
      },
      psr: {
        goPokedexList: [],
        maybe: false
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
      if (this.searchParam.isPoke) {
        msg += this.$checkRequired({ item: this.searchParam.name, itemName: 'ポケモン' })
      } else if (!this.searchParam.type1 && !this.searchParam.type2) {
        msg += '「タイプ」は少なくともどちらか一方を入力してください。'
      }

      return msg
    },
    async get () {
      const requestParam = {}
      // リクエストで送信する値を作成
      if (this.searchParam.isPoke) {
        requestParam.name = this.searchParam.name
      } else {
        requestParam.type1 = this.searchParam.type1
        requestParam.type2 = this.searchParam.type2
      }

      // 送信
      return await this.$axios
        .get('/api/typeScore', { params: requestParam })
    },
    /**
     * APIのレスポンスを処理する。
     *
     * @param {Object} res
     */
    handleApiResult (res) {
      const resData = res.data
      if (resData.executedType) {
        const query = {}
        if (this.searchParam.type1) { query.type1 = this.searchParam.type1 }
        if (this.searchParam.type2) { query.type2 = this.searchParam.type2 }
        // タイプから検索した場合
        this.replaceState(this.searchParam)
        this.$router.push({
          name: 'search-result-typeScoreResult',
          query,
          params: {
            rd: resData
          }
        })
      } else {
        // ポケモンから検索した場合
        this.getToast(resData.pokemonSearchResult)
        if (this.dispDialog(resData)) {
          return
        }
        if (resData.success) {
          this.setVuexState(resData)
          this.replaceState(this.searchParam)
          if (resData.pokemonSearchResult.unique) {
          // 1件のみヒットした場合
            this.$router.push({
              name: 'search-result-typeScoreResult',
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
        { property: 'og:description', content: 'タイプの評価を確認することができます。※評価ロジックは当サイト独自です。' },
        { property: 'og:image', content: process.env.VUE_APP_STATIC_URL + '/pokego/peripper-eyes.png' }
      ]
    }
  }
}
</script>
