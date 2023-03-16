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
      let msg = ''
      msg += this.$checkRequired({ item: this.searchParam.name, itemName: 'ポケモン' })
      msg += this.$checkRequired({ item: this.searchParam.league, itemName: 'リーグ' })
      return msg
    },
    async get () {
      await this.$axios
        .get('/api/scpRankList', { params: this.searchParam })
        .then((res) => {
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
        })
        .catch(this.$processUtils.onErrorNot401)
    }
  }
}
</script>
