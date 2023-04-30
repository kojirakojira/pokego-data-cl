<template>
  <div>
    <H2Common>
      {{ getSearchPatternName('plList') }}
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
            個体値<br>(攻撃 - 防御 - HP)
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            {{ `${resData.iva} - ${resData.ivd} - ${resData.ivh}` }}
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            md="12"
            lg="12"
            xl="12"
            class="col-title"
          >
            PLとCP一覧
          </v-col>
          <v-col cols="12" md="12" lg="12" xl="12">
            <v-data-table
              :headers="headers"
              :items="resData.plList"
              hide-default-footer
              :mobile-breakpoint="200"
              :footer-props="{ 'items-per-page-options': [-1] }"
              no-data-text="loading now..."
              no-results-text="該当するデータがありません。"
            />
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
import OgpPokemon from '~/components/search/OgpPokemon'
import Loading from '~/components/Loading'
export default {
  name: 'ScpRankResult',
  components: {
    H2Common,
    Loading
  },
  mixins: [SearchCommon, OgpPokemon],
  data () {
    return {
      searchParam: {
        id: null, // pokedexId,
        iv: null // IndividualValue
      },
      resData: {
        plList: {}
      },
      headers: [
        { text: 'PL', value: 'pl' },
        { text: 'CP', value: 'cp' }],
      isLoading: true

    }
  },
  async beforeMount () {
    this.searchParam.id = this.$route.query.pid
    this.searchParam.iv = this.$route.query.iv
    let resData = this.$route.params.rd

    if (!resData) {
      // paramsでresDataが渡されていない場合は、APIから取得してから表示する
      if (!this.checkIv(this.searchParam.iv)) {
        alert('正しくない個体値が設定されました。')
        this.$router.back()
      }
      resData = await this.get()
    }

    if (!resData) {
      // resDataを取得できなかった場合
      return
    }

    this.resData = resData
    this.isLoading = false
  },
  methods: {
    async get () {
      const res = await this.$axios
        .get('/api/plList', {
          params: {
            id: this.searchParam.id,
            iva: this.searchParam.iv.substring(0, 2),
            ivd: this.searchParam.iv.substring(2, 4),
            ivh: this.searchParam.iv.substring(4, 6)
          }
        })
        .catch(this.$processUtils.onErrorNot401)
      const resData = res.data
      if (this.dispDialog(resData)) {
        return
      }
      return resData
    },
    /**
     * ivをチェックする。正しい場合はtrue
     */
    checkIv (iv) {
      if (!iv) { return false }

      if (iv.length !== 6 || isNaN(iv)) {
        return false
      }

      const ivArr = [iv.substring(0, 2), iv.substring(2, 4), iv.substring(4, 6)]
      for (const i in ivArr) {
        if (!(ivArr[i] >= 0 && ivArr[i] <= 15)) {
          return false
        }
      }
      return true
    }
  },
  head () {
    return {
      title: `${this.ogp_name}の情報`,
      meta: [
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: `${this.ogp_name}の情報 - ペリずかん` },
        { property: 'og:url', content: process.env.VUE_APP_URL + this.$route.path },
        { property: 'og:site_name', content: 'ペリずかん' },
        { property: 'og:description', content: `${this.ogp_name}のPLごとのCPを確認できます。` },
        { property: 'og:image', content: this.ogp_image }
      ]
    }
  }
}
</script>
