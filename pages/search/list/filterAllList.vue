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
            <v-col v-for="chkItem in disabledChkboxes" :key="`chkbox-${chkItem.label}`" class="py-0">
              <v-checkbox
                v-model="chkboxSelected"
                hide-details
                :label="chkItem.label"
                :value="chkItem.value"
                style="white-space: nowrap;"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-container>
    <v-container>
      <v-row>
        <v-col class="py-0 body-2" align="right">
          {{ `絞り込み結果：${gpAndCpList.length}件` }}
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table
            :headers="headerItems"
            :items="gpAndCpList"
            :footer-props="{ 'items-per-page-options': [100, 1000] }"
            mobile-breakpoint="200"
            no-data-text="loading now..."
            no-results-text="該当するデータがありません。"
            class="pokemon-data-table"
            @click:row="(item) => {
              $router.push({ name: 'search-result-abundance', query: { pid: item.goPokedex.pokedexId}})
            }"
          >
            <template v-slot:[`item.goPokedex.pokedexId`]="{ item }">
              {{ item.goPokedex.pokedexId | getPokedexNo }}
            </template>
            <template v-slot:[`item.goPokedex.image`]="{ item }">
              <v-avatar size="36" style="float:left">
                <v-img :src="item.goPokedex.image ? item.goPokedex.image : require('~/static/img/no-image.png')" />
              </v-avatar>
            </template>
            <template v-slot:[`item.goPokedex.name`]="{ item }">
              {{ item.goPokedex.name }}
              <template v-if="item.goPokedex.remarks">
                <br><span class="caption">{{ `(${item.goPokedex.remarks})` }}</span>
              </template>
            </template>
            <template v-slot:[`item.goPokedex.type1`]="{ item }">
              <span
                :style="`background-color: ${$editUtils.getRGB(item.goPokedex.type1)}; margin-right:5px;`"
                class="type"
              >
                {{ item.goPokedex.type1 }}
              </span>
              <span
                v-if="item.goPokedex.type2"
                :style="`background-color: ${$editUtils.getRGB(item.goPokedex.type2)};`"
                class="type"
              >
                {{ item.goPokedex.type2 }}
              </span>
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
  filters: {
    getPokedexNo (value) {
      return value.substring(0, 4) * 1
    }
  },
  mixins: [SearchCommon],
  data () {
    return {
      searchPattern: 'filterAll',
      searchParam: {},
      filteredItems: [],
      gpAndCpList: [],
      resData: {},
      headerItems: [
        { text: '№', value: 'goPokedex.pokedexId' },
        { text: '', value: 'goPokedex.image', sortable: false, width: '52px' },
        { text: 'ポケモン', value: 'goPokedex.name' },
        { text: 'タイプ', value: 'goPokedex.type1' },
        { text: 'こうげき', value: 'goPokedex.attack' },
        { text: 'ぼうぎょ', value: 'goPokedex.defense' },
        { text: 'HP', value: 'goPokedex.hp' },
        { text: 'CP', value: 'cp' }
      ],
      tmpHeaderItems: [],
      chkboxSelected: [],
      disabledChkboxes: [
        { label: 'タイプ', value: 'goPokedex.type1' },
        { label: 'こうげき', value: 'goPokedex.attack' },
        { label: 'ぼうぎょ', value: 'goPokedex.defense' },
        { label: 'HP', value: 'goPokedex.hp' },
        { label: 'CP', value: 'cp' }
      ],
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
    this.$set(this, 'gpAndCpList', this.resData.pfr.gpAndCpList)
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
        .catch(this.$processUtils.onErrorNot401)
      const resData = res.data
      if (this.dispDialog(resData)) {
        return
      }
      return resData
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
