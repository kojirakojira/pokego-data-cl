<template>
  <div>
    <div>
      <H2Common>
        {{ getSearchPatternName('threeGalarBirds') }}
      </H2Common>
    </div>
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
                  <v-row class="searched-param">
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      CP
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ resData.cp }}
                    </v-col>
                  </v-row>
                  <v-row class="searched-param">
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      天候ブースト
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ resData.wbFlg ? 'あり' : 'なし' }}
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="subtitle-2">
            野生ポケモンにおけるPLは1～30、個体値はHP、こうげき、ぼうぎょそれぞれ最低値保証はなく0～15の振れ幅があります。天候ブーストの場合、PLは6～35、個体値は4～15になります。
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="12" lg="12" xl="12">
            <h3>
              {{ `個体値一覧(CP${resData.cp})` }}
            </h3>
          </v-col>
          <v-col
            cols="12"
            md="12"
            lg="12"
            xl="12"
            align="right"
            class="subtitle-2"
          >
            {{ `該当する個体数：${resData.ivList?.length}` }}
          </v-col>
          <v-col>
            <v-data-table
              :headers="headers"
              :items="resData.ivList"
              :footer-props="{ 'items-per-page-options': [-1] }"
              hide-default-footer
              no-data-text="loading now..."
              no-results-text="該当するデータがありません。"
            >
              <template v-slot:[`item.percent`]="{ item }">
                {{ item.percent + '%' }}
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
  name: 'ThreeGalarBirdsResult',
  components: {
    H2Common,
    Loading
  },
  mixins: [SearchCommon, OgpPokemon],
  data () {
    return {
      searchParam: {},
      resData: {},

      headers: [
        { text: '№', value: 'no' },
        { text: 'PL', value: 'pl' },
        { text: 'AT', value: 'iva' },
        { text: 'DF', value: 'ivd' },
        { text: 'HP', value: 'ivh' },
        { text: '%', value: 'percent' }],
      isLoading: true
    }
  },
  async beforeMount () {
    this.searchParam.id = this.$route.query.pid
    this.searchParam.cp = this.$route.query.cp
    this.searchParam.wbFlg = this.$route.query.wbFlg
    const resData = this.$route.params.rd

    if (resData) {
      // paramsでresDataが渡されている場合は、そのまま表示する
      this.resData = resData
    } else {
      // paramsでresDataが渡されていない場合は、APIから取得してから表示する
      this.resData = await this.get()
    }

    if (this.resData?.ivList?.length) {
      this.$store.dispatch('getToast', { msg: `${this.resData.ivList?.length}パターンの個体値が該当します！`, id: 'unchi' })
    }
    this.isLoading = !this.resData
  },
  methods: {
    async get () {
      const res = await this.$axios
        .get('/api/threeGalarBirds', { params: this.searchParam })
      const resData = res.data
      if (!this.dispDialog(resData)) {
        return
      }
      return resData
    }
  },
  head () {
    return {
      title: `${this.ogp_name}の野生個体値`,
      meta: [
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: `${this.ogp_name}の野生個体値 - ペリずかん` },
        { property: 'og:url', content: process.env.VUE_APP_URL + this.$route.path },
        { property: 'og:site_name', content: 'ペリずかん' },
        { property: 'og:description', content: `野生で出現した${this.ogp_name}のCPから、有り得る個体値を一覧で表示させることができます。` },
        { property: 'og:image', content: this.ogp_image }
      ]
    }
  }
}
</script>
