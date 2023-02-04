<template>
  <div>
    <v-container>
      <p />
      <h2 class="display-1">
        <v-row>
          <v-col>
            <div class="home">
              <div class="peripper2" />
              <span class="home-text">ホーム</span>
              <div class="peripper" />
            </div>
          </v-col>
        </v-row>
      </h2>
    </v-container>
    <v-container>
      <v-row>
        <v-col class="subtitle-2">
          ペリずかんは、ポケモンGOの個体値を検索したり、種族値を比較したりするためのサイトです。研究目的の使用、豆知識の蓄積に便利です。（多分）
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" md="7" lg="8" xl="8">
          <v-row>
            <v-col>
              <v-list-item-group>
                <v-list-item
                  v-for="(searchPatternName, index) in searchPatternNames"
                  :key="index"
                  class="px-0"
                  :to="{name: `search-${index}`}"
                >
                  <v-list-item-avatar>
                    <v-icon large>
                      mdi-pokemon-go
                    </v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ searchPatternName }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" sm="6" md="5" lg="4" xl="4">
          <TopicPage class="my-2" />
          <TopicPokemon class="my-2" />
          <Archive class="my-2 pb-6" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import SearchCommon from '~/components/search/SearchCommon'
import TopicPage from '~/components/search/TopicPage'
import TopicPokemon from '~/components/search/TopicPokemon'
import Archive from '~/components/blog/Archive'
export default {
  name: 'Home',
  components: {
    TopicPage,
    TopicPokemon,
    Archive
  },
  mixins: [SearchCommon],
  mounted () {
    this.$store.dispatch('setSearchState', null)
  }
}
</script>

<style scoped>
.home {
  height: 60px;
  display: flex;
  position: relative;
  align-items: center;
  overflow: hidden;
  background-color: #1E1E1E;
  border-bottom: 3px ridge skyblue;
  border-radius: 20px;
}
.home-text {
  font-weight: bold;
  color: white;
  margin: auto;
}
/* .peripper {
  position: absolute;
  background-image: url(http://localhost:3000/img/%E3%83%9A%E3%83%AA%E3%83%83%E3%83%91%E3%83%BC%E3%81%AE%E7%9B%AE4.png);
  width: 79.6px;
  height: 60px;
  background-size: contain;
  background-position: center right;
  right: 0;
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
    rgba(30,30,30,1) 0%,
    rgba(30,30,30,0.5) 30%,
    rgba(30,30,30,0) 100%);
} */
.peripper {
  position: absolute;
  background-image: url(https://static.brainjuice.jp/pokego/peripper-eyes.png);
  width: 111.7px;
  height: 60px;
  background-size: contain;
  right: 0;
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
    rgba(30,30,30,1) 0%,
    rgba(30,30,30,0.5) 40%,
    rgba(30,30,30,0) 100%);
}
.peripper2 {
  position: absolute;
  background-image: url(https://static.brainjuice.jp/pokego/peripper-eyes.png);
  width: 111.7px;
  height: 60px;
  background-size: contain;
  left: 0;
}
.peripper2::after {
  position: absolute;
  content: '';
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    270deg,
    rgba(30,30,30,1) 0%,
    rgba(30,30,30,0.5) 40%,
    rgba(30,30,30,0) 100%);
}
</style>
