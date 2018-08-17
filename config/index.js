module.exports = {
  'port': 8000,
  'db': {
    database: 'nodemysql',
    username: 'root',
    password: 'root',
    host: '127.0.0.1',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  },
  'jwt': {
    'key': 'user',
    'expire': '14 days',
    'collection': 'tokens',
    'secret': 'shared-secret'
  }
}
