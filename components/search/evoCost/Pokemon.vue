<template>
  <div
    class="evo-cost-pokemon"
    :style="link || clickAction ? 'cursor: pointer;' : 'pointer-events: none;'"
    @click="clickAction()"
  >
    <v-avatar size="36" style="float:left">
      <v-img :src="image ? image : require('~/static/img/no-image.png')" />
    </v-avatar>
    <span class="pokemon-name">
      {{ name }}
      <div v-if="remarks" class="remarks">
        {{ `(${remarks})` }}
      </div>
    </span>
  </div>
</template>

<script>
export default {
  name: 'EvoCostPokemon',
  props: {
    pid: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    remarks: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: false,
      default: null
    },
    link: {
      type: Boolean,
      required: false,
      default: false
    },
    clickAction: {
      type: Function,
      required: false,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
.evo-cost-pokemon {
    display: flex;
    align-items: center;

  .pokemon-name {
    margin-left: 5px;
    font-size: 14px;

    .remarks {
      font-size: 10px;
    }
  }
}
</style>
