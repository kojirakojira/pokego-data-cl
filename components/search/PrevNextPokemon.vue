<template>
  <v-container>
    <v-row>
      <v-col>
        <h3>
          関連するポケモン
        </h3>
      </v-col>
    </v-row>
    <v-row v-if="!isLoading">
      <v-col cols="12" sm="6" md="6" lg="6" xl="6">
        <nuxt-link v-if="prev" :to="{ name: routerLink, query: queryFunc(prev) }">
          {{ prevTextFunc(prev) }}
        </nuxt-link>
      </v-col>
      <v-col
        v-if="next"
        cols="12"
        sm="6"
        md="6"
        lg="6"
        xl="6"
        align="right"
      >
        <nuxt-link :to="{ name: routerLink, query: queryFunc(next) }">
          {{ nextTextFunc(next) }}
        </nuxt-link>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <Loading split-scr />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'PrevNextPokemon',
  props: {
    id: {
      type: String,
      required: true
    },
    prevTextFunc: {
      type: Function,
      required: true
    },
    nextTextFunc: {
      type: Function,
      required: true
    },
    routerLink: {
      type: String,
      required: true
    },
    queryFunc: {
      type: Function,
      required: false,
      default: (gp) => {
        return { pid: gp?.pokedexId }
      }
    }
  },
  data () {
    return {
      prev: null,
      next: null,
      isLoading: true
    }
  },
  watch: {
    $route: {
      handler: 'init',
      immediate: true
    }
  },
  methods: {
    async init () {
      scrollTo(0, 0)

      const resData = await this.get()
      this.prev = resData.prev
      this.next = resData.next

      this.isLoading = false
    },
    async get () {
      const res = await this.$axios
        .get('/api/prevNextPokemon', {
          params: {
            id: this.id
          }
        })
      return res.data
    }
  }
}
</script>
