<template>
  <transition name="slide">
    <div class="operation" v-if="isShow">
      <div class="head">
        <div class="total-select" @click="onSelectAll">{{selectAll ? '全不选': '全选'}}</div>
        <div class="title">批量操作</div>
        <div class="close" @click="hide">关闭</div>
      </div>
      <scroll class="song-list">
        <ul>
          <li v-for="(song,index) in songs" class="item" :key="index"  @click="onCheck(index)">
            <div class="checkbox" >
              <input type="checkbox" ref="checkBox" @click.stop="onCheck()"/>
            </div>
            <div class="content">
              <h2 class="name">{{song.name}}</h2>
              <p class="desc">{{getDesc(song)}}</p>
            </div>
          </li>
        </ul>
      </scroll>
      <div class="footer" :class="{active: isSelect||selectAll}" @click="batchDelete">
        <i class="icon-clear"></i>
        <span>删除</span>
      </div>
      <confirm text="是否删除已选中的歌曲?" ref="confirm" @confirm="confirm"></confirm>
    </div>
  </transition>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import {mapMutations} from 'vuex'
export default {
  data () {
    return {
      isShow: false,
      isSelect: false,
      selectAll: false
    }
  },
  props: {
    songs: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  components: {
    Scroll,
    Confirm
  },
  methods: {
    show () {
      this.isShow = true
      this.setPopupUp(true)
    },
    hide () {
      this.isShow = false
      setTimeout(() => {
        this.setPopupUp(false)
      }, 500)
    },
    getDesc (song) {
      return `${song.singer}  ${song.album}`
    },
    onCheck (index) {
      if (index !== undefined) {
        this.$refs.checkBox[index].checked = !this.$refs.checkBox[index].checked
      }
      let i = this.$refs.checkBox.findIndex(song => {
        return song.checked === false
      })
      if (i > -1) {
        this.selectAll = false
      } else {
        this.selectAll = true
      }
      let j = this.$refs.checkBox.findIndex(song => {
        return song.checked === true
      })
      if (j > -1) {
        this.isSelect = true
      } else {
        this.isSelect = false
      }
    },
    onSelectAll () {
      this.$refs.checkBox.forEach(song => {
        song.checked = !this.selectAll
      })
      this.selectAll = !this.selectAll
    },
    batchDelete () {
      if (this.isSelect || this.selectAll) {
        this.$refs.confirm.show()
      }
    },
    confirm () {
      let datas = []
      this.$refs.checkBox.forEach((song, index) => {
        if (song.checked) {
          datas.push(this.songs[index])
        }
      })
      this.$emit('batchDelete', datas)
      this.hide()
    },
    ...mapMutations({
      setPopupUp: 'SET_POPUP_STATE'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .operation
    position: fixed
    max-width: 640px
    top: 0
    bottom:0
    z-index: 120
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.5s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(0, 100%, 0)
    .head
      position: absolute
      top: 0
      left: 0
      z-index: 50
      width: 100%
      height: 62px
      padding: 40px 0px 8px
      display: flex
      align-items: center
      background: $color-background-y
      color: $color-text-b
      font-size: $font-size-medium
      .total-select
        flex: 0 0 70px
        font-weight: 200
        margin-left:15px
      .title
        flex: 1
        font-size: $font-size-medium-x
        line-height: 58 px
        text-align: center
      .close
        flex: 0 0 70px
        font-weight: 200
        margin-right:15px
    .song-list
      position absolute
      top: 110px
      left: 0
      bottom: 92px
      overflow: hidden
      .item
        display: flex
        align-items: center
        box-sizing: border-box
        height: 85px
        justify-items: center
        font-size: $font-size-medium-x
        border-bottom: 1px solid $color-border-d
        .checkbox
          float: left
          width: 60px
          input[type="checkbox"]
            position: relative
            width: 0px
            height: 0px
          input[type=checkbox]::before
            content: " "
            position: absolute
            left: 20px
            top: -18px
            width: 20px
            height: 20px
            border: 1px solid
            border-radius: 2px
            border-color: #999
          input[type="checkbox"]:checked::after
            content: " "
            position: absolute
            top: -17px
            left: 26px
            box-sizing: border-box
            width: 8px
            height: 18px
            -webkit-transform: rotate(45deg)
            -ms-transform: rotate(45deg)
            transform: rotate(45deg)
            border: 3px solid
            border-top: 0
            border-left: 0
            border-color: $color-theme
        .content
          float: left
          width: 540px
          line-height: 30px
          overflow: hidden
          margin-left: 20px
          .name
            no-wrap()
            color: $color-text
          .desc
            no-wrap()
            margin-top: 5px
            color: $color-text-d
            font-size: $font-size-small-s
    .footer
      width: 100%
      position: absolute
      left: 0
      bottom:0
      display: flex
      flex-direction: column
      align-items: center
      height: 70px
      background: $color-background-d
      font-size: $font-size-large-x
      color:$color-text-d
      padding: 12px 0 10px
      &.active
       color: $color-text
      span
        font-size: $font-size-small-s
        margin-top: 10px
</style>
