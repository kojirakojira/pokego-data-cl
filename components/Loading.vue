<template>
  <div :class="styleSelector">
    <div class="loading-parent">
      <div class="loading-spacer" />
      <client-only>
        <vue-loading
          type="spiningDubbles"
          color="#aaa"
          :size="{ width: '80px', height: '80px' }"
        />
      </client-only>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    splitScr: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    styleSelector () {
      let style = ''
      if (!this.splitScr) {
        style += 'center-0 '
        if (this.$vuetify.theme.dark) {
          style += 'dark'
        } else {
          style += 'light'
        }
      }
      return style
    }
  }
}
</script>

<style>
.fullview {
  width: 100%;
  height: 100%;
  background: #fefefe;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 53;
}
.loading-spacer {
  height: 30%;
  z-index: 52;
}
</style>

<style scoped>
.loading-parent {
  margin-top: 100px;
  margin-bottom: 150px;
  z-index: 51;
}
.center-0 {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
}
.center-0.light {
  background-color: white;
}
.center-0.dark {
  background-color: black;
}
</style>
