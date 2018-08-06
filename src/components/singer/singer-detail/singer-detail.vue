<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :text="text" :songs="songs" :desc="desc" :loadShow="loadShow" :loadMsg="loadMsg" @pullingUp="pullingUp"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'

export default {
  components: {
    MusicList
  },
  data () {
    return {
      songs: [],
      ret: [],
      total: 0,
      begin: 0,
      loadShow: true,
      showFlag: true,
      loadMsg: '加载更多',
      bgImage: '',
      title: '',
      desc: '',
      text: '',
      singerId: 0
    }
  },
  methods: {
    pullingUp () {
      if (this.loadShow) {
        this.loadMsg = '正在加载...'
        this.begin += 15
        if (this.begin > this.total) {
          this.begin = this.total
        }
        this._getDetail(this.singerId, this.begin)
      }
    },
    _normalizeSongs (list) {
      list.forEach(item => {
        this.ret.push(createSong(item.musicData))
      })
      return this.ret
    },
    _getDetail () {
      if (!this.singerId) {
        this.$router.back()
        return
      }
      getSingerDetail(this.singerId, this.begin).then(res => {
        if (res.code === ERR_OK) {
          this.bgImage = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${res.data.singer_mid}.jpg?max_age=2592000`
          this.title = res.data.singer_name
          this.text = `单曲 : ${res.data.total}&nbsp;&nbsp;&nbsp;专辑 : ${res.data.albumTotal}`
          this.desc = res.data.SingerDesc
          this.songs = this._normalizeSongs(res.data.list)
          this.loadMsg = '加载更多'
          // 歌曲总数
          this.total = res.data.total
          if (this.songs.length === this.total) {
            this.loadShow = false
          }
        }
      })
    }
  },
  created () {
    this.singerId = this.$route.query.id
    this._getDetail()
    this.listenScroll = true
  },
  activated () {
    if (this.singerId) {
      return ''
    }
    this.singerId = this.$route.query.id
    this._getDetail()
  },
  deactivated () {
    this.bgImage = ''
    this.title = ''
    this.desc = ''
    this.text = ''
    this.songs = []
    this.ret = []
    this.total = 0
    this.begin = 0
    this.singerId = 0
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active
    transition: all .5s
  .slide-enter
    transform:translate3d(100%,0,0)
</style>
