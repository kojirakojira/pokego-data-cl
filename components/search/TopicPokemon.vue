<template>
  <div>
    <v-container>
      <v-row>
        <v-col class="subtitle-1 py-0 h2-event">
          人気のポケモン
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-list-item-group>
            <v-list-item
              v-for="(p, index) in topicPokemons"
              :key="index"
              class="px-0"
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
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'TopicPokemons',
  data () {
    return {
      topicPokemons: []
    }
  },
  mounted () {
    this.get()
  },
  methods: {
    async get () {
      await this.$axios
        .get('/api/topicPokemon')
        .then((res) => {
          this.topicPokemons = res.data
        })
        .catch((err) => {
          if (err.response.status !== 401) {
            alert('何らかのエラーが発生しました。')
            this.$router.back()
          }
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
