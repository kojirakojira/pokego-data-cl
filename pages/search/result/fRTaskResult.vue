<template>
  <div>
    <H2Common>
      {{ getSearchPatternName('fRTask') }}
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
            CP
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            {{ `${resData.minCp} ～ ${resData.maxCp}` }}
          </v-col>
        </v-row>
        <v-row>
          <v-col class="caption">
            ※フィールドリサーチの報酬は、天候ブーストの影響を受けません。
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
export default {
  name: 'FRTaskResult',
  components: {
    H2Common,
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
    } else {
      // paramsでresDataが渡されていない場合は、APIから取得してから表示する
      await this.get()
    }
  },
  methods: {
    async get () {
      await this.$axios
        .get('/api/fRTask', {
          params: {
            id: this.id
          }
        })
        .then((res) => {
          this.resData = res.data
        })
        .catch((err) => {
          if (err.response.status !== 401) {
            alert('何らかのエラーが発生しました。')
            this.$router.back()
          }
        })
    }
  }
}
</script>
