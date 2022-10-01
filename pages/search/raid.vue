<template>
  <div>
    <v-container>
      <p />
      <H2Common>
        {{ getSearchPatternName(searchPattern) }}
      </H2Common>
    </v-container>
    <v-container>
      <v-row>
        <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
          <v-icon>
            mdi-pen
          </v-icon>
          ポケモン
        </v-col>
        <v-col cols="12" md="8" lg="8" xl="8">
          <v-text-field
            v-model="pokemon.name"
            label="例：ミュウツー"
            outlined
            dense
            rows="1"
            :rules="rules.name"
            :counter="10"
            maxlength="10"
            autocomplete="off"
            @keyup.enter.exact="clickSearchBtn"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" align="center">
          <v-btn
            rounded
            min-width="50%"
            color="success"
            :disabled="isSearchBtnClick"
            @click="clickSearchBtn()"
          >
            検索
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import H2Common from '~/components/utils/H2Common'
import SearchCommon from '~/components/search/SearchCommon'
export default {
  name: 'Raid',
  components: {
    H2Common
  },
  mixins: [SearchCommon],
  data () {
    return {
      searchPattern: 'raid',
      pokemon: {
        name: ''
      },
      rules: {
        name: [
          v =>
            (v || '').length <= 10 || 'ポケモンは10文字以内で入力してください。'
        ]
      },
      isSearchBtnClick: false
    }
  },
  methods: {
    clickSearchBtn () {
      this.isSearchBtnClick = true
      const msg = this.check()
      if (msg) {
        alert(msg)
        this.isSearchBtnClick = false
        return
      }
      this.get()
    },
    check () {
      return this.$checkRequired(this.pokemon.name, null, 'ポケモン')
    },
    async get () {
      await this.$axios
        .get('/api/raid', {
          params: {
            name: this.pokemon.name
          }
        })
        .then((res) => {
          const result = res.data
          if (result.pokemonSearchResult.unique) {
            this.$router.push({
              name: 'search-result-raidResult',
              query: {
                id: result.pokedexId
              },
              params: {
                rd: result
              }
            })
          } else {
            this.$router.push({
              name: 'search-resultList',
              query: {
                sp: this.searchPattern
              },
              params: {
                psr: result.pokemonSearchResult
              }
            })
          }
        })
        .catch((err) => {
          if (err.response.status !== 401) {
            alert('何らかのエラーが発生しました。')
            this.$router.back()
          }
        })
    }
  }
}
</script>
