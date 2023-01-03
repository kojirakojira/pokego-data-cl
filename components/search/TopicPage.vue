<template>
  <v-container class="widget-item">
    <v-row>
      <v-col class="subtitle-1 py-0 h2-title">
        人気の検索
      </v-col>
    </v-row>
    <v-row v-show="!isLoading">
      <v-col>
        <v-list-item-group v-if="isHit">
          <v-list-item
            v-for="(p, index) in topicPages"
            :key="index"
            class="px-0"
            :to="{name: `search-${p.page}`}"
          >
            <v-list-item-avatar>
              <v-icon v-if="index <= 3" :color="getTrophyColor(index)">
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
        <Loading :full-scr="false" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'TopicPage',
  data () {
    return {
      topicPages: [],
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
        .get('/api/topicPage')
        .then((res) => {
          this.topicPages = res.data
          this.isHit = !!this.topicPages.length
        })
        .catch((err) => {
          if (!err.response) { return }
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
