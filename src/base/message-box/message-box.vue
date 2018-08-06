<template>
  <transition name="message">
    <div class="message-box" v-show="showMessage">
      <span class="text">{{message}}</span>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showMessage: false
    }
  },
  methods: {
    show () {
      this.showMessage = true
      setTimeout(() => {
        this.hide()
      }, 2000)
    },
    hide () {
      this.showMessage = false
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .message-box
    position: fixed
    top:50%
    left:50%
    transform: translateX(-50%)
    background:$color-background-e
    padding 18px 60px
    text-align: center
    font-size: $font-size-small-s
    color: $color-text-b
    font-weight: 200
    &.message-enter-active, &.message-leave-active
      transition: opacity 0.3s
    &.message-enter, &.message-leave-to
      opacity: 0

</style>
