<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="col-title">
        進化ツリー
      </v-col>
      <v-col style="justify-content: center; display: flex;">
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
                    :link="h.id === pokedexId"
                    :click-action="() => { $router.replace({ name: routerLink, query: { pid: h.id }})}"
                    :marker="h.id === pokedexId"
                  />
                </template>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div class="col-title">
          別のすがた
        </div>
      </v-col>
      <v-col style="justify-content: center; display: flex;">
        <v-container v-if="aotFormArr.length">
          <v-row class="another-form">
            <v-col v-for="pid in aotFormArr" :key="`aot-form-${pid}`" class="pa-0">
              <div :class="`block aot-form-${pid}`">
                <Pokemon
                  :pid="pid"
                  :name="raceMap[pid].goPokedex.name"
                  :remarks="raceMap[pid].goPokedex.remarks"
                  :click-action="() => { $router.replace({ name: routerLink, query: { pid }})}"
                />
              </div>
            </v-col>
          </v-row>
        </v-container>
        <div v-else>
          なし
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="col-title">
        同系統のポケモン
      </v-col>
      <v-col style="justify-content: center; display: flex;">
        <v-container v-if="bfAfAotFormArr.length">
          <v-row class="bfaf-another-form">
            <v-col v-for="pid in bfAfAotFormArr" :key="`aot-form-${pid}`" class="pa-0">
              <div :class="`block bfaf-aot-form-${pid}`">
                <Pokemon
                  :pid="pid"
                  :name="raceMap[pid].goPokedex.name"
                  :remarks="raceMap[pid].goPokedex.remarks"
                  :click-action="() => { $router.replace({ name: routerLink, query: { pid } })}"
                />
              </div>
            </v-col>
          </v-row>
        </v-container>
        <div v-else>
          なし
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Pokemon from '~/components/search/evolution/Pokemon'
export default {
  name: 'EvoInfo',
  components: {
    Pokemon
  },
  props: {
    pokedexId: {
      type: String,
      required: true
    },
    evoTreeInfo: {
      type: Array,
      required: true
    },
    anotherForms: {
      type: Array,
      required: true
    },
    bfAfAotForms: {
      type: Array,
      required: true
    },
    raceMap: {
      type: Object,
      required: true
    },
    routerLink: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      styleIdArr: [] // 追加したstyleのclass名の配列
    }
  },
  computed: {
    /**
     * 進化ツリー
     */
    evoTree () {
      const evoTree = []
      const evoTreeInfo = this.evoTreeInfo
      evoTreeInfo.forEach((bfTree, i) => {
        const treeArr = []

        // styleの作成をcomputedの追跡対象外にするため、this.$nextTickを使用。
        this.$nextTick(() => {
          this.deleteStyleElem('evotree-index')
          // エッジを描画する。
          this.drawEdge(bfTree, i)
          // ノードを描画する。（色を設定するだけ。）
          this.drawNode(bfTree, this.raceMap, i)
        })
        // ツリーを描画する。
        treeArr.push(...this.drawTree(bfTree))

        evoTree.push(treeArr)
      })
      return evoTree
    },
    /**
     * 別のすがた
     * anotherFormArr
     */
    aotFormArr () {
      const aotFormArr = this.anotherForms
      this.$nextTick(() => {
        // style追加前に、不要なスタイルが残っている場合は削除する。
        this.deleteStyleElem('aot-form-')
        // 描画(styleの追加)
        this.drawAnotherForms(aotFormArr, this.raceMap)
      })
      return aotFormArr
    },
    /**
     * 同系統のポケモン
     */
    bfAfAotFormArr () {
      const bfAfAotFormArr = this.bfAfAotForms
      this.$nextTick(() => {
        // style追加前に、不要なスタイルが残っている場合は削除する。
        this.deleteStyleElem('bfaf-aot-form-')
        // 描画(styleの追加)
        this.drawBfAfAotForms(bfAfAotFormArr, this.raceMap)
      })
      return bfAfAotFormArr
    }
  },
  beforeDestroy () {
    // 作成したstyleをすべて削除する
    this.deleteStyleElem()
  },
  methods: {
    /**
     * 進化ツリーを描画する。
     */
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
    /**
     * 進化ツリーのノードを描画する。
     */
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
    /**
     * 進化ツリーのエッジを描画する。
     */
    drawEdge (yArr, i) {
      yArr.forEach((xArr) => {
        xArr.forEach(v => this.createEdge(i, v.x, v.y, v.dist))
      })
    },
    /**
     * 進化ツリーのノードを結ぶ線（エッジ）のスタイルを作成します。
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
    /**
     * 別のすがたのノードを描画する。
     */
    drawAnotherForms (aotFormArr, raceMap) {
      aotFormArr.forEach((pid) => {
        const idName = `aot-form-${pid}`
        const color = raceMap[pid].color
        const style = `.block.aot-form-${pid} .node {\
            background-color: rgb(${color.r}, ${color.g}, ${color.b}); },`
        this.createStyleElem(idName, style)
      })
    },
    /**
     * 同系統のすがたのノードを描画する。
     */
    drawBfAfAotForms (bfAfAotFormArr, raceMap) {
      bfAfAotFormArr.forEach((pid) => {
        const idName = `bfaf-aot-form-${pid}`
        const color = raceMap[pid].color
        const style = `.block.bfaf-aot-form-${pid} .node {\
          background-color: rgb(${color.r}, ${color.g}, ${color.b}); },`
        this.createStyleElem(idName, style)
      })
    },
    /**
     * styleを追加します。
     */
    createStyleElem (id, style) {
      // styleを追加
      const newStyle = document.createElement('style')
      newStyle.id = id
      newStyle.innerHTML = style
      document.getElementsByTagName('head').item(0).appendChild(newStyle)

      // styleのid名を配列に追加
      this.styleIdArr.push(id)
    },
    /**
     * prefixに該当するstyleを削除する。
     * styleIdArrから削除したidを削除する。
     */
    deleteStyleElem (prefix) {
      // styleの削除
      this.styleIdArr.forEach((id) => {
        if (!prefix || !id.indexOf(prefix)) {
          const elem = document.getElementById(id)
          elem.remove()
        }
      })

      // styleIdArrからの該当のidの削除
      this.styleIdArr = this.styleIdArr.filter((id) => { return prefix && id.indexOf(prefix) })
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
