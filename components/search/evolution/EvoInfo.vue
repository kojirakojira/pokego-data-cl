<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="col-title">
        <h4 style="margin: 0px;">
          進化ツリー
        </h4>
      </v-col>
      <v-col cols="12" style="justify-content: center; display: flex;">
        <div style="overflow-x: auto; display: flex;">
          <div v-for="(yArr, i) in evoTree" :key="i" class="evo-tree">
            <div v-for="(xArr, y) in yArr" :key="`hierarchy-${y + 1}`" class="hierarchy">
              <div v-for="h in xArr" :key="`index${i}-${h.y}-${h.x}`" :class="`block index${i}-${h.y}-${h.x}`">
                <template v-if="!h.blank">
                  <div v-if="0 < y" class="edge" />
                  <ul
                    v-if="0 < y"
                    class="costs"
                    @mouseenter="onCostsEnter(`index${i}-${h.y}-${h.x}`)"
                    @mouseleave="onCostsLeave(`index${i}-${h.y}-${h.x}`)"
                  >
                    <li v-for="(c, ci) in h.costs" :key="`costs${i}-${h.y}-${h.x}-${ci}`">
                      <!-- text-overflow:ellipsisとliの中点は共存不可 -->
                      {{ '・' + c }}
                    </li>
                  </ul>
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
            <ul v-if="evoTreeAnnos.length" class="evo-tree-annos">
              <li v-for="(anno, i) in evoTreeAnnos" :key="`anno-${i}`">
                {{ anno }}
              </li>
            </ul>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div class="col-title">
          <h4 style="margin: 0px;">
            別のすがた
          </h4>
        </div>
      </v-col>
      <v-col>
        <v-container v-if="aotFormArr.length" style="justify-content: center; display: grid;">
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
        <div v-else align="center">
          なし
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="col-title">
        <h4 style="margin: 0px;">
          同系統のポケモン
        </h4>
      </v-col>
      <v-col>
        <v-container v-if="bfAfAotFormArr.length" style="justify-content: center; display: grid;">
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
        <div v-else align="center">
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
    /** 図鑑ID */
    pokedexId: {
      type: String,
      required: true
    },
    /** 進化ツリー */
    evoTreeInfo: {
      type: Array,
      required: true
    },
    /** 別のすがた */
    anotherForms: {
      type: Array,
      required: true
    },
    /** 別のすがたの進化前、進化後 */
    bfAfAotForms: {
      type: Array,
      required: true
    },
    /** 種族値マップ */
    raceMap: {
      type: Object,
      required: true
    },
    /** 進化ツリーの注釈 */
    evoTreeAnnos: {
      type: Array,
      required: false,
      default: () => []
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
     * ※処理中で、style(css)を生成したり、styleIdArrを更新したりしている。
     * 本来、computedで別の値を更新するのは良くないが、今回のケースではそれが最適解であると考える。
     */
    evoTree () {
      const evoTree = []
      // 親コンポーネントの進化ツリーを取得
      const evoTreeInfo = this.evoTreeInfo

      // styleIdArrを更新するため、古いstyleIdをstyleIdArrを削除する。
      this.$nextTick(() => {
        this.styleIdArr = this.$editUtils.deleteStyleElem(this.styleIdArr, 'evotree-index')
      })

      evoTreeInfo.forEach((bfTree, i) => {
        const treeArr = []

        // styleの作成をcomputedの追跡対象外にするため、this.$nextTickを使用。
        this.$nextTick(() => {
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
        this.styleIdArr = this.$editUtils.deleteStyleElem(this.styleIdArr, 'aot-form-')
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
        this.styleIdArr = this.$editUtils.deleteStyleElem(this.styleIdArr, 'bfaf-aot-form-')
        // 描画(styleの追加)
        this.drawBfAfAotForms(bfAfAotFormArr, this.raceMap)
      })
      return bfAfAotFormArr
    }
  },
  beforeDestroy () {
    // 作成したstyleをすべて削除する
    this.$editUtils.deleteStyleElem(this.styleIdArr)
  },
  methods: {
    /**
     * costsにマウスカーソルを乗せた際のイベント
     */
    onCostsEnter (index) {
      const costs = document.getElementsByClassName(index)[0].getElementsByClassName('costs')[0]
      costs.className += ' costs-enter'
    },
    /**
     * costsからマウスカーソルを外した際のイベント
     */
    onCostsLeave (index) {
      const costs = document.getElementsByClassName(index)[0].getElementsByClassName('costs')[0]
      costs.className = 'costs'
    },
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

      // 要素が存在しない箇所に空であることを示す要素(blank: true)を追加する。
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
          this.$editUtils.createStyleElem(idName, style, this.styleIdArr)
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
        left: ${-80 * dist}px; }`
      this.$editUtils.createStyleElem(idName, style, this.styleIdArr)
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
        this.$editUtils.createStyleElem(idName, style, this.styleIdArr)
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
        this.$editUtils.createStyleElem(idName, style, this.styleIdArr)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.evo-tree {
  background-color: black;
  width: fit-content;

  .hierarchy {
    height: 140px;
    display: flex;
  }

  .evo-tree-annos {
    color: white;
    padding-bottom: 5px;
    font-size: 12px;

    li::marker {
      content: '※';
    }
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
    height: 90px;
    top: -20px;
    border-top: 2px solid yellow;
    border-right: 2px solid yellow;
    border-radius: 0 30px 0 0;
    z-index: 50;
  }
  .edge:before {
    content: '';
    position: absolute;
    height: 50px;
    top: -50px;
    border-bottom: 2px solid yellow;
    border-left: 2px solid yellow;
    border-radius: 0 0 0 30px;
    z-index: 50;
  }

  .pokemon {
    margin-left: 15px;
  }

  .costs {
    position: absolute;
    left: 45px;
    top: -10px;
    color: white;
    font-size: 11px;
    z-index: 52;
    width: calc(100% - 45px);
    padding-left: 0px;

    li {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &-enter {
      background-color: #F5F5F5;
      color: black;
      border-radius: 2px;
      font-weight: bold;
      height: auto;

      li {
        white-space: normal;
      }
    }
  }
}
</style>
