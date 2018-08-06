<template>
  <transition name="box">
    <div class="detail-box" v-show="showBox" @click="hide">
      <div class="content"> <i></i> <span class="text" v-html="text"></span></div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showBox: false
    }
  },
  methods: {
    show () {
      this.showBox = true
    },
    hide () {
      this.showBox = false
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .detail-box
    position: fixed
    max-width:640px
    width: 100%
    top:0
    bottom: 0
    z-index: 100
    &.box-fade-enter-active, &.box-fade-leave-active
      transition: opacity 0.3s
    &.box-fade-enter, &.box-fade-leave-to
      opacity: 0
    .content
      position: absolute
      width: 400px
      height: 400px
      padding:20px
      margin-right: 20px
      top: 300px
      right:0
      z-index: 200
      overflow: scroll
      background: $color-background-d
      font-size: $font-size-small-s
      line-height: 30px
      color: $color-text-e
      border: 1px solid $color-border
      i
        position: fixed
        top: 295px
        right: 100px
        display: inline-block
        border: 8px solid $color-background-d
        border-bottom: 8px solid transparent
        border-right: 8px solid transparent
        transform:rotate(45deg)
</style>
