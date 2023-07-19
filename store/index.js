export const state = () => ({
  userId: '',
  jwt: '',
  toast: [],

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
  pushToast (state, payload) {
    state.toast.push(payload)
  },
  shiftToast (state) {
    state.toast.shift()
  },
  clearToast (state, id) {
    if (id) {
      // 指定されたidの要素を削除
      state.toast = state.toast.filter(elem => elem.id !== id)
    } else {
      // idを指定していない場合は全要素を削除する。
      state.toast.splice(0)
    }
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
    commit('pushToast', toast)
  },
  shiftToast ({ commit }) {
    commit('shiftToast')
  },
  clearToast ({ commit }, id) {
    commit('clearToast', id)
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
