<template>
  <div>
    <v-btn class="ma-2 login-status" color="error" @click="logout">
      <span>ログアウト</span>
    </v-btn>
  </div>
</template>

<script>
import firebase from 'firebase/app'

export default {
  name: 'Logout',
  data () {
    return {
    }
  },
  methods: {
    logout () {
      firebase
        .auth()
        .signOut()
        .then(() => {
          // jwtのトークンを削除してAPIサーバからログアウト
          this.$store.dispatch('setJwt', null)
          this.$store.dispatch('getToast', { msg: 'ログアウトしました' })
        })
        .catch((error) => {
          this.$store.dispatch('getToast', { msg: '登録しました。' })
          alert(`ログアウト時にエラーが発生しました (${error})`)
        })
      this.$router.push({ name: 'search' })
    }
  }
}
</script>
