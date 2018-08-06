<template>
  <div class="tab">
    <router-link tag="div" v-for="(tab, index) in tabs" :key="index" class="tab-item" :to="links[index]" replace>
      <span class="tab-link">{{tab}}</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    tabs: {
      type: Array,
      default: function () {
        return ['推荐', '歌手', '排行']
      }
    },
    links: {
      type: Array,
      default: function () {
        return ['/recommend', '/singer', '/rank']
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .tab
    display: flex
    height: 48px
    line-height: 48px
    font-size: $font-size-medium
    .tab-item
      flex: 1
      text-align: center
      .tab-link
        padding-bottom: 5px
        color: $color-text-g
      &.router-link-active
        .tab-link
          color: $color-text
          border-bottom: 4px solid $color-theme
</style>
