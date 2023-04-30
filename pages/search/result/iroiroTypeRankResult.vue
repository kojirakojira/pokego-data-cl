<template>
  <div>
    <H2Common>
      {{ getSearchPatternName('iroiroTypeRank') }}
    </H2Common>
    <div v-if="!isLoading">
      <v-container>
        <v-row>
          <v-col class="body-2">
            ランキング：
            {{ resData.searchPattern }}
          </v-col>
        </v-row>
        <v-row>
          <v-col class="body-2" align="right">
            タイプ数：
            {{ resData.typeRankList.length }}
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table
              :headers="headers"
              :items="resData.typeRankList"
              hide-default-footer
              mobile-breakpoint="400"
              no-data-text="loading now..."
              no-results-text="該当するデータがありません。"
              :footer-props="{ 'items-per-page-options': [-1] }"
            >
              <template v-slot:[`item.twoTypeKey`]="{ item }">
                <span
                  v-if="item.twoTypeKey.type1"
                  :style="`background-color: ${$editUtils.getRGB(item.twoTypeKey.type1)};'}`"
                  class="type"
                >
                  {{ toJpn(item.twoTypeKey.type1) }}
                </span>
                <span
                  v-if="item.twoTypeKey.type2"
                  :style="`background-color: ${$editUtils.getRGB(item.twoTypeKey.type2)};'}`"
                  class="type"
                >
                  {{ toJpn(item.twoTypeKey.type2) }}
                </span>
              </template>
              <template v-slot:[`item.msgs`]="{ item }">
                <v-list style="background-color: transparent;" dense>
                  <v-list-item
                    v-for="(v, i) in item.msgs"
                    :key="item.twoTypeKey.type1 + item.twoTypeKey.type2 + i"
                    class="px-0"
                  >
                    <v-list-item-content>
                      <!-- eslint-disable-next-line vue/no-v-html -->
                      <div v-html="typeDecoration(v, resData.msgDecoration)" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
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
export default {
  name: 'XTypeResult',
  components: {
    H2Common
  },
  mixins: [SearchCommon],
  data () {
    return {
      searchParam: {},
      resData: {},
      headers: [
        { text: '順位', value: 'rank', align: 'center' },
        { text: 'タイプ', value: 'twoTypeKey', sortable: false },
        { text: '', value: 'msgs' }
      ],
      definedXOwn: false,
      isLoading: true
    }
  },
  async beforeMount () {
    Object.entries(this.$route.query).forEach(([k, v]) => {
      this.searchParam[k] = v
    })

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
    this.headers.forEach((col) => {
      col.text = col.value === 'msgs' ? resData.msgsHeader : col.text
    })
    this.isLoading = false
  },
  methods: {
    async get () {
      const res = await this.$axios
        .get('/api/iroiroTypeRank' + this.spreadArray(this.searchParam))
        .catch(this.$processUtils.onErrorNot401)
      const resData = res.data
      if (this.dispDialog(resData)) {
        return
      }
      return resData
    },
    toJpn (v) {
      if (v === 'x') {
        return 'Xで仮定'
      }

      return this.$CONST.getValue(v, this.$CONST.TYPE)
    },
    /**
     * 第2引数がtrueの場合、タイプ名を装飾します。
     */
    typeDecoration (msg, isDecor) {
      return isDecor ? this.$editUtils.typeDecoration(msg) : msg
    }
  },
  head () {
    return {
      title: `${this.getSearchPatternName('iroiroTypeRank')}`,
      meta: [
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: `${this.getSearchPatternName('iroiroTypeRank')} - ペリずかん` },
        { property: 'og:url', content: process.env.VUE_APP_URL + this.$route.path },
        { property: 'og:site_name', content: 'ペリずかん' },
        { property: 'og:description', content: 'タイプについての色々なランキングを確認することができます。' },
        { property: 'og:image', content: process.env.VUE_APP_STATIC_URL + '/pokego/peripper-eyes.png' }
      ]
    }
  }
}
</script>

<style>
.stats {
  vertical-align: middle;
  margin: auto;
}
</style>
