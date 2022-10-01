export default function ({ route, redirect, store }) {
  // "/"のURLにアクセスしてきたら、"/search"にリダイレクトする。
  if (route.path === '/') {
    return redirect('/search')
  }
}
