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
            <TypeComments :comments="resData.typeComments">
              あ、どうも。このタイプの特徴について簡単に説明します。
            </TypeComments>
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
      <!-- こうげき倍率 -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <h3 v-on="on">
            こうげき倍率
            <v-icon small>
              mdi-help-circle
            </v-icon>
          </h3>
        </template>
        <span>ポケモンGOにおけるダメージ倍率は、ポケモンの原作のシリーズとは少し違った考え方です。
          しかし、こうげき時のダメージ倍率の考え方はほぼ同じであり、×1.6は抜群、×0.625は軽減、×0.390625は無効に対応します。また、タイプ一致のダメージ倍率は×1.2です。</span>
      </v-tooltip>
      <TypeAtkDmgMult
        :type1="type1"
        :type2="type2"
        :def-type-dic1="resData.attackerType1Map"
        :def-type-dic2="resData.attackerType2Map"
      />
      <!-- ぼうぎょ倍率 -->
      <h3>ぼうぎょ倍率</h3>
      <TypeDefDmgMult
        :type1="type1"
        :type2="type2"
        :atk-type-dic="resData.defenderTypeMap"
      />
    </div>
    <div v-else>
      <Loading split-scr />
    </div>
  </div>
</template>

<script>
import H2Common from '~/components/utils/H2Common'
import SearchCommon from '~/components/search/SearchCommon'
import OgpType from '~/components/utils/OgpType'
import Loading from '~/components/Loading'
import TypeComments from '~/components/search/type/TypeComments'
import TypeAtkDmgMult from '~/components/search/type/TypeAtkDmgMult'
import TypeDefDmgMult from '~/components/search/type/TypeDefDmgMult'
export default {
  name: 'TypeScoreResult',
  components: {
    H2Common,
    Loading,
    TypeComments,
    TypeAtkDmgMult,
    TypeDefDmgMult
  },
  mixins: [SearchCommon, OgpType],
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

      isLoading: true
    }
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
    // API側の仕様として、タイプ1に値がなく、タイプ2に値がある場合は、タイプ2にタイプ1の値が設定される。
    // そのため、再セットする。
    this.type1 = resData.type1
    this.type2 = resData.type2

    this.score = this.setScore(resData)
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
      const resData = res.data
      if (!this.dispDialog(resData)) {
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
    }
  },
  head () {
    return {
      title: `${this.ogp_type}の評価`,
      meta: [
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: `${this.ogp_type}の評価 - ペリずかん` },
        { property: 'og:url', content: process.env.VUE_APP_URL + this.$route.path },
        { property: 'og:site_name', content: 'ペリずかん' },
        { property: 'og:description', content: 'タイプの評価を確認することができます。※評価ロジックは当サイト独自です。' },
        { property: 'og:image', content: process.env.VUE_APP_STATIC_URL + '/pokego/peripper-eyes.png' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.rating {
  display: flex;
  align-items: center;
}
</style>
