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
          個体値
        </v-col>
        <v-col cols="12" md="8" lg="8" xl="8">
          <v-text-field
            v-model="searchParam.iv"
            label="例：101508(攻撃,防御,HPを6桁で入力)"
            outlined
            dense
            :rules="rules.iv"
            :counter="6"
            maxlength="6"
            autocomplete="off"
            type="number"
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
  name: 'PlList',
  components: {
    H2Common,
    ResultList
  },
  mixins: [SearchCommon],
  data () {
    return {
      searchPattern: 'plList',
      searchParam: {
        name: '',
        iv: ''
      },
      psr: {
        goPokedexList: [],
        maybe: false
      },
      rules: {
        iv: [
          v =>
            ((v || '').length === 6 || (v || '').length === 0) || '個体値は6桁で入力してください。'
        ]
      },
      ivNames: ['攻撃', '防御', 'HP'],
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
      msg += this.$checkRequired({ item: this.searchParam.iv, itemName: '個体値' })
      msg += this.checkIv(this.searchParam.iv)
      return msg
    },
    async get () {
      await this.$axios
        .get('/api/plList', {
          params: {
            name: this.searchParam.name,
            iva: this.searchParam.iv.substring(0, 2),
            ivd: this.searchParam.iv.substring(2, 4),
            ivh: this.searchParam.iv.substring(4, 6)
          }
        })
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
                name: 'search-result-plListResult',
                query: {
                  pid: resData.pokedexId,
                  iv: this.getIvString(resData)
                },
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
    },
    checkIv (iv) {
      let msg = ''
      if (!iv) { return msg }

      if (iv.length !== 6 || isNaN(iv)) {
        msg = '「個体値」は数値6桁で入力してください。'
        return msg
      }

      const ivArr = [iv.substring(0, 2), iv.substring(2, 4), iv.substring(4, 6)]
      for (const i in ivArr) {
        if (!(ivArr[i] >= 0 && ivArr[i] <= 15)) {
          msg += `${this.ivNames[i]}は0~15の間で入力してください。\n`
        }
      }
      return msg
    },
    getIvString (resData) {
      const zeroPud = (val) => { return ('00' + val).slice(-2) }
      return zeroPud(resData.iva) + zeroPud(resData.ivd) + zeroPud(resData.ivh)
    }
  }
}
</script>

<style>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
input[type="number"] {
  -moz-appearance:textfield;
}
</style>
