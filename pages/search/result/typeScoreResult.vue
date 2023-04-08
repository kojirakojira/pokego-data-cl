<template>
  <div>
    <H2Common>
      {{ getSearchPatternName('typeScore') }}
    </H2Common>
    <div v-if="!isLoading">
      <v-container v-if="resData.name">
        <v-row>
          <v-col>
            {{ `ポケモン：${appendRemarks(resData.name, resData.remarks)}` }}
          </v-col>
        </v-row>
      </v-container>
      <v-container v-if="resData.typeComments">
        <v-row>
          <v-col>
            <TypeComments :comments="resData.typeComments" />
          </v-col>
        </v-row>
      </v-container>
      <h3>
        評価
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs}">
            <v-icon
              small
              v-bind="attrs"
              v-on="on"
            >
              mdi-help-circle
            </v-icon>
          </template>
          <span>有利・不利タイプの数から加点・減点し、タイプごとの評価を算出しています。</span>
        </v-tooltip>
      </h3>
      <v-container>
        <v-row>
          <v-col class="col-title">
            こうげき時のタイプ評価
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col class="pa-3">
            タイプ1:
            <span :style="`background-color: ${$editUtils.getRGB(type1)};'}`" class="type">
              {{ $CONST.getValue(type1, $CONST.TYPE) }}
            </span>
          </v-col>
          <v-col>
            <div class="rating">
              <v-rating v-model="score.attacker1" half-increments readonly dense />
              <span class="pl-2">{{ resData.attacker1Score + '点' }}</span>
            </div>
          </v-col>
        </v-row>
        <v-row v-if="type2" align="center">
          <v-col class="pa-3">
            タイプ2:
            <span :style="`background-color: ${$editUtils.getRGB(type2)};'}`" class="type">
              {{ $CONST.getValue(type2, $CONST.TYPE) }}
            </span>
          </v-col>
          <v-col>
            <div class="rating">
              <v-rating v-model="score.attacker2" half-increments readonly dense />
              <span class="pl-2">{{ resData.attacker2Score + '点' }}</span>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="col-title">
            ぼうぎょ時のタイプ評価
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col class="pa-3">
            タイプ:
            <span :style="`background-color: ${$editUtils.getRGB(type1)};'}`" class="type">
              {{ $CONST.getValue(type1, $CONST.TYPE) }}
            </span>
            <span v-if="type2" :style="`background-color: ${$editUtils.getRGB(type2)};'}`" class="type">
              {{ $CONST.getValue(type2, $CONST.TYPE) }}
            </span>
          </v-col>
          <v-col>
            <div class="rating">
              <v-rating v-model="score.defender" half-increments readonly dense />
              <span class="pl-2">{{ resData.defenderScore + '点' }}</span>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <h3>こうげき倍率</h3>
      <v-container class="pa-0">
        <v-row>
          <v-col cols="12" md="6" lg="6" xl="6">
            <div class="pa-3">
              タイプ1:
              <span :style="`background-color: ${$editUtils.getRGB(type1)};'}`" class="type">
                {{ $CONST.getValue(type1, $CONST.TYPE) }}
              </span>
            </div>
            <v-container class="atk-dmg-mult-type1-table">
              <v-row v-for="dp in atkDmgMultArr" :key="`atk-dmg-mult-type1-${dp.name}`">
                <v-col cols="4">
                  {{ dp.dmgMult }}
                </v-col>
                <v-col cols="8">
                  <span
                    v-for="(type, idx) in resData.attackerType1Map[dp.name]"
                    :key="`atk-dmg-mult-type1-${type}`"
                    :style="`background-color: ${$editUtils.getRGB(type)}; ${idx === 0 ? '': 'margin-left:5px;'}`"
                    class="type"
                  >
                    {{ $CONST.getValue(type, $CONST.TYPE) }}
                  </span>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
          <v-col v-if="type2" cols="12" md="6" lg="6" xl="6">
            <div class="pa-3">
              タイプ2:
              <span :style="`background-color: ${$editUtils.getRGB(type2)};'}`" class="type">
                {{ $CONST.getValue(type2, $CONST.TYPE) }}
              </span>
            </div>
            <v-container class="atk-dmg-mult-type2-table">
              <v-row v-for="dp in atkDmgMultArr" :key="`atk-dmg-mult-type2-${dp.name}`">
                <v-col cols="4">
                  {{ dp.dmgMult }}
                </v-col>
                <v-col cols="8">
                  <span
                    v-for="(type, idx) in resData.attackerType2Map[dp.name]"
                    :key="`atk-dmg-mult-type2-${type}`"
                    :style="`background-color: ${$editUtils.getRGB(type)}; ${idx === 0 ? '': 'margin-left:5px;'}`"
                    class="type"
                  >
                    {{ $CONST.getValue(type, $CONST.TYPE) }}
                  </span>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
      <h3>ぼうぎょ倍率</h3>
      <div>
        <div class="pa-3">
          タイプ1:
          <span :style="`background-color: ${$editUtils.getRGB(type1)};'}`" class="type">
            {{ $CONST.getValue(type1, $CONST.TYPE) }}
          </span>
          <div v-if="type2">
            タイプ2:
            <span :style="`background-color: ${$editUtils.getRGB(type2)};'}`" class="type">
              {{ $CONST.getValue(type2, $CONST.TYPE) }}
            </span>
          </div>
        </div>
        <v-container class="def-dmg-mult-table" style="margin-bottom: 36px;">
          <v-row v-for="dp in defDmgMultArr" :key="`def-dmg-mult-${dp.name}`">
            <v-col cols="4">
              {{ dp.dmgMult }}
            </v-col>
            <v-col cols="8">
              <span
                v-for="(type, idx) in resData.defenderTypeMap[dp.name]"
                :key="`def-dmg-mult-${type}`"
                :style="`background-color: ${$editUtils.getRGB(type)}; ${idx === 0 ? '': 'margin-left:5px;'}`"
                class="type"
              >
                {{ $CONST.getValue(type, $CONST.TYPE) }}
              </span>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
    <div v-else>
      <Loading split-scr />
    </div>
  </div>
</template>

<script>
import H2Common from '~/components/utils/H2Common'
import SearchCommon from '~/components/search/SearchCommon'
import Loading from '~/components/Loading'
import TypeComments from '~/components/search/TypeComments'
export default {
  name: 'TypeScoreResult',
  components: {
    H2Common,
    Loading,
    TypeComments
  },
  mixins: [SearchCommon],
  data () {
    return {
      type1: null,
      type2: null,
      id: null, // pokedexId
      resData: {},
      score: {
        attacker1: null,
        attacker2: null,
        defender: null
      },

      atkDmgMultArr: [
        { name: 'HIGH', dmgMult: '×1.6' },
        { name: 'LOW', dmgMult: '×0.625' },
        { name: 'VERY_LOW', dmgMult: '×0.390625' }],
      defDmgMultArr: [
        { name: 'MAX', dmgMult: '×2.56' },
        { name: 'HIGH', dmgMult: '×1.6' },
        { name: 'LOW', dmgMult: '×0.625' },
        { name: 'VERY_LOW', dmgMult: '×0.390625' },
        { name: 'MIN', dmgMult: '×0.244140625' }],
      styleIdArr: [],
      isLoading: true
    }
  },
  beforeDestroy () {
    // 作成したstyleをすべて削除する
    this.$editUtils.deleteStyleElem(this.styleIdArr)
  },
  async beforeMount () {
    this.id = this.$route.query.pid
    this.type1 = this.$route.query.type1
    this.type2 = this.$route.query.type2
    let resData = this.$route.params.rd

    if (!resData) {
      // paramsでresDataが渡されていない場合は、APIから取得してから表示する
      resData = await this.get()
    }

    if (!resData) {
      // resDataを取得できなかった場合
      return
    }
    console.log(resData)
    // API側の仕様として、タイプ1に値がなく、タイプ2に値がある場合は、タイプ2にタイプ1の値が設定される。
    // そのため、再セットする。
    this.type1 = resData.type1
    this.type2 = resData.type2

    this.score = this.setScore(resData)
    this.createStyleElem()
    this.resData = resData
    this.isLoading = !this.resData
  },
  methods: {
    async get () {
      const reqParam = {}
      if (this.id) { reqParam.id = this.id }
      if (this.type1) { reqParam.type1 = this.type1 }
      if (this.type2) { reqParam.type2 = this.type2 }
      const res = await this.$axios
        .get('/api/typeScore', {
          params: reqParam
        })
        .catch(this.$processUtils.onErrorNot401)
      const resData = res.data
      if (this.dispDialog(resData)) {
        return
      }
      return resData
    },
    setScore (resData) {
      // 2捨3入の関数
      const round2to3 = (score) => { return Math.round(score * 2) / 2 }
      const score = {
        attacker1: round2to3(resData.attacker1Score),
        attacker2: round2to3(resData.attacker2Score),
        defender: round2to3(resData.defenderScore)
      }
      return score
    },
    /**
     * ポケモンのタイプの色を使用し、テーブルのstyleを動的に設定します。
     */
    createStyleElem () {
      // こうげきのタイプ１のstyle
      this.createTableStyle(
        'atk-dmg-mult-type1-table',
        this.$editUtils.getRGB(this.type1),
        this.$editUtils.getRGBA(0.1, this.type1))

      // こうげきのタイプ２のstyle
      if (this.type2) {
        this.createTableStyle(
          'atk-dmg-mult-type2-table',
          this.$editUtils.getRGB(this.type2),
          this.$editUtils.getRGBA(0.1, this.type2))
      }

      // ぼうぎょのタイプ１のstyle
      this.createTableStyle(
        'def-dmg-mult-table',
        this.$editUtils.getRGB(this.type1, this.type2),
        this.$editUtils.getRGBA(0.1, this.type1, this.type2))
    },
    /**
     * テーブルのスタイルを生成します。
     *
     * @param {String} idPrefix HTMLにスタイルを追加する際のidのprefix
     * @param {String} rgb 色
     * @param {String} rgba 色（透明度つき）
     */
    createTableStyle (idPrefix, rgb, rgba) {
      let id = `${idPrefix}-header`
      let style
      // 項目名
      style = `.${idPrefix} .row .col:first-child { background: ${rgb}}`
      this.$editUtils.createStyleElem(id, style, this.styleIdArr)

      // 項目値の背景色を交互に
      id = `${idPrefix}-odd`
      style = `.${idPrefix} .row:nth-child(odd) .col:not(:first-child) { background: ${rgba}}`
      this.$editUtils.createStyleElem(id, style, this.styleIdArr)
    }
  }
}
</script>

<style lang="scss" scoped>
.rating {
  display: flex;
  align-items: center;
}
.atk-dmg-mult-type1-table, .atk-dmg-mult-type2-table, .def-dmg-mult-table {
  border: medium solid grey;
  border-radius: 10px;
  overflow: hidden;
  max-width: 500px;
  .row {
    .col:first-child {
      color: white;
      font-weight: bold;
      word-wrap: break-word;
    }
    .col:not(:last-child) {
      border-bottom: thin solid black;
    }
  }
}

</style>
