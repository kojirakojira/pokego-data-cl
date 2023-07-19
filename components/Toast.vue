<template>
  <v-snackbar
    v-model="dispFlg"
    bottom
    rounded="pill"
    :timeout="toast[0]?.timeout"
    :color="toast[0]?.color"
  >
    {{ msg }}
    <template v-slot:action="{ attrs }">
      <v-btn
        color="pink"
        text
        v-bind="attrs"
        style="font-weight:bold;"
        @click="closeToast()"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  data () {
    return {
      dispFlg: false,
      msg: ''
    }
  },
  computed: {
    toast () {
      // watch式でdeepを使用する場合、new, oldで同じオブジェクトを参照することになる。そのため値を複製させる。
      return JSON.parse(JSON.stringify(this.$store.state.toast))
    }
  },
  watch: {
    toast: {
      handler (newToast) {
        if (!newToast.length || this.dispFlg) {
          // 要素数が0件の場合、表示中の場合は中断。
          return
        }
        // storeのclearToastを実行したときの考慮。
        // メッセージを退避させないと、トースト表示中にメッセージが消えてしまう。
        this.msg = newToast[0]?.msg
        this.dispFlg = true
      },
      deep: true
    },
    dispFlg (newDispFlg) {
      if (newDispFlg) { return }
      // トーストが閉じられた際の処理
      setTimeout(() => {
        // 表示していたメッセージの要素を削除する。（queue）
        this.$store.dispatch('shiftToast')
        // 削除後、メッセージが存在する場合は次のメッセージを表示させる。
        if (this.toast.length) {
          this.msg = this.toast[0]?.msg
          this.dispFlg = true
        }
      }, 100)
    }
  },
  methods: {
    closeToast () {
      this.dispFlg = false
    }
  }
}
</script>
