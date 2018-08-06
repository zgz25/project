import {Splicing} from 'common/js/util'

export default class Song {
  constructor ({id, mid, singer, singerid, singermid, name, album, albumid, albummid, img, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.singerid = singerid
    this.singermid = singermid
    this.name = name
    this.album = album
    this.albumid = albumid
    this.albummid = albummid
    this.img = img
    this.url = url
  }
}

export function createSong (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: Splicing(musicData.singer),
    singerid: musicData.singer[0].id,
    singermid: musicData.singer[0].mid,
    name: musicData.songname,
    album: musicData.albumname,
    albumid: musicData.albumid,
    albummid: musicData.albummid,
    img: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=0&guid=126548448`
  })
}

export function createSong2 (musicData) {
  return new Song({
    id: musicData.id,
    mid: musicData.mid,
    singer: Splicing(musicData.singer),
    singerid: musicData.singer[0].id,
    singermid: musicData.singer[0].mid,
    name: musicData.name,
    album: musicData.album.name,
    albumid: musicData.album.id,
    albummid: musicData.album.mid,
    img: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.album.mid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/C100${musicData.mid}.m4a?fromtag=0&guid=126548448`
  })
}
