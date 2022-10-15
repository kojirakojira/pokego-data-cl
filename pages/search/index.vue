<template>
  <div>
    <v-container>
      <p />
      <H2Common>
        ホームのページ
      </H2Common>
    </v-container>
    <v-container>
      <v-row>
        <v-col>
          <ul>
            <li v-for="(searchPatternName, index) in searchPatternNames" :key="index">
              <nuxt-link :to="{name: `search-${index}`}">
                {{ searchPatternName }}
              </nuxt-link>
            </li>
          </ul>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import H2Common from '~/components/utils/H2Common'
import SearchCommon from '~/components/search/SearchCommon'
export default {
  name: 'Home',
  components: {
    H2Common
  },
  mixins: [SearchCommon],
  mounted () {
    this.$store.dispatch('setSearchState', null)
  }
}
</script>
