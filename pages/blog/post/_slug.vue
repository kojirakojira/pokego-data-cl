<template>
  <div>
    <div id="post">
      <p id="blog-name">
        ペリぶろぐ
      </p>
      <client-only>
        <v-container>
          <v-row>
            <v-col class="px-0">
              <template v-if="!isLoading">
                <Post
                  :title="postInfo.title"
                  :content="postInfo.content"
                  :media-link="postInfo.mediaLink"
                  :prev="postInfo.prev"
                  :next="postInfo.next"
                />
              <!-- <CommentForm :form="commentForm" class="my-3 py-3" @click="submitCommentForm" /> -->
              </template>
              <Loading v-else split-scr />
            </v-col>
          </v-row>
        </v-container>
      </client-only>
    </div>
  </div>
</template>

<script>
import Post from '~/components/blog/Post'
// import CommentForm from '~/components/blog/CommentForm'

export default {
  name: 'Article',
  components: {
    Post
    // CommentForm
  },
  async asyncData ({ $axios, params }) {
    const postInfo = {}

    // スラッグ（WordPressにおける記事を特定するためのエンドポイント的なやつ。）
    const slug = params.slug
    // WordPressのURL
    const url = `${process.env.VUE_APP_BLOG_URL}/wp-json/wp/v2/posts?_embed&slug=${slug}`
    const res = await $axios.get(url)
      .catch(() => {})

    if (!res || !res.data[0]) {
      postInfo.content = '<p></p><span class="headline">記事の取得に失敗しました。</span><p></p>'
    }

    const rd = res.data[0]
    postInfo.id = rd ? rd.id : 0 // 記事ID
    postInfo.title = rd ? rd.title.rendered : '' // 記事タイトル
    postInfo.content = rd ? rd.content.rendered : postInfo.content // 記事本文
    postInfo.prev = rd ? rd.prev : null // 前の記事
    postInfo.next = rd ? rd.next : null // 次の記事

    // アイキャッチ画像
    // res.data._embedded.wp:featuredmedia[0].linkが存在してたらアイキャッチ画像が存在する。
    const wpfm = 'wp:featuredmedia'
    postInfo.mediaLink = (rd && rd._embedded[wpfm] && rd._embedded[wpfm][0].link)
      ? rd._embedded[wpfm][0].link : ''

    // OGP情報の生成
    const content = postInfo.content.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
    const ogpInfo = {
      title: postInfo.title,
      content: content.length > 100 ? content.substring(0, 100) : content,
      image: postInfo.mediaLink
    }

    return {
      slug,
      postInfo,
      ogpInfo
    }
  },
  data () {
    return {
      // commentForm: {
      //   name: '',
      //   email: '',
      //   content: ''
      // },
      isLoading: true
    }
  },
  beforeMount () {
    this.isLoading = false
  },
  methods: {
    async get () {
    //   submitCommentForm ({ name, email, content, msg }) {
    //     if (msg) {
    //       alert(msg)
    //       return
    //     }

    //     this.comment(name, email, content)
    //   },
    //   /**
    //    * コメントを作成する。
    //    * WP REST APIを呼び出してコメントを作成する。
    //    *
    //    * @param {name}
    //    * @param {email}
    //    * @param {content}
    //    */
    //   async comment (name, email, content) {
    //     await axios.post(process.env.VUE_APP_BLOG_URL + '/wp-json/wp/v2/comments', {
    //       post: this.postInfo.id,
    //       author_name: name,
    //       author_email: email,
    //       content
    //     },
    //     { headers: { 'content-type': 'application/json' } })
    //       .then((res) => {
    //         console.log(res)
    //       })
    //       .catch((err) => {
    //         console.log(err.response)
    //         if (err.response.status !== 401) {
    //           alert('何らかのエラーが発生しました。')
    //           this.$router.back()
    //         }
    //       })
    }

  },
  head () {
    return {
      title: `${this.ogpInfo.title} - ペリぶろぐ`,
      meta: [
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: `${this.ogpInfo.title} - ペリぶろぐ` },
        { property: 'og:url', content: process.env.VUE_APP_URL + this.$route.path },
        { property: 'og:site_name', content: 'ペリずかん' },
        { property: 'og:description', content: this.ogpInfo.content },
        { property: 'og:image', content: this.ogpInfo.image }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
#post {
  background-color: #f3f4f5;

  #blog-name {
    background-color: gold;
    padding: 24px;
    font-weight: bold;
    font-size: 28px;
  }
}
</style>
