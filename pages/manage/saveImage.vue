<template>
  <div>
    <div v-if="token">
      <v-container>
        <h2 class="display-1">
          <v-row>
            <v-col style="font-weight:bold;">
              画像保存画面
            </v-col>
          </v-row>
        </h2>
      </v-container>
      <v-container>
        <v-row>
          <v-col align="center">
            <Thumbnail :key="thumbnail" ref="thum" :image="thumbnail" />
          </v-col>
        </v-row>
        <v-row>
          <v-col align="center">
            <v-btn
              rounded
              min-width="50%"
              color="success"
              :disabled="isClickCompBtn"
              @click="complete"
            >
              送信
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-else>
      <Loading />
    </div>
  </div>
</template>

<script>
import Thumbnail from '~/components/utils/Thumbnail'

export default {
  name: 'SaveImage',
  components: {
    Thumbnail
  },
  data () {
    return {
      thumbnail: '',

      isClickCompBtn: false
    }
  },
  computed: {
    // storeのtokenをバインド
    token () {
      return this.$store.getters.jwt
    }
  },
  methods: {
    async complete () {
      this.isClickCompBtn = true

      // サムネイル画像を取得する
      const thumbnail = this.$refs.thum.getImageFile()

      const errorMessage = '入力内容に不備があります。\n\n'
      const message = this.check()

      if (message !== '') {
        alert(errorMessage + message)
        this.isClickCompBtn = false
        return
      }
      const isOk = confirm('画像を送信します。\n\n')

      if (isOk) {
        // POST送信
        await this.post(thumbnail)
      }
      this.isClickCompBtn = false
    },
    check () {
      let message = ''
      // サムネイル
      if (this.$refs.thum.isError()) {
        message += 'サムネイルの拡張子が正しくありません。\n'
      } else {
        const fileSize = this.$refs.thum.getFileSize()
        if (fileSize && fileSize > 5 * (10 ** 6)) {
          message += 'ファイルサイズは5MBまでです。\n'
        }
      }
      return message
    },
    async post (thumbnail) {
      try {
        const formData = new FormData()
        formData.append('thumbnail', thumbnail)
        const config = {
          headers: {
            'content-type': 'multipart/form-data'
          }
        }
        await this.$axios.post('/api/secure/saveImage', formData, config)
          .then((res) => {
            this.$store.dispatch('getToast', { msg: res.data.message })
            if (!res.data.success) {
              this.isClickCompBtn = false
              return
            }

            this.thumbnail = ''
            this.$refs.thum.clear()
          })
          .catch((err) => {
            if (err.response.status !== 401) {
              alert(err.response.data)
            }
            this.isClickCompBtn = false
          })
      } catch (e) {
        alert('送信に失敗しました。インターネット接続状態を確認後再度実行してみてください。')
        this.isClickCompBtn = false
      }
    }
  }
}
</script>
