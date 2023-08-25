<template>
  <div>
    <v-container>
      <v-row>
        <v-col align="right" style="padding-bottom:0px;">
          {{ `検索結果：${psr.goPokedexList.length}件` }}
        </v-col>
      </v-row>
      <v-row>
        <v-col class="py-0 subtitle-2">
          複数件ヒットしました。ポケモンを選択してください。
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
                v-for="p in psr.goPokedexList"
                :key="p.pokedexId"
                @click="$emit('clickRow', p.pokedexId)"
              >
                <v-list-item-avatar>
                  <v-img :src="p.image ? p.image : require('~/static/img/no-image.png')" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $editUtils.appendRemarks(p.name, p.remarks) }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'ResultList',
  props: {
    psr: {
      required: true,
      type: Object
    },
    searchPattern: {
      required: true,
      type: String
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
