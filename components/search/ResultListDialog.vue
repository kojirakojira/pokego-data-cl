<template>
  <v-card>
    <v-card-title :class="color">
      <div style="margin-left:5px; color:white;">
        {{ `ポケモン${psrArrIdx + 1}体目` }}
      </div>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col align="right" style="padding-bottom:0px;">
            {{ `検索結果：${psr.goPokedexList.length}件` }}
          </v-col>
        </v-row>
        <v-row>
          <v-col class="py-0 subtitle-2">
            複数件ヒットしました。比較したいポケモンを選択してください。
          </v-col>
        </v-row>
        <v-row v-if="psr.maybe">
          <v-col class="py-0 subtitle-2">
            ※あいまい検索
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-list outlined>
              <v-subheader>ポケモン</v-subheader>
              <v-list-item-group>
                <v-list-item
                  v-for="(p, gpIdx) in psr.goPokedexList"
                  :key="p.pokedexId"
                  @click="$emit('selected', psr, gpIdx)"
                >
                  <v-list-item-avatar>
                    <v-img :src="p.image ? p.image : require('~/static/img/no-image.png')" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ appendRemarks(p.name, p.remarks) }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'ResultListDialog',
  props: {
    psr: {
      required: true,
      type: Object
    },
    psrArrIdx: {
      required: true,
      type: Number
    }
  },
  data () {
    return {
      color: 'info',
      colorFlg: false // 色を交互に切り替えるためのフラグ
    }
  },
  watch: {
    psr () {
      if (this.colorFlg) {
        this.color = 'info'
      } else {
        this.color = 'success'
      }
      this.colorFlg = !this.colorFlg
    }
  },
  methods: {
    appendRemarks (name, remarks) {
      let val = name
      if (remarks) {
        val = val + `(${remarks})`
      }
      return val
    }
  }
}
</script>
