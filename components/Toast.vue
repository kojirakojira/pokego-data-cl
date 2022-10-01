<template>
  <v-snackbar
    v-model="setSnackbar"
    bottom
    rounded="pill"
    :timeout="toast.timeout"
    :color="toast.color"
  >
    {{ toast.msg }}
    <template v-slot:action="{ attrs }">
      <v-btn
        color="pink"
        text
        v-bind="attrs"
        style="font-weight:bold;"
        @click="setSnackbar = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  computed: {
    toast () {
      return this.$store.state.toast
    },
    setSnackbar: {
      get () {
        return !!this.toast.msg
      },
      set (val) {
        this.resetToast()
        return val
      }
    }
  },
  methods: {
    resetToast () {
      return this.$store.dispatch('getToast', { msg: null })
    }
  }
}
</script>
