import Vue from 'vue'
import Router from '../vueRouter/index'
// import Router from 'vue-router'
import Home from '@/components/Home'
import About from '@/components/About'
Vue.use(Router)

export default new Router({
  // mode:"hash",
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/about',
      name: 'About',
      component: About
    }
  ]
})
