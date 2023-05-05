<template>
  <v-container class="widget-item">
    <v-row>
      <v-col class="subtitle-1 py-0 h2-title">
        人気のポケモン
      </v-col>
    </v-row>
    <v-row v-show="!isLoading">
      <v-col>
        <v-list-item-group v-if="isHit">
          <v-list-item
            v-for="(p, index) in topicPokemons"
            :key="index"
            class="px-0"
            :to="{name: 'search-result-abundance', query: { pid: p.pokedexId }}"
          >
            <v-list-item-avatar style="positon:relative;">
              <v-img :src="p.image ? p.image : require('~/static/img/no-image.png')" />
              <v-icon v-if="index <= 3" :color="getTrophyColor(index)" style="position:absolute;">
                mdi-trophy
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="subtitle-2" :title="p.name">
                {{ p.name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <div v-else class="subtitle-2">
          最近のアクセスはありません。
        </div>
      </v-col>
    </v-row>
    <v-row v-show="isLoading">
      <v-col>
        <Loading split-scr />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'TopicPokemons',
  data () {
    return {
      topicPokemons: [],
      isHit: true,
      isLoading: true
    }
  },
  async mounted () {
    await this.get()
    this.isLoading = false
  },
  methods: {
    async get () {
      await this.$axios
        .get('/api/topicPokemon')
        .then((res) => {
          this.topicPokemons = res.data
          this.isHit = !!this.topicPokemons.length
        })
    },
    getTrophyColor (index) {
      let color = ''
      switch (index + 1) {
        case 1:
          color = 'yellow'
          break
        case 2:
          color = '#F0EFE8'
          break
        case 3:
          color = '#CD7427'
          break
      }
      return color
    }
  }
}
</script>
