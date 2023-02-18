const CONST = {
  TYPE: [], // タイプ
  REGION: [], // 地域
  GEN: [] // 世代
}

export default ({ $axios }, inject) => {
  inject('CONST', CONST)

  $axios
    .get('/api/typeConst')
    .then((res) => {
      Object.entries(res.data).forEach(([k, v]) => { CONST.TYPE.push({ k, v }) })
    })

  $axios
    .get('/api/regionConst')
    .then((res) => {
      Object.entries(res.data).forEach(([k, v]) => { CONST.REGION.push({ k, v }) })
    })

  $axios
    .get('/api/genConst')
    .then((res) => {
      Object.entries(res.data).forEach(([k, v]) => { CONST.GEN.push({ k, v }) })
    })
}
