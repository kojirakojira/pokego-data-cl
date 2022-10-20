<template>
  <div>
    <v-container>
      <h2 class="display-1">
        <v-row>
          <v-col style="font-weight:bold;">
            画像確認
          </v-col>
        </v-row>
      </h2>
    </v-container>
    <!-- リストエリア -->
    <v-container>
      <v-row>
        <v-col class="subtitle-1" align="right">
          AWS S3 保存件数：{{ allImages.length }}
        </v-col>
      </v-row>
      <v-row>
        <v-col
          v-for="(image, index) in images"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          xl="3"
          style="padding:16px 8px;"
        >
          <v-card>
            <v-img
              :src="image.path"
            >
              <p class="image-path">
                {{ image.path.substring(image.path.lastIndexOf('/') + 1) }}
              </p>
              <p class="last-modified">
                {{ image.lastModified }}
              </p>
            </v-img>
          </v-card>
        </v-col>
      </v-row>
      <!-- 下スクロールしたときに、次のデータを取得する無限スクロールコンポーネント -->
      <client-only>
        <Infinite-loading ref="infiniteLoading" @infinite="infiniteHandler">
          <span slot="no-more">
            <v-icon>
              mdi-check
            </v-icon>
          </span>
          <span slot="no-results">{{ resultMsg }}</span>
        </Infinite-loading>
      </client-only>
    </v-container>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'ViewImage',
  components: {
    InfiniteLoading
  },
  data () {
    return {
      page: 1, // 現在の表示ページ数
      perPage: 10, // 1ページ当たりの表示件数
      images: [], // 表示中の画像リスト
      resultMsg: null, // 無限スクロールのメッセージ

      allImages: []
    }
  },
  methods: {
    async infiniteHandler ($state) {
      if (this.page === 1) {
        await this.get()
        if (!this.allImages.length) {
          this.resultMsg = 'ヒットしませんでした。'
          $state.complete()
        }
      }
      if (this.allImages.length <= this.images.length) {
        $state.complete()
      } else {
        // 取得した画像の件数
        const allSize = this.allImages.length
        // 次に表示させるページの最初のインデックス
        const index = (this.page - 1) * this.perPage
        // 次に表示させるページの最後のインデックス
        const lastIndex = index <= allSize ? index + this.perPage : allSize - index - 1
        this.images.push(...this.allImages.slice(index, lastIndex))
        $state.loaded()
      }
      this.page++
    },
    async get () {
      await this.$axios
        .get('/api/secure/imageList')
        .then((res) => {
          this.allImages.push(...res.data.images)
        })
        .catch((err) => {
          if (err.response.status !== 401) {
            alert(err + '\n処理に失敗しました。時間を置いてもう一度実行してみてください。')
          }
        })
    }
  }
}
</script>

<style scoped>
.image-path {
    position: absolute;
    top: 0px;
    left: 0px;
    white-space: nowrap;
    overflow: hidden;
    background-color: black;
    color: white;
    text-align: center;
    font-weight:bold !important;
    font-size:12px;
    padding: 0px 5px;
    border-radius: 2px;
}
.last-modified {
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
    margin-bottom: 0px;
    border-radius: 2px;
}
</style>
