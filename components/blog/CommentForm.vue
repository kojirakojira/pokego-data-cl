<template>
  <div class="comment-form">
    <v-container>
      <v-row>
        <v-col>
          <h2>
            <v-icon>
              mdi-pen
            </v-icon>
            コメントを残す
          </h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
          投稿者名
        </v-col>
        <v-col cols="12" md="8" lg="8" xl="8">
          <v-text-field
            v-model="form.name"
            label="任意"
            outlined
            dense
            rows="1"
            autocomplete="off"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
          メールアドレス
        </v-col>
        <v-col cols="12" md="8" lg="8" xl="8">
          <v-text-field
            v-model="form.email"
            label="任意"
            outlined
            dense
            rows="1"
            autocomplete="off"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4" lg="4" xl="4" class="col-title">
          コメント<span class="required-mark">必須</span>
        </v-col>
        <v-col>
          <v-textarea
            v-model="form.content"
            counter
            label="コメントを入力してください。"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col align="right">
          <v-btn color="success" min-width="20%" @click="onClick()">
            コメント送信
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'CommentForm',
  props: {
    form: {
      required: true,
      type: Object
    }
  },
  methods: {
    onClick () {
      let { name, email, content } = this.form
      // HTMLタグ除去
      name = this.removeTag(name)
      email = this.removeTag(email)
      content = this.removeTag(content)
      // 入力チェック
      const msg = this.$validate([
        { valid: 'email', item: email },
        { valid: 'required', item: content, itemName: 'コメント' }
      ])

      this.$emit('click', { name, email, content, msg })
    },
    removeTag (arg1) {
      // HTMLタグを除去する。
      return arg1.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
    }
  }

}
</script>

<style scoped>
.comment-form {
  background-color: white;
}
</style>
