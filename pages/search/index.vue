<template>
  <div>
    <v-container>
      <p />
      <H2Common>
        ホーム
      </H2Common>
    </v-container>
    <v-container>
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
          <TopicPage />
          <TopicPokemon />
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
export default {
  name: 'Home',
  components: {
    H2Common,
    TopicPage,
    TopicPokemon
  },
  mixins: [SearchCommon],
  mounted () {
    this.$store.dispatch('setSearchState', null)
  }
}
</script>
