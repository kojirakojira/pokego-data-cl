<template>
  <div>
    <v-container>
      <p />
      <H2Common>
        {{ getSearchPatternName('raceDiff') }}
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
            ポケモン
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            <template
              v-for="(race, idx) in resData.raceArr"
            >
              <div :key="`p-name-${idx}`">
                <v-icon large :color="`rgba(${colorArr[idx].r}, ${colorArr[idx].g}, ${colorArr[idx].b}, 0.5)`">
                  mdi-circle-half-full
                </v-icon>{{ race.goPokedex.name }}
              </div>
            </template>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <RadarDiffGraph
              chart-id="go-poke-radar"
              title="GO種族値"
              :labels="goRadarLabels"
              :elems-arr="goRadarElems"
              :min="1"
              :max="resData.statistics.goPokedexStats.goHpStats.list.length"
              :color-arr="colorArr"
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
      goRadarLabels: ['HP', 'こうげき', 'ぼうぎょ'],
      goRadarElems: [],
      isLoading: true,

      colorArr: [
        { r: 255, g: 0, b: 0 }, // blue
        { r: 0, g: 0, b: 255 }, // red
        { r: 0, g: 255, b: 0 }, // lime
        { r: 255, g: 0, b: 255 }, // fuchsia
        { r: 0, g: 0, b: 128 }, // navy
        { r: 255, g: 255, b: 0 } // aqua
      ]
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
        .post('/api/raceDiff', { idArr: this.idArr }, {
          headers: {
            'content-type': 'application/json'
          }
        })
        .then((res) => {
          const resData = this.resData = res.data
          if (!resData.success) {
            alert(resData.message)
            this.$router.back()
            return
          }

          this.drawing(resData)
          console.log(this.resData)
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
    },
    /**
     * GO種族値のレーダーチャートの値を設定し、描画する。
     *
     * @param resData
     */
    drawGoRadar (resData) {
      // ['HP', 'こうげき', 'ぼうぎょ']
      const goValListArr = [
        resData.statistics.goPokedexStats.goHpStats.list,
        resData.statistics.goPokedexStats.goAtStats.list,
        resData.statistics.goPokedexStats.goDfStats.list
      ]
      const goValArr = []
      resData.raceArr.forEach((r) => {
        goValArr.push([r.goPokedex.hp, r.goPokedex.attack, r.goPokedex.defense])
      })
      for (const y in goValArr) {
        const elem = []
        for (const x in goValArr[y]) {
          elem.push(this.rank(goValArr[y][x], goValListArr[x]))
        }
        this.goRadarElems.push(elem)
      }
      console.log(this.goRadarElems)
    },
    /**
     * 順位を求める（ソートされた配列の中で何番目に出現するかを求める。）
     * @param val 値
     * @param arr 値の配列
     */
    rank (val, arr) {
      for (const i in arr) {
        if (arr[i] === val) {
          return i * 1 + 1
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
</style>
