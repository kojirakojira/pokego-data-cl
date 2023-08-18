export default (context, inject) => {
  /**
   * 図鑑IDから図鑑Noを取得する。
   *
   * @param {String} pdxId 図鑑No
   * @returns
   */
  const getPdxNo = (pdxId) => {
    return pdxId ? pdxId.substring(0, 4) * 1 : ''
  }
  /**
   * ポケモン名に備考を連結させる。
   *
   * @param {String} name
   * @param {String} remarks
   * @returns
   */
  const appendRemarks = (name, remarks) => {
    let val = name
    if (remarks) {
      val = val + `(${remarks})`
    }
    return val
  }
  /**
   * タイプのrgb(999, 999, 999)を取得します。
   * 英語名、日本語名の両方から取得できます。
   *
   * @param {String} type1 タイプ１
   * @param {String} type2 タイプ２
   */
  const getRGB = (type1, type2) => {
    let rgb1 = { r: 0, g: 0, b: 0 }
    let rgb2 = { r: 0, g: 0, b: 0 }
    for (const t of context.$CONST.TYPE) {
      if (type1 === t.v || type1 === t.k) { rgb1 = t }
      if (type2 === t.v || type2 === t.k) { rgb2 = t }
    }
    const createColor = (c1, c2) => { return (c1 * 1 + c2 * 1) / 2 }
    const r = type2 ? createColor(rgb1.r, rgb2.r) : rgb1.r
    const g = type2 ? createColor(rgb1.g, rgb2.g) : rgb1.g
    const b = type2 ? createColor(rgb1.b, rgb2.b) : rgb1.b
    return `rgb(${r}, ${g}, ${b})`
  }
  /**
     * タイプのrgba(999, 999, 999, alpha)を取得します。
     * 英語名、日本語名の両方から取得できます。
     *
     * @param {Number} alpha 透明度
     * @param {String} type1 タイプ１
     * @param {String} type2 タイプ２
     */
  const getRGBA = (alpha, type1, type2) => {
    let rgb1 = null
    let rgb2 = null
    for (const t of context.$CONST.TYPE) {
      if (type1 === t.v || type1 === t.k) { rgb1 = t }
      if (type2 === t.v || type2 === t.k) { rgb2 = t }
    }
    const createColor = (c1, c2) => { return (c1 * 1 + c2 * 1) / 2 }
    const r = type2 ? createColor(rgb1.r, rgb2.r) : rgb1.r
    const g = type2 ? createColor(rgb1.g, rgb2.g) : rgb1.g
    const b = type2 ? createColor(rgb1.b, rgb2.b) : rgb1.b
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
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

  /**
     * 引数に渡した文字列にタイプ名が含まれていた場合にデコレーションします。
     *
     * @param {String} value タイプコメントの1つ
     */
  const typeDecoration = (value) => {
    const regex = new RegExp(context.$CONST.TYPE.map(elem => elem.v).join('|'), 'g')
    return value.replace(regex, (match) => {
      return '<span class="type" style="background-color: ' +
        `${getRGB(match)}">${match}</span>`
    }).replaceAll('>,', '>')
  }

  const editUtils = {
    getPdxNo,
    appendRemarks,
    getRGB,
    getRGBA,
    createStyleElem,
    deleteStyleElem,
    typeDecoration
  }
  inject('editUtils', editUtils)
}
