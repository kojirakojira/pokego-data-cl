<template>
  <div>
    <H2Common>
      {{ getSearchPatternName('scpRankList') }}
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
            リーグ
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            {{ leagueDic[resData.league] }}
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="5"
            md="5"
            lg="5"
            xl="5"
            class="col-title"
          >
            PvP順位
          </v-col>
          <v-col
            cols="7"
            md="7"
            lg="7"
            xl="7"
            align="right"
            class="col-title"
          >
            <v-btn
              rounded
              color="info"
              x-small
              @click="onClickScpSpBtn"
            >
              {{ headers.length === 7 ? 'SCP,ステ積を表示する': 'SCP,ステ積を非表示にする' }}
            </v-btn>
          </v-col>
          <v-col cols="12" md="12" lg="12" xl="12">
            <v-data-table
              :headers="headers"
              :items="resData.scpRankList"
              mobile-breakpoint="300"
              :footer-props="{ 'items-per-page-options': [100, 500, 1000, -1] }"
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
  name: 'ScpRankListResult',
  components: {
    H2Common,
    Loading
  },
  mixins: [SearchCommon, OgpPokemon],
  data () {
    return {
      searchParam: {
        id: null, // pokedexId,
        league: null // league
      },
      resData: {
        scpRankList: [],
        league: ''
      },
      leagueDic: {
        sl: 'スーパーリーグ(CP1500以下)',
        gl: 'スーパーリーグ(CP1500以下)',
        hl: 'ハイパーリーグ(CP2500以下)',
        ul: 'ハイパーリーグ(CP2500以下)',
        ml: 'マスターリーグ'
      },

      headers: [
        { text: 'ランク', value: 'rank' },
        { text: 'AT', value: 'iva' },
        { text: 'DF', value: 'ivd' },
        { text: 'HP', value: 'ivh' },
        { text: 'PL', value: 'pl' },
        { text: 'CP', value: 'cp' },
        { text: '%', value: 'percent' }],
      isLoading: true

    }
  },
  async beforeMount () {
    this.searchParam.id = this.$route.query.pid
    this.searchParam.league = this.$route.query.league
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
        .get('/api/scpRankList', { params: this.searchParam })

      const resData = res.data
      if (!this.dispDialog(resData)) {
        return
      }
      return resData
    },
    onClickScpSpBtn () {
      const headers = this.headers
      if (headers.length === 7) {
        // 非表示時
        headers.push({ text: '(SCP)', value: 'scp' })
        headers.push({ text: '(ステ積)', value: 'sp' })
      } else if (headers.length === 9) {
        // 表示時
        headers.pop()
        headers.pop()
      }
      this.$set(this, 'headers', headers)
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
