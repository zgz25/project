import {commonParams} from './config'
import axios from 'axios/index'
import {Base64} from 'js-base64'

export function getSingerList () {
  const url = '/api/getSingerList'
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 1000,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(e => {
    console.log(e)
  })
}

export function getSingerDetail (singerId, begin) {
  const url = '/api/getSingerDetail'
  const data = Object.assign({}, commonParams, {
    singerid: singerId,
    platform: 'h5page',
    needNewCode: 1,
    order: 'listen',
    from: 'h5',
    num: 15,
    begin: begin
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(e => {
    console.log(e)
  })
}

export function getLyric (mid) {
  const url = '/api/getLyric'
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date()
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(e => {
    console.log(e)
  })
}

// 获取歌词
export function getLyrics (mid) {
  return new Promise((resolve, reject) => {
    getLyric(mid).then((res) => {
      if (res.retcode === 0) {
        let lyric = Base64.decode(res.lyric)
        resolve(lyric)
      }
    })
  })
}
