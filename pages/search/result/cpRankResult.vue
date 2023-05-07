<template>
  <div>
    <H2Common>
      {{ getSearchPatternName('cpRank') }}
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
                      {{ appendRemarks(resData.goPokedex.name, resData.goPokedex.remarks) }}
                    </v-col>
                  </v-row>
                  <v-row class="searched-param" align="center">
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      個体値<br>(こうげき - ぼうぎょ - HP)
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ `${resData.iva} - ${resData.ivd} - ${resData.ivh}` }}
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
          <v-col cols="12" md="6" lg="6" xl="6" class="col-title">
            個体値ごとのCPの順位
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            {{ `${resData.cpRank.rank}位 / 4096位` }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6" lg="6" xl="6" class="col-title">
            CP(PL40時)
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            {{ resData.cpRank.cp }}
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
  name: 'CpRankResult',
  components: {
    H2Common,
    Loading
  },
  mixins: [SearchCommon, OgpPokemon],
  data () {
    return {
      searchParam: {
        id: null, // pokedexId,
        iv: null // 個体値
      },
      resData: {},
      isLoading: true

    }
  },
  async beforeMount () {
    this.searchParam.id = this.$route.query.pid
    this.searchParam.iv = this.$route.query.iv
    let resData = this.$route.params.rd

    if (!resData) {
      // paramsでresDataが渡されていない場合は、APIから取得してから表示する
      const msg = this.$checkIv({ item: this.searchParam.iv, itemName: '個体値' })
      if (msg) {
        alert(msg)
        this.$router.back()
        return
      }
      resData = await this.get()
    }

    if (!resData) {
      // resDataを取得できなかった場合
      return
    }

    console.log(resData)
    this.resData = resData
    this.isLoading = !this.isLoading
  },
  methods: {
    async get () {
      const res = await this.$axios
        .get('/api/cpRank', {
          params: {
            id: this.searchParam.id,
            iva: this.searchParam.iv.substring(0, 2),
            ivd: this.searchParam.iv.substring(2, 4),
            ivh: this.searchParam.iv.substring(4, 6)
          }
        })

      const resData = res.data
      if (this.dispDialog(resData)) {
        return
      }
      return resData
    }
  },
  head () {
    return {
      title: `${this.ogp_name}のPvP順位の一覧`,
      meta: [
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: `${this.ogp_name}のPvP順位の一覧 - ペリずかん` },
        { property: 'og:url', content: process.env.VUE_APP_URL + this.$route.path },
        { property: 'og:site_name', content: 'ペリずかん' },
        { property: 'og:description', content: `${this.ogp_name}のPvP順位の一覧を確認できます。` },
        { property: 'og:image', content: this.ogp_image }
      ]
    }
  }
}
</script>
