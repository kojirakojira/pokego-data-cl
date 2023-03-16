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
          <template v-for="(value, key, idx) in searchParam">
            <v-text-field
              :key="`name-field-${idx * 1 + 1}`"
              v-model="searchParam[key]"
              :label="`ポケモン${idx * 1 + 1}体目`"
              outlined
              dense
              clearable
              :rules="rules.name"
              :error-messages="errMsgs[idx]"
              :counter="10"
              maxlength="10"
              autocomplete="off"
              @keyup.enter.exact="clickSearchBtn"
            />
          </template>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="py-0" align="right">
          <v-btn
            class="mx-2"
            small
            fab
            color="info"
            elevation="2"
            :disabled="Object.keys(searchParam).length >= 6"
            @click="() => {
              searchParam[`name${Object.keys(searchParam).length + 1}`] = ''
              errMsgs.push('')
            }"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn
            class="mx-2"
            small
            fab
            color="error"
            elevation="2"
            :disabled="Object.keys(searchParam).length <= 2"
            @click="() => {
              delete searchParam[`name${Object.keys(searchParam).length}`]
              errMsgs.pop()
            }"
          >
            <v-icon>mdi-minus</v-icon>
          </v-btn>
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
    <v-dialog
      v-model="dialogFlg"
      scrollable
      max-width="600px"
      persistent
      content-class="dialog-height-100"
    >
      <ResultListDialog
        :psr="psr"
        :psr-arr-idx="psrArrIdx"
        @selected="(psr, gpIdx) => { selected(psr, gpIdx) }"
        @close="() => {
          dialogFlg = false
          isSearchBtnClick = false
        }"
      />
    </v-dialog>
  </div>
</template>

<script>
import H2Common from '~/components/utils/H2Common'
import SearchCommon from '~/components/search/SearchCommon'
import ResultListDialog from '~/components/search/ResultListDialog'
export default {
  name: 'RaceDiff',
  components: {
    H2Common,
    ResultListDialog
  },
  mixins: [SearchCommon],
  data () {
    return {
      searchPattern: 'raceDiff',
      searchParam: {},
      errMsgs: [],
      psrArr: [], // pokemonSearchResultの配列
      psr: {}, // ダイアログに渡す用のpokemonSearchResult
      psrArrIdx: null, // ダイアログに渡したpsrのpsrArrに対するindex
      isSearchBtnClick: false,

      dialogFlg: false // ResultListDialogを表示させるかのフラグ
    }
  },
  mounted () {
    // 初期化処理（mixinsより後に実行される）
    // queryはname1~6しか許容しない。queryが重複する場合は削除する。
    let i = 1
    const tmpSp = {}
    for (const [key, value] of Object.entries(this.searchParam)) {
      if (/^name[1-6]/.test(key) && typeof value === 'string') {
        tmpSp[`name${i}`] = value
        i++
      }
    }
    // searchParamの要素数を2まで増やす。（入力ボックスは最低2こ）
    const loopCount = Object.keys(tmpSp).length
    for (let i = loopCount; i < 2; i++) {
      tmpSp[`name${i * 1 + 1}`] = ''
    }
    this.searchParam = tmpSp

    // searchParamの要素数分errMsgsを初期化する。
    Object.keys(this.searchParam).forEach(() => { this.errMsgs.push('') })
  },
  methods: {
    async clickSearchBtn () {
      this.isSearchBtnClick = true
      this.clearErr()
      const res = await this.get()
      this.handleApiResult(res)
    },
    async get () {
      const nameArr = []
      for (const sp in this.searchParam) {
        nameArr.push(this.searchParam[sp])
      }
      return await this.$axios
        .get('/api/raceDiff' + this.spreadArray({ nameArr }))
        .catch(this.$processUtils.onErrorNot401)
    },
    /**
     * APIのレスポンスを処理する。
     *
     * @param {Object} res
     */
    handleApiResult (res) {
      const resData = res.data
      this.getToast(resData.msr)
      if (this.dispDialog(resData)) {
        return
      }
      this.setVuexState(resData)

      this.$set(this, 'psrArr', resData.msr.psrArr)

      // ヒットしなかった場合エラーメッセージを設定する。
      const hitFlg = this.setErrMsgs(this.psrArr)
      // ヒットしていないnameが存在する場合は処理を中断。
      if (!hitFlg) {
        this.isSearchBtnClick = false
        return
      }

      if (resData.msr.allUnique) {
        // 検索結果がすべてユニークだった場合、種族値比較結果画面へ遷移する。
        this.transResultPage(resData)
      } else {
        // 検索結果が複数の場合は、ダイアログで指定してもらい、一意にする。
        this.makeUnique(this.psrArr)
      }
    },
    /**
     * 検索結果が複数件あるポケモンをダイアログにて開き、ユーザに検索したいポケモンを選択してもらう。
     *
     * @param psrArr
     */
    makeUnique (psrArr) {
      for (const i in psrArr) {
        if (!psrArr[i].unique) {
          // ユニークでないポケモンのpsrを設定
          this.psr = psrArr[i]
          this.psrArrIdx = i * 1
          // ResultListDialogを開く
          this.dialogFlg = true
          return
        }
      }
      // すべてユニークの場合、raceDiffResult画面に遷移する。
      this.transResultPage()
    },
    /**
     * 手動で設定した入力ボックスのエラーをクリアする。
     */
    clearErr () {
      for (const i in this.errMsgs) {
        this.errMsgs[i] = ''
      }
    },
    /**
     * ヒットしなかったnameにエラーメッセージをセットする。
     * すべてヒットした場合はtrue、それ以外はfalseを返却する。
     */
    setErrMsgs (psrArr) {
      let hitFlg = true
      for (const i in psrArr) {
        if (!psrArr[i].hit) {
          this.$set(this.errMsgs, i, psrArr[i].message)
          hitFlg = false
        }
      }
      return hitFlg
    },
    /**
     * ResultListDialogでポケモンが選択された場合の処理。
     *
     * @param psr ResultListDialogに渡したpsr(参照渡しで渡している。)
     * @param gpIdx psr.goPokedexListの何番目が選択されたか。
     */
    selected (psr, gpIdx) {
      // psrの内容を編集する。(検索結果が1件だったことにする。psr.goPokedexListは空にする。)
      psr.unique = true
      psr.goPokedex = JSON.parse(JSON.stringify(psr.goPokedexList[gpIdx]))
      psr.goPokedexList = {}
      // 入力ボックスのポケモン名を更新
      this.searchParam[`name${this.psrArrIdx * 1 + 1}`] = psr.goPokedex.name
      this.dialogFlg = false

      // checkUniqueメソッドを再度呼び出し、次にユニークでないポケモンが存在した場合にダイアログを開く。
      setTimeout(() => { this.makeUnique(this.psrArr) }, 100)
    },
    /**
     * raceDiffResult画面に遷移する。（遷移前にstoreを整理する。）
     *
     * @param resData
     */
    async transResultPage (resData) {
      // queryを更新。
      if (this.isChangeQuery(this.$route.query, this.searchParam)) {
        await this.$router.replace({ name: this.$route.name, query: this.searchParam })
      }

      const query = {}
      for (const i in this.psrArr) {
        query[`pid${i * 1 + 1}`] = this.psrArr[i].goPokedex.pokedexId
      }

      this.$router.push({
        name: 'search-result-raceDiffResult',
        query,
        params: {
          rd: resData
        }
      })
    }
  }
}
</script>
