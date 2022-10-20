<template>
  <div>
    <div v-if="token">
      <v-container>
        <h2 class="display-1">
          <v-row>
            <v-col style="font-weight:bold;">
              セリフ追加
            </v-col>
          </v-row>
        </h2>
      </v-container>
      <div>
        <v-container>
          <v-row>
            <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
              <v-icon>
                mdi-pen
              </v-icon>
              セリフ
            </v-col>
            <v-col cols="12" md="8" lg="8" xl="8">
              <v-textarea
                v-model="line.lines"
                counter
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
              <v-icon>
                mdi-pen
              </v-icon>
              キャラクター
            </v-col>
            <v-col cols="12" md="8" lg="8" xl="8">
              <v-text-field
                v-model="line.character"
                outlined
                dense
                rows="1"
                clearable
                :rules="rules.catchcopy"
                :counter="50"
                maxlength="50"
                autocomplete="off"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4" lg="4" xl="4" class="subtitle-2">
              <v-icon>
                mdi-pen
              </v-icon>
              巻数
            </v-col>
            <v-col cols="12" md="8" lg="8" xl="8">
              <v-text-field
                v-model="line.volume"
                outlined
                dense
                rows="1"
                clearable
                :rules="rules.number"
                autocomplete="off"
                type="tel"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4" lg="4" xl="4" class="subtitle-2">
              <v-icon>
                mdi-pen
              </v-icon>
              話数
            </v-col>
            <v-col cols="12" md="8" lg="8" xl="8">
              <v-text-field
                v-model="line.episode"
                outlined
                dense
                rows="1"
                clearable
                :rules="rules.number"
                autocomplete="off"
                type="tel"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
              <v-icon>
                mdi-pen
              </v-icon>
              コメント
            </v-col>
            <v-col cols="12" md="8" lg="8" xl="8">
              <v-textarea
                v-model="line.comment"
                counter
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col align="center">
              <v-btn
                rounded
                min-width="50%"
                color="info"
                :disabled="isLoading"
                @click="onClickClear"
              >
                クリア
              </v-btn>
            </v-col>
            <v-col align="center">
              <v-btn
                rounded
                min-width="50%"
                color="success"
                :disabled="isLoading || isClick"
                @click="onClickSubmit"
              >
                送信
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
    <div>
      <Loading />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SaveLine',
  data () {
    return {
      rules: {
        eventName: [
          v =>
            (v || '').length <= 30 || 'イベント名は30文字以内で入力してください。'
        ],
        catchcopy: [
          v =>
            (v || '').length <= 50 ||
            'キャッチコピーは50文字以内で入力してください。'
        ],

        number: [
          v => !(v || '0').match('[^0-9]+') || '半角数字で入力してください。'
        ]
      },
      line: {
        lines: '',
        character: '',
        volume: '',
        episode: '',
        comment: ''
      },
      isLoading: true,
      isClick: false
    }
  },
  computed: {
    // storeのtokenをバインド
    token () {
      return this.$store.getters.jwt
    }
  },
  mounted () {
    this.isLoading = false
  },
  methods: {
    onClickClear () {
      this.clear()
    },
    onClickSubmit () {
      this.isClick = true
      const msg = this.check()
      if (msg) {
        alert(msg)
        this.isClick = false
        return
      }
      this.post()
    },
    async post () {
      try {
        const formData = new FormData()
        formData.append('lines', this.line.lines)
        formData.append('character', this.line.character)
        formData.append('volume', this.line.volume)
        formData.append('episode', this.line.episode)
        formData.append('comment', this.line.comment)

        const config = {
          headers: {
            'content-type': 'multipart/form-data'
          }
        }
        await this.$axios.post('/api/save', formData, config)
          .then((res) => {
            this.clear()
            this.isClick = false
            this.$store.dispatch('getToast', { msg: 'セリフを追加しました。' })
          })
      } catch (error) {
        alert('送信に失敗しました。インターネット接続状態を確認後再度実行してみてください。')
        this.isClick = false
      }
    },
    clear () {
      this.line.lines = ''
      this.line.character = ''
      this.line.volume = ''
      this.line.episode = ''
      this.line.comment = ''
      this.$store.dispatch('getToast', { msg: 'クリア完了' })
    },
    check () {
      let msg = ''
      msg += this.checkString(this.line.lines, 'セリフを入力してください。\n')
      msg += this.checkString(this.line.character, 'キャラクターを入力してください。\n')

      msg += this.checkNumber(this.line.volume, '巻数を数値で入力してください。\n')
      msg += this.checkNumber(this.line.episode, '話数を数値で入力してください。\n')

      return msg
    },
    checkString (str, msg) {
      return str ? '' : msg
    },
    checkNumber (num, msg) {
      return num && !num.match('[^0-9]+') ? '' : msg
    }
  }
}
</script>
