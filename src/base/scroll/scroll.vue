<template>
  <div ref="wrapper">
      <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  data () {
    return {
      height: -50
    }
  },
  props: {
    probeType: {
      type: Number,
      default: 3
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    _initScroll () {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          pullUpLoad: {
            threshold: this.height
            //  当上拉到超过底部 50px 时，
          }
        })
        if (this.listenScroll) {
          let me = this
          this.scroll.on('scroll', (e) => {
            me.$emit('scroll', e)
          })
          this.scroll.on('scrollEnd', (e) => {
            me.$emit('scrollEnd', e)
          })
          this.scroll.on('pullingUp', () => {
            me.$emit('pullingUp')
            this.scroll.finishPullUp()
            this.scroll.refresh()
          })
        }
        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }
      } else {
        this.scroll.refresh()
      }
    },
    // 滚动到指定的位置
    scrollTo (x, y, time) {
      this.scroll.scrollTo(x, y, time)
    },
    // 跳到指定项元素的位置
    scrollToElement (el, time) {
      this.scroll.scrollToElement(el, time)
    },
    refresh () {
      this.scroll.refresh()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this._initScroll()
    })
  }
}
</script>

<style scoped>
  .wrapper{
    height: 100%;
    overflow: hidden;
  }
</style>
