import {commonParams, options} from './config'
import jsonp from 'common/js/jsonp'
import axios from 'axios/index'

export function getHotKey () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

export function getSuggest (key) {
  const url = '/api/getSuggest'

  const data = Object.assign({}, commonParams, {
    is_xml: 0,
    key: key,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(e => {
    console.log(e)
  })
}

export function getSearch (query, page) {
  const url = '/api/getSearch'
  const data = Object.assign({}, commonParams, {
    ct: 24,
    qqmusic_ver: 1298,
    new_json: 1,
    remoteplace: 'txt.yqq.song',
    t: 0,
    aggr: 1,
    cr: 1,
    catZhida: 1,
    lossless: 0,
    flag_qc: 0,
    p: page,
    n: 20,
    w: query,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(e => {
    console.log(e)
  })
}

export function getSearchCd (query, page) {
  const url = '/api/getSearchCd'
  const data = Object.assign({}, commonParams, {
    remoteplace: 'txt.yqq.album',
    flag_qc: 0,
    page_no: page,
    num_per_page: 21,
    query: query,
    loginUin: 0,
    hostUin: 0,
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(e => {
    console.log(e)
  })
}

export function getAlbum (query, page, remoteplace) {
  const url = '/api/getSearch'
  const data = Object.assign({}, commonParams, {
    ct: 24,
    qqmusic_ver: 1298,
    remoteplace: 'txt.yqq.album',
    aggr: 0,
    catZhida: 1,
    lossless: 0,
    sem: 10,
    t: 8,
    p: page,
    n: 30,
    w: query,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(e => {
    console.log(e)
  })
}

export function getAlbumInfo (albumid) {
  const url = '/api/getAlbumInfo'

  const data = Object.assign({}, commonParams, {
    albumid,
    uin: 0,
    platform: 'h5',
    needNewCode: 1
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(e => {
    console.log(e)
  })
}
