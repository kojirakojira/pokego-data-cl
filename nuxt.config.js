import colors from 'vuetify/es5/util/colors'

const environment = process.env.NODE_ENV
const envSettings = require(`./env.${environment}.js`)

export default {
  ssr: true,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - pokedexBJ',
    title: 'pokedexBJ',
    htmlAttrs: {
      lang: 'ja'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'google-site-verification', content: 'rwSZiGYezVoKWWBVOlGg5HLVZBZRba0JhnVRddn_q7k' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '~/assets/style.css'
  ],
  styleResources: {
    scss: [
      '~/assets/common/common.scss'
    ]
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {
      src: '~/plugins/localStorage',
      ssr: false
    },
    {
      src: '~/plugins/VueLoading',
      ssr: false
    },
    {
      src: '~/plugins/axiosCommon',
      ssr: false
    },
    {
      src: '~/plugins/redirect',
      ssr: false
    },
    '~/plugins/constants',
    '~/plugins/validateUtils',
    '~/plugins/editUtils',
    '~/plugins/sanitize',
    '~/plugins/firebase'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    'nuxt-client-init-module',
    '@nuxtjs/style-resources'
  ],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    /*
     ** Run ESLint on save
     */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    loaders: {
      // SCSSを扱う.
      scss: {
        // デフォルト値だと動かないので、sass(Dart Sass)で上書き.
        implementation: require('sass'),
        // sassのオプションにfibersを設定.
        sassOptions: {
          // fibersプロパティではないので注意. (ややこしい)
          fiber: require('fibers')
        }
      }
    },
    postcss: null
  },

  router: {
    middleware: ['auth', 'homeRedirect']
  },

  env: envSettings
}
