<template>
  <div>
    <v-container>
      <p />
      <H2Common>
        {{ getSearchPatternName('raid') }}
      </H2Common>
    </v-container>
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
          {{ resData.name }}
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
          最高CP(最低CP)
        </v-col>
        <v-col cols="12" md="6" lg="6" xl="6">
          {{ `${resData.maxCp}(${resData.minCp})` }}
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
          天候ブースト時最高CP(最低CP)
        </v-col>
        <v-col cols="12" md="6" lg="6" xl="6">
          {{ `${resData.wbMaxCp}(${resData.wbMinCp})` }}
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import H2Common from '~/components/utils/H2Common'
import SearchCommon from '~/components/search/SearchCommon'
export default {
  name: 'RaidResult',
  components: {
    H2Common
  },
  mixins: [SearchCommon],
  data () {
    return {
      searchPatternName: 'レイドボスのCP検索',
      id: null, // pokedexId
      resData: {}

    }
  },
  beforeMount () {
    this.id = this.$route.query.pid
    const resData = this.$route.params.rd

    if (resData) {
      // paramsでresDataが渡されている場合は、そのまま表示する
      this.resData = resData
    } else {
      // paramsでresDataが渡されていない場合は、APIから取得してから表示する
      this.get()
    }
  },
  methods: {
    async get () {
      await this.$axios
        .get('/api/raid', {
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
