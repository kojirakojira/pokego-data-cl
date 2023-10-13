<template>
  <div>
    <H2Common>
      {{ getSearchPatternName('evoCost') }}
    </H2Common>
    <div v-if="!isLoading">
      <v-container>
        <v-row>
          <v-col>
            <div
              v-for="(detailDic, costTypeKey, ctIdx) in resData?.costTypeMap"
              :key="`cost-type-${costTypeKey}`"
              :class="`cost-type-area cost-type-area--${getColor(ctIdx)}`"
            >
              <div class="cost-type-title">
                {{ costTypeKey }}
              </div>
              <div
                v-for="(pokeArr, detailKey, dIdx) in detailDic"
                :key="`cost-detail-${detailKey}`"
                :class="'detail-area detail-area--' + (dIdx % 2 === 0 ? `${getColor(ctIdx)}` : 'white')"
              >
                <div class="detail-title">
                  {{ `${detailKey}(${pokeArr.length})` }}
                </div>
                <div class="evo-edge-area">
                  <EvoEdge
                    v-for="(p, eeIdx) in pokeArr"
                    :key="`${costTypeKey}-${detailKey}-${eeIdx}`"
                    :go-pokedex1="p.beforeGoPokedex"
                    :go-pokedex2="p.goPokedex"
                    :annos="p.annos"
                  />
                </div>
              </div>
            </div>
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

    console.log(this.resData)
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
  border: 0.1em solid gray;
  margin: 12px 0px;
  padding: 8px 0px;

  &--red {
    background: rgb(255, 200, 200);
    border-color: rgb(255, 0, 0);
  }

  &--green {
    background: rgb(200, 255, 200);
    border-color: rgb(0, 255, 0);
  }

  &--blue {
    background: rgb(200, 200, 255);
    border-color: rgb(0, 0, 255);
  }

  .cost-type-title {
    font-size: 22px;
    padding: 0px 0px 8px 12px;
  }

  .detail-area {
    border: 0.1em solid gray;
    margin: 12px 8px 12px 16px;
    padding: 8px 0px;

    &--red {
      background-color: rgb(255, 230, 230);
    }

    &--green {
      background-color: rgb(230, 255, 230);
    }

    &--blue {
      background-color: rgb(230, 230, 255);
    }

    &--white {
      background-color: rgb(255, 255, 255);
    }

    .detail-title {
      font-size: 20px;
      padding: 0px 0px 8px 12px;
    }

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
