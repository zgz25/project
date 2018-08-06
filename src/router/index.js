import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: resolve => require(['components/recommend/recommend'], resolve),
      children: [
        {
          path: ':id',
          component: resolve => require(['components/recommend/disc/disc'], resolve)
        }
      ]
    },
    {
      path: '/singer',
      component: resolve => require(['components/singer/singer'], resolve),
      children: [
        {
          path: ':id',
          component: resolve => require(['components/singer/singer-detail/singer-detail'], resolve)
        }
      ]
    },
    {
      path: '/rank',
      component: resolve => require(['components/rank/rank'], resolve),
      children: [
        {
          path: ':id',
          component: resolve => require(['components/rank/top-list/top-list'], resolve)
        }
      ]
    },
    {
      path: '/album',
      component: resolve => require(['components/album/album'], resolve),
      children: [
        {
          path: ':id',
          component: resolve => require(['components/album/album-detail/album-detail'], resolve)
        }
      ]
    },
    {
      path: '/search',
      component: resolve => require(['components/search/search'], resolve),
      children: [
        {
          path: '/search/searchResult',
          component: resolve => require(['components/search-result/search-result'], resolve),
          children: [
            {
              path: '/search/searchResult',
              redirect: '/search/searchResult/searchSongs'
            },
            {
              path: '/search/searchResult/searchSongs',
              component: resolve => require(['components/search-result/search-songs/search-songs'], resolve)
            },
            {
              path: '/search/searchResult/searchDisc',
              component: resolve => require(['components/search-result/search-disc/search-disc'], resolve)
            },
            {
              path: '/search/searchResult/searchAlbum',
              component: resolve => require(['components/search-result/search-album/search-album'], resolve)
            },
            {
              path: ':id',
              component: resolve => require(['components/singer/singer-detail/singer-detail'], resolve)
            },
            {
              path: ':id',
              component: resolve => require(['components/recommend/disc/disc'], resolve)
            },
            {
              path: ':id',
              component: resolve => require(['components/album/album'], resolve)
            }
          ]
        }
      ]
    },
    {
      path: '/user',
      component: resolve => require(['components/user-center/user-center'], resolve)
    }
  ]
  // history模式 去除链接中的 #号 但是打包后 刷新页面会404
  // mode: 'history'
  // linkActiveClass: 'active'
})
