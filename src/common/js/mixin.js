import {mapGetters, mapActions} from 'vuex'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist',
      'popup'
    ])
  },
  methods: {
    handlePlaylist: function () {
      throw new Error('必须实现 handlePlaylist 函数')
    }
  },
  mounted () {
    this.handlePlaylist(this.playlist, this.popup)
  },
  // keep-alive组件激活时调用。
  activated () {
    this.handlePlaylist(this.playlist, this.popup)
  },
  watch: {
    playlist (playlist) {
      this.handlePlaylist(playlist, this.popup)
    },
    popup (popup) {
      this.handlePlaylist(this.playlist, popup)
    }
  }
}

export const collectionMixin = {
  computed: {
    ...mapGetters([
      'collectionList'
    ])
  },
  methods: {
    toggleCollection (song) {
      if (this.isCollection(song)) {
        this.deleteCollectionList(song)
      } else {
        this.saveCollectionList(song)
      }
      if (this.showList) {
        this.hide()
      }
    },
    getCollectionIcon (song) {
      if (this.isCollection(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    getCollectionText (song) {
      if (this.isCollection(song)) {
        return '取消收藏'
      }
      return '收藏'
    },
    isCollection (song) {
      let index = this.collectionList.findIndex((item) => {
        return song.id === item.id
      })
      return index > -1
    },
    ...mapActions([
      'saveCollectionList',
      'deleteCollectionList'
    ])
  }
}
