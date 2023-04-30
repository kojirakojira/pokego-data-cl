<template>
  <div>
    <H2Common>
      {{ getSearchPatternName(searchPattern) }}
    </H2Common>
    <v-container>
      <v-row>
        <v-col>
          <v-list v-if="!isLoading" outlined>
            <v-subheader>ポケモン</v-subheader>
            <v-list-item-group>
              <!-- <v-list-item
                v-for="p in unimplList"
                :key="p.pokedexId"
                @click="clickRow(p.pokedexId)"
              > -->
              <v-list-item
                v-for="p in unimplList"
                :key="p.pokedexId"
              >
                <v-list-item-avatar>
                  <v-img :src="p.image ? p.image : require('~/static/img/no-image.png')" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ appendRemarks(p.name, p.remarks) + ' : ' + p.gen }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <Loading v-else split-scr />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import H2Common from '~/components/utils/H2Common'
import SearchCommon from '~/components/search/SearchCommon'
export default {
  name: 'UnimplPokemon',
  components: {
    H2Common
  },
  mixins: [SearchCommon],
  data () {
    return {
      searchPattern: 'unimplPokemon',
      unimplList: [],

      isLoading: true
    }
  },
  async beforeMount () {
    this.unimplList = (await this.get()).data.unimplList
    this.isLoading = false
  },
  methods: {
    async get () {
      return await this.$axios
        .get('/api/unimplPokemon')
        .catch(this.$processUtils.onErrorNot401)
    }
  },
  head () {
    return {
      title: this.getSearchPatternName(this.searchPattern),
      meta: [
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: this.getSearchPatternName(this.searchPattern) },
        { property: 'og:url', content: process.env.VUE_APP_URL + this.$route.path },
        { property: 'og:site_name', content: 'ペリずかん' },
        { property: 'og:description', content: 'ポケモンGO未実装ポケモンの一覧を閲覧することができます。' },
        { property: 'og:image', content: process.env.VUE_APP_STATIC_URL + '/pokego/peripper-eyes.png' }
      ]
    }
  }
}
</script>
