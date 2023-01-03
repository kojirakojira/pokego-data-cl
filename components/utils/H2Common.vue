<template>
  <v-container>
    <p />
    <h2 class="display-1">
      <v-row>
        <v-col class="h2-title h2-brain-icon">
          <slot />
        </v-col>
      </v-row>
    </h2>
  </v-container>
</template>

<script>
export default {
  name: 'H2Common',
  data () {
    return {
      brainImages: [
        'brain-juice-cat',
        'brain-juice-cat2',
        'brain-juice'
      ],
      imageLocation: '/img/'
    }
  },
  beforeMount () {
    this.createStyle()
  },
  methods: {
    createStyle () {
      const newStyle = document.createElement('style')
      let style = '.h2-brain-icon {'
      style += 'background-image: '
      style += 'url(' + this.imageSelector() + '), '
      style += 'url(' + this.imageSelector(true) + ');'
      style += 'background-size: contain; background-position-x: 98%, 2%; }'

      newStyle.innerHTML = style
      document.getElementsByTagName('head').item(0).appendChild(newStyle)
    },
    imageSelector (flg) {
      const idx = Math.floor(Math.random() * this.brainImages.length)
      let imgPath = process.env.VUE_APP_URL + this.imageLocation + this.brainImages[idx]
      imgPath += (flg ? '-flip' : '')
      imgPath += '.png'
      return imgPath
    }
  }
}
</script>
