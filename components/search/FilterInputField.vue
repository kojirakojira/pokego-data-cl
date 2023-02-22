<template>
  <v-container
    :class="`${$vuetify.theme.dark ? 'darken-3' : 'lighten-5'} grey filter-area pa-4 my-4`"
  >
    <v-row class="body-1">
      <v-col cols="8">
        <v-btn
          rounded
          small
          color="success"
          @click="$emit('showArea')"
        >
          <v-icon small>
            mdi-filter-menu
          </v-icon>
          絞り込む
        </v-btn>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs}">
            <v-icon
              small
              v-bind="attrs"
              v-on="on"
            >
              mdi-help-circle
            </v-icon>
          </template>
          <span>「種族値検索」では、種族値の高さをグラフを使用し可視化します。グラフは順位を基準として表示します。</span>
        </v-tooltip>
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
      <div v-show="showArea">
        <v-row>
          <v-col>
            <v-divider />
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="12" md="5" lg="4" xl="4" class="col-title">
            {{ $CONST.getValue('type', $CONST.FILTER_ITEMS) }}
          </v-col>
          <v-col cols="12" md="7" lg="8" xl="8">
            <v-select
              v-model="searchParam.type1"
              :items="$CONST.TYPE"
              item-text="v"
              item-value="k"
              clearable
              prepend-icon="mdi-filter-multiple"
            />
            <v-select
              v-model="searchParam.type2"
              :items="$CONST.TYPE"
              item-text="v"
              item-value="k"
              clearable
              prepend-icon="mdi-filter-multiple"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-divider />
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="12" md="5" lg="4" xl="4" class="col-title">
            {{ $CONST.getValue('finEvo', $CONST.FILTER_ITEMS) }}
          </v-col>
          <v-col cols="12" md="7" lg="8" xl="8">
            <v-switch
              v-model="searchParam.finEvo"
              inset
              dense
              hide-details
              prepend-icon="mdi-filter-multiple"
              :label="searchParam.finEvo ? 'filter' : 'not filter'"
            />
          </v-col>
        </v-row>
        <v-row align="center">
          <v-spacer />
          <v-col cols="12" md="7" lg="8" xl="8">
            <v-switch
              v-model="searchParam.negaFinEvo"
              inset
              dense
              hide-details
              prepend-icon="mdi-not-equal"
              :disabled="!searchParam.finEvo"
              :label="searchParam.negaFinEvo ? 'not equal' : 'equals'"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-divider />
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="12" md="5" lg="4" xl="4" class="col-title">
            {{ $CONST.getValue('mega', $CONST.FILTER_ITEMS) }}
          </v-col>
          <v-col cols="12" md="7" lg="8" xl="8">
            <v-switch
              v-model="searchParam.mega"
              inset
              dense
              hide-details
              prepend-icon="mdi-filter-multiple"
              :label="searchParam.mega ? 'filter' : 'not filter'"
            />
          </v-col>
        </v-row>
        <v-row align="center">
          <v-spacer />
          <v-col cols="12" md="7" lg="8" xl="8">
            <v-switch
              v-model="searchParam.negaMega"
              inset
              dense
              hide-details
              prepend-icon="mdi-not-equal"
              :disabled="!searchParam.mega"
              :label="searchParam.negaMega ? 'not equal' : 'equals'"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-divider />
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="12" md="5" lg="4" xl="4" class="col-title">
            {{ $CONST.getValue('impled', $CONST.FILTER_ITEMS) }}
          </v-col>
          <v-col cols="12" md="7" lg="8" xl="8">
            <v-switch
              v-model="searchParam.impled"
              inset
              dense
              hide-details
              prepend-icon="mdi-filter-multiple"
              :label="searchParam.impled ? 'filter' : 'not filter'"
            />
          </v-col>
        </v-row>
        <v-row align="center">
          <v-spacer />
          <v-col cols="12" md="7" lg="8" xl="8">
            <v-switch
              v-model="searchParam.negaImpled"
              inset
              dense
              hide-details
              prepend-icon="mdi-not-equal"
              :disabled="!searchParam.impled"
              :label="searchParam.negaImpled ? 'not equal' : 'equals'"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-divider />
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="12" md="5" lg="4" xl="4" class="col-title">
            {{ $CONST.getValue('tooStrong', $CONST.FILTER_ITEMS) }}
          </v-col>
          <v-col cols="12" md="7" lg="8" xl="8">
            <v-switch
              v-model="searchParam.tooStrong"
              inset
              dense
              hide-details
              prepend-icon="mdi-filter-multiple"
              :label="searchParam.tooStrong ? 'filter' : 'not filter'"
            />
          </v-col>
        </v-row>
        <v-row align="center">
          <v-spacer />
          <v-col cols="12" md="7" lg="8" xl="8">
            <v-switch
              v-model="searchParam.negaTooStrong"
              inset
              dense
              hide-details
              prepend-icon="mdi-not-equal"
              :disabled="!searchParam.tooStrong"
              :label="searchParam.negaTooStrong ? 'not equal' : 'equals'"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-divider />
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="12" md="5" lg="4" xl="4" class="col-title">
            {{ $CONST.getValue('region', $CONST.FILTER_ITEMS) }}
          </v-col>
          <v-col cols="12" md="7" lg="8" xl="8">
            <div v-for="r in $CONST.REGION" :key="r.k">
              <v-checkbox
                v-model="searchParam.region"
                :label="r.v"
                :value="r.k"
                hide-details
                multiple
              />
            </div>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-spacer />
          <v-col cols="12" md="7" lg="8" xl="8">
            <v-switch
              v-model="searchParam.negaRegion"
              inset
              dense
              hide-details
              prepend-icon="mdi-not-equal"
              :disabled="!searchParam.region.length"
              :label="searchParam.negaRegion ? 'not equal' : 'equals'"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-divider />
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="12" md="5" lg="4" xl="4" class="col-title">
            {{ $CONST.getValue('gen', $CONST.FILTER_ITEMS) }}
          </v-col>
          <v-col cols="12" md="7" lg="8" xl="8">
            <div v-for="r in $CONST.GEN" :key="r.k">
              <v-checkbox
                v-model="searchParam.gen"
                :label="r.v"
                :value="r.k"
                hide-details
                multiple
              />
            </div>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-spacer />
          <v-col cols="12" md="7" lg="8" xl="8">
            <v-switch
              v-model="searchParam.negaGen"
              inset
              dense
              hide-details
              prepend-icon="mdi-not-equal"
              :disabled="!searchParam.gen.length"
              :label="searchParam.negaGen ? 'not equal' : 'equals'"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-divider />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" align="center">
            <v-btn
              rounded
              min-width="50%"
              color="success"
              :disabled="isSearchBtnClick"
              @click="$emit('click')"
            >
              検索
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </transition>
  </v-container>
</template>

<script>
export default {
  name: 'FilterInputField',
  props: {
    searchParam: {
      type: Object,
      required: true
    },
    showArea: {
      type: Boolean,
      required: true
    },
    isSearchBtnClick: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      filterKeys: [
        { key: 'type1' },
        { key: 'type2' },
        { key: 'finEvo', nega: 'negaFinEvo' },
        { key: 'mega', nega: 'negaMega' },
        { key: 'impled', nega: 'negaImpled' },
        { key: 'tooStrong', nega: 'negaTooStrong' },
        { key: 'region', nega: 'negaRegion' },
        { key: 'gen', nega: 'negaGen' }
      ]

    }
  },
  watch: {
    /**
     * 否定形は、項目に何かしら値が入ってるときだけ有効。
     * それ以外の場合はfalseにする。
     */
    searchParam: {
      handler (v) {
        this.filterKeys.forEach((dic) => {
          if ((typeof this.searchParam[dic.key] === 'boolean' && !v[dic.key]) ||
           (Array.isArray(this.searchParam[dic.key]) && !v[dic.key].length)) {
            v[dic.nega] = false
          }
        })
      },
      deep: true
    }
  },
  methods: {
    clear () {
      const func = (key) => {
        const value = this.searchParam[key]
        if (typeof value === 'boolean') {
          this.searchParam[key] = false
        } else if (typeof value === 'string') {
          this.searchParam[key] = ''
        } else if (Array.isArray(value)) {
          this.searchParam[key] = []
        }
      }
      this.filterKeys.forEach((elem) => {
        func(elem.key)
        if (elem.nega) {
          func(elem.nega)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.filter-area {
  max-width: 700px;
  border-radius: 20px
}
</style>
