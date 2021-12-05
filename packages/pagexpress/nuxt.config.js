const { CLIENT_BASE_PATH, SERVER_APP_URL, API_BASE_PATH } = process.env;

export default {
  ssr: false,
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  publicRuntimeConfig: {
    serverAppUrl: SERVER_APP_URL,
  },
  manifest: {
    crossorigin: 'use-credentials',
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#454545' },
  /*
   ** Global CSS
   */
  css: [
    '~/assets/css/main.css',
    'quill/dist/quill.core.css',
    'quill/dist/quill.snow.css',
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~plugins/quill-plugin', ssr: false },
    '~/plugins/socket.js',
  ],
  router: {
    middleware: ['auth', 'prevent-leaving', 'left-editing-event'],
    base: CLIENT_BASE_PATH,
  },
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    [
      'nuxt-fontawesome',
      {
        component: 'fa', // customize component name
        imports: [
          {
            set: '@fortawesome/free-solid-svg-icons',
            icons: [
              'faEdit',
              'faGripVertical',
              'faMinus',
              'faPlus',
              'faPaste',
              'faCopy',
              'faCut',
              'faTrashAlt',
              'faClone',
              'faSearch',
              'faTimes',
              'faEye',
              'faExclamationTriangle',
              'faUserEdit',
            ],
          },
        ],
      },
    ],
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/modules/tree/master/packages/bulma
    '@nuxtjs/bulma',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/pwa',
  ],
  axios: {
    baseURL: `${SERVER_APP_URL}${API_BASE_PATH}`,
  },
  auth: {
    redirect: {
      login: '/sign-in',
      logout: '/sign-in',
      home: '/',
      callback: '/sign-in',
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: 'auth', method: 'post', propertyName: 'token' },
          user: { url: 'users/me', method: 'get', propertyName: 'email' },
          logout: false,
        },
      },
    },
  },
  /*
   ** Build configuration
   */
  build: {
    babel: {
      plugins: [['@babel/plugin-proposal-private-methods', { loose: true }]],
    },
    postcss: {
      plugins: {
        'postcss-nested': {},
      },
      preset: {
        features: {
          customProperties: false,
        },
      },
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
};
