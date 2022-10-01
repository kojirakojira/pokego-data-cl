<template>
  <div>
    <div v-if="token">
      <v-container>
        <h2 class="display-1">
          <v-row>
            <v-col style="font-weight:bold;">
              管理者画面
            </v-col>
          </v-row>
        </h2>
      </v-container>
      <v-container>
        <v-row>
          <v-col>
            <v-icon>
              mdi-message
            </v-icon>
            セリフ
          </v-col>
        </v-row>
        <v-row>
          <v-col align="center">
            <v-btn
              rounded
              min-width="50%"
              color="success"
              @click="$router.push({ name: 'manage-saveLine'})"
            >
              セリフ追加
            </v-btn>
          </v-col>
          <v-col />
        </v-row>
        <v-row>
          <v-col>
            <v-icon>
              mdi-panorama-variant-outline
            </v-icon>
            画像
          </v-col>
        </v-row>
        <v-row>
          <v-col align="center">
            <v-btn
              rounded
              min-width="50%"
              color="success"
              @click="$router.push({ name: 'manage-saveImage'})"
            >
              画像追加
            </v-btn>
          </v-col>
          <v-col align="center">
            <v-btn
              rounded
              min-width="50%"
              color="success"
              @click="$router.push({ name: 'manage-viewImage'})"
            >
              画像確認
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" align="right">
            <Logout />
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
import Logout from '~/components/account/Logout'

export default {
  name: 'ManageHome',
  components: {
    Logout
  },
  data () {
    return {}
  },
  computed: {
    // storeのtokenをバインド
    token () {
      return this.$store.getters.jwt
    }
  }
}
</script>
