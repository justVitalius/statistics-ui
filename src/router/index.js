import Vue from 'vue'
import Router from 'vue-router'
import Statistic from '@/components/Statistic'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Statistic',
      component: Statistic
    }
  ]
})
