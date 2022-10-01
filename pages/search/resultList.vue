<template>
  <div>
    <v-container>
      <p />
      <H2Common>
        {{ getSearchPatternName(searchPattern) }}
      </H2Common>
    </v-container>
    <v-container>
      <v-row>
        <v-col align="right" style="padding-bottom:0px;">
          {{ `検索結果：${psr.goPokedexList.length}件` }}
        </v-col>
      </v-row>
      <v-row v-if="psr.maybe">
        <v-col class="py-0 subtitle-2">
          あいまい検索によって検索されました。
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-list outlined>
            <v-subheader>ポケモン</v-subheader>
            <v-list-item-group>
              <v-list-item
                v-for="p in psr.goPokedexList"
                :key="p.pokedexId"
                :to="{name: `search-result-${searchPattern}Result` , query: {pid: p.pokedexId}}"
              >
                <v-list-item-avatar>
                  <v-img :src="require('~/static/img/no-image.png')" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ p.name }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import H2Common from '~/components/utils/H2Common'
import SearchCommon from '~/components/search/SearchCommon'
export default {
  name: 'ResultList',
  components: {
    H2Common
  },
  mixins: [SearchCommon],
  data () {
    return {
      searchPattern: this.$route.query.sp,
      psr: {
        goPokedexList: [],
        maybe: false
      }

    }
  },
  beforeMount () {
    const psr = this.$route.params.psr
    if (psr) {
      // 検索画面からの遷移の場合
      this.psr = psr
      this.$store.dispatch('setPsrState', this.psr)
    } else if (this.$store.getters.psrState) {
      // 検索画面以外からの遷移の場合（ブラウザの更新含む）
      this.$set(this, 'psr', this.$store.getters.psrState)
    }
  }
}
</script>
