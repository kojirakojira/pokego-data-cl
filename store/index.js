export const state = () => ({
  userId: '',
  jwt: '',
  toast: {
    msg: null,
    color: 'black',
    timeout: 4000
  },
  psrState: null // PokemonSearchResult：検索結果一覧画面(resultList)にブラウザバックしてきたとき、画面復元に使う。
})

export const getters = {
  userId (state) {
    return state.userId
  },
  jwt (state) {
    return state.jwt
  },
  psrState (state) {
    return state.psrState
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
  setPsrState (state, psrState) {
    state.psrState = psrState
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
  setPsrState ({ commit }, psrState) {
    commit('setPsrState', psrState)
  },
  nuxtClientInit ({ commit }, context) {
    const data = JSON.parse(localStorage.getItem('brain-juice')) || []
    if (data.userId) {
      commit('setUserId', data.userId)
    }
    if (data.jwt) {
      commit('setJwt', data.jwt)
    }
    if (data.psrState) {
      commit('setPsrState', data.psrState)
    }
  }
}
