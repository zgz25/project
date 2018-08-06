<template>
  <div class="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) in suggest" :key="index" @click="addQuery(suggesResult(item, index))">
        <span class="text">{{suggesResult(item, index)}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
import {getSuggest} from 'api/search'
import {ERR_OK} from 'api/config'

export default {
  props: {
    query: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      suggest: []
    }
  },
  methods: {
    _getSuggest () {
      getSuggest(this.query).then(res => {
        if (res.code === ERR_OK) {
          this.suggest = this._normalizeSongs(res.data)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      if (list.singer) {
        list.singer.itemlist.forEach((item) => {
          ret.push(item)
        })
      }
      if (list.song) {
        list.song.itemlist.forEach((item) => {
          ret.push(item)
        })
      }
      if (list.album) {
        list.album.itemlist.forEach((item) => {
          ret.push(item)
        })
      }
      if (list.mv) {
        list.mv.itemlist.forEach((item) => {
          ret.push(item)
        })
      }
      return ret
    },
    suggesResult (item, index) {
      if (item.name === item.singer && index === 0) {
        return item.singer
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    addQuery (querry) {
      this.$emit('addQuery', querry)
    }
  },
  watch: {
    query () {
      this._getSuggest()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    background:$color-background
    overflow: hidden
    .suggest-list
      .suggest-item
        display: flex
        align-items: center
        border-bottom: 1px solid $color-border
        .text
          width: 90%
          margin-left: 20px
          height:70px
          line-height:70px
          font-size:$font-size-medium-x
          color:$color-text-e
          no-wrap()
  </style>
