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
            :rules="rules.name"
            :counter="10"
            maxlength="10"
            autocomplete="off"
            clearable
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
  name: 'Evolution',
  components: {
    H2Common,
    ResultList
  },
  mixins: [SearchCommon],
  data () {
    return {
      searchPattern: 'evolution',
      searchParam: {
        name: ''
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
      return this.$checkRequired({ item: this.searchParam.name, itemName: 'ポケモン' })
    },
    async get () {
      return await this.$axios
        .get('/api/evolution', { params: this.searchParam })
        .catch(this.$processUtils.onErrorNot401)
    },
    /**
     * APIのレスポンスを処理する。
     *
     * @param {Object} res
     */
    handleApiResult (res) {
      const resData = res.data
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
            name: 'search-result-evolutionResult',
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
        { property: 'og:title', content: this.getSearchPatternName(this.searchPattern) },
        { property: 'og:url', content: process.env.VUE_APP_URL + this.$route.path },
        { property: 'og:site_name', content: 'ペリずかん' },
        { property: 'og:description', content: '特定のポケモンの進化ツリーを確認できます。' },
        { property: 'og:image', content: process.env.VUE_APP_STATIC_URL + '/pokego/peripper-eyes.png' }
      ]
    }
  }
}
</script>
