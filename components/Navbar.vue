<template>
  <div>
    <!-- ナビゲーションバー -->
    <v-app-bar app dark style="z-index:60;">
      <v-app-bar-nav-icon @click="drawer = true" />
      <v-toolbar-title class="v-toolbar-title">
        <router-link :to="{ name: 'search' }" class="title-line">
          <img
            src="~/static/img/brain-juice.png"
            width="30"
            height="30"
            alt
          >
          <h1 class="title" style="margin-bottom:0px;">
            ペリずかん
          </h1>
        </router-link>
        <!-- <v-img
          src="https://static.brainjuice.jp/pokego/peripper-eyes.png"
          contain
          aspect-ratio
          height="100%"
          position="center left"
        /> -->
        <div class="peripper" />
      </v-toolbar-title>
      <v-tabs right>
        <v-tab
          v-for="(menuItem, index) in menuItems"
          :key="index"
          :to="menuItem.link"
        >
          {{ menuItem.name }}
        </v-tab>
      </v-tabs>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" style="z-index:61;" fixed temporary>
      <v-list nav dense>
        <v-list-item-group>
          <v-list-item
            v-for="(menuItem, index) in menuItems"
            :key="index"
            :to="menuItem.link"
          >
            <v-list-item-title>{{ menuItem.name }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  data () {
    return {
      drawer: false,
      menuItems: [
        { name: '検索する', link: '/search' },
        { name: 'ヘルプ', link: '/help' }
      ],
      isLoading: true,

      existsNons: false
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.isLoading = false
    })
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/common/mixin';

.v-toolbar-title {
  padding-left: 5px !important;
  display: contents;
  align-items: center;
  height:100%;
}
.title-line {
  display: flex;
  overflow: visible !important;
  text-decoration: none;
  color: white;
}
.peripper {
  position: relative;
  background-image: url(https://static.brainjuice.jp/pokego/peripper-eyes.png);
  height: 100%;
  background-size: contain;
  aspect-ratio: 421 / 226;
  margin-left: auto;
}
.peripper::after {
  position: absolute;
  content: '';
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    90deg,
  #1e1e1e 0%,
  rgba(30, 30, 30, 0.4) 30%,
  rgba(30, 30, 30, 0.3) 40%,
  rgba(30, 30, 30, 0.3) 60%,
  rgba(30, 30, 30, 0.4) 70%,
  #1e1e1e 100%);
}
.v-app-bar__nav-icon {
  @include display_pc {
    display: none !important;
  }
}

img {
  display: none;
  @include display_pc {
    display: block !important;
    float: left;
    margin-right: 10px;
  }
}
.v-tabs {
  display: none;
  @include display_pc {
    display: block !important;
  }
}
</style>

<style>
.v-toolbar__content {
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>
