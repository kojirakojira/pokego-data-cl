<template>
  <div>
    <H2Common>
      {{ getSearchPatternName('shadow') }}
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
            {{ $editUtils.appendRemarks(resData.name, resData.remarks) }}
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
            通常時CP
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            {{ `${resData.minCp} ～ ${resData.maxCp}` }}
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
            天候ブースト時CP
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            {{ `${resData.wbMinCp} ～ ${resData.wbMaxCp}` }}
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
export default {
  name: 'ShadowResult',
  components: {
    H2Common,
    Loading
  },
  mixins: [SearchCommon, OgpPokemon],
  data () {
    return {
      id: null, // pokedexId
      resData: {},
      isLoading: true
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
      this.resData = await this.get()
    }

    this.isLoading = !this.resData
  },
  methods: {
    async get () {
      const res = await this.$axios
        .get('/api/shadow', {
          params: {
            id: this.id
          }
        })
      const resData = res.data
      if (!this.dispDialog(resData)) {
        return
      }
      return resData
    }
  },
  head () {
    return {
      title: `${this.ogp_name}のシャドウCP`,
      meta: [
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: `${this.ogp_name}のシャドウCP - ペリずかん` },
        { property: 'og:url', content: process.env.VUE_APP_URL + this.$route.path },
        { property: 'og:site_name', content: 'ペリずかん' },
        { property: 'og:description', content: `ロケット団を倒した後、シャドウの${this.ogp_name}をゲットしたときのCPの振れ幅を確認できます。` },
        { property: 'og:image', content: this.ogp_image }
      ]
    }
  }
}
</script>
