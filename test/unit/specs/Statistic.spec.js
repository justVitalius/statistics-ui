import Vue from 'vue'
import Statistic from '@/components/Statistic'

describe('Statistic.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Statistic)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.statisticMainPage h1').textContent)
      .toEqual('Статистика по пользователям')
  })
})
