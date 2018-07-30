const SpriteFrameSet = cc.Class({
  name: 'SpriteFrameSet',
  properties: {
    language: '',
    spriteFrame: cc.SpriteFrame,
    atlas: cc.SpriteAtlas
  }
})

module.exports = SpriteFrameSet