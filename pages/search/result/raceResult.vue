<template>
  <div>
    <H2Common>
      {{ getSearchPatternName('race') }}
    </H2Common>
    <div v-if="!isLoading">
      <FilteredItems :items="filteredItems" />
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
            強ポケ補正
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
              <span>各ステータスの順位を基準として表示しています。そうです。この世の中は相対評価なのです。</span>
            </v-tooltip>
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
            <GoRadarGraph
              :race="resData.race"
              :go-pokedex-stats="resData.statistics.goPokedexStats"
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
              <span>各ステータスの順位を基準として表示しています。そうです。この世界同様、ポケモンの世界でも競争が強いられているのです。</span>
            </v-tooltip>
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
            <OriRadarGraph
              :race="resData.race"
              :ori-stats-items="oriStatsItems"
              :pokedex-stats="resData.statistics.pokedexStats"
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
      <Loading split-scr />
    </div>
  </div>
</template>

<script>
import H2Common from '~/components/utils/H2Common'
import SearchCommon from '~/components/search/SearchCommon'
import OgpPokemon from '~/components/utils/OgpPokemon'
import Loading from '~/components/Loading'
import GoRadarGraph from '~/components/search/graph/GoRadarGraph'
import OriRadarGraph from '~/components/search/graph/OriRadarGraph'
import LineGraph from '~/components/utils/graph/LineGraph'
import FilteredItems from '~/components/search/FilteredItems'
export default {
  name: 'RaceResult',
  components: {
    H2Common,
    Loading,
    GoRadarGraph,
    OriRadarGraph,
    LineGraph,
    FilteredItems
  },
  mixins: [SearchCommon, OgpPokemon],
  data () {
    return {
      searchParam: {},
      resData: {
        race: {
          type1Color: {},
          type2Color: {}
        }
      },
      filteredItems: [],

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

      // レーダーチャートの横に配置する種族値(GO)
      goStatsItems: [
        { key: 'hp', name: 'HP' },
        { key: 'attack', name: 'こうげき' },
        { key: 'defense', name: 'ぼうぎょ' }
      ],
      // レーダーチャートの横に配置する種族値(原作)
      oriStatsItems: [
        { key: 'hp', name: 'HP' },
        { key: 'attack', name: 'こうげき' },
        { key: 'defense', name: 'ぼうぎょ' },
        { key: 'specialAttack', name: 'とくこう' },
        { key: 'specialDefense', name: 'とくぼう' },
        { key: 'speed', name: 'すばやさ' }],
      isLoading: true
    }
  },
  async beforeMount () {
    Object.entries(this.$route.query).forEach(([k, v]) => {
      const key = k === 'pid' ? 'id' : k
      this.searchParam[key] = v
    })

    let resData = this.$route.params.rd

    if (!resData) {
      // paramsでresDataが渡されていない場合は、APIから取得してから表示する
      resData = await this.get()
    }

    if (!resData) {
      // resDataを取得できなかった場合
      return
    }

    this.resData = resData
    this.filteredItems.push(...this.resData.filteredItems)
    this.isLoading = false
  },
  methods: {
    async get () {
      const res = await this.$axios
        .get('/api/race' + this.spreadArray(this.searchParam))
      const resData = res.data
      if (this.dispDialog(resData)) {
        return
      }
      return resData
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
  },
  head () {
    return {
      title: `${this.ogp_name}の種族値`,
      meta: [
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: `${this.ogp_name}の種族値 - ペリずかん` },
        { property: 'og:url', content: process.env.VUE_APP_URL + this.$route.path },
        { property: 'og:site_name', content: 'ペリずかん' },
        { property: 'og:description', content: `${this.ogp_name}の種族値を確認できます。` },
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
