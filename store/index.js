export const state = () => ({
  userId: '',
  jwt: '',
  toast: {
    msg: null,
    color: 'black',
    timeout: 4000
  },

  searchState: null // 画面復元用オブジェクト。(routeName, (psr)をセットする)
})

export const getters = {
  userId (state) {
    return state.userId
  },
  jwt (state) {
    return state.jwt
  },
  searchState (state) {
    return state.searchState
  }
}

export const mutations = {
  setUserId (state, userId) {
    state.userId = userId
  },
  setJwt (state, jwt) {
    state.jwt = jwt
  },
  setToast (state, payload) {
    state.toast = payload
  },
  setSearchState (state, searchState) {
    state.searchState = searchState
  },
  RESET_VUEX_STATE (state) {
    Object.assign(state, localStorage.getItem('brain-juice'))
  }
}

export const actions = {
  setUserId ({ commit }, value) {
    commit('setUserId', value)
  },
  setJwt ({ commit }, value) {
    commit('setJwt', value)
  },
  getToast ({ commit }, toast) {
    toast.color = toast.color || 'black'
    toast.timeout = toast.timeout || 4000
    commit('setToast', toast)
  },
  setSearchState ({ commit }, searchState) {
    commit('setSearchState', searchState)
  },
  nuxtClientInit ({ commit }, context) {
    const data = JSON.parse(localStorage.getItem('brain-juice')) || []
    if (data.userId) {
      commit('setUserId', data.userId)
    }
    if (data.jwt) {
      commit('setJwt', data.jwt)
    }
    if (data.searchState) {
      commit('setSearchState', data.searchState)
    }
  }
}
