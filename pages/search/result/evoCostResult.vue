<template>
  <div>
    <H2Common>
      {{ getSearchPatternName('evoCost') }}
    </H2Common>
    <div v-if="!isLoading">
      <v-container>
        <v-row>
          <v-col>
            <v-list>
              <v-list-group
                v-for="(detailDic, costTypeKey) in resData?.costTypeMap"
                :key="`cost-type-${costTypeKey}`"
                :title="costTypeKey"
                class="cost-type-area"
              >
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>{{ `${costTypeKey}(${Object.keys(detailDic).length})` }}</v-list-item-title>
                  </v-list-item-content>
                </template>
                <v-list-item>
                  <v-container>
                    <v-row>
                      <v-col class="pa-0">
                        <v-list>
                          <v-list-group
                            v-for="(pokeArr, detailKey) in detailDic"
                            :key="`cost-detail-${detailKey}`"
                            :title="detailKey"
                            class="detail-area"
                          >
                            <template v-slot:activator>
                              <v-list-item-content>
                                <v-list-item-title>{{ `${detailKey}(${pokeArr.length})` }}</v-list-item-title>
                              </v-list-item-content>
                            </template>
                            <div class="evo-edge-area">
                              <EvoEdge
                                v-for="(p, eeIdx) in pokeArr"
                                :key="`${costTypeKey}-${detailKey}-${eeIdx}`"
                                :go-pokedex1="p.beforeGoPokedex"
                                :go-pokedex2="p.goPokedex"
                                :annos="p.annos"
                                router-link="search-result-abundance"
                              />
                            </div>
                          </v-list-group>
                        </v-list>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-list-item>
              </v-list-group>
            </v-list>
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
import EvoEdge from '~/components/search/evoCost/EvoEdge'
import OgpPokemon from '~/components/utils/OgpPokemon'
import Loading from '~/components/Loading'
export default {
  name: 'EvoCostResult',
  components: {
    H2Common,
    EvoEdge,
    Loading
  },
  mixins: [SearchCommon, OgpPokemon],
  data () {
    return {
      searchParam: {
        costs: null
      },
      resData: {
      },
      isLoading: true

    }
  },
  async beforeMount () {
    this.searchParam.id = this.$route.query.pid
    this.searchParam.costs = this.$route.query.costs
    const resData = this.$route.params.rd

    if (resData) {
      // paramsでresDataが渡されている場合は、そのまま表示する
      this.resData = resData
    } else {
      // paramsでresDataが渡されていない場合は、APIから取得してから表示する
      this.resData = await this.get()
    }

    this.isLoading = !this.resData
  },
  methods: {
    async get () {
      const res = await this.$axios
        .get('/api/evoCost', {
          params: {
            costs: this.searchParam.costs
          }
        })

      const resData = res.data
      if (!this.dispDialog(resData)) {
        return
      }
      return resData
    },
    getColor (idx) {
      const mod = idx % 3
      let ret = ''
      if (mod === 0) {
        ret = 'red'
      } else if (mod === 1) {
        ret = 'green'
      } else if (mod === 2) {
        ret = 'blue'
      }
      return ret
    }
  },
  head () {
    return {
      title: `${this.ogp_name}のCP算出`,
      meta: [
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: `${this.ogp_name}のCP算出 - ペリずかん` },
        { property: 'og:url', content: process.env.VUE_APP_URL + this.$route.path },
        { property: 'og:site_name', content: 'ペリずかん' },
        { property: 'og:description', content: `${this.ogp_name}の個体値、PLから、CPを確認できます。` },
        { property: 'og:image', content: this.ogp_image }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.cost-type-area {
  border: thin solid rgba(0, 0, 0, 0.12);

  &:not(:last-child) {
    border-bottom: none;
  }

  .detail-area {
    border-top: thin solid rgba(0, 0, 0, 0.12);
    border-left: thin solid rgba(0, 0, 0, 0.12);
    display: flow;

    .evo-edge-area {
      display: flex;
      flex-flow: wrap;
      margin-left: 16px;
    }
  }
}
.evo-edge {
  padding: 4px 8px;
  margin: 2px;
  border: 0.1em solid gray;
}
</style>
