<!-- ポケモン原作の種族値をレーダーチャートで表示させるためのコンポーネントです。 -->
<template>
  <RadarGraph
    title="原作種族値"
    :labels="['HP', 'こうげき', 'とくこう', 'すばやさ', 'とくぼう', 'ぼうぎょ']"
    :elems="oriRadarElems"
    :min="1"
    :max="pokedexStats.hpStats.list.length"
    :rgb="[race.color.r, race.color.g, race.color.b]"
  />
</template>

<script>
import RadarGraph from '~/components/utils/graph/RadarGraph'
export default {
  name: 'OriRadarGraph',
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
     * 対象の全てのポケモンのHP,こうげき,ぼうぎょ,とくこう,とくぼう,すばやさの
     * ソートされたリストを持つObject
     */
    pokedexStats: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      // race.pokedexのキーとpokedexStatsのキーの対比
      oriStatsItems: [
        { key: 'hp', statsKey: 'hpStats' },
        { key: 'attack', statsKey: 'atStats' },
        { key: 'specialAttack', statsKey: 'spAtStats' },
        { key: 'speed', statsKey: 'spStats' },
        { key: 'specialDefense', statsKey: 'spDfStats' },
        { key: 'defense', statsKey: 'dfStats' }]
    }
  },
  computed: {
    oriRadarElems () {
      const oriRadarElems = []
      // 全ポケモン数
      const count = this.pokedexStats.hpStats.list.length
      // ['HP', 'こうげき', 'とくこう', 'すばやさ', 'とくぼう', 'ぼうぎょ']
      this.oriStatsItems.forEach((s) => {
        oriRadarElems.push(
          count - (this.rank(this.race.pokedex[s.key], this.pokedexStats[s.statsKey].list) - 1)
        )
      })
      return oriRadarElems
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
