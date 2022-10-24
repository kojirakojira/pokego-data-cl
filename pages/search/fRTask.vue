<template>
  <div>
    <v-container>
      <p />
      <H2Common>
        {{ getSearchPatternName(searchPattern) }}
      </H2Common>
    </v-container>
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
    <ResultList
      v-if="psr.goPokedexList.length !== 0"
      :psr="psr"
      :search-pattern="searchPattern"
    />
  </div>
</template>

<script>
import H2Common from '~/components/utils/H2Common'
import SearchCommon from '~/components/search/SearchCommon'
import ResultList from '~/components/search/ResultList'
export default {
  name: 'FRTask',
  components: {
    H2Common,
    ResultList
  },
  mixins: [SearchCommon],
  data () {
    return {
      searchPattern: 'fRTask',
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
    clickSearchBtn () {
      this.isSearchBtnClick = true
      const msg = this.check()
      if (msg) {
        alert(msg)
        this.isSearchBtnClick = false
        return
      }
      this.get()
    },
    check () {
      return this.$checkRequired(this.searchParam.name, null, 'ポケモン')
    },
    async get () {
      await this.$axios
        .get('/api/fRTask', { params: this.searchParam })
        .then((res) => {
          const resData = res.data
          this.getToast(resData)
          if (resData.success) {
            this.setSearchState(resData)
            if (resData.pokemonSearchResult.unique) {
            // 1件のみヒットした場合
              this.$router.push({
                name: 'search-result-fRTaskResult',
                query: {
                  pid: resData.pokedexId
                },
                params: {
                  rd: resData
                }
              })
            } else {
              // 複数件 or 0件ヒットした場合
              this.psr = resData.pokemonSearchResult
              if (this.isChangeQuery(this.$route.query, this.searchParam)) {
                this.$router.replace({ name: this.$route.name, query: this.searchParam })
              }
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
