const Observer = {
  clientList: [],
  subscribe: function (key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = []
    }
    this.clientList[key].push(fn)
  },
  trigger: function () {
    let key = Array.prototype.shift.call(arguments)
    let fns = this.clientList[key]
    if (!fns || fns.length === 0) {
      return false
    }
    // eslint-disable-next-line no-cond-assign
    for (let i = 0, fn; fn = fns[i++];) {
      fn.apply(this, arguments)
    }
  },
  unsubscribe: function (key, fn) {
    let fns = this.clientList[key]
    if (!fns) {
      return false
    }
    if (!fn) {
      fns && (fns.length = 0)
    } else {
      for (let l = fns.length - 1; l >= 0; l--) {
        let _fn = fns[l]
        if (_fn === fn) {
          fns.splice(l, 1)
        }
      }
    }
  }
}

export default Observer
