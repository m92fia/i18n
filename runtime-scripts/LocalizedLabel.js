const i18n = require('LanguageData')

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce (func, wait, immediate) {
  var timeout
  return function () {
    var context = this, args = arguments
    var later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

cc.Class({
  extends: cc.Component,

  editor: {
    executeInEditMode: true,
    menu: 'i18n/LocalizedLabel'
  },

  properties: {
    dataID: {
      get () {
        return this._dataID
      },
      set (val) {
        if (this._dataID !== val) {
          this._dataID = val
          if (CC_EDITOR) {
            this._debouncedUpdateLabel()
          } else {
            this.updateLabel()
          }
        }
      }
    },
    _dataID: '',
    localizedData: {
      get () {
        return this._localizedData
      },
      set (val) {
        if (this._localizedData !== val) {
          this._localizedData = val
          !this._fetchRender && this.fetchRender()
          this.updateLabel()
        }
      }
    },
    _localizedData: null,
    _fetchRender: false
  },

  onLoad () {
    if (CC_EDITOR) {
      this._debouncedUpdateLabel = debounce(this.updateLabel, 200)
    }
    if (!i18n.inst) {
      i18n.init()
    }
    // cc.log('dataID: ' + this.dataID + ' value: ' + i18n.t(this.dataID));
    this.fetchRender()
  },

  fetchRender () {
    this._fetchRender = true
    let label = this.getComponent(cc.Label)
    if (label) {
      this.label = label
      this.updateLabel()
      return
    }
  },

  updateLabel () {
    if (!this.label) {
      cc.error('Failed to update localized label, label component is invalid!', this.node.name)
      return
    }
    if (this._localizedData) {
      // console.log('----this._localizedData:', this._localizedData, window.i18n.curLang)
      this.label.string = this._localizedData[window.i18n.curLang]
    } else {
      let localizedString = i18n.t(this.dataID)
      if (localizedString) {
        this.label.string = localizedString
      }
    }
  }
})