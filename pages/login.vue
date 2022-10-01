<template>
  <v-container>
    <div
      v-if="!isLoading"
      :class="($vuetify.theme.dark ? 'darken-3' : 'lighten-5') + ' grey search-area px-4 py-4'"
    >
      <h2 class="headline">
        <p>BrainJuice(ぶれいんじゅーす)と、あなたのTwitterアカウントを連携します。</p>
      </h2>
      <div class="body-2">
        <div style="text-align: center">
          <img src="~/static/img/Twitter_Social_Icon_Square_Color.png" alt>
          <v-icon large>
            mdi-arrow-right-bold-outline
          </v-icon>
          <img src="~/static/img/brain-juice.png" alt>
        </div>
        <br>
        <p>※連携を解除したい場合は、Twitterから解除することができます。</p>
        <v-btn block color="info" dark @click="signin">
          ログイン
        </v-btn>
      </div>
    </div>
    <div v-else>
      <Loading />
    </div>
  </v-container>
</template>

<script>
import firebase from 'firebase/app'
import Loading from '~/components/Loading'

export default {
  name: 'Login',
  components: {
    Loading
  },
  data () {
    return {
      isLoading: false
    }
  },
  methods: {
    async signin () {
      this.isLoading = !this.isLoading
      let isSuccess = false

      const params = {}
      const provider = new firebase.auth.TwitterAuthProvider()
      await firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          params.firebaseToken = result.user.Aa
          params.accessToken = result.credential.accessToken
          params.secret = result.credential.secret
          const user = result.user
          if (user) {
            params.userId = user.providerData[0].uid
            params.displayName = user.providerData[0].displayName
            params.photoURL = result.additionalUserInfo.profile.profile_image_url_https
            params.userName = result.additionalUserInfo.username

            this.$store.dispatch('setUserId', params.userId)
          } else {
            alert('有効なアカウントではありません')
          }
          isSuccess = true
        })
        .catch((e) => {
          this.$store.dispatch('getToast', { msg: '認証に失敗しました。' })
          this.isLoading = false
        })

      if (isSuccess) {
        await this.post(params)
      }
    },
    /**
     * APサーバに対して管理者ログインのリクエストを送信する。
     */
    async post (params) {
      try {
        const formData = new FormData()
        formData.append('userId', params.userId)
        formData.append('userName', params.displayName)
        formData.append('thumbnail', params.photoURL)
        formData.append('twitterUserName', params.userName)
        formData.append('accessToken', params.accessToken)
        formData.append('accessTokenSecret', params.secret)

        const config = {
          headers: {
            'content-type': 'multipart/form-data',
            firebaseToken: params.firebaseToken
          }
        }
        await this.$axios.post('/api/adminLogin', formData, config)
          .then((res) => {
            if (!res.data.success) {
              this.$store.dispatch('getToast', { msg: '認証に失敗しました。' })
              this.isLoading = false
              return
            }

            this.$store.dispatch('setJwt', res.headers.authorization)
            this.$store.dispatch('getToast', { msg: res.data.message })
            this.$router.push({ name: 'manage' })
          })
          .catch((err) => {
            alert(err.response.data)
            firebase
              .auth()
              .signOut()
              .then(() => {
                // jwtのトークンを削除してAPIサーバからログアウト
                this.$store.dispatch('setJwt', null)
              })
              .catch()
            this.isLoading = !this.isLoading
          })
      } catch (error) {
        alert('送信に失敗しました。インターネット接続状態を確認後再度実行してみてください。')
        firebase
          .auth()
          .signOut()
          .then(() => {
            // jwtのトークンを削除してAPIサーバからログアウト
            this.$store.dispatch('setJwt', null)
          })
          .catch()
        this.isLoading = !this.isLoading
      }
    }
  },
  head () {
    return {
      title: 'ログイン',
      meta: [
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: 'ログイン' },
        { property: 'og:url', content: process.env.VUE_APP_URL + this.$route.path },
        { property: 'og:site_name', content: 'BrainJuice' },
        { property: 'og:description', content: 'Twitter認証を使用しログインします。' },
        { property: 'og:image', content: process.env.VUE_APP_URL + '/img/brain-juice.png' }
      ]
    }
  }
}
</script>

<style scoped>
.signin-space {
  padding: 5px;
}
.use-list {
  margin: 5px;
}
.v-icon {
  margin-left: 10px;
  margin-right: 10px;
}
p {
  margin: 10px;
}
img {
  border-radius: 50%;
  width: 60px;
  height: 60px;
}
</style>
