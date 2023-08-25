<template>
  <div>
    <H2Common>
      {{ getSearchPatternName('cpRankList') }}
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
                      {{ resData.goPokedex.pokedexId | dispPdx }}
                    </v-col>
                  </v-row>
                  <v-row class="searched-param">
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      ポケモン
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ $editUtils.appendRemarks(resData.goPokedex.name, resData.goPokedex.remarks) }}
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <h3>
        算出結果
      </h3>
      <v-container>
        <v-row>
          <v-col cols="12" class="col-title">
            CPランキング
          </v-col>
          <v-col col="12" align="center">
            <v-data-table
              :headers="headers"
              :items="resData.cpRankList"
              hide-default-footer
              mobile-breakpoint="300"
              style="max-width: 400px;"
              no-data-text="loading now..."
              no-results-text="該当するデータがありません。"
              :footer-props="{ 'items-per-page-options': [-1] }"
            >
              <template v-slot:[`item.goPokedex.pokedexId`]="{ item }">
                {{ item.goPokedex.pokedexId | dispPdx }}
              </template>
              <template v-slot:[`item.goPokedex.name`]="{ item }">
                {{ $editUtils.appendRemarks(item.goPokedex.name, item.goPokedex.remarks) }}
              </template>
            </v-data-table>
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
  name: 'CpRankListResult',
  components: {
    H2Common,
    Loading
  },
  mixins: [SearchCommon, OgpPokemon],
  data () {
    return {
      searchParam: {
        id: null // pokedexId
      },
      resData: {},
      headers: [
        { text: '順位', value: 'rank' },
        { text: 'こうげき', value: 'iva' },
        { text: 'ぼうぎょ', value: 'ivd' },
        { text: 'HP', value: 'ivh' },
        { text: 'CP(PL40)', value: 'cp' }
      ],
      isLoading: true

    }
  },
  async beforeMount () {
    this.searchParam.id = this.$route.query.pid
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
    this.isLoading = !this.isLoading
  },
  methods: {
    async get () {
      const res = await this.$axios
        .get('/api/cpRankList', { params: this.searchParam })

      const resData = res.data
      if (!this.dispDialog(resData)) {
        return
      }
      return resData
    }
  },
  head () {
    return {
      title: `${this.ogp_name}のCPランキング`,
      meta: [
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: `${this.ogp_name}のCPランキング - ペリずかん` },
        { property: 'og:url', content: process.env.VUE_APP_URL + this.$route.path },
        { property: 'og:site_name', content: 'ペリずかん' },
        { property: 'og:description', content: `${this.ogp_name}のCPランキングを確認することができます。` },
        { property: 'og:image', content: this.ogp_image }
      ]
    }
  }
}
</script>
