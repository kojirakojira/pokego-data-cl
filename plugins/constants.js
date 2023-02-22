const CONST = {
  TYPE: [], // タイプ
  REGION: [], // 地域
  GEN: [], // 世代
  FILTER_ITEMS: [], // 絞り込み検索項目
  getValue: (k, arr) => {
    for (const item of arr) {
      if (k === item.k) {
        return item.v
      }
    }
  }
}

export default async ({ $axios }, inject) => {
  inject('CONST', CONST)

  // クライアント側でのみ取得する。
  if (process.client) {
    await Promise.all([
      $axios.get('/api/typeConst'),
      $axios.get('/api/regionConst'),
      $axios.get('/api/genConst'),
      $axios.get('/api/filterItemsConst')
    ])
      .then((res) => {
        Object.entries(res[0].data).forEach(([k, v]) => { CONST.TYPE.push({ k, v }) })
        Object.entries(res[1].data).forEach(([k, v]) => { CONST.REGION.push({ k, v }) })
        Object.entries(res[2].data).forEach(([k, v]) => { CONST.GEN.push({ k, v }) })
        Object.entries(res[3].data).forEach(([k, v]) => { CONST.FILTER_ITEMS.push({ k, v }) })
      })
  }
}
