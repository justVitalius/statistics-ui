export default {
  statisticApi: {
    host: process.env.API_HOST || 'http://localhost',
    port: process.env.API_PORT || 3000
  },
  endpoints: {
    statistic: '/statistic',
    categories: '/categories'
  }
}
