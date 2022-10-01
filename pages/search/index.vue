<template>
  <div>
    <v-container>
      <p />
      <H2Common>
        ホームのページ
      </H2Common>
    </v-container>
    <v-container>
      <v-row>
        <v-col>
          <ul>
            <li>
              <nuxt-link :to="{name: 'search-raid'}">
                レイドボスのCP
              </nuxt-link>
            </li>
          </ul>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import H2Common from '~/components/utils/H2Common'
export default {
  name: 'Home',
  components: {
    H2Common
  }
}
</script>
