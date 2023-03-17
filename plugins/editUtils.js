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
  /**
   * styleを追加します。
   * 追加したstyleはSPAの画面遷移では削除されないため、自前で管理する必要があります。
   * そのため、第3引数に指定した配列に追加したstyleのidをpushします。
   *
   * @param {String} id styleに指定するHTMLにおけるid属性
   * @param {String} style 設定するstyle
   * @param {Array} styleIdArr
   */
  const createStyleElem = (id, style, styleIdArr) => {
    // styleを追加
    const newStyle = document.createElement('style')
    newStyle.id = id
    newStyle.innerHTML = style
    document.getElementsByTagName('head').item(0).appendChild(newStyle)

    // styleのid名を配列に追加
    styleIdArr.push(id)
  }
  /**
   * styleIdArrのidのうち、prefixに該当するstyleをHTML上から削除します。
   * 削除後の配列を返却値として受け取ってください。
   *
   * @param {Array} styleIdArr
   * @param {String} prefix 該当した接頭辞のみ削除する（省略可）
   */
  const deleteStyleElem = (styleIdArr, prefix) => {
    // styleの削除
    styleIdArr.forEach((id) => {
      if (!prefix || !id.indexOf(prefix)) {
        const elem = document.getElementById(id)
        elem.remove()
      }
    })

    // styleIdArrからの該当のidの削除
    return styleIdArr.filter((id) => { return prefix && id.indexOf(prefix) })
  }

  const editUtils = {
    getRGB,
    createStyleElem,
    deleteStyleElem
  }
  inject('editUtils', editUtils)
}
