<!-- こうげき倍率（こうげきを与える際の倍率ごとのタイプ）の表 -->
<template>
  <v-container class="basic-info-table atk-dmg-mult-table">
    <v-row v-for="(adm, admIdx) in atkDmgMultArr" :key="`atk-dmg-mult-${adm.name}`">
      <v-col cols="4" :style="`background: ${$editUtils.getRGB(atkType)}`">
        {{ adm.dmgMult }}
      </v-col>
      <v-col cols="8" :style="admIdx % 2 === 0 ? `background: ${$editUtils.getRGBA(0.1, atkType)}` : ''">
        <span
          v-for="(type, idx) in defTypeDic[adm.name]"
          :key="`atk-dmg-mult-${type}`"
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
  name: 'TypeAtkTable',
  props: {
    atkType: {
      type: String,
      required: true
    },
    defTypeDic: {
      type: Object,
      required: true
    }
  },
  data () {
    return {

      atkDmgMultArr: [
        { name: 'HIGH', dmgMult: '×1.6' },
        { name: 'LOW', dmgMult: '×0.625' },
        { name: 'VERY_LOW', dmgMult: '×0.390625' }]
    }
  }
}
</script>

<style scoped lang="scss">
.atk-dmg-mult-table {
  max-width: 500px;
}
</style>
