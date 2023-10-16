<template>
  <div class="evo-edge">
    <div class="evo-edge-flow">
      <Pokemon
        :pid="goPokedex1.pokedexId"
        :name="goPokedex1.name"
        :remarks="goPokedex1.remarks"
        :image="goPokedex1.image"
        :click-action="() => { $router.push({ name: routerLink, query: { pid: goPokedex1.pokedexId }})}"
      />
      <v-icon class="px-1">
        mdi-arrow-right-bold-box
      </v-icon>
      <Pokemon
        :pid="goPokedex2.pokedexId"
        :name="goPokedex2.name"
        :remarks="goPokedex2.remarks"
        :image="goPokedex2.image"
        :click-action="() => { $router.push({ name: routerLink, query: { pid: goPokedex2.pokedexId }})}"
      />
    </div>
    <div v-if="annos.length" class="evo-edge-annos">
      <p v-for="(anno, i) in annos" :key="`anno-${i}`" style="margin: 0px;">
        {{ `他の進化条件${String.fromCharCode(0x2460 + i)}：${anno}` }}
      </p>
    </div>
  </div>
</template>

<script>
import Pokemon from '~/components/search/evoCost/Pokemon'
export default {
  name: 'EvoEdge',
  components: {
    Pokemon
  },
  props: {
    goPokedex1: {
      type: Object,
      required: true
    },
    goPokedex2: {
      type: Object,
      required: true
    },
    annos: {
      type: Array,
      required: false,
      default: () => []
    },
    routerLink: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.evo-edge {
    display: flex;
    flex-flow: column;
    background: white;
    max-width: 100%;

    .evo-edge-flow {
        display: inline-flex;
        align-items: center;

        .evo-cost-pokemon {
            width: 150px;
        }
    }

    .evo-edge-annos {
        font-size: 10px;
    }
}
</style>
