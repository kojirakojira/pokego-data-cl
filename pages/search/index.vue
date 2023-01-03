<template>
  <div>
    <H2Common>
      ホーム
    </H2Common>
    <v-container>
      <v-row>
        <v-col class="subtitle-2">
          ぽけで！！は、ポケモンGOの個体値を検索したり、種族値を比較したりするためのサイトです。研究目的の使用、豆知識の蓄積に便利です。（多分）
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" md="7" lg="8" xl="8">
          <v-row>
            <v-col>
              <v-list-item-group>
                <v-list-item
                  v-for="(searchPatternName, index) in searchPatternNames"
                  :key="index"
                  class="px-0"
                  :to="{name: `search-${index}`}"
                >
                  <v-list-item-avatar>
                    <v-icon large>
                      mdi-pokemon-go
                    </v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ searchPatternName }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" sm="6" md="5" lg="4" xl="4">
          <TopicPage class="my-2" />
          <TopicPokemon class="my-2" />
          <Archive class="my-2 pb-6" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import H2Common from '~/components/utils/H2Common'
import SearchCommon from '~/components/search/SearchCommon'
import TopicPage from '~/components/search/TopicPage'
import TopicPokemon from '~/components/search/TopicPokemon'
import Archive from '~/components/blog/Archive'
export default {
  name: 'Home',
  components: {
    H2Common,
    TopicPage,
    TopicPokemon,
    Archive
  },
  mixins: [SearchCommon],
  mounted () {
    this.$store.dispatch('setSearchState', null)
  }
}
</script>
