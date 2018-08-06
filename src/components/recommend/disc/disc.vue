<template>
  <transition name="slide">
    <music-list :bg-image="bgImage" :songs="songs" :title="title" :desc="cdDesc" :text="text" :loadShow="loadShow" :loadMsg="loadMsg" :noResult="noResult" @pullingUp="pullingUp" ref="musicList"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {getSongList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import {createSong2} from 'common/js/song'
import {Splicing} from 'common/js/util'

export default {
  components: {
    MusicList
  },
  data () {
    return {
      songs: [],
      ret: [],
      loadShow: true,
      loadMsg: '加载更多',
      total: 0,
      begin: 0,
      bgImage: '',
      title: '',
      cdDesc: '',
      text: '',
      dissid: 0,
      noResult: false
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
        this._getSongList(this.dissid, this.begin)
      }
    },
    _getSongList () {
      if (!this.dissid) {
        // 刷新返回歌手页面
        this.$router.push('/recommend')
        return
      }
      getSongList(this.dissid, this.begin).then(res => {
        if (res.code === ERR_OK) {
          if (res.subcode !== 0) {
            this.noResult = true
            this.$refs.musicList.showMsgBox(res.msg)
            return
          }
          this.bgImage = res.cdlist[0].logo
          this.title = res.cdlist[0].dissname
          this.text = Splicing(res.cdlist[0].tags)
          this.cdDesc = res.cdlist[0].desc
          this.songs = this._normalizeSongs(res.cdlist[0].songlist)
          this.total = res.cdlist[0].total_song_num
          this.loadMsg = '加载更多'
          if (this.songs.length === this.total) {
            this.loadShow = false
          }
        }
      })
    },
    _normalizeSongs (list) {
      list.forEach((musicData) => {
        this.ret.push(createSong2(musicData))
      })
      return this.ret
    }
  },
  created () {
    this.dissid = this.$route.query.id
    this._getSongList()
    this.listenScroll = true
  },
  activated () {
    if (this.dissid) {
      return ''
    }
    this.dissid = this.$route.query.id
    this._getSongList()
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
    this.dissid = 0
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active
    transition: all .5s
  .slide-enter
    transform:translate3d(100%,0,0)
</style>
