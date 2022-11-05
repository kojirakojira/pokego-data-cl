<template>
  <div>
    <v-container>
      <p />
      <H2Common>
        {{ getSearchPatternName('scpRankMaxMin') }}
      </H2Common>
    </v-container>
    <div v-if="!isLoading">
      <v-container>
        <v-row>
          <v-col
            cols="12"
            md="6"
            lg="6"
            xl="6"
            class="col-title"
          >
            図鑑No
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            {{ resData.pokedexId | dispPdx }}
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            md="6"
            lg="6"
            xl="6"
            class="col-title"
          >
            ポケモン
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            {{ appendRemarks(resData.name, resData.remarks) }}
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            class="col-title"
          >
            スーパーリーグPvP順位
          </v-col>
          <v-col cols="12">
            <v-simple-table>
              <thead>
                <tr>
                  <th v-for="(h, index) in headers" :key="index" class="text-center">
                    {{ h.text }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(t, tIndex) in slTableData" :key="tIndex">
                  <td
                    v-for="(h, hIndex) in headers"
                    :key="hIndex"
                    :style="styleSelector(t, h)"
                    align="center"
                  >
                    {{ t[h.value] }}
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            class="col-title"
          >
            ハイパーリーグPvP順位
          </v-col>
          <v-col cols="12">
            <v-simple-table>
              <thead>
                <tr>
                  <th v-for="(h, index) in headers" :key="index" class="text-center">
                    {{ h.text }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(t, tIndex) in hlTableData" :key="tIndex">
                  <td
                    v-for="(h, hIndex) in headers"
                    :key="hIndex"
                    :style="styleSelector(t, h)"
                    align="center"
                  >
                    {{ t[h.value] }}
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            class="col-title"
          >
            マスターリーグPvP順位
          </v-col>
          <v-col cols="12">
            <v-simple-table>
              <thead>
                <tr>
                  <th v-for="(h, index) in headers" :key="index" class="text-center">
                    {{ h.text }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(t, tIndex) in mlTableData" :key="tIndex">
                  <td
                    v-for="(h, hIndex) in headers"
                    :key="hIndex"
                    :style="styleSelector(t, h)"
                    align="center"
                  >
                    {{ t[h.value] }}
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-else>
      <Loading :full-scr="false" />
    </div>
  </div>
</template>

<script>
import H2Common from '~/components/utils/H2Common'
import SearchCommon from '~/components/search/SearchCommon'
import Loading from '~/components/Loading'
export default {
  name: 'RaidResult',
  components: {
    H2Common,
    Loading
  },
  mixins: [SearchCommon],
  data () {
    return {
      id: null, // pokedexId
      resData: {},

      headers: [
        { text: '', value: 'mm' },
        { text: 'AT', value: 'iva' },
        { text: 'DF', value: 'ivd' },
        { text: 'HP', value: 'ivh' },
        { text: 'PL', value: 'pl' },
        { text: 'CP', value: 'cp' }],
      slTableData: [],
      hlTableData: [],
      mlTableData: [],
      isLoading: true
    }
  },
  watch: {
    resData () {
      // resDataに値がセットされたらLoadingを解除する。
      this.isLoading = false
    }
  },
  beforeMount () {
    this.id = this.$route.query.pid
    const resData = this.$route.params.rd

    if (resData) {
      // paramsでresDataが渡されている場合は、そのまま表示する
      this.resData = resData
      this.addTableData(this.resData)
    } else {
      // paramsでresDataが渡されていない場合は、APIから取得してから表示する
      this.get()
    }
  },
  methods: {
    async get () {
      await this.$axios
        .get('/api/scpRankMaxMin', {
          params: {
            id: this.id
          }
        })
        .then((res) => {
          this.resData = res.data
          this.addTableData(this.resData)
        })
        .catch((err) => {
          if (err.response.status !== 401) {
            alert('何らかのエラーが発生しました。')
            this.$router.back()
          }
        })
    },
    addTableData (resData) {
      const slArr = [
        { lgId: 'scpSlRankMax', mm: '最高個体' },
        { lgId: 'scpSlRankMin', mm: '最低個体' }
      ]
      const hlArr = [
        { lgId: 'scpHlRankMax', mm: '最高個体' },
        { lgId: 'scpHlRankMin', mm: '最低個体' }
      ]
      const mlArr = [
        { lgId: 'scpMlRankMax', mm: '最高個体' },
        { lgId: 'scpMlRankMin', mm: '最低個体' }
      ]
      this.slTableData = this.getTableData(slArr, resData)
      this.hlTableData = this.getTableData(hlArr, resData)
      this.mlTableData = this.getTableData(mlArr, resData)
    },
    getTableData (lgArr, resData) {
      const tableData = []
      for (const lgInfo of lgArr) {
        tableData.push({
          mm: lgInfo.mm,
          iva: resData[lgInfo.lgId].iva,
          ivd: resData[lgInfo.lgId].ivd,
          ivh: resData[lgInfo.lgId].ivh,
          pl: resData[lgInfo.lgId].pl,
          cp: resData[lgInfo.lgId].cp
        })
      }
      return tableData
    },
    styleSelector (t, h) {
      let style = ''
      if (h.value === 'mm') {
        if (t.mm.includes('最高')) {
          style = 'color:red;'
        } else if (t.mm.includes('最低')) {
          style = 'color:blue;'
        }
      }
      return style
    }
  }
}
</script>
