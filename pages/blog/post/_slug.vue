<template>
  <div>
    <div id="post">
      <p id="blog-name">
        ペリぶろぐ
      </p>
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
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Post from '~/components/blog/Post'
// import CommentForm from '~/components/blog/CommentForm'

export default {
  name: 'Article',
  components: {
    Post
    // CommentForm
  },
  data () {
    return {
      slug: this.$route.params.slug,
      postInfo: {
        id: 0,
        title: '',
        content: '',
        mediaLink: '',
        prev: {},
        next: {}
      },
      commentForm: {
        name: '',
        email: '',
        content: ''
      },
      isLoading: true
    }
  },
  async mounted () {
    await this.get()
    this.isLoading = false
  },
  methods: {
    async get () {
      await axios.get(process.env.VUE_APP_BLOG_URL + '/wp-json/wp/v2/posts?_embed&slug=' + this.slug)
        .then((res) => {
          const rd = res.data[0]
          this.postInfo.id = rd.id
          this.postInfo.title = rd.title.rendered
          this.postInfo.content = rd.content.rendered
          this.postInfo.prev = rd.prev
          this.postInfo.next = rd.next

          if (rd._embedded['wp:featuredmedia'] && rd._embedded['wp:featuredmedia'][0].link) {
            this.postInfo.mediaLink = rd._embedded['wp:featuredmedia'][0].link
          }
        })
        .catch(() => {
          this.postInfo.content = '<p></p><span class="headline">記事の取得に失敗しました。</span><p></p>'
        })
    }
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
    //   }

  },
  head () {
    return {
      title: 'ペリぶろぐ',
      meta: [
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: 'ペリぶろぐ - ペリずかん' },
        { property: 'og:url', content: process.env.VUE_APP_URL + this.$route.path },
        { property: 'og:site_name', content: 'ペリずかん' },
        { property: 'og:description', content: '' },
        { property: 'og:image', content: '' }
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
