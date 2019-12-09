/**
 * 测试查看p值用
 */
export const showp = /showp/.test(document.location.href)

export const registerShowPHandler = () => {
  // showp
  window.addEventListener('keydown', (e) => {
  // 同时按 p , alt, ctrl
    if (e.keyCode === 80 && e.altKey === true && e.ctrlKey === true) {
      e.preventDefault()
      document.location.href += '#showp'
      document.location.reload()
    }
  })
}
