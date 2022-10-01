export default ({ app }, inject) => {
  inject('checkRequired', (item, additional, message) => {
    if (!item) {
      let msg = '「' + message + '」は必須項目です。\n'
      if (additional) {
        msg = additional + msg
      }
      return msg
    }
    return ''
  })
}
