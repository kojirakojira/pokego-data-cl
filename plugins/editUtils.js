export default (context, inject) => {
  /**
     * 引数にはタイプの日本語名を渡します。
     * 英語名でもどっちでも良かったので、API側のデータの持ち方の都合上日本語名にしました。
     */
  const getRGB = (type) => {
    let rgb = null
    for (const t of context.$CONST.TYPE) {
      if (type === t.v) {
        rgb = `rgb(${t.r}, ${t.g}, ${t.b})`
        break
      }
    }
    return rgb
  }
  const editUtils = {
    getRGB
  }
  inject('editUtils', editUtils)
}
