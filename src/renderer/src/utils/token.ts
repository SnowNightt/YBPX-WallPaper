export function getToken() {
  return localStorage.getItem('TOKEN')
}
export function setToken(token: string) {
  localStorage.setItem('TOKEN', token)
}
export function removeTOken() {
  localStorage.removeItem('TOKEN')
}