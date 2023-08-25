<template>
  <div>
    <H2Common>
      {{ getSearchPatternName('scpRank') }}
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
            個体値<br>(攻撃 - 防御 - HP)
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            {{ resData.scpSlRank.rank ? `${resData.scpSlRank.iva} - ${resData.scpSlRank.ivd} - ${resData.scpSlRank.ivh}` : '' }}
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
            PvP順位
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            <p>{{ `スーパーリーグ：${resData.scpSlRank.rank}位` }}</p>
            <p>{{ `ハイパーリーグ：${resData.scpHlRank.rank}位` }}</p>
            <p>{{ `マスターリーグ：${resData.scpMlRank.rank}位` }}</p>
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
            詳細   <span class="subtitle-2">※スマホの場合は画面を横にすると見やすいです。</span>
          </v-col>
          <v-col cols="12" md="12" lg="12" xl="12">
            <v-data-table
              :headers="headers"
              :items="scpRankArr"
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
        scpSlRank: {},
        scpHlRank: {},
        scpMlRank: {}
      },
      headers: [
        { text: 'リーグ', value: 'league' },
        { text: '順位', value: 'rank' },
        { text: 'PL', value: 'pl' },
        { text: 'CP', value: 'cp' },
        { text: '%', value: 'percent' },
        { text: '(SCP)', value: 'scp' },
        { text: '(ステ積)', value: 'sp' }],
      scpRankArr: [],
      search: '',
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
      }
      resData = await this.get()
    }

    if (!resData) {
      // resDataを取得できなかった場合
      return
    }

    this.resData = resData
    this.setScpRankArr(this.resData)
    this.isLoading = false
  },
  methods: {
    async get () {
      const res = await this.$axios
        .get('/api/scpRank', {
          params: {
            id: this.searchParam.id,
            iva: this.searchParam.iv.substring(0, 2),
            ivd: this.searchParam.iv.substring(2, 4),
            ivh: this.searchParam.iv.substring(4, 6)
          }
        })
      const resData = res.data
      if (!this.dispDialog(resData)) {
        return
      }
      return resData
    },
    setScpRankArr (resData) {
      const scpRankArr = [resData.scpSlRank, resData.scpHlRank, resData.scpMlRank]
      const leagueArr = ['スーパーリーグ', 'ハイパーリーグ', 'マスターリーグ']
      this.scpRankArr.splice(0)
      for (const i in scpRankArr) {
        this.scpRankArr.push({
          league: leagueArr[i],
          rank: scpRankArr[i].rank,
          pl: scpRankArr[i].pl,
          cp: scpRankArr[i].cp,
          percent: scpRankArr[i].percent,
          scp: scpRankArr[i].scp,
          sp: scpRankArr[i].sp
        })
      }
    }
  },
  head () {
    return {
      title: `${this.ogp_name}のPvP順位`,
      meta: [
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: `${this.ogp_name}のPvP順位 - ペリずかん` },
        { property: 'og:url', content: process.env.VUE_APP_URL + this.$route.path },
        { property: 'og:site_name', content: 'ペリずかん' },
        { property: 'og:description', content: `${this.ogp_name}のPvP順位を確認できます。` },
        { property: 'og:image', content: this.ogp_image }
      ]
    }
  }
}
</script>
