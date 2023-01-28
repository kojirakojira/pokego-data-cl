<template>
  <div>
    <H2Common>
      {{ getSearchPatternName('evolution') }}
    </H2Common>
    <div v-if="!isLoading">
      <v-container>
        <v-row>
          <v-col cols="12" class="col-title">
            進化ツリー
          </v-col>
          <v-col>
            <div style="overflow-x: auto; display: flex;">
              <div v-for="(yArr, i) in evoTree" :key="i" class="evo-tree">
                <div v-for="(xArr, y) in yArr" :key="`hierarchy-${y + 1}`" class="hierarchy">
                  <div v-for="h in xArr" :key="`index${i}-${h.y}-${h.x}`" :class="`block index${i}-${h.y}-${h.x}`">
                    <template v-if="!h.blank">
                      <div v-if="1 < y + 1" class="edge" />
                      <Pokemon
                        :pid="h.id"
                        :name="raceMap[h.id].goPokedex.name"
                        :remarks="raceMap[h.id].goPokedex.remarks"
                        :link="h.id === id ? null : routerLink"
                        :marker="h.id === id"
                      />
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="col-title">
            別のすがた
          </v-col>
          <v-col>
            <v-container>
              <v-row class="another-form">
                <v-col v-for="pid in aotFormArr" :key="`aot-form-${pid}`" class="pa-0">
                  <div :class="`block aot-form-${pid}`">
                    <Pokemon
                      :pid="pid"
                      :name="raceMap[pid].goPokedex.name"
                      :remarks="raceMap[pid].goPokedex.remarks"
                      :link="routerLink"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="col-title">
            同系統のポケモン
          </v-col>
          <v-col>
            <v-container>
              <v-row class="bfaf-another-form">
                <v-col v-for="pid in bfAfAotFormArr" :key="`aot-form-${pid}`" class="pa-0">
                  <div :class="`block bfaf-aot-form-${pid}`">
                    <Pokemon
                      :pid="pid"
                      :name="raceMap[pid].goPokedex.name"
                      :remarks="raceMap[pid].goPokedex.remarks"
                      :link="routerLink"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-else>
      <Loading split-scr />
    </div>
  </div>
</template>

<script>
import H2Common from '~/components/utils/H2Common'
import SearchCommon from '~/components/search/SearchCommon'
import Pokemon from '~/components/search/evolution/Pokemon'
import Loading from '~/components/Loading'
export default {
  name: 'EvolutionResult',
  components: {
    H2Common,
    Loading,
    Pokemon
  },
  mixins: [SearchCommon],
  data () {
    return {
      id: null, // pokedexId

      evoTree: [],
      aotFormArr: [], // anotherFormArr
      bfAfAotFormArr: [],
      raceMap: {},
      styleIdArr: [], // 追加したstyleのclass名の配列

      routerLink: 'search-result-evolutionResult',

      isLoading: true
    }
  },
  watch: {
    $route (to) {
      if (to.query.pid !== this.id) {
        this.initial()
      }
    }
  },
  async beforeMount () {
    await this.initial()
  },
  beforeDestroy () {
    // 作成したstyleを削除する
    this.styleIdArr.forEach((id) => {
      const elem = document.getElementById(id)
      elem.remove()
    })
  },
  methods: {
    async initial () {
      this.id = this.$route.query.pid
      const resData = this.$route.params.rd

      if (resData) {
      // paramsでresDataが渡されている場合は、そのまま表示する
        this.drawing(resData)
      } else {
      // paramsでresDataが渡されていない場合は、APIから取得してから表示する
        await this.get()
      }

      this.$nextTick(() => { this.isLoading = false })
    },
    drawing (resData) {
      /** 種族値マップ */
      this.raceMap = resData.raceMap

      /** 進化ツリー */
      this.evoTree = [] // 初期化
      const evoTreeInfo = resData.evoTreeInfo
      evoTreeInfo.forEach((bfTree, i) => {
        const treeArr = []
        // エッジを描画する。
        this.drawEdge(bfTree, i)
        // ノードを描画する。（色を設定するだけ。）
        this.drawNode(bfTree, this.raceMap, i)
        // ツリーを描画する。
        treeArr.push(...this.drawTree(bfTree))

        this.evoTree.push(treeArr)
      })

      /** 別のすがた */
      this.aotFormArr = resData.anotherForms
      this.drawAnotherForms(this.aotFormArr, this.raceMap)

      /** 別のすがたの進化前進化後 */
      this.bfAfAotFormArr = resData.bfAfAotForms
      this.drawBfAfAotForms(this.bfAfAotFormArr, this.raceMap)
    },
    drawTree (yArr) {
      const treeArr = []
      // x座標の最大値を求める。
      let xMax = 0
      yArr.forEach((xArr) => {
        xArr.forEach((v) => { if (xMax < v.x) { xMax = v.x } })
      })

      // 要素が存在しない箇所に空であることを示す要素を追加する。
      yArr.forEach((xArr, y) => {
        const tmpArr = []
        for (let i = 0; i < xMax; i++) {
          let xItem = null
          xArr.forEach((v) => {
            if (v.x === i + 1) {
              xItem = v
            }
          })
          // 要素が存在する場合は、その要素。なかったら空の要素
          tmpArr.push(xItem || { x: i + 1, y, blank: true })
        }
        treeArr.push(tmpArr)
      })

      return treeArr
    },
    drawNode (yArr, raceMap, i) {
      yArr.forEach((xArr) => {
        xArr.forEach((v) => {
          const idName = `evotree-index${i}-${v.y}-${v.x}-node`
          const color = raceMap[v.id].color
          const style = `.block.index${i}-${v.y}-${v.x} .pokemon .node {\
            background-color: rgb(${color.r}, ${color.g}, ${color.b}); },`
          this.createStyleElem(idName, style)
        })
      })
    },
    drawEdge (yArr, i) {
      yArr.forEach((xArr) => {
        xArr.forEach(v => this.createEdge(i, v.x, v.y, v.dist))
      })
    },
    /**
     * ノードを結ぶ線（エッジ）のスタイルを作成します。
     *
     * @param {i} i番目のツリー
     * @param {x} x軸
     * @param {y} y軸(上から数える)
     * @param {dist} 上位階層からのx軸の距離
     */
    createEdge (i, x, y, dist) {
      // y=1の場合はedgeは生成しない。
      if (y <= 1) { return }

      const idName = `evotree-index${i}-${y}-${x}-edge`
      const style =
      `.block.index${i}-${y}-${x} .edge {\
        width: ${80 * dist + 1}px;\
        left: ${-80 * dist + 35}px; }\
       .block.index${i}-${y}-${x} .edge:before {\
        width: ${80 * dist + 1}px;\
        left: ${-80 * dist}px; }\
        this.createStyleElem(className, style)`
      this.createStyleElem(idName, style)
    },
    drawAnotherForms (aotFormArr, raceMap) {
      aotFormArr.forEach((pid) => {
        const idName = `aot-form-${pid}`
        const color = raceMap[pid].color
        const style = `.block.aot-form-${pid} .node {\
            background-color: rgb(${color.r}, ${color.g}, ${color.b}); },`
        this.createStyleElem(idName, style)
      })
    },
    drawBfAfAotForms (bfAfAotFormArr, raceMap) {
      bfAfAotFormArr.forEach((pid) => {
        const idName = `bfaf-aot-form-${pid}`
        const color = raceMap[pid].color
        const style = `.block.bfaf-aot-form-${pid} .node {\
          background-color: rgb(${color.r}, ${color.g}, ${color.b}); },`
        this.createStyleElem(idName, style)
      })
    },
    async get () {
      await this.$axios
        .get('/api/evolution', {
          params: {
            id: this.id
          }
        })
        .then((res) => {
          this.drawing(res.data)
        })
        .catch((err) => {
          if (err.response.status !== 401) {
            alert('何らかのエラーが発生しました。')
            this.$router.back()
          }
        })
    },
    createStyleElem (id, style) {
      // styleを追加
      const newStyle = document.createElement('style')
      newStyle.id = id
      newStyle.innerHTML = style
      document.getElementsByTagName('head').item(0).appendChild(newStyle)

      // styleのid名を配列に追加
      this.styleIdArr.push(id)
    }
  }
}
</script>

<style lang="scss" scoped>
.evo-tree {
  background-color: black;
  width: fit-content;

  .hierarchy {
    height: 120px;
    display: flex;
  }
}
.another-form,.bfaf-another-form {
  background-color: black;
  width: fit-content;

  .block {
    height: 60px;
  }
}
.block {
  width: 160px;
  display: flex;
  position: relative;
  align-items: center;

  .edge {
    content: '';
    position: absolute;
    height: 60px;
    top: 0px;
    border-top: 2px solid yellow;
    border-right: 2px solid yellow;
    border-radius: 0 30px 0 0;
    z-index: 50;
  }
  .edge:before {
    content: '';
    position: absolute;
    height: 60px;
    top: -60px;
    border-bottom: 2px solid yellow;
    border-left: 2px solid yellow;
    border-radius: 0 0 0 30px;
    z-index: 50;
  }

  .pokemon {
    margin-left: 15px;
  }
}
</style>
