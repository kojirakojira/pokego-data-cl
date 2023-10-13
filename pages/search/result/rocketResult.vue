<template>
  <div>
    <H2Common>
      {{ getSearchPatternName('rocket') }}
    </H2Common>
    <div v-if="!isLoading">
      <v-container>
        <v-row>
          <v-col align="center">
            <v-card max-width="500px" class="searched-items">
              <v-card-title class="d-block body-2 pa-2 searched-params-title">
                検索条件
              </v-card-title>
              <v-card-text class="caption text-left py-1">
                <v-container>
                  <v-row>
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      図鑑№
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ resData.pokedexId | dispPdx }}
                    </v-col>
                  </v-row>
                  <v-row class="searched-param">
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      ポケモン
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ $editUtils.appendRemarks(resData.name, resData.remarks) }}
                    </v-col>
                  </v-row>
                  <v-row v-if="resData.sakaki" class="searched-param">
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      サカキ
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      サカキ戦勝利ボーナスとして算出
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <h3>
        CP<span v-if="resData.mega" class="subtitle-2">
          {{ `（${$editUtils.appendRemarks(resData.befMegaGp.name, resData.befMegaGp.remarks)}で算出）` }}
        </span>
      </h3>
      <v-container>
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
  name: 'RocketResult',
  components: {
    H2Common,
    Loading
  },
  mixins: [SearchCommon, OgpPokemon],
  data () {
    return {
      id: null, // pokedexId
      sakaki: false,
      resData: {},
      isLoading: true
    }
  },
  async beforeMount () {
    this.id = this.$route.query.pid
    this.sakaki = this.$route.query.sakaki
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
        .get('/api/rocket', {
          params: {
            id: this.id,
            sakaki: this.sakaki
          }
        })
      const resData = res.data
      if (!this.getToast(resData.message, resData.msgLevel)) {
        return
      }
      return resData
    }
  },
  head () {
    return {
      title: `${this.ogp_name}のロケット団勝利ボーナスCP`,
      meta: [
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: `${this.ogp_name}のロケット団勝利ボーナスCP - ペリずかん` },
        { property: 'og:url', content: process.env.VUE_APP_URL + this.$route.path },
        { property: 'og:site_name', content: 'ペリずかん' },
        { property: 'og:description', content: `ロケット団を倒した後、シャドウの${this.ogp_name}をゲットしたときのCPの振れ幅を確認できます。` },
        { property: 'og:image', content: this.ogp_image }
      ]
    }
  }
}
</script>
