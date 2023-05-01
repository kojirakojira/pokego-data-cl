<template>
  <div>
    <H2Common>
      {{ getSearchPatternName('afterEvoCp') }}
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
                      {{ resData.searchPokemon.pokedexId | dispPdx }}
                    </v-col>
                  </v-row>
                  <v-row class="searched-param">
                    <v-col cols="7" md="6" lg="6" xl="6" class="pa-1">
                      ポケモン
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ appendRemarks(resData.searchPokemon.name, resData.searchPokemon.remarks) }}
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
                      (PL)
                    </v-col>
                    <v-col cols="5" md="6" lg="6" xl="6" class="pa-1">
                      {{ `(${resData.pl})` }}
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <h3>
              進化後のポケモン
            </h3>
            <v-data-table
              v-if="resData.afEvoList.length"
              :headers="headers"
              :items="resData.afEvoList"
              hide-default-footer
              mobile-breakpoint="400"
              no-data-text="loading now..."
              no-results-text="該当するデータがありません。"
              :footer-props="{ 'items-per-page-options': [-1] }"
            >
              <template v-slot:[`item.goPokedex.pokedexId`]="{ item }">
                {{ item.goPokedex.pokedexId | dispPdx }}
              </template>
              <template v-slot:[`item.goPokedex.name`]="{ item }">
                {{ appendRemarks(item.goPokedex.name, item.goPokedex.remarks) }}
              </template>
            </v-data-table>
            <div v-else class="pl-4">
              なし
            </div>
          </v-col>
        </v-row>
        <v-row v-if="resData.anotherFormList.length">
          <v-col cols="12">
            <h3>
              別のすがた
            </h3>
            <v-data-table
              :headers="headers"
              :items="resData.anotherFormList"
              hide-default-footer
              mobile-breakpoint="400"
              no-data-text="loading now..."
              no-results-text="該当するデータがありません。"
              :footer-props="{ 'items-per-page-options': [-1] }"
            >
              <template v-slot:[`item.goPokedex.pokedexId`]="{ item }">
                {{ item.goPokedex.pokedexId | dispPdx }}
              </template>
              <template v-slot:[`item.goPokedex.name`]="{ item }">
                {{ appendRemarks(item.goPokedex.name, item.goPokedex.remarks) }}
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
  name: 'AfterEvoCpResult',
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
      resData: {},
      headers: [
        { text: '図鑑№', value: 'goPokedex.pokedexId' },
        { text: 'ポケモン', value: '.goPokedex.name' },
        { text: 'CP', value: 'cp' }
      ],
      isLoading: true

    }
  },
  async beforeMount () {
    this.searchParam.id = this.$route.query.pid
    this.searchParam.iv = this.$route.query.iv
    this.searchParam.cp = this.$route.query.cp
    let resData = this.$route.params.rd

    if (!resData) {
      // paramsでresDataが渡されていない場合は、APIから取得してから表示する
      if (!this.checkIv(this.searchParam.iv)) {
        alert('正しくない個体値が設定されました。')
        this.$router.back()
      }
      if (!this.checkCp(this.searchParam.cp)) {
        alert('正しくないCPが設定されました。')
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
        .get('/api/afterEvoCp', {
          params: {
            id: this.searchParam.id,
            iva: this.searchParam.iv.substring(0, 2),
            ivd: this.searchParam.iv.substring(2, 4),
            ivh: this.searchParam.iv.substring(4, 6),
            cp: this.searchParam.cp
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
    },
    /**
     * cpをチェックする。正しい場合はtrue
     */
    checkCp (cp) {
      if (!cp) { return false }

      return !isNaN(cp)
    }
  },
  head () {
    return {
      title: `${this.ogp_name}の進化後CP`,
      meta: [
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: `${this.ogp_name}の進化後CP - ペリずかん` },
        { property: 'og:url', content: process.env.VUE_APP_URL + this.$route.path },
        { property: 'og:site_name', content: 'ペリずかん' },
        { property: 'og:description', content: `${this.ogp_name}の進化後CPを確認できます。` },
        { property: 'og:image', content: this.ogp_image }
      ]
    }
  }
}
</script>
