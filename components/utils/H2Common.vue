<template>
  <v-container>
    <p />
    <h2 class="display-1">
      <v-row>
        <v-col :class="`h2-title ${className}`">
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
      imageLocation: '/img/',
      className: 'h2-brain-icon'
    }
  },
  beforeMount () {
    this.createStyle()
  },
  methods: {
    createStyle () {
      // styleが既に設定されている場合は取得
      const styleElem = document.getElementById(this.className)

      // プロパティを指定
      const style = `.${this.className} {\
        background-image: url(${this.imageSelector()}), url(${this.imageSelector(true)});\
        background-size: 65px;\
        background-position-x: 98%, 2%;
        text-stroke: 0.5px black;
        -webkit-text-stroke: 0.5px black; }`

      if (styleElem) {
        // styleが既に設定されている場合
        styleElem.innerHTML = style
      } else {
        // styleが設定されていない場合
        const newStyle = document.createElement('style')

        newStyle.id = this.className
        newStyle.innerHTML = style
        document.getElementsByTagName('head').item(0).appendChild(newStyle)
      }
    },
    /**
     * ランダムにイメージを取得する。
     * brainImagesの配列に設定されている中から設定する。
     */
    imageSelector (flipFlg) {
      const idx = Math.floor(Math.random() * this.brainImages.length)
      let imgPath = process.env.VUE_APP_URL + this.imageLocation + this.brainImages[idx]
      imgPath += (flipFlg ? '-flip' : '')
      imgPath += '.png'
      return imgPath
    }
  }
}
</script>
