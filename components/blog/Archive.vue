<template>
  <v-container class="widget-item">
    <v-row>
      <v-col class="subtitle-1 py-0 h2-title">
        最新記事一覧
      </v-col>
    </v-row>
    <v-row v-if="!isErr" v-show="!isLoading">
      <v-col
        v-for="art in articles"
        :key="art.id"
        class="py-1"
      >
        <v-card
          class="mx-auto"
          max-width="400"
          :to="{ name: 'blog-post-slug', params: { slug: art.slug }}"
        >
          <v-img
            :src="art._embedded['wp:featuredmedia']
              ? art._embedded['wp:featuredmedia'][0].source_url
              : require('~/static/img/no-image.png')"
            height="100"
          >
            <div class="publ-date">
              {{ art.date | dateFormat }}
            </div>
          </v-img>
          <v-card-title class="py-2">
            <span class="subtitle-2 text-truncate-row2">{{ art.title.rendered }}</span>
          </v-card-title>
          <v-card-text>
            <span class="text-truncate-row3 caption">{{ art.content.rendered | removeTag }}</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col class="subtitle-2">
        取得に失敗しました。
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
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'Archive',
  filters: {
    dateFormat (arg1) {
      return moment(arg1).format('YYYY/MM/DD')
    },
    removeTag (arg1) {
      // HTMLタグを除去する。
      return arg1.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
    }
  },
  data () {
    return {
      articles: [],
      isLoading: true,

      isErr: false
    }
  },
  async mounted () {
    await this.get()
    this.isLoading = false
  },
  methods: {
    async get () {
      // _embedでサムネイル情報も取得している。公開日順、5件まで
      await axios.get(process.env.VUE_APP_BLOG_URL + '/wp-json/wp/v2/posts?_embed&orderby=date&per_page=5')
        .then((res) => {
          this.articles = res.data
        })
        .catch(() => {
          this.isErr = true
        })
    }
  }
}
</script>

<style lang="scss">
.publ-date {
    position: absolute;
    bottom: 0px;
    right: 0px;
    white-space: nowrap;
    overflow: hidden;
    background-color: black;
    color: white;
    text-align: center;
    font-weight:bold !important;
    font-size: 10px;
    padding: 0px 5px;
    border-radius: 2px;
}
/** text-truncate-row${i}を生成。複数行でtext-overflow: ellipsisをやる。 */
.text-truncate {
  $i: 2;
  @while $i <= 4 {
    &-row#{$i} {
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: $i;
    }
    $i: $i + 1;
  }

}
</style>
