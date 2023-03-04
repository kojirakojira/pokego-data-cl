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
        <FilterInput :search-param="searchParam" :is-search-btn-click="isSearchBtnClick" />
      </div>
    </transition>
  </v-container>
</template>

<script>
import FilterInput from '~/components/search/FilterInput'
export default {
  name: 'FilterInputStowable',
  components: {
    FilterInput
  },
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
