<template>
  <div>
    <H2Common>
      {{ getSearchPatternName('evolution') }}
    </H2Common>
    <div v-if="!isLoading">
      <EvoInfo
        :pokedex-id="id"
        :evo-tree-info="resData.evoTreeInfo"
        :another-forms="resData.anotherForms"
        :bf-af-aot-forms="resData.bfAfAotForms"
        :race-map="resData.raceMap"
        router-link="search-result-evolutionResult"
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
import EvoInfo from '~/components/search/evolution/EvoInfo'
import Loading from '~/components/Loading'
export default {
  name: 'EvolutionResult',
  components: {
    H2Common,
    EvoInfo,
    Loading
  },
  mixins: [SearchCommon],
  data () {
    return {
      id: null, // pokedexId
      resData: {},

      isLoading: true
    }
  },
  watch: {
    $route (to) {
      if (to.query.pid !== this.id) {
        this.initial()
      }
    }
  },
  async beforeMount () {
    await this.initial()
  },
  beforeDestroy () {
    this.isLoading = true
  },
  methods: {
    async initial () {
      this.id = this.$route.query.pid
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
      this.isLoading = false
    },
    async get () {
      const res = await this.$axios
        .get('/api/evolution', { params: { id: this.id } })
        .catch(this.$processUtils.onErrorNot401)
      const resData = res.data
      if (this.dispDialog(resData)) {
        return
      }
      return resData
    }
  }
}
</script>
