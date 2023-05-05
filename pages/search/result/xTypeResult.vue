<template>
  <div>
    <H2Common>
      {{ getSearchPatternName('xType') }}
    </H2Common>
    <div v-if="!isLoading">
      <v-container v-if="resData.typeComments">
        <v-row>
          <v-col>
            <TypeComments :comments="resData.typeComments">
              あ、どうも。
              <span
                v-if="definedXOwn ? resData.opp1: resData.own1"
                :style="`background-color: ${$editUtils.getRGB(definedXOwn ? resData.opp1: resData.own1)};'}`"
                class="type"
              >
                {{ toJpn(definedXOwn ? resData.opp1: resData.own1) }}
              </span>
              <span
                v-if="definedXOwn ? resData.opp2: resData.own2"
                :style="`background-color: ${$editUtils.getRGB(definedXOwn ? resData.opp2: resData.own2)};'}`"
                class="type"
              >
                {{ toJpn(definedXOwn ? resData.opp2: resData.own2) }}
              </span>
              の特徴について簡単に説明します。
            </TypeComments>
          </v-col>
        </v-row>
      </v-container>
      <v-container>
        <v-row>
          <v-col cols="12" md="6" lg="6" xl="6">
            じぶんのタイプ：
            <span
              v-if="resData.own1"
              :style="`background-color: ${$editUtils.getRGB(resData.own1)};'}`"
              class="type"
            >
              {{ toJpn(resData.own1) }}
            </span>
            <span
              v-if="resData.own2"
              :style="`background-color: ${$editUtils.getRGB(resData.own2)};'}`"
              class="type"
            >
              {{ toJpn(resData.own2) }}
            </span>
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            あいてのタイプ：
            <span
              v-if="resData.opp1"
              :style="`background-color: ${$editUtils.getRGB(resData.opp1)};'}`"
              class="type"
            >
              {{ toJpn(resData.opp1) }}
            </span>
            <span
              v-if="resData.opp2"
              :style="`background-color: ${$editUtils.getRGB(resData.opp2)};'}`"
              class="type"
            >
              {{ toJpn(resData.opp2) }}
            </span>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            重視ポイント：
            {{ resData.emphasis }}
          </v-col>
        </v-row>
      </v-container>
      <v-container>
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
              <template v-slot:[`item.atkMsgs`]="{ item }">
                <v-list style="background-color: transparent;" dense>
                  <v-list-item v-for="(v, i) in item.atkMsgs" :key="item.twoTypeKey.type1 + item.twoTypeKey.type2 + i">
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <div v-html="combiDecoration(v, true)" />
                  </v-list-item>
                </v-list>
              </template>
              <template v-slot:[`item.defMsgs`]="{ item }">
                <v-list style="background-color: transparent;" dense>
                  <v-list-item v-for="(v, i) in item.defMsgs" :key="item.twoTypeKey.type1 + item.twoTypeKey.type2 + i">
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <div v-html="combiDecoration(v, false)" />
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
import TypeComments from '~/components/search/type/TypeComments'
export default {
  name: 'XTypeResult',
  components: {
    H2Common,
    TypeComments
  },
  mixins: [SearchCommon],
  data () {
    return {
      searchParam: {},
      resData: {},
      headers: [
        { text: '有利順位', value: 'rank', align: 'center' },
        { text: 'タイプ', value: 'twoTypeKey', sortable: false, align: 'center' },
        { text: 'こうげき時相性', value: 'atkMsgs', sortable: false, align: 'center' },
        { text: 'ぼうぎょ時相性', value: 'defMsgs', sortable: false, align: 'center' }
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
    // Xを「じぶん」側に定義したかどうか
    this.definedXOwn = !!this.isIncludeX(resData.own1, resData.own2)
    this.isLoading = false
  },
  methods: {
    async get () {
      const res = await this.$axios
        .get('/api/xType' + this.spreadArray(this.searchParam))
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
     * 引数に指定された値に'x'が含まれているかを判定する。
     * 残余引数で引数の値を配列で受け取る。
     */
    isIncludeX (...args) {
      return args.filter(v => v === 'x').length
    },
    /**
     * 相性を伝えるメッセージを装飾します。
     */
    combiDecoration (msg, atkFlg) {
      let ret = this.$editUtils.typeDecoration(msg)

      const regex = new RegExp('（×.*）')
      ret = ret.replace(regex, (match) => {
        let str = match
        const mult = match.substring(2, match.length - 1) * 1
        if ((atkFlg && mult < 1) || (!atkFlg && mult > 1)) {
          str = '<span style="color: blue;">' + match + '</span>'
        }
        return str
      })
      return ret
    }
  },
  head () {
    return {
      title: `${this.getSearchPatternName('xType')}の結果`,
      meta: [
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: `${this.getSearchPatternName('xType')}の結果 - ペリずかん` },
        { property: 'og:url', content: process.env.VUE_APP_URL + this.$route.path },
        { property: 'og:site_name', content: 'ペリずかん' },
        { property: 'og:description', content: 'じぶんのポケモン、あいてのポケモンのタイプのうち1つをXと仮定し、何のタイプであれば有利になるかを求めることができます。' },
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
