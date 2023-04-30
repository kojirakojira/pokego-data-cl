<template>
  <v-container class="pa-0">
    <v-row>
      <v-col
        cols="12"
        :md="type2 ? 6 : 12"
        :lg="type2 ? 6 : 12"
        :xl="type2 ? 6 : 12"
      >
        <div class="pa-3">
          タイプ1:
          <span :style="`background-color: ${$editUtils.getRGB(type1)};'}`" class="type">
            {{ $CONST.getValue(type1, $CONST.TYPE) }}
          </span>
        </div>
        <TypeAtkTable :atk-type="type1" :def-type-dic="defTypeDic1" class="" />
      </v-col>
      <v-col v-if="type2" cols="12" md="6" lg="6" xl="6">
        <div class="pa-3">
          タイプ2:
          <span :style="`background-color: ${$editUtils.getRGB(type2)};'}`" class="type">
            {{ $CONST.getValue(type2, $CONST.TYPE) }}
          </span>
        </div>
        <TypeAtkTable :atk-type="type2" :def-type-dic="defTypeDic2" class="" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TypeAtkTable from '~/components/search/type/TypeAtkTable'
export default {
  name: 'TypeAtkDmgMult',
  components: {
    TypeAtkTable
  },
  props: {
    type1: {
      type: String,
      required: true
    },
    type2: {
      type: String,
      required: false,
      default: null
    },
    defTypeDic1: {
      type: Object,
      required: true
    },
    defTypeDic2: {
      type: Object,
      required: false,
      default: () => {}
    }
  }

}
</script>
