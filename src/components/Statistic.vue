<template>
  <div class="statisticMainPage">
    <h1>{{ title }}</h1>
    <table>
      <thead>
        <tr>
          <th>Имя пользователя</th>
          <th>ФИО</th>
          <th v-for="category in categories" :key="category">
            {{ category.name }}
          </th>
        </tr>
      </thead>
      <transition-group name="fade" tag="tbody" class="Results">
        <tr v-for="user in users" :key="user">
          <td>
            {{ user.username  }}
          </td>
          <td>
            {{ user.fio  }}
          </td>
        </tr>
      </transition-group>
    </table>
  </div>
</template>

<script>
import CONFIG from '../constants'
const { endpoints } = CONFIG
const host = process.env.API_HOST
const port = process.env.API_PORT
const { statistic, categories } = endpoints

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
    fetchCategories () {
      fetch(`${this.baseUrl}${categories}`)
        .then(stream => stream.json())
        .then(data => {
          this.categories = data
        })
        .catch(error => console.error(error))
    },
    fetchUsers () {
      fetch(`${this.baseUrl}${statistic}`)
        .then(stream => stream.json())
        .then(data => {
          this.users = data
        })
        .catch(error => console.error(error))
    }
  },
  mounted () {
    this.fetchCategories()
    this.fetchUsers()
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
