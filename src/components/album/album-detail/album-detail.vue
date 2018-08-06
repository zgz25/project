<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :text="text" :songs="songs" :desc="desc"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {getAlbumInfo} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'

export default {
  data () {
    return {
      songs: [],
      bgImage: '',
      title: '',
      desc: '',
      text: '',
      albumID: 0
    }
  },
  components: {
    MusicList
  },
  methods: {
    _normalizeSongs (list) {
      let ret = []
      list.forEach(item => {
        ret.push(createSong(item))
      })
      return ret
    },
    _getAlbum () {
      if (!this.albumID) {
        this.$router.back()
        return
      }
      getAlbumInfo(this.albumID).then(res => {
        if (res.code === ERR_OK) {
          this.bgImage = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${res.data.mid}.jpg?max_age=2592000`
          this.title = res.data.name
          this.text = `发行时间 : ${res.data.aDate}`
          this.desc = res.data.desc
          this.songs = this._normalizeSongs(res.data.list)
        }
      })
    }
  },
  created () {
    this.albumID = this.$route.query.id
    this._getAlbum()
  },
  activated () {
    if (this.albumID) {
      return ''
    }
    this.albumID = this.$route.query.id
    this._getAlbum()
  },
  deactivated () {
    this.bgImage = ''
    this.title = ''
    this.desc = ''
    this.text = ''
    this.songs = []
    this.albumID = 0
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active
    transition: all .5s
  .slide-enter
    transform:translate3d(100%,0,0)
</style>
