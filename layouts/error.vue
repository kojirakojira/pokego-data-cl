<template>
  <v-app class="center-0">
    <v-container>
      <v-row>
        <v-col align="center">
          <v-img
            :src="require('~/static/img/brain-juice-r.png')"
            width="200"
            height="200"
            alt
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col align="center" style="color:black;">
          <h2 v-if="error.statusCode === 404">
            {{ error.msg ? error.msg : pageNotFound }}
          </h2>
          <h2 v-else>
            {{ error.msg ? error.msg : '例外が発生しました。' }}
          </h2>
          <NuxtLink to="/search">
            ホームへ移動する
          </NuxtLink>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
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
