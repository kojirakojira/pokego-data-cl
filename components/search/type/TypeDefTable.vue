<!-- ぼうぎょ倍率（こうげきを与える際の倍率ごとのタイプ）の表 -->
<template>
  <v-container class="def-dmg-mult-table">
    <v-row v-for="(ddm, ddmIdx) in defDmgMultArr" :key="`def-dmg-mult-${ddm.name}`">
      <v-col cols="4" :style="`background: ${$editUtils.getRGB(defType1, defType2)}`">
        {{ ddm.dmgMult }}
      </v-col>
      <v-col
        cols="8"
        :style="ddmIdx % 2 === 0 ? `background: ${$editUtils.getRGBA(0.1, defType1, defType2)}` : ''"
      >
        <span
          v-for="(type, idx) in atkTypeDic[ddm.name]"
          :key="`def-dmg-mult-${type}`"
          :style="`background-color: ${$editUtils.getRGB(type)}; ${idx === 0 ? '': 'margin-left:5px;'}`"
          class="type"
        >
          {{ $CONST.getValue(type, $CONST.TYPE) }}
        </span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'TypeDefTable',
  props: {
    defType1: {
      type: String,
      required: true
    },
    defType2: {
      type: String,
      required: true
    },
    atkTypeDic: {
      type: Object,
      required: true
    }
  },
  data () {
    return {

      defDmgMultArr: [
        { name: 'MAX', dmgMult: '×2.56' },
        { name: 'HIGH', dmgMult: '×1.6' },
        { name: 'LOW', dmgMult: '×0.625' },
        { name: 'VERY_LOW', dmgMult: '×0.390625' },
        { name: 'MIN', dmgMult: '×0.244140625' }]
    }
  }
}
</script>

<style scoped lang="scss">
.def-dmg-mult-table {
  border: medium solid grey;
  border-radius: 10px;
  overflow: hidden;
  max-width: 500px;
  .row {
    /** "見出し列"だけに指定 */
    .col:first-child {
      color: white;
      font-weight: bold;
      word-wrap: break-word;

    }
  }
  /** 最後の行以外の"見出し列"だけに指定 */
  .row:not(:last-child) {
    .col:first-child {
      border-bottom: thin solid black;
    }
  }
}
</style>
