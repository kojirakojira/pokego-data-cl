<template>
  <div>
    <H2Common>
      {{ getSearchPatternName('race') }}
    </H2Common>
    <div v-if="!isLoading">
      <v-container>
        <v-row>
          <v-col
            cols="12"
            md="6"
            lg="6"
            xl="6"
            class="col-title"
          >
            図鑑No
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            {{ resData.pokedexId | dispPdx }}
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            md="6"
            lg="6"
            xl="6"
            class="col-title"
          >
            ポケモン
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            {{ appendRemarks(resData.name, resData.remarks) }}
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            md="6"
            lg="6"
            xl="6"
            class="col-title"
          >
            タイプ
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            <span
              :style="`background-color: rgb(${resData.race.type1Color.r},${resData.race.type1Color.g},${resData.race.type1Color.b};`"
              class="type"
            >
              {{ resData.race.goPokedex.type1 }}
            </span>
            <span
              v-if="resData.race.goPokedex.type2"
              :style="`background-color: rgb(${resData.race.type2Color.r},${resData.race.type2Color.g},${resData.race.type2Color.b}; margin-left:5px;`"
              class="type"
            >
              {{ resData.race.goPokedex.type2 }}
            </span>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            md="6"
            lg="6"
            xl="6"
            class="col-title"
          >
            原作→GO変換弱体化対象
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
              <span>ポケモンGOの種族値は、原作の種族値から一定の変換式で算出されます。
                種族値が高すぎる一部のポケモンは算出された種族値から×0.91されます。</span>
            </v-tooltip>
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            <span v-if="resData.tooStrong" class="red--text">対象</span>
            <span v-else>対象外</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            ※ポケモンGO
            <span v-if="resData.race.goPokedex.implFlg" class="font-weight-bold">実装済み</span>
            <span v-else class="font-weight-bold red--text">未実装</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-divider />
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            class="col-title"
          >
            GO種族値
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="6"
            lg="6"
            xl="6"
            align="right"
          >
            <RadarGraph
              chart-id="go-poke-radar"
              title="GO種族値"
              :labels="['HP', 'こうげき', 'ぼうぎょ']"
              :elems="goRadarElems"
              :min="1"
              :max="resData.statistics.goPokedexStats.goHpStats.list.length"
              :rgb="[resData.race.color.r, resData.race.color.g, resData.race.color.b]"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="6"
            lg="6"
            xl="6"
            class="stats"
          >
            <v-row>
              <template
                v-for="item in goStatsItems"
              >
                <v-col
                  :key="`go-col-${item.key}`"
                  cols="6"
                  md="4"
                  lg="4"
                  xl="2"
                  style="text-align: right"
                >
                  {{ `${item.name}:` }}
                </v-col>
                <v-col
                  :key="`go-val-${item.key}`"
                  cols="6"
                  md="8"
                  lg="8"
                  xl="10"
                >
                  {{ resData.race.goPokedex[item.key] }}
                </v-col>
              </template>
            </v-row>
          </v-col>
        </v-row>
        <v-row v-for="elem in goLineElems" :key="`go-${elem.key}-line`">
          <v-col>
            <LineGraph
              :chart-id="`go-${elem.key}-line`"
              :title="elem.title"
              :rank="rank(resData.race.goPokedex[elem.key], resData.statistics.goPokedexStats[elem.statsKey].list)"
              :elems="resData.statistics.goPokedexStats[elem.statsKey].list"
              :point="resData.race.goPokedex[elem.key]"
              :rgb="elem.rgb"
              :height="100"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-divider />
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            class="col-title"
          >
            原作種族値
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="6"
            lg="6"
            xl="6"
            align="right"
          >
            <RadarGraph
              title="原作種族値"
              :labels="['HP', 'こうげき', 'とくこう', 'すばやさ', 'とくぼう', 'ぼうぎょ']"
              :elems="oriRadarElems"
              :min="1"
              :max="resData.statistics.pokedexStats.hpStats.list.length"
              :rgb="[resData.race.color.r, resData.race.color.g, resData.race.color.b]"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="6"
            lg="6"
            xl="6"
            class="stats"
          >
            <v-row>
              <template
                v-for="item in oriStatsItems"
              >
                <v-col
                  :key="`ori-col-${item.key}`"
                  cols="6"
                  md="4"
                  lg="4"
                  xl="2"
                  style="text-align: right"
                >
                  {{ `${item.name}:` }}
                </v-col>
                <v-col
                  :key="`ori-val-${item.key}`"
                  cols="6"
                  md="8"
                  lg="8"
                  xl="10"
                >
                  {{ resData.race.pokedex[item.key] }}
                </v-col>
              </template>
            </v-row>
          </v-col>
        </v-row>
        <v-row v-for="elem in oriLineElems" :key="`ori-${elem.key}-line`">
          <v-col>
            <LineGraph
              :chart-id="`ori-${elem.key}-line`"
              :title="elem.title"
              :rank="rank(resData.race.pokedex[elem.key], resData.statistics.pokedexStats[elem.statsKey].list)"
              :elems="resData.statistics.pokedexStats[elem.statsKey].list"
              :point="resData.race.pokedex[elem.key]"
              :rgb="elem.rgb"
              :height="100"
            />
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-else>
      <Loading :full-scr="false" />
    </div>
  </div>
</template>

<script>
import H2Common from '~/components/utils/H2Common'
import SearchCommon from '~/components/search/SearchCommon'
import Loading from '~/components/Loading'
import RadarGraph from '~/components/utils/graph/RadarGraph'
import LineGraph from '~/components/utils/graph/LineGraph'
export default {
  name: 'RaceResult',
  components: {
    H2Common,
    Loading,
    RadarGraph,
    LineGraph
  },
  mixins: [SearchCommon],
  data () {
    return {
      id: null, // pokedexId
      resData: {
        race: {
          type1Color: {},
          type2Color: {}
        }
      },

      goLineElems: [
        { key: 'hp', statsKey: 'goHpStats', title: 'HP', rgb: [0, 0, 255] },
        { key: 'attack', statsKey: 'goAtStats', title: 'こうげき', rgb: [255, 0, 0] },
        { key: 'defense', statsKey: 'goDfStats', title: 'ぼうぎょ', rgb: [0, 255, 0] }
      ],
      oriLineElems: [
        { key: 'hp', statsKey: 'hpStats', title: 'HP', rgb: [0, 0, 255] },
        { key: 'attack', statsKey: 'atStats', title: 'こうげき', rgb: [255, 0, 0] },
        { key: 'defense', statsKey: 'dfStats', title: 'ぼうぎょ', rgb: [0, 255, 0] },
        { key: 'specialAttack', statsKey: 'spAtStats', title: 'とくこう', rgb: [255, 20, 147] },
        { key: 'specialDefense', statsKey: 'spDfStats', title: 'とくぼう', rgb: [255, 255, 0] },
        { key: 'speed', statsKey: 'spStats', title: 'すばやさ', rgb: [199, 21, 133] }
      ],

      goRadarElems: [],
      goStatsItems: [
        { key: 'hp', statsKey: 'goHpStats', name: 'HP' },
        { key: 'attack', statsKey: 'goAtStats', name: 'こうげき' },
        { key: 'defense', statsKey: 'goDfStats', name: 'ぼうぎょ' }
      ],
      oriRadarElems: [],
      oriStatsItems: [
        { key: 'hp', statsKey: 'hpStats', name: 'HP' },
        { key: 'attack', statsKey: 'atStats', name: 'こうげき' },
        { key: 'specialAttack', statsKey: 'spAtStats', name: 'とくこう' },
        { key: 'speed', statsKey: 'spStats', name: 'すばやさ' },
        { key: 'specialDefense', statsKey: 'spDfStats', name: 'とくぼう' },
        { key: 'defense', statsKey: 'dfStats', name: 'ぼうぎょ' }],
      isLoading: true
    }
  },
  watch: {
    resData () {
      // resDataに値がセットされたらLoadingを解除する。
      this.isLoading = false
    }
  },
  async beforeMount () {
    this.id = this.$route.query.pid
    const resData = this.$route.params.rd

    if (resData) {
      // paramsでresDataが渡されている場合は、そのまま表示する
      this.resData = resData
      this.drawing(resData)
    } else {
      // paramsでresDataが渡されていない場合は、APIから取得してから表示する
      await this.get()
    }
  },
  methods: {
    async get () {
      await this.$axios
        .get('/api/race', {
          params: {
            id: this.id
          }
        })
        .then((res) => {
          const resData = this.resData = res.data
          this.drawing(resData)
        })
        .catch((err) => {
          if (err.response.status !== 401) {
            alert('何らかのエラーが発生しました。')
            this.$router.back()
          }
        })
    },
    drawing (resData) {
      this.drawGoRadar(resData)
      this.drawOriRadar(resData)
    },
    /**
     * GO種族値のレーダーチャートの値を設定し、描画する。
     *
     * @param resData
     */
    drawGoRadar (resData) {
      // 全ポケモン数
      const count = resData.statistics.goPokedexStats.goHpStats.list.length
      // ['HP', 'こうげき', 'ぼうぎょ']
      this.goStatsItems.forEach((s) => {
        this.goRadarElems.push(
          count - (this.rank(resData.race.goPokedex[s.key], resData.statistics.goPokedexStats[s.statsKey].list) - 1)
        )
      })
    },
    /**
     * 原作種族値のレーダーチャートの値を設定し、描画する。
     *
     * @param resData
     */
    drawOriRadar (resData) {
      // 全ポケモン数
      const count = resData.statistics.pokedexStats.hpStats.list.length
      // ['HP', 'こうげき', 'とくこう', 'すばやさ', 'とくぼう', 'ぼうぎょ']
      this.oriStatsItems.forEach((s) => {
        this.oriRadarElems.push(
          count - (this.rank(resData.race.pokedex[s.key], resData.statistics.pokedexStats[s.statsKey].list) - 1)
        )
      })
    },
    /**
     * 順位を求める。
     * @param val 値
     * @param arr 値の配列
     */
    rank (val, arr) {
      for (const i in arr) {
        if (arr[i] === val) {
          return arr.length - (i * 1)
        }
      }
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
