<template>
  <div class="list" v-show="datas.length">
    <ul>
      <li class="item" v-for="(data, index) in datas" :key="index" @click="itemEvent(data)">
        <span class="text">{{data}}</span>
        <span class="icon" @click.stop="deleteOne(index)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    datas: {
      type: Array,
      default: function () {
      }
    }
  },
  methods: {
    itemEvent (data) {
      this.$emit('itemEvent', data)
    },
    deleteOne (index) {
      this.$emit('deleteOne', index)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .list
    .item
      display: flex
      align-items center
      height: 55px
      line-height: 55px
      &:last-child
        padding-bottom: 40px
      .text
        flex 1
        color:$color-text-e
        font-size: $font-size-medium
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color $color-text-l
</style>
