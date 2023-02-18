<template>
  <v-app>
    <div dark style="min-height: 90vh">
      <Navbar />
      <Toast />
      <v-main>
        <nuxt />
      </v-main>
    </div>
    <v-footer padless>
      <v-col
        class="text-right"
        cols="12"
        style="padding-bottom:0px;"
      >
        <router-link to="/help/inquiry">
          お問い合わせ
        </router-link> | <router-link to="/help/privacyPolicy">
          プライバシーポリシー
        </router-link>
      </v-col>
      <v-col
        class="text-right"
        cols="12"
      >
        <a style="display:none;">©</a> 2021 — <strong>BrainJuice</strong>
      </v-col>
    </v-footer>
    <div v-show="isLoading">
      <div class="center-0">
        <div class="pulse-loader center-2">
          Loading...
        </div>
        <img
          src="~/static/img/brain-juice.png"
          class="center-1"
          alt
        >
      </div>
    </div>
  </v-app>
</template>

<script>
import Navbar from '~/components/Navbar.vue'
import '~/assets/spinners.css'
export default {
  components: {
    Navbar
  },
  data () {
    return {
      homeList: null,

      isLoading: true
    }
  },
  mounted () {
    setTimeout(() => {
      this.$vuetify.theme.dark = this.$store.getters.darkTheme
      this.isLoading = false
    }, 0)
  }
}
</script>

<style>

.center-2 {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 102;
}
.center-1 {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  z-index: 101;
}
.center-0 {
  background-color: #dcdcdc;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
</style>
