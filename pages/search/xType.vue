<template>
  <div>
    <H2Common>
      {{ getSearchPatternName(searchPattern) }}
    </H2Common>
    <v-container>
      <v-row>
        <v-col class="caption">
          じぶんのポケモン、あいてのポケモンのタイプのうち1つをXと仮定し、何のタイプであれば有利になるかを求めることができます。<br>
          なんだか分かりにくい機能なので、とりあえず使って試してみてください。
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="12" md="5" lg="5" class="px-0">
          <v-container>
            <v-row align="center">
              <v-col cols="12" sm="5" md="6" lg="6" class="col-title">
                <v-icon>
                  mdi-pen
                </v-icon>
                じぶんのポケモン
              </v-col>
              <v-col cols="12" sm="7" md="6" lg="6">
                <v-select
                  v-model="searchParam.own1"
                  :items="typeArr"
                  item-text="v"
                  item-value="k"
                  clearable
                  hide-details
                />
              </v-col>
            </v-row>
            <v-row>
              <v-spacer />
              <v-col cols="12" sm="7" md="6" lg="6">
                <v-select
                  v-model="searchParam.own2"
                  :items="typeArr"
                  item-text="v"
                  item-value="k"
                  clearable
                  hide-details
                />
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col
          cols="12"
          sm="12"
          md="1"
          lg="1"
          class="px-0"
          style="display: flex; align-items: center;"
        >
          <v-container>
            <v-row>
              <v-col align="center">
                <v-icon class="arrow-down">
                  mdi-arrow-right-bold-outline
                </v-icon>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col cols="12" sm="12" md="5" lg="5" class="px-0">
          <v-container>
            <v-row>
              <v-col cols="12" sm="5" md="6" lg="6" class="col-title">
                <v-icon>
                  mdi-pen
                </v-icon>
                あいてのポケモン
              </v-col>
              <v-col cols="12" sm="7" md="6" lg="6">
                <v-select
                  v-model="searchParam.opp1"
                  :items="typeArr"
                  item-text="v"
                  item-value="k"
                  clearable
                  hide-details
                />
              </v-col>
            </v-row>
            <v-row>
              <v-spacer />
              <v-col cols="12" sm="7" md="6" lg="6">
                <v-select
                  v-model="searchParam.opp2"
                  :items="typeArr"
                  item-text="v"
                  item-value="k"
                  clearable
                  hide-details
                />
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-spacer />
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col cols="12" sm="12" md="5" lg="5" class="col-title">
          <v-icon>
            mdi-pen
          </v-icon>
          重視ポイント
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs}">
              <v-icon
                small
                v-bind="attrs"
                v-on="on"
              >
                mdi-help-circle
              </v-icon>
            </template>
            <span>有利タイプのランキングを取得する上で、こうげき、またはぼうぎょを重視したい場合に設定してください。</span>
          </v-tooltip>
        </v-col>
        <v-col cols="12" sm="12" md="7" lg="7">
          <v-radio-group v-model="searchParam.emphasis" row>
            <v-radio label="設定しない" value="none" />
            <v-radio label="こうげき重視" value="attack" />
            <v-radio label="ぼうぎょ重視" value="defense" />
          </v-radio-group>
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
  name: 'XType',
  components: {
    H2Common
  },
  mixins: [SearchCommon],
  data () {
    return {
      searchPattern: 'xType',
      searchParam: {
        own1: '',
        own2: '',
        opp1: '',
        opp2: '',
        emphasis: 'none'
      },
      typeArr: [{ k: 'x', v: 'Xで仮定' }, ...this.$CONST.TYPE],
      isSearchBtnClick: false
    }
  },
  methods: {
    async clickSearchBtn () {
      this.isSearchBtnClick = true
      const msg = this.check()
      if (msg) {
        alert(msg)
        this.isSearchBtnClick = false
        return
      }
      const res = await this.get()
      this.handleApiResult(res)
    },
    check () {
      let msg = ''
      const sp = this.searchParam
      if (!sp.own1 && !sp.own2) {
        msg += '「じぶんのポケモン」は少なくともどちらか一方を入力してください。\n'
      }
      if (!sp.opp1 && !sp.opp2) {
        msg += '「あいてのポケモン」は少なくともどちらか一方を入力してください。\n'
      }
      // Xは1個だけしか置けない。NOT(at1 XOR at2 XOR df1 XOR df2)
      const isX = t => t === 'x'
      if (!(isX(sp.own1) ^ isX(sp.own2) ^ isX(sp.opp1) ^ isX(sp.opp2))) {
        msg += '「じぶんのポケモン」「あいてのポケモン」どちから一方に1つだけXを置いてください。\n'
      }

      return msg
    },
    async get () {
      // 送信
      return await this.$axios
        .get('/api/xType', { params: this.searchParam })
        .catch(this.$processUtils.onErrorNot401)
    },
    /**
     * APIのレスポンスを処理する。
     *
     * @param {Object} res
     */
    handleApiResult (res) {
      const resData = res.data
      // タイプから検索した場合
      this.replaceState(this.searchParam)
      this.$router.push({
        name: 'search-result-xTypeResult',
        query: this.makeQuery(),
        params: {
          rd: resData
        }
      })
    }
  }
}
</script>

<style lang="scss" >
.arrow-down {
  transform: rotate(90deg);

  @include display_pc {
    transform: rotate(0deg);
  }
}
</style>
