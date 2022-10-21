<template>
  <div>
    <!-- ナビゲーションバー -->
    <header>
      <v-app-bar app dark style="z-index:60;">
        <v-app-bar-nav-icon @click="drawer = true" />
        <v-toolbar-title>
          <router-link :to="{ name: 'search' }" class="v-toolbar__title">
            <img
              src="~/static/img/brain-juice.png"
              width="30"
              height="30"
              alt
            >
            <h1 class="title" style="margin-bottom:0px;">
              ポケデックスBJ
            </h1>
          </router-link>
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
    </header>
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

.v-application--is-ltr
  .v-toolbar__content
  > .v-btn.v-btn--icon:first-child
  + .v-toolbar__title {
  padding-left: 5px;
}
.v-toolbar__title {
  overflow: visible !important;
  text-decoration: none;
  color: white;
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
