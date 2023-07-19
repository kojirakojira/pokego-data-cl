import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  window.onNuxtReady(() => {
    createPersistedState({
      key: 'brain-juice',
      paths: ['userId', 'jwt', 'searchState']
    })(store)
  })
}
