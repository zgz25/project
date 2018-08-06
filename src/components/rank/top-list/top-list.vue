<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :text="text" :songs="songs" :desc="desc" :rank="true"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {ERR_OK} from 'api/config'
import {getTopList} from 'api/rank'
import {createSong} from 'common/js/song'

export default {
  data () {
    return {
      songs: [],
      bgImage: '',
      title: '',
      count: '',
      text: '',
      desc: '',
      topId: 0
    }
  },
  components: {
    MusicList
  },
  methods: {
    _getTopList () {
      if (!this.topId) {
        // 刷新返回歌手页面
        this.$router.push('/rank')
        return
      }
      getTopList(this.topId).then(res => {
        if (res.code === ERR_OK) {
          this.title = res.topinfo.ListName
          this.bgImage = res.topinfo.pic_album
          this.text = `更新时间：${res.update_time}`
          this.desc = res.topinfo.info
          this.songs = this._normalizeSongs(res.songlist)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((musicData) => {
        ret.push(createSong(musicData.data))
      })
      return ret
    }
  },
  created () {
    this.topId = this.$route.query.id
    this._getTopList()
    this.listenScroll = true
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active
    transition: all .5s
  .slide-enter
    transform:translate3d(100%,0,0)
</style>
