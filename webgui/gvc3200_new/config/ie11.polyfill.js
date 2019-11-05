// ie 11 polyfill ie 11 兼容
if (!!window.ActiveXObject || 'ActiveXObject' in window) {
  require('react-app-polyfill/ie11')
  require('react-app-polyfill/stable')
}
