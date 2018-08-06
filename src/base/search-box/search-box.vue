<template>
  <div class="search-box">
    <div class="back" @click="_back" v-show="back">
      <i class="icon-back"></i>
    </div>
    <div class="search-box-wrapper">
      <i class="icon-search"></i>
      <input class="box" v-model="query" @click="focus" :placeholder="placeholder" maxlength="24" ref="query" :readonly="readonly" :onblur="isBlur"/>
      <span class="dismiss"><i class="icon-dismiss" v-show="query" @click="clear"></i></span>
    </div>
    <div class="search-text-wrapper" v-show="searchBtn" @click="onSearchBtn">
      <span class="text" >搜索</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    },
    back: {
      type: Boolean,
      default: false
    },
    searchBtn: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      query: '',
      isBlur: false
    }
  },
  methods: {
    _back () {
      this.$router.back()
      this.clear()
    },
    clear () {
      this.query = ''
      this.$emit('clear')
    },
    setQuery (query) {
      this.query = query
    },
    focus () {
      this.$emit('focus')
    },
    autoFocus () {
      this.$refs.query.focus()
    },
    onSearchBtn () {
      this.$emit('onSearchBtn')
    },
    blur () {
      this.isBlur = true
    }
  },
  created () {
    let time
    this.$watch('query', (newQuery) => {
      clearTimeout(time)
      time = setTimeout(() => {
        this.$emit('query', newQuery)
      }, 200)
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    margin-top:15px
    .back
      flex 0 0 20px
      .icon-back
        display: block
        padding: 15px
        font-size: $font-size-large-x
        color:$color-text-b
    .search-box-wrapper
      display: flex
      flex: 1
      align-items: center
      box-sizing: border-box
      padding: 0 10px
      height: 50px
      background: $color-background
      border-radius: 100px
      .icon-search
        margin-top:3px
        font-size: 36px
        color: $color-text-g
      .box
        flex: 1
        margin: 0 5px
        padding-left: 5px
        padding-top: 4px
        height: 46px
        line-height:46px
        background: $color-background
        font-size: $font-size-medium
        outline: none
        text-shadow: 0px 0px 0px $color-text-e
        -webkit-text-fill-color: transparent
        &::placeholder
          color:$color-text-d
          text-shadow: none
          -webkit-text-fill-color: initial
        &:focus
          color:$color-theme
      .dismiss
        flex: 0 0 20px
        .icon-dismiss
          font-size: 20px
          color: $color-text-h
    .search-text-wrapper
       flex: 0 0 60px
       padding: 0 5px
       margin-left: 10px
       line-height:40px
       .text
         font-size:$font-size-medium
         color:$color-text-b
</style>
