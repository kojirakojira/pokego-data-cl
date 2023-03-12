<!-- ポケモンGOの種族値をレーダーチャートで表示させるためのコンポーネントです。 -->
<template>
  <RadarGraph
    chart-id="go-poke-radar"
    title="GO種族値"
    :labels="['HP', 'こうげき', 'ぼうぎょ']"
    :elems="goRadarElems"
    :min="1"
    :max="goPokedexStats.goHpStats.list.length"
    :rgb="[race.color.r, race.color.g, race.color.b]"
  />
</template>

<script>
import RadarGraph from '~/components/utils/graph/RadarGraph'
export default {
  name: 'GoRadarGraph',
  components: {
    RadarGraph
  },
  props: {
    /**
     * 表示するポケモン1個体の種族値
     */
    race: {
      type: Object,
      required: true
    },
    /**
     * 対象の全てのポケモンのHP,攻撃,防御のソートされたリストを持つObject
     */
    goPokedexStats: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      // race.goPokedexのキーとgoPokedexStatsのキーの対比
      goStatsItems: [
        { key: 'hp', statsKey: 'goHpStats' },
        { key: 'attack', statsKey: 'goAtStats' },
        { key: 'defense', statsKey: 'goDfStats' }
      ]
    }
  },
  computed: {
    goRadarElems () {
      const goRadarElems = []
      // 全ポケモン数
      const count = this.goPokedexStats.goHpStats.list.length
      // ['HP', 'こうげき', 'ぼうぎょ']
      this.goStatsItems.forEach((s) => {
        goRadarElems.push(
          count - (this.rank(this.race.goPokedex[s.key], this.goPokedexStats[s.statsKey].list) - 1)
        )
      })
      return goRadarElems
    }
  },
  methods: {
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
