<template>
  <ul class="switches">
    <li class="switch-item" v-for="(item,index) in switches" :class="{'active':currentIndex === index}"
        @click="switchItem(index)" :key="index">
      <span>{{item}} </span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    switches: {
      type: Array,
      default: function () {
      }
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    switchItem (index) {
      this.$emit('switch', index)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .switches
    display: flex
    align-items: center
    width: 320px
    margin: 0 auto
    background: $color-background-d
    .switch-item
      flex: 1
      padding: 10px
      text-align: center
      font-size: $font-size-small
      color: $color-text-d
      &.active
        background: $color-background-g
        color: $color-text
</style>
