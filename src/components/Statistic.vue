<template>
  <div class="statisticMainPage">
    <h1>{{ title }}</h1>
    <h2 v-if="!users.length">Нет данных</h2>
    <table v-else class="table">
      <thead class="header">
        <tr>
          <th class="fio-header">Name</th>
          <th v-for="category in categories" :key="category.title">
            {{ category.title }}
          </th>
          <th>Всего</th>
        </tr>
      </thead>
      <transition-group name="fade" tag="tbody" class="results">
        <tr v-for="user in users" :key="user.id">
          <td class="fio-value">
            {{ user.fio  }}
            <span class="ghost-value">/ {{ user.username  }} </span>
          </td>
          <td v-for="(answer, index) in user.answers" v-bind:key="index">
            {{ answer.count }}/{{answer.totalCount}}
            <span class="ghost-value">/ ({{answer.percent}}%) </span>
          </td>
          <td>{{ user.allCorrectAnswers }} / {{ user.allAnswersCount }}</td>
        </tr>
      </transition-group>
    </table>
    <div id="footer">
      <img src="../assets/logo.png">
      <img src="../assets/sbt.png">
    </div>
  </div>
</template>

<script>
import CONFIG from '../constants'
import { groupBy, orderBy } from 'lodash/collection'
import { mapValues, get } from 'lodash/object'
const { ENDPOINTS, REQUEST_INTERVAL } = CONFIG
const { GAMERS, CATEGORIES } = ENDPOINTS

export default {
  name: 'Statistic',
  data () {
    return {
      title: 'Сбертех бот. Таблица участников',
      users: [],
      categories: []
    }
  },
  methods: {
    updateData (url, handler, repeatable) {
      fetch(url)
        .then(stream => stream.json())
        .then(handler)
        .catch(console.error)
      if (repeatable) {
        setTimeout(this.updateData, REQUEST_INTERVAL, url, handler, repeatable)
      }
    },
    fetchCategories () {
      this.updateData(`${CATEGORIES}`, data => {
        this.categories = data
        this.updateData(`${GAMERS}`, data => {
          data = data.map(item => {
            const { answers = [] } = item
            const allAnswersCount = answers.length
            const allCorrectAnswers = answers.filter(item => item.isCorrect).length
            const correctAnswers = mapValues(groupBy(answers, 'category'), (items) => {
              return {
                count: items.filter(item => item.isCorrect).length,
                totalCount: items.length
              }
            })
            return {
              allCorrectAnswers,
              allAnswersCount,
              ...item,
              answers: this.categories.map(category => {
                const { title, numberOfRequiredAnswers = 1 } = category
                const { count, totalCount } = get(correctAnswers, title, { count: 0, totalCount: 0 })
                let percent = parseFloat(count * 100 / numberOfRequiredAnswers).toFixed()
                percent = percent > 100 ? 100 : percent
                return {
                  count,
                  totalCount,
                  percent
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
.ghost-value {
  color: gray;
}
h1 {
  font-weight: 500;
  font-size: 1.75rem;
  color: #fff;
  font-family: Roboto, Arial, sans-serif;
}

h2 {
  font-size: 1rem;
  color: #fff;
}

.results {
  margin: 0;
  padding: 0;
  text-align: left;
  position: relative;
}
.results tr {
  margin: 0;
  padding: 1em;
  list-style: none;
  width: 100%;
  border-bottom: 1px solid #394E62;
  transition: ease-in-out 0.5s;
}

.results td {
  text-align: center;
  padding: 10px 10px;
  transition: ease-in-out 0.5s;
  border-bottom: 1px solid #ccc;
}

.header th {
  text-align: center;
  padding: 10px;
  border: none;
}

.header tr {
  background-color: #f9f9f9;
  color: #777
}

.table {
  width: 90%;
  margin: auto;
  background: #fff;
}

.user-header{
  min-width: 50px;
  width: 10%;
}

.fio-header{
  min-width: 100px;
  width: 15%;
}

.user-value, .fio-value {
  text-align: left !important;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

  @media print {
    body {
      background: none;
    }

    #footer, .header, h1 {
      display: none;
    }

    table td, table th { display: none; }

    table .fio-header, body .fio-value{
      width: 100%;
      display: table-cell;
      height: 60px;
    }
  }
</style>
