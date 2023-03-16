<template>
  <div>
    <H2Common>
      {{ `${abundResData.name || 'name'}の情報` }}
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
          <h3>
            基本情報
          </h3>
          <v-container
            v-if="isLoadedAbundance"
            class="abundance-basic-info-table"
            :style="`border: medium solid rgb(${abundResData.color.r}, ${abundResData.color.g}, ${abundResData.color.b});`"
          >
            <v-row>
              <v-col cols="5" class="col-title">
                図鑑No
              </v-col>
              <v-col cols="7">
                {{ abundResData.pokedexId | dispPdx }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5" class="col-title">
                ポケモン
              </v-col>
              <v-col cols="7">
                {{ appendRemarks(abundResData.name, abundResData.remarks) }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5" class="col-title">
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
              <v-col cols="5" class="col-title">
                世代
              </v-col>
              <v-col cols="7">
                {{ dispGenJpn(abundResData.goPokedex.gen) }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5" class="col-title">
                PokémonGO実装
              </v-col>
              <v-col cols="7">
                <span v-if="abundResData.goPokedex.implFlg">実装済</span>
                <span v-else class="red--text">未実装</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5" class="col-title">
                強ポケ補正
              </v-col>
              <v-col cols="7">
                <span v-if="abundResData.tooStrong" class="red--text">対象</span>
                <span v-else>対象外</span>
              </v-col>
            </v-row>
          </v-container>
          <h3>
            CP
          </h3>
          <v-container
            v-if="isLoadedAbundance"
            class="abundance-cp-table"
          >
            <v-row>
              <v-col cols="5" class="col-title">
                種族値CP(PL40)
              </v-col>
              <v-col cols="7">
                {{ abundResData.cp40 }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5" class="col-title">
                最大CP
              </v-col>
              <v-col cols="7">
                {{ abundResData.maxCp }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5" class="col-title">
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
              <v-col cols="5" class="col-title">
                フィールドリサーチCP
              </v-col>
              <v-col cols="7">
                {{ `${abundResData.minFrTaskCp} ～ ${abundResData.maxFrTaskCp}` }}
              </v-col>
            </v-row>
          </v-container>
          <!-- 種族値 -->
          <h3>
            種族値
          </h3>
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
import EvoInfo from '~/components/search/evolution/EvoInfo'
import GoRadarGraph from '~/components/search/graph/GoRadarGraph'

export default {
  name: 'Abundance',
  components: {
    H2Common,
    EvoInfo,
    GoRadarGraph
  },
  mixins: [SearchCommon],
  data () {
    return {
      id: this.$route.query.pid,
      abundResData: {},
      evoResData: {},
      raceResData: {},

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
    }
  },
  beforeMount () {
    this.get('/api/abundance', { params: { id: this.id } }, 'abundResData')
    this.get('/api/race', { params: { id: this.id } }, 'raceResData')
    this.get('/api/evolution', { params: { id: this.id } }, 'evoResData')
  },
  methods: {
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
        .catch(this.$processUtils.onErrorNot401)
      const resData = res.data
      if (this.dispDialog(resData)) {
        return
      }
      this.$set(this, resDataNm, resData)
    },
    /**
     * 世代の日本語名を取得する。
     *
     * @param {String} value
     */
    dispGenJpn (value) {
      return this.$CONST.GEN.filter(v => v.k === value).map(v => v.v)[0]
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
  .row:not(:last-child) {
    border-bottom: dotted black;
  }
}
// .abundance-basic-info-tableのボーダーの色は可変
.abundance-cp-table {
  border: medium solid grey;
}
.race {
  border: medium solid maroon;
  // border-color: red blue blue red;
}
.evolution {
  border: medium solid green;
}

</style>
