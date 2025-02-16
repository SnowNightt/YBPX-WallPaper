export function setLocalStorage(name: string, value: string) {
  localStorage.setItem(name, value)
}
export function getLocalStorage(name: string) {
  return localStorage.getItem(name)
}
export function removeLocalStorage(name: string) {
  localStorage.removeItem(name)
}
