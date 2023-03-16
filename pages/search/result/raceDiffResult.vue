<template>
  <div>
    <H2Common>
      {{ getSearchPatternName('raceDiff') }}
    </H2Common>
    <div v-if="!isLoading">
      <v-container>
        <v-row>
          <v-col
            cols="12"
            md="4"
            lg="5"
            xl="5"
            class="col-title"
          >
            ポケモン
          </v-col>
          <v-col cols="12" md="8" lg="7" xl="7">
            <v-container>
              <v-row v-for="(race, idx) in resData.raceArr" :key="`p-name-${idx}`">
                <v-col class="py-0">
                  <v-icon large :color="`rgba(${colorArr[idx].r}, ${colorArr[idx].g}, ${colorArr[idx].b}, 0.5)`">
                    mdi-circle-half-full
                  </v-icon>
                  {{ appendRemarks(race.goPokedex.name, race.goPokedex.remarks) }}
                </v-col>
                <v-col class="py-0">
                  <span
                    :style="`background-color: rgb(${race.type1Color.r},${race.type1Color.g},${race.type1Color.b};`"
                    class="type"
                  >
                    {{ race.goPokedex.type1 }}
                  </span>
                  <span
                    v-if="race.goPokedex.type2"
                    :style="`background-color: rgb(${race.type2Color.r},${race.type2Color.g},${race.type2Color.b}; margin-left:5px;`"
                    class="type"
                  >
                    {{ race.goPokedex.type2 }}
                  </span>
                </v-col>
              </v-row>
            </v-container>
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
              <span>レーダーチャートの凡例をタップすると、特定のポケモンを非表示にできます。</span>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            sm="12"
            md="6"
            lg="6"
            xl="6"
            align="center"
          >
            <RadarDiffGraph
              chart-id="go-poke-radar"
              title="GO種族値"
              :labels="['HP', 'こうげき', 'ぼうぎょ']"
              :datasets="goRadarDatasets"
              :min="1"
              :max="goDataTableElems.count"
              max-width="600px"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="6"
            lg="6"
            xl="6"
          >
            <v-data-table
              :headers="goHeaders"
              :items="goDataTableElems.data"
              hide-default-footer
              mobile-breakpoint="300"
              no-data-text="loading now..."
              no-results-text="該当するデータがありません。"
            >
              <template v-slot:[`item.name`]="{ item }">
                {{ item.name }}
                <template v-if="item.remarks">
                  <br><span class="caption">{{ `(${item.remarks})` }}</span>
                </template>
              </template>
              <template v-slot:[`item.hp`]="{ item }">
                {{ `${item.hp}` }}<br><span class="caption">{{ `(${item.hpRank}位)` }}</span>
              </template>
              <template v-slot:[`item.at`]="{ item }">
                {{ `${item.at}` }}<br><span class="caption">{{ `(${item.atRank}位)` }}</span>
              </template>
              <template v-slot:[`item.df`]="{ item }">
                {{ `${item.df}` }}<br><span class="caption">{{ `(${item.dfRank}位)` }}</span>
              </template>
            </v-data-table>
            <p align="right" class="subtitle-2">
              {{ `※全ポケモン${goDataTableElems.count}体中(未実装、メガ、ゲンシ等含む)` }}
            </p>
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
              <span>レーダーチャートの凡例をタップすると、特定のポケモンを非表示にできます。</span>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            sm="12"
            md="6"
            lg="6"
            xl="6"
            align="center"
          >
            <RadarDiffGraph
              chart-id="ori-poke-radar"
              title="原作種族値"
              :labels="['HP', 'こうげき', 'とくこう', 'すばやさ', 'とくぼう', 'ぼうぎょ']"
              :datasets="oriRadarDatasets"
              :min="1"
              :max="oriDataTableElems.count"
              max-width="600px"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="6"
            lg="6"
            xl="6"
          >
            <p class="subtitle-2 py-0" align="right">
              スマホの場合は画面を横にすると見やすいです。
            </p>
            <v-data-table
              :headers="oriHeaders"
              :items="oriDataTableElems.data"
              hide-default-footer
              no-data-text="loading now..."
              no-results-text="該当するデータがありません。"
            >
              <template v-slot:[`item.name`]="{ item }">
                {{ item.name }}
                <template v-if="item.remarks">
                  <br><span class="caption">{{ `(${item.remarks})` }}</span>
                </template>
              </template>
              <template v-slot:[`item.hp`]="{ item }">
                {{ `${item.hp}` }}<br><span class="caption">{{ `(${item.hpRank}位)` }}</span>
              </template>
              <template v-slot:[`item.at`]="{ item }">
                {{ `${item.at}` }}<br><span class="caption">{{ `(${item.atRank}位)` }}</span>
              </template>
              <template v-slot:[`item.df`]="{ item }">
                {{ `${item.df}` }}<br><span class="caption">{{ `(${item.dfRank}位)` }}</span>
              </template>
              <template v-slot:[`item.spAt`]="{ item }">
                {{ `${item.spAt}` }}<br><span class="caption">{{ `(${item.spAtRank}位)` }}</span>
              </template>
              <template v-slot:[`item.spDf`]="{ item }">
                {{ `${item.spDf}` }}<br><span class="caption">{{ `(${item.spDfRank}位)` }}</span>
              </template>
              <template v-slot:[`item.sp`]="{ item }">
                {{ `${item.sp}` }}<br><span class="caption">{{ `(${item.spRank}位)` }}</span>
              </template>
            </v-data-table>
            <p align="right" class="subtitle-2">
              {{ `※全ポケモン${oriDataTableElems.count}体中(メガ、ゲンシ等含む)` }}
            </p>
          </v-col>
        </v-row>
      </v-container>
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
import RadarDiffGraph from '~/components/utils/graph/RadarDiffGraph'
export default {
  name: 'RaidResult',
  components: {
    H2Common,
    Loading,
    RadarDiffGraph
  },
  mixins: [SearchCommon],
  data () {
    return {
      idArr: [], // pokedexId
      resData: {},
      goRadarDatasets: [],
      goDataTableElems: {
        // data: [{name, remarks, hp, at, df, hpRank, atRank, dfRank}, ...]
        // count: 全ポケモン数
        data: [],
        count: 0
      },
      goHeaders: [
        { text: 'ポケモン', value: 'name' },
        { text: 'HP', value: 'hp' },
        { text: 'こうげき', value: 'at' },
        { text: 'ぼうぎょ', value: 'df' }
      ],
      oriRadarDatasets: [],
      oriDataListElems: {
        // data: [{name, remarks, hp, at, df, spAt, spDf, sp, hpRank, atRank, dfRank, spAtRank, spDfRank, spRank}, ...]
        // count: 全ポケモン数
        data: [],
        count: 0
      },
      oriHeaders: [
        { text: 'ポケモン', value: 'name' },
        { text: 'HP', value: 'hp' },
        { text: 'こうげき', value: 'at' },
        { text: 'ぼうぎょ', value: 'df' },
        { text: 'とくこう', value: 'spAt' },
        { text: 'とくぼう', value: 'spDf' },
        { text: 'すばやさ', value: 'sp' }
      ],

      colorArr: [
        { r: 255, g: 0, b: 0 }, // blue
        { r: 0, g: 0, b: 255 }, // red
        { r: 0, g: 255, b: 0 }, // lime
        { r: 255, g: 0, b: 255 }, // fuchsia
        { r: 0, g: 0, b: 128 }, // navy
        { r: 255, g: 255, b: 0 } // aqua
      ],
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
    this.idArr = this.makeIdArr(this.$route.query)
    const resData = this.$route.params.rd

    if (this.idArr.length < 2) {
      alert('pidは重複なしで2~6個指定する必要があります。')
      this.$router.back()
      return
    }

    if (resData) {
      // paramsでresDataが渡されている場合は、そのまま表示する
      this.resData = resData
      this.drawing(resData)
    } else {
      // paramsでresDataが渡されていない場合は、APIから取得してから表示する
      await this.post()
    }
  },
  methods: {
    async post () {
      await this.$axios
        .get('/api/raceDiff' + this.spreadArray({ idArr: this.idArr }))
        .then((res) => {
          const resData = res.data
          if (this.dispDialog(resData)) {
            return
          }
          this.resData = resData

          this.drawing(resData)
        })
        .catch(this.$processUtils.onErrorNot401)
    },
    drawing (resData) {
      this.goDataTableElems = this.getGoDataTableElems(resData)
      this.drawGoRadar(this.goDataTableElems)
      this.oriDataTableElems = this.getOriDataTableElems(resData)
      this.drawOriRadar(this.oriDataTableElems)
    },
    /**
     * GO種族値のv-data-tableに表示させる用の連想配列を取得する。
     *
     * @param resData
     */
    getGoDataTableElems (resData) {
      const elems = {
        data: [],
        count: 0
      }
      // data: [{name, remarks, hp, at, df, hpRank, atRank, dfRank}, ...]
      resData.raceArr.forEach((race) => {
        const gp = race.goPokedex
        elems.data.push({
          name: gp.name,
          remarks: gp.remarks,
          hp: gp.hp,
          at: gp.attack,
          df: gp.defense,
          hpRank: this.rank(race.goPokedex.hp, resData.statistics.goPokedexStats.goHpStats.list),
          atRank: this.rank(race.goPokedex.attack, resData.statistics.goPokedexStats.goAtStats.list),
          dfRank: this.rank(race.goPokedex.defense, resData.statistics.goPokedexStats.goDfStats.list)
        })
      })
      elems.count = resData.statistics.goPokedexStats.goHpStats.list.length

      return elems
    },
    /**
     * GO種族値のレーダーチャートの値を設定する。
     *
     * @param goDataTableElems
     */
    drawGoRadar (goDataTableElems) {
      const datasets = []
      goDataTableElems.data.forEach((data, idx) => {
        // dataset = {elems: [hpRank, atRank, dfRank], label: name, color: color}
        const dataset = {}
        const elems = [data.hpRank, data.atRank, data.dfRank]
        dataset.elems = elems.map(r => goDataTableElems.count - r * 1 + 1)
        dataset.label = this.appendRemarks(data.name, data.remarks)
        dataset.color = this.colorArr[idx]
        datasets.push(dataset)
      })
      this.goRadarDatasets.push(...datasets)
    },
    /**
     * 原作種族値のv-data-tableに表示させる用の連想配列を取得する。
     *
     * @param resData
     */
    getOriDataTableElems (resData) {
      const elems = {
        data: [],
        count: 0
      }
      // data: [{name, remarks, hp, at, df, spAt, spDf, sp, hpRank, atRank, dfRank, spAtRank, spDfRank, spRank}, ...]
      resData.raceArr.forEach((race) => {
        const p = race.pokedex
        elems.data.push({
          name: p.name,
          remarks: p.remarks,
          hp: p.hp,
          at: p.attack,
          df: p.defense,
          spAt: p.specialAttack,
          spDf: p.specialDefense,
          sp: p.speed,
          hpRank: this.rank(p.hp, resData.statistics.pokedexStats.hpStats.list),
          atRank: this.rank(p.attack, resData.statistics.pokedexStats.atStats.list),
          dfRank: this.rank(p.defense, resData.statistics.pokedexStats.dfStats.list),
          spAtRank: this.rank(p.specialAttack, resData.statistics.pokedexStats.spAtStats.list),
          spDfRank: this.rank(p.specialDefense, resData.statistics.pokedexStats.spDfStats.list),
          spRank: this.rank(p.speed, resData.statistics.pokedexStats.spStats.list)
        })
      })
      elems.count = resData.statistics.pokedexStats.hpStats.list.length

      return elems
    },
    /**
     * 原作種族値のレーダーチャートの値を設定する。
     *
     * @param oriDataTableElems
     */
    drawOriRadar (oriDataTableElems) {
      const datasets = []
      oriDataTableElems.data.forEach((data, idx) => {
        // dataset = {elems: [hpRank, atRank, spAtRank, spRank, spDfRank, dfRank], label: name, color: color}
        const dataset = {}
        // elemsはレーダチャート描画のため値をリバースする。
        const elems = [data.hpRank, data.atRank, data.spAtRank, data.spRank, data.spDfRank, data.dfRank]
        dataset.elems = elems.map(r => oriDataTableElems.count - r * 1 + 1)
        dataset.label = this.appendRemarks(data.name, data.remarks)
        dataset.color = this.colorArr[idx]
        datasets.push(dataset)
      })
      this.oriRadarDatasets.push(...datasets)
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
    },
    /**
     * queryのpidからidArrを生成する。
     */
    makeIdArr (query) {
      const idArr = []
      for (const [key, value] of Object.entries(query)) {
        if (/^pid[1-6]/.test(key) && typeof value === 'string') {
          idArr.push(value)
        }
      }
      return idArr
    }
  }
}
</script>

<style>
.mdi-circle-half-full::before {
  transform: rotate(90deg);
}
#go-poke-radar {
  max-width: 500px;
  max-height: 500px;
}
#ori-poke-radar {
  max-width: 500px;
  max-height: 500px;
}
</style>
