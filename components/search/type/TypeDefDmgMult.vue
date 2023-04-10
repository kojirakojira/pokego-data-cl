<template>
  <div>
    <div class="pa-3">
      タイプ1:
      <span :style="`background-color: ${$editUtils.getRGB(type1)};'}`" class="type">
        {{ $CONST.getValue(type1, $CONST.TYPE) }}
      </span>
      <div v-if="type2">
        タイプ2:
        <span :style="`background-color: ${$editUtils.getRGB(type2)};'}`" class="type">
          {{ $CONST.getValue(type2, $CONST.TYPE) }}
        </span>
      </div>
    </div>
    <TypeDefTable
      :def-type1="type1"
      :def-type2="type2"
      :atk-type-dic="atkTypeDic"
      style="margin-bottom: 36px;"
    />
  </div>
</template>

<script>
import TypeDefTable from '~/components/search/type/TypeDefTable'
export default {
  name: 'TypeDefDmgMult',
  components: {
    TypeDefTable
  },
  props: {
    type1: {
      type: String,
      required: true
    },
    type2: {
      type: String,
      required: true
    },
    atkTypeDic: {
      type: Object,
      required: true
    }
  }

}
</script>
