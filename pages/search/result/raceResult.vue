<template>
  <div>
    <v-container>
      <p />
      <H2Common>
        {{ getSearchPatternName('race') }}
      </H2Common>
    </v-container>
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
                  :key="`go-col-${item.id}`"
                  cols="6"
                  md="4"
                  lg="4"
                  xl="2"
                  style="text-align: right"
                >
                  {{ `${item.name}:` }}
                </v-col>
                <v-col
                  :key="`go-val-${item.id}`"
                  cols="6"
                  md="8"
                  lg="8"
                  xl="10"
                >
                  {{ resData.race.goPokedex[item.id] }}
                </v-col>
              </template>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <LineGraph
              chart-id="go-hp-line"
              title="HP"
              :elems="resData.statistics.goPokedexStats.goHpStats.list"
              :point="resData.race.goPokedex.hp"
              :rgb="[0,0,255]"
              :height="100"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <LineGraph
              chart-id="go-at-line"
              title="こうげき"
              :elems="resData.statistics.goPokedexStats.goAtStats.list"
              :point="resData.race.goPokedex.attack"
              :rgb="[255,0,0]"
              :height="100"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <LineGraph
              chart-id="go-df-line"
              title="ぼうぎょ"
              :elems="resData.statistics.goPokedexStats.goDfStats.list"
              :point="resData.race.goPokedex.defense"
              :rgb="[0,255,0]"
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
                  :key="`ori-col-${item.id}`"
                  cols="6"
                  md="4"
                  lg="4"
                  xl="2"
                  style="text-align: right"
                >
                  {{ `${item.name}:` }}
                </v-col>
                <v-col
                  :key="`ori-val-${item.id}`"
                  cols="6"
                  md="8"
                  lg="8"
                  xl="10"
                >
                  {{ resData.race.pokedex[item.id] }}
                </v-col>
              </template>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <LineGraph
              chart-id="ori-hp-line"
              title="HP"
              :elems="resData.statistics.pokedexStats.hpStats.list"
              :point="resData.race.pokedex.hp"
              :rgb="[0,0,255]"
              :height="100"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <LineGraph
              chart-id="ori-at-line"
              title="こうげき"
              :elems="resData.statistics.pokedexStats.atStats.list"
              :point="resData.race.pokedex.attack"
              :rgb="[255,0,0]"
              :height="100"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <LineGraph
              chart-id="ori-df-line"
              title="ぼうぎょ"
              :elems="resData.statistics.pokedexStats.dfStats.list"
              :point="resData.race.pokedex.defense"
              :rgb="[0,255,0]"
              :height="100"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <LineGraph
              chart-id="ori-spAt-line"
              title="とくこう"
              :elems="resData.statistics.pokedexStats.spAtStats.list"
              :point="resData.race.pokedex.specialAttack"
              :rgb="[255,20,147]"
              :height="100"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <LineGraph
              chart-id="ori-spDf-line"
              title="とくぼう"
              :elems="resData.statistics.pokedexStats.spDfStats.list"
              :point="resData.race.pokedex.specialDefense"
              :rgb="[255,255,0]"
              :height="100"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <LineGraph
              chart-id="ori-speed-line"
              title="すばやさ"
              :elems="resData.statistics.pokedexStats.spStats.list"
              :point="resData.race.pokedex.speed"
              :rgb="[199,21,133]"
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

      goRadarElems: [],
      oriRadarElems: [],

      // レーダーチャートの隣に表示させてるやつのItem
      goStatsItems: [
        { id: 'hp', name: 'HP' },
        { id: 'attack', name: 'こうげき' },
        { id: 'defense', name: 'ぼうぎょ' }
      ],
      oriStatsItems: [
        { id: 'hp', name: 'HP' },
        { id: 'attack', name: 'こうげき' },
        { id: 'defense', name: 'ぼうぎょ' },
        { id: 'specialAttack', name: 'とくこう' },
        { id: 'specialDefense', name: 'とくぼう' },
        { id: 'speed', name: 'すばやさ' }],
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
      // ['HP', 'こうげき', 'ぼうぎょ']
      const gps = resData.statistics.goPokedexStats
      const goValListArr = [gps.goHpStats.list, gps.goAtStats.list, gps.goDfStats.list]
      const gp = resData.race.goPokedex
      const goValArr = [gp.hp, gp.attack, gp.defense]
      // 全ポケモン数
      const count = gps.goHpStats.list.length
      for (const i in goValArr) {
        this.goRadarElems.push(count - (this.rank(goValArr[i], goValListArr[i]) - 1))
      }
    },
    /**
     * 原作種族値のレーダーチャートの値を設定し、描画する。
     *
     * @param resData
     */
    drawOriRadar (resData) {
      // ['HP', 'こうげき', 'とくこう', 'すばやさ', 'とくぼう', 'ぼうぎょ']
      const ps = resData.statistics.pokedexStats
      const oriValListArr = [ps.hpStats.list, ps.atStats.list, ps.spAtStats.list, ps.spStats.list, ps.spDfStats.list, ps.dfStats.list]
      const p = resData.race.pokedex
      const oriValArr = [p.hp, p.attack, p.specialAttack, p.speed, p.specialDefense, p.defense]
      // 全ポケモン数
      const count = ps.hpStats.list.length
      for (const i in oriValArr) {
        this.oriRadarElems.push(count - (this.rank(oriValArr[i], oriValListArr[i]) - 1))
      }
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
