<template>
  <div class="album">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .album
    max-width: 640px
    position: fixed
    top: 200px
    bottom: 0
    width: 100%
</style>
