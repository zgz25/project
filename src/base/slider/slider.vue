<template>
    <div class="slider" ref="slider">
      <div class="slider-group" ref="sliderGroup">
        <slot></slot>
      </div>
      <div class="dots">
        <span class="dot" v-for="(item, index) in dots" :key="index" :class="{active:currentPageIndex === index}"></span>
      </div>
    </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  data () {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    },
    speed: {
      type: Number,
      default: 400
    }
  },
  methods: {
    _setSliderWidth (isResize) {
      this.children = this.$refs.sliderGroup.childNodes
      let sliderWidth = this.$refs.slider.clientWidth
      let width = this.children.length * sliderWidth
      // 之前BScroll开启loop已经默认加个了两子元素 重新计算宽度不需要再加两个子元素的宽度
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initSlider () {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false, // 关闭或者打开惯性运动的执行
        snap: {
          loop: this.loop, // 无限滚动
          threshold: 0.3,
          speed: this.speed // 滑动的时间
        },
        click: true
      })
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        this.currentPageIndex = pageIndex
      })
      this.slider.on('beforeScrollStart', () => {
        clearInterval(this.timer)
        this._autopPlay()
      })
    },
    _initDots () {
      this.dots = new Array(this.children.length)
    },
    _autopPlay () {
      if (this.autoPlay) {
        this.timer = setInterval(() => {
          if (this.currentPageIndex >= this.dots.length - 1) {
            this.currentPageIndex = 0
          } else {
            this.currentPageIndex++
          }
          this.slider.goToPage(this.currentPageIndex, 0, this.speed)
        }, this.interval)
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()
      this._autopPlay()
    })
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
   @import "~common/stylus/variable"
   .slider
     min-height: 1px
     .slider-group
       position: relative
       overflow: hidden
       white-space: nowrap
       .slider-item
         float: left
         box-sizing: border-box
         overflow: hidden
         text-align: center
         a
           display: block
           width: 100%
           overflow: hidden
           text-decoration: none
         img
           display: block
           width: 640px
     .dots
       position: absolute
       right: 0
       left: 0
       bottom: 12px
       text-align: center
       font-size: 0
       .dot
         display: inline-block
         margin: 0 4px
         width: 12px
         height: 12px
         border-radius: 50%
         background: $color-text-l
         &.active
           width: 28px
           border-radius: 5px
           background: $color-text-ll
</style>
