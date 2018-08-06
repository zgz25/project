<template>
<div class="progress-bar" ref="progressBar" @click="progressClick">
  <div class="bar-inner">
    <div class="progress" ref="progress"></div>
    <div class="progress-btn-wrapper" ref="progressBtn"
         @touchstart.prevent="progressTouchStart"
         @touchmove.prevent="progressTouchMove"
         @touchend="progressTouchEnd">
      <div class="progress-btn"></div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    progressTouchStart (e) {
      this.touch.init = true
      // 开始拖动的位置
      this.touch.startX = e.touches[0].pageX
      // 当前进度条的长度
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove (e) {
      const deltaX = e.touches[0].pageX - this.touch.startX
      const btnWidth = this.$refs.progressBtn.clientWidth
      const barWidth = this.$refs.progressBar.clientWidth - btnWidth / 2
      // 用 min() max() 来控制范围
      const offsetWidth = Math.min(barWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    progressTouchEnd () {
      this.touch.init = false
      this._updatePercent()
    },
    progressClick (e) {
      // e.offsetX 偏移量
      this._offset(e.offsetX)
      this._updatePercent()
    },
    _updatePercent () {
      const btnWidth = this.$refs.progressBtn.clientWidth
      const barWidth = this.$refs.progressBar.clientWidth - btnWidth / 2
      // 更新比例
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('updatePercent', percent)
    },
    _offset (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`
    }
  },
  watch: {
    percent (newPercent) {
      if (newPercent >= 0 && !this.touch.init) {
        const btnWidth = this.$refs.progressBtn.clientWidth
        const barWidth = this.$refs.progressBar.clientWidth - btnWidth / 2
        const offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .progress-bar
    height 30px
    .bar-inner
      position relative
      top 8px
      height: 8px
      border-radius:50px
      background rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
        border-radius:50px
      .progress-btn-wrapper
        position absolute
        left 0px
        top -12px
        width 30px
        height 30px
      .progress-btn
        position relative
        top 7px
        left -5px
        box-sizing border-box
        width 20px
        height 20px
        border 4px solid $color-text-l
        border-radius 50%
        background $color-theme
</style>
