<template>
  <div>
    <v-img :max-height="150" :max-width="150" :src="path" /><br>
    <v-file-input v-model="imageFile" show-size label="ファイルを選択" />
    <div v-show="isExtErr" class="error-message-text">
      ※正しい拡張子で指定してください。
      <br>指定できる拡張子はjpg, jpeg, png, gif, tiff, tifのみです。
    </div>
  </div>
</template>

<script>
export default {
  name: 'Thumbnail',
  props: {
    thumbnail: {
      type: [String, Object],
      default: null
    }
  },
  data () {
    return {
      imageFile: null,
      defPath: '',
      path: '',
      isExtErr: false
    }
  },
  watch: {
    imageFile () {
      if (this.imageFile) {
        const imageExt = [
          'jpg',
          'jpeg',
          'png',
          'gif',
          'tiff',
          'tif',
          'JPG',
          'JPEG',
          'PNG',
          'GIF',
          'TIFF',
          'TIF'
        ]

        const imageFileName = this.imageFile.name
        const inputExt = imageFileName.substr(imageFileName.lastIndexOf('.') + 1)
        let flg = true
        imageExt.forEach(function (ext) {
          if (ext === inputExt) {
            // 一致する拡張子があったらfalseにする
            flg = false
          }
        })
        if (!flg) {
          const reader = new FileReader()
          reader.onload = (e) => {
            this.path = e.target.result
          }
          reader.readAsDataURL(this.imageFile)
        }
        this.isExtErr = flg
      } else {
        // サムネイル画像が設定されてない場合は拡張子のエラー表示をなくす
        this.isExtErr = false
        this.path = this.defPath ? this.defPath : '/img/no-image.png'
      }
    }
  },
  mounted () {
    this.setPath()
  },
  methods: {
    setPath () {
      if (this.thumbnail) {
        if (typeof this.thumbnail === 'string') {
          // String
          // 編集前に画像が指定されている場合はString型で入ってくる
          this.defPath = this.thumbnail
          this.path = this.thumbnail
        } else {
          // Object
          const reader = new FileReader()
          reader.onload = (e) => {
            this.path = e.target.result
          }
          reader.readAsDataURL(this.thumbnail)
        }
      }
    },
    getImageFile () {
      return this.imageFile ? this.imageFile : null
    },
    getFileSize () {
      if (!this.imageFile) {
        return false
      }
      return this.imageFile.size
    },
    isError () {
      return this.isExtErr
    },
    clear () {
      this.imageFile = null
      this.defPath = ''
      this.path = ''
    }
  }
}
</script>

<style scoped>
.col-title {
  font-weight: bold;
}
</style>
