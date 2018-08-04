const SpriteFrameSet = require('SpriteFrameSet')

cc.Class({
  extends: cc.Component,

  editor: {
    executeInEditMode: true,
    inspector: 'packages://i18n/inspector/localized-sprite.js',
    menu: 'i18n/LocalizedSprite'
  },

  properties: {
    spriteFrameSet: {
      default: [],
      type: SpriteFrameSet
    }
  },

  onLoad () {
    this.fetchRender()
  },

  fetchRender () {
    let sprite = this.getComponent(cc.Sprite)
    if (sprite) {
      this.sprite = sprite
      this.updateSprite(window.i18n.curLang)
      return
    }
  },

  setSpriteFrameByLang (language, spriteFrame = null) {
    if (spriteFrame) {
      let spriteFrameSet = this.getSpriteFrameByLang(language, true)
      if (spriteFrameSet) {
        spriteFrameSet.spriteFrame = spriteFrame
      } else {
        this.spriteFrameSet.push({language, spriteFrame})
      }
    } else {
      for (let data of language) {
        let spriteFrameSet = this.getSpriteFrameByLang(data.language, true)
        if (spriteFrameSet) {
          spriteFrameSet.spriteFrame = data.spriteFrame
        } else {
          this.spriteFrameSet.push({language: data.language, spriteFrame: data.spriteFrame})
        }
      }
    }
  },

  getSpriteFrameByLang (lang, getSpriteFrameSet = false) {
    for (let i = 0; i < this.spriteFrameSet.length; ++i) {
      if (this.spriteFrameSet[i].language === lang) {
        return getSpriteFrameSet ? this.spriteFrameSet[i] : this.spriteFrameSet[i].spriteFrame
      }
    }
  },

  updateSprite (language) {
    if (!this.sprite) {
      // xf: 如果当前节点未激活，则取不到 sprite，所以有可能是误报
      if (this.node && cc.isValid(this.node) && this.node.activeInHierarchy) {
        cc.warn('Failed to update localized sprite, sprite component is invalid!', this.node.name)
      }
      return
    }

    let spriteFrame = this.getSpriteFrameByLang(language)

    if (!spriteFrame && this.spriteFrameSet[0]) {
      spriteFrame = this.spriteFrameSet[0].spriteFrame
    }

    if (spriteFrame) {
      this.sprite.spriteFrame = spriteFrame
    }
  }
})