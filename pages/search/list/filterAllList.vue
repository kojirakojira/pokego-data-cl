<template>
  <div>
    <H2Common>
      {{ getSearchPatternName(searchPattern) }}
    </H2Common>
    <FilteredItems :items="filteredItems" />
    <v-container
      :class="`${$vuetify.theme.dark ? 'darken-3' : 'lighten-5'} grey column-disabled-area pa-4 my-4`"
    >
      <v-row class="body-1">
        <v-col cols="8">
          <v-btn
            rounded
            small
            color="success"
            @click="showColumnDisabledArea = !showColumnDisabledArea"
          >
            列を非表示にする
          </v-btn>
        </v-col>
        <v-col cols="4" align="right">
          <v-btn
            rounded
            small
            outlined
            color="error"
            style="background-color: white;"
            title="絞り込み条件をクリア"
            @click="clear()"
          >
            クリア
          </v-btn>
        </v-col>
      </v-row>
      <transition name="fade">
        <div v-show="showColumnDisabledArea">
          <v-row>
            <v-col cols="12" sm="3" md="3" lg="3" class="py-0">
              <v-checkbox v-model="chkboxSelected" hide-details label="タイプ" value="type1" />
            </v-col>
            <v-col cols="12" sm="3" md="3" lg="3" class="py-0">
              <v-checkbox v-model="chkboxSelected" hide-details label="こうげき" value="attack" />
            </v-col>
            <v-col cols="12" sm="3" md="3" lg="3" class="py-0">
              <v-checkbox v-model="chkboxSelected" hide-details label="ぼうぎょ" value="defense" />
            </v-col>
            <v-col cols="12" sm="3" md="3" lg="3" class="py-0">
              <v-checkbox v-model="chkboxSelected" hide-details label="HP" value="hp" />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-container>
    <v-container>
      <v-row>
        <v-col class="py-0 body-2" align="right">
          {{ `絞り込み結果：${goPokedexList.length}件` }}
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table
            :headers="headerItems"
            :items="goPokedexList"
            :footer-props="{ 'items-per-page-options': [100, 1000] }"
            mobile-breakpoint="200"
            no-data-text="loading now..."
            no-results-text="該当するデータがありません。"
            class="pokemon-data-table"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>{{ item.index }}</td>
                <td>
                  <v-avatar size="36" style="float:left">
                    <v-img :src="item.image ? item.image : require('~/static/img/no-image.png')" />
                  </v-avatar>
                </td>
                <td>
                  {{ item.name }}
                  <template v-if="item.remarks">
                    <br><span class="caption">{{ `(${item.remarks})` }}</span>
                  </template>
                </td>
                <td v-show="!chkboxSelected.includes('type1')">
                  <span
                    :style="`background-color: ${getRGB(item.type1)}; margin-right:5px;`"
                    class="type"
                  >
                    {{ item.type1 }}
                  </span>
                  <span
                    v-if="item.type2"
                    :style="`background-color: ${getRGB(item.type2)};`"
                    class="type"
                  >
                    {{ item.type2 }}
                  </span>
                </td>
                <td v-show="!chkboxSelected.includes('attack')">
                  {{ item.attack }}
                </td>
                <td v-show="!chkboxSelected.includes('defense')">
                  {{ item.defense }}
                </td>
                <td v-show="!chkboxSelected.includes('hp')">
                  {{ item.hp }}
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import H2Common from '~/components/utils/H2Common'
import SearchCommon from '~/components/search/SearchCommon'
import FilteredItems from '~/components/search/FilteredItems'
export default {
  name: 'FilterAllList',
  components: {
    H2Common,
    FilteredItems
  },
  mixins: [SearchCommon],
  data () {
    return {
      searchPattern: 'filterAll',
      searchParam: {},
      filteredItems: [],
      goPokedexList: [],
      resData: {},
      headerItems: [
        { text: '№', value: 'index' },
        { text: '', value: 'image', sortable: false, width: '52px' },
        { text: 'ポケモン', value: 'name', fixed: true },
        { text: 'タイプ', value: 'type1' },
        { text: 'こうげき', value: 'attack' },
        { text: 'ぼうぎょ', value: 'defense' },
        { text: 'HP', value: 'hp' }
      ],
      tmpHeaderItems: [],
      chkboxSelected: [],
      showColumnDisabledArea: false
    }
  },
  watch: {
    chkboxSelected: {
      handler (af, bf) {
        let diff = null
        /** チェックしたとき */
        // 差分を求め、チェックした列を取得する。（配列で取得するが、要素数が2以上になることはない。）
        diff = af.filter(v => !bf.includes(v))
        if (diff.length) {
          // チェックした列をheaderItemsから削除する。
          const removeItems = this.headerItems.filter(v => !diff.includes(v.value))
          this.$set(this, 'headerItems', removeItems)
        }

        /** チェックを外したとき */
        // 差分を求め、チェックを外した列を取得する。（配列で取得するが、要素数が2以上になることはない。）
        diff = bf.filter(v => !af.includes(v))
        if (diff.length) {
          // チェックを外した列を、退避させたheaderItemsから取得する。
          const addItems = this.tmpHeaderItems.filter(v => diff.includes(v.value))
          // 追加する際のindexを求める。
          let idx = 0
          addItems.forEach((v) => {
            for (const i in this.headerItems) {
              if (v.index < this.headerItems[i].index) { break }
              idx++
            }
            // 追加
            this.headerItems.splice(idx, 0, v)
          })
        }
      },
      deep: true
    }
  },
  async beforeMount () {
    Object.entries(this.$route.query).forEach(([k, v]) => {
      this.searchParam[k] = v
    })

    const resData = this.$route.params.rd

    if (resData) {
      // paramsでresDataが渡されている場合は、そのまま表示する
      this.resData = resData
    } else {
      // paramsでresDataが渡されていない場合は、APIから取得してから表示する
      this.resData = await this.get()
    }

    // indexを追加してからセットする。
    this.$set(this, 'goPokedexList', this.resData.pfr.goPokedexList.map((v, i) => {
      v.index = i + 1
      return v
    }))
    this.$set(this, 'filteredItems', this.resData.pfr.filteredItems)
    // カラム絞り込み機能のため、ヘッダの項目を退避させる。
    this.tmpHeaderItems = this.headerItems.map((v, i) => {
      v.index = i + 1
      return v
    })
  },
  methods: {
    async get () {
      const res = await this.$axios
        .get('/api/filterAll' + this.spreadArray(this.searchParam))
        .catch((err) => {
          if (err.response.status !== 401) {
            alert('何らかのエラーが発生しました。')
            this.$router.back()
          }
        })
      const resData = res.data
      if (this.dispDialog(resData)) {
        return
      }
      return resData
    },
    /**
     * 引数にはタイプの日本語名を渡します。
     * 英語名でもどっちでも良かったので、API側のデータの持ち方の都合上日本語名にしました。
     */
    getRGB (type) {
      let rgb = null
      for (const t of this.$CONST.TYPE) {
        if (type === t.v) {
          rgb = `rgb(${t.r}, ${t.g}, ${t.b})`
          break
        }
      }
      return rgb
    },
    clear () {
      this.chkboxSelected.splice(0)
      this.$set(this, 'headerItems', this.tmpHeaderItems)
    }
  }
}
</script>

<style lang="scss">
.pokemon-data-table {
  th, td {
    padding: 0px !important;
  }
}
</style>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.column-disabled-area {
  max-width: 700px;
  border-radius: 20px;
}
</style>
