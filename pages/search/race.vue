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
            :counter="10"
            maxlength="10"
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
    <FilterInputField
      :search-param="searchParam"
      :show-area="showFilterArea"
      :is-search-btn-click="isSearchBtnClick"
      @showArea="showFilterArea = !showFilterArea"
      @click="clickSearchBtn()"
    />
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
import FilterInputField from '~/components/search/FilterInputField'
export default {
  name: 'Race',
  components: {
    H2Common,
    ResultList,
    FilterInputField
  },
  mixins: [SearchCommon],
  data () {
    return {
      searchPattern: 'race',
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
      psr: {
        goPokedexList: [],
        maybe: false
      },
      labels: ['HP', 'こうげき', 'ぼうぎょ'],

      showFilterArea: false,
      isSearchBtnClick: false
    }
  },
  methods: {
    clickSearchBtn () {
      this.isSearchBtnClick = true
      const msg = this.check()
      if (msg) {
        alert(msg)
        this.isSearchBtnClick = false
        return
      }
      this.get()
      this.showFilterArea = false
    },
    check () {
      return this.$checkRequired({ item: this.searchParam.name, itemName: 'ポケモン' })
    },
    async get () {
      await this.$axios
        .get('/api/race' + this.spreadArray(this.searchParam))
        .then((res) => {
          const resData = res.data
          this.getToast(resData)
          if (this.dispDialog(resData)) {
            return
          }
          if (resData.success) {
            this.setVuexState(resData)
            this.replaceState(this.searchParam)
            if (resData.pokemonSearchResult.unique) {
              // 1件のみヒットした場合
              this.$router.push({
                name: 'search-result-raceResult',
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
        })
        .catch((err) => {
          if (err.response.status !== 401) {
            alert('何らかのエラーが発生しました。')
            this.$router.back()
          }
        })
    }
  }
}
</script>
