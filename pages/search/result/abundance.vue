<template>
  <div>
    <H2Common>
      {{ `${appendRemarks(abundResData.name, abundResData.remarks) || 'name'}の情報` }}
    </H2Common>
    <!-- ポケモンの画像 -->
    <v-container>
      <v-row>
        <v-col align="center">
          <v-avatar size="200" :rounded="true">
            <v-img
              :src="abundResData.goPokedex && abundResData.goPokedex.image
                ? item.goPokedex.image
                : require('~/static/img/no-image.png')"
            />
          </v-avatar>
        </v-col>
      </v-row>
    </v-container>
    <!-- 横並びにするためのコンテナ -->
    <v-container>
      <v-row>
        <v-col cols="12" md="7" lg="8" xl="8">
          <!-- abundanceの表 -->
          <h3>基本情報</h3>
          <v-container
            v-if="isLoadedAbundance"
            class="abundance-basic-info-table"
          >
            <v-row>
              <v-col cols="5">
                図鑑No
              </v-col>
              <v-col cols="7">
                {{ abundResData.pokedexId | dispPdx }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                ポケモン
              </v-col>
              <v-col cols="7">
                {{ appendRemarks(abundResData.name, abundResData.remarks) }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                タイプ
              </v-col>
              <v-col cols="7">
                <span
                  :style="`background-color: ${$editUtils.getRGB(abundResData.goPokedex.type1)};`"
                  class="type"
                >
                  {{ abundResData.goPokedex.type1 }}
                </span>
                <span
                  v-if="abundResData.goPokedex.type2"
                  :style="`background-color: ${$editUtils.getRGB(abundResData.goPokedex.type2)}; margin-left:5px;`"
                  class="type"
                >
                  {{ abundResData.goPokedex.type2 }}
                </span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                世代
              </v-col>
              <v-col cols="7">
                {{ dispGenJpn(abundResData.goPokedex.gen) }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                PokémonGO実装
              </v-col>
              <v-col cols="7">
                <span v-if="abundResData.goPokedex.implFlg">実装済</span>
                <span v-else class="red--text">未実装</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                強ポケ補正
              </v-col>
              <v-col cols="7">
                <span v-if="abundResData.tooStrong" class="red--text">対象</span>
                <span v-else>対象外</span>
              </v-col>
            </v-row>
          </v-container>
          <h3>CP</h3>
          <v-container
            v-if="isLoadedAbundance"
            class="abundance-cp-table"
          >
            <v-row>
              <v-col cols="5">
                種族値CP(PL40)
              </v-col>
              <v-col cols="7">
                {{ abundResData.cp40 }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                最大CP
              </v-col>
              <v-col cols="7">
                {{ abundResData.maxCp }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                レイドCP
              </v-col>
              <v-col cols="7">
                {{ `${abundResData.minRaidCp} ～ ${abundResData.maxRaidCp}` }}
                <p class="caption my-0">
                  {{ `天候ブースト時:${abundResData.minWbRaidCp} ～ ${abundResData.maxWbRaidCp}` }}
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                シャドウCP
              </v-col>
              <v-col cols="7">
                {{ `${abundResData.minShadowCp} ～ ${abundResData.maxShadowCp}` }}
                <p class="caption my-0">
                  {{ `天候ブースト時:${abundResData.minWbShadowCp} ～ ${abundResData.maxWbShadowCp}` }}
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                フィールドリサーチCP
              </v-col>
              <v-col cols="7">
                {{ `${abundResData.minFrTaskCp} ～ ${abundResData.maxFrTaskCp}` }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                タマゴCP
              </v-col>
              <v-col cols="7">
                {{ `${abundResData.minEggCp} ～ ${abundResData.maxEggCp}` }}
              </v-col>
            </v-row>
          </v-container>
          <!-- 種族値 -->
          <h3>種族値</h3>
          <v-container v-if="isLoadedRace" class="race">
            <v-row>
              <v-col
                cols="12"
                sm="7"
                md="7"
                lg="7"
                xl="7"
                align="right"
              >
                <GoRadarGraph
                  :race="raceResData.race"
                  :go-pokedex-stats="raceResData.statistics.goPokedexStats"
                />
              </v-col>
              <v-col
                cols="12"
                sm="5"
                md="5"
                lg="5"
                xl="5"
                class="stats"
              >
                <v-row>
                  <template v-for="item in goStatsItems">
                    <v-col :key="`go-col-${item.key}`" cols="6" style="text-align: right">
                      {{ `${item.name}:` }}
                    </v-col>
                    <v-col :key="`go-val-${item.key}`" cols="6">
                      {{ raceResData.race.goPokedex[item.key] }}
                    </v-col>
                  </template>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
          <!-- タイプ倍率 -->
          <h3>タイプ倍率</h3>
          <div v-if="isTypeScoreEvolution">
            <v-container v-if="typeScoreResData.typeComments">
              <v-row>
                <v-col>
                  <TypeComments :comments="typeScoreResData.typeComments">
                    <span>あ、どうも。</span>
                    <span :style="`background-color: ${$editUtils.getRGB(typeScoreResData.type1)};`" class="type">
                      {{ $CONST.getValue(typeScoreResData.type1, $CONST.TYPE) }}
                    </span>
                    <span v-if="typeScoreResData.type2" :style="`background-color: ${$editUtils.getRGB(typeScoreResData.type2)};`" class="type">
                      {{ $CONST.getValue(typeScoreResData.type2, $CONST.TYPE) }}
                    </span>
                    <span>の特徴について簡単に説明します。</span>
                  </TypeComments>
                </v-col>
              </v-row>
            </v-container>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <h4 v-on="on">
                  こうげき時
                  <v-icon small>
                    mdi-help-circle
                  </v-icon>
                </h4>
              </template>
              <span>タイプ一致時のダメージ倍率を示しています。ここから×1.2倍されます。</span>
            </v-tooltip>
            <TypeAtkDmgMult
              :type1="typeScoreResData.type1"
              :type2="typeScoreResData.type2"
              :def-type-dic1="typeScoreResData.attackerType1Map"
              :def-type-dic2="typeScoreResData.attackerType2Map"
            />
            <h4>ぼうぎょ時</h4>
            <TypeDefDmgMult
              :type1="typeScoreResData.type1"
              :type2="typeScoreResData.type2"
              :atk-type-dic="typeScoreResData.defenderTypeMap"
            />
          </div>
        </v-col>
        <v-col cols="12" md="5" lg="4" xl="4">
          <h3>
            進化
          </h3>
          <EvoInfo
            v-if="isLoadedEvolution"
            :pokedex-id="id"
            :evo-tree-info="evoResData.evoTreeInfo"
            :another-forms="evoResData.anotherForms"
            :bf-af-aot-forms="evoResData.bfAfAotForms"
            :race-map="evoResData.raceMap"
            router-link="search-result-abundance"
            class="evolution"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import H2Common from '~/components/utils/H2Common'
import SearchCommon from '~/components/search/SearchCommon'
import OgpPokemon from '~/components/utils/OgpPokemon'
import EvoInfo from '~/components/search/evolution/EvoInfo'
import GoRadarGraph from '~/components/search/graph/GoRadarGraph'
import TypeComments from '~/components/search/type/TypeComments'
import TypeAtkDmgMult from '~/components/search/type/TypeAtkDmgMult'
import TypeDefDmgMult from '~/components/search/type/TypeDefDmgMult'

export default {
  name: 'Abundance',
  components: {
    H2Common,
    EvoInfo,
    GoRadarGraph,
    TypeComments,
    TypeAtkDmgMult,
    TypeDefDmgMult
  },
  mixins: [SearchCommon, OgpPokemon],
  data () {
    return {
      id: '',
      abundResData: {},
      raceResData: {},
      evoResData: {},
      typeScoreResData: {},
      styleIdArr: [],

      // レーダーチャートの横に配置する種族値
      goStatsItems: [
        { key: 'hp', name: 'HP' },
        { key: 'attack', name: 'こうげき' },
        { key: 'defense', name: 'ぼうぎょ' }
      ]
    }
  },
  computed: {
    /**
     * abundanceの読み込みが終わったらtrueになる。
     */
    isLoadedAbundance () {
      return Object.keys(this.abundResData).length
    },
    /**
     * raceの読み込みが終わったらtrueになる。
     */
    isLoadedRace () {
      return Object.keys(this.raceResData).length
    },
    /**
     * evolutionの読み込みが終わったらtrueになる。
     */
    isLoadedEvolution () {
      return Object.keys(this.evoResData).length
    },
    /**
     * typeScoreの読み込みが終わったらtrueになる。
     */
    isTypeScoreEvolution () {
      return Object.keys(this.typeScoreResData).length
    }
  },
  watch: {
    $route (to) {
      if (to.query.pid !== this.id) {
        this.initial()
      }
    }
  },
  beforeDestroy () {
    // 作成したstyleをすべて削除する
    this.$editUtils.deleteStyleElem(this.styleIdArr)
  },
  beforeMount () {
    this.initial()
  },
  methods: {
    /**
     * 画面表示初期処理
     */
    initial () {
      // styleをリセットする。
      this.styleIdArr = this.$editUtils.deleteStyleElem(this.styleIdArr)
      // queryからidを取得。
      this.id = this.$route.query.pid
      this.abundResData = {}
      this.raceResData = {}
      this.evoResData = {}
      this.typeScoreResData = {}
      Promise.all([
        this.get('/api/abundance', { params: { id: this.id } }, 'abundResData'),
        this.get('/api/race', { params: { id: this.id, enableCount: true } }, 'raceResData'),
        this.get('/api/evolution', { params: { id: this.id, enableCount: true } }, 'evoResData'),
        this.get('/api/typeScore', { params: { id: this.id, enableCount: true } }, 'typeScoreResData')
      ]).then(() => {
        this.createStyleElem()
      })
    },
    /**
     * APIにGET送信し、レスポンスを処理する。
     *
     * @param {String} endpoint
     * @param {Object} params
     * @param {String} resDataNm レスポンスをセットする変数名
     */
    async get (endpoint, params, resDataNm) {
      const res = await this.$axios
        .get(endpoint, params)
      const resData = res.data
      if (this.dispDialog(resData)) {
        return
      }
      this.$set(this, resDataNm, resData)
    },
    /**
     * ポケモンのタイプの色を使用し、テーブルのstyleを動的に設定します。
     * ※表のrow,colをループさせていないので、この方式をとっています。
     */
    createStyleElem () {
      let idPrefix, id, color, style
      /** 基本情報のstyle */
      idPrefix = 'abundance-basic-info-table'
      // 項目名
      id = `${idPrefix}-header`
      color = this.abundResData.type1Color
      style = `.abundance-basic-info-table .row .col:first-child {\
        background: rgb(${color.r}, ${color.g}, ${color.b})}`
      this.$editUtils.createStyleElem(id, style, this.styleIdArr)

      // 項目値の背景色を交互に
      id = `${idPrefix}-odd`
      style = `.abundance-basic-info-table .row:nth-child(odd) .col:not(:first-child) {\
        background: rgba(${color.r}, ${color.g}, ${color.b}, 0.1)}`
      this.$editUtils.createStyleElem(id, style, this.styleIdArr)

      /** CPのstyle */
      idPrefix = 'abundance-cp-table'
      // 項目名
      id = `${idPrefix}-header`
      color = this.abundResData.type2Color ? this.abundResData.type2Color : color
      style = `.abundance-cp-table .row .col:first-child {\
        background: rgb(${color.r}, ${color.g}, ${color.b})}`
      this.$editUtils.createStyleElem(id, style, this.styleIdArr)

      // 項目値の背景色を交互に
      id = `${idPrefix}-odd`
      style = `.abundance-cp-table .row:nth-child(odd) .col:not(:first-child) {\
        background: rgba(${color.r}, ${color.g}, ${color.b}, 0.1)}`
      this.$editUtils.createStyleElem(id, style, this.styleIdArr)
    },
    /**
     * 世代の日本語名を取得する。
     *
     * @param {String} value
     */
    dispGenJpn (value) {
      return this.$CONST.GEN.filter(v => v.k === value).map(v => v.v)[0]
    }
  },
  head () {
    return {
      title: `${this.ogp_name}の情報`,
      meta: [
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: `${this.ogp_name}の情報 - ペリずかん` },
        { property: 'og:url', content: process.env.VUE_APP_URL + this.$route.path },
        { property: 'og:site_name', content: 'ペリずかん' },
        { property: 'og:description', content: `${this.ogp_name}の総合的な情報を確認できます。` },
        { property: 'og:image', content: this.ogp_image }
      ]
    }
  }
}
</script>

<style>
.stats {
  vertical-align: middle;
  margin: auto;
}
</style>

<style lang="scss" scoped>
.abundance-basic-info-table,.abundance-cp-table {
  border: medium solid grey;
  border-radius: 10px;
  overflow:hidden;
  .row {
    .col:first-child {
      color: white;
      font-weight: bold;
    }
    .col:not(:last-child) {
      border-bottom: thin solid black;
    }
  }
}
.race {
  border: medium solid maroon;
  // border-color: red blue blue red;
}
.evolution {
  border: medium solid green;
}

</style>
