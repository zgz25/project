<template>
  <div class="m-header">
    <router-link tag="div" class="searchBox" to="/search">
      <search-box></search-box>
    </router-link>
    <router-link tag="div" class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
export default {
  components: {
    SearchBox
  },
  props: {
    back: {
      type: Boolean,
      default: false
    },
    searchBtn: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .m-header
    width: 100%
    position: relative
    height: 85px
    padding-top: 25px
    text-align: center
    color: $color-text-b
    font-size: 0
    background-color: $color-background-y
    display flex
    align-items: center
    .searchBox
      margin: 2px 20px
      margin-right: 0
      flex: 0 0 560px
    .mine
      flex: 1
      margin-top: 14px
      .icon-mine
        display: block
        padding: 20px
        font-size: 26px
        color: $color-text-b
</style>
