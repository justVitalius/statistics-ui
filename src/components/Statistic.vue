<template>
  <div class="statisticMainPage">
    <h1>{{ title }}</h1>
    <table>
      <thead>
        <tr>
          <th>Имя пользователя</th>
          <th>ФИО</th>
          <th v-for="category in categories" :key="category.title">
            {{ category.title }}
          </th>
        </tr>
      </thead>
      <transition-group name="fade" tag="tbody" class="Results">
        <tr v-for="user in users" :key="user.id">
          <td>
            {{ user.username  }}
          </td>
          <td>
            {{ user.fio  }}
          </td>
          <td v-for="(answer, index) in user.answers" v-bind:key="index">
            {{ answer.count }} ({{answer.percent}}%)
          </td>
        </tr>
      </transition-group>
    </table>
  </div>
</template>

<script>
import CONFIG from '../constants'
import { groupBy, orderBy } from 'lodash/collection'
import { mapValues, get } from 'lodash/object'
const { ENDPOINTS, REQUEST_INTERVAL } = CONFIG
const host = process.env.API_HOST
const port = process.env.API_PORT
const { GAMERS, CATEGORIES } = ENDPOINTS

export default {
  name: 'Statistic',
  data () {
    return {
      title: 'Статистика по пользователям',
      users: [],
      categories: [],
      baseUrl: `${host}:${port}`
    }
  },
  methods: {
    updateData (url, handler, repeatable) {
      fetch(url)
        .then(stream => stream.json())
        .then(handler)
        .catch(error => console.error(error))
      if (repeatable) {
        setTimeout(this.updateData, REQUEST_INTERVAL, url, handler, repeatable)
      }
    },
    fetchCategories () {
      this.updateData(`${this.baseUrl}${CATEGORIES}`, data => {
        this.categories = data
        this.updateData(`${this.baseUrl}${GAMERS}`, data => {
          data = data.map(item => {
            let { answers = [] } = item
            answers = mapValues(groupBy(answers, 'category'), (items) => {
              return {
                count: items.filter(item => item.isCorrect).length
              }
            })
            return {
              ...item,
              answers: this.categories.map(category => {
                const { title, numberOfNeedAnswers = 1 } = category
                const { count } = get(answers, title, { count: 0 })
                return {
                  count,
                  percent: count * 100 / numberOfNeedAnswers
                }
              })
            }
          })
          data = orderBy(data, item => {
            const { answers = [] } = item
            return answers.reduce((total, answer) => total + answer.count, 0)
          }, ['desc'])
          this.users = data
        }, true)
      }, false)
    }
  },
  mounted () {
    this.fetchCategories()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
.Results {
  margin: 0;
  padding: 0;
  text-align: left;
  position: relative;
}
.Results tr {
  background: rgba(53, 73, 94, 0.3);
  margin: 0;
  padding: 1em;
  list-style: none;
  width: 100%;
  border-bottom: 1px solid #394E62;
  transition: ease-in-out 0.5s;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
