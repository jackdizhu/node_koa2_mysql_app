const Koa = require('koa')
const app = new Koa()
const cors = require('koa-cors')
const koaJwt = require('koa-jwt')
const path = require('path')
// const jwt = require('jsonwebtoken')
// const util = require('util')
// 解密
// const verify = util.promisify(jwt.verify)
// 加盐 key
const secret = 'lqwiuerpowjflaskdjffkhgoiwurpoqdjlsakjflsdkf'

const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser') // form-data 不支持  x-www-form-urlencoded 改为
const logger = require('koa-logger')

const index = require('./routes/index')
const api = require('./routes/api')

// 自定义 日志打印
const log = require('./com/log')
global.log = log()

// error handler
onerror(app)

// token 验证 js req header authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidXNlci5uYW1lIiwiaWF0IjoxNTE2Nzg3MDU0LCJleHAiOjE1MTY3OTA2NTR9.gEIBKKqhEQ_slW0BmSK-3pnaXxYFaOSOJonLb3Xc6n0"
// app.use(koaJwt({secret}).unless({
//   // 数组中的路径不需要通过jwt验证
//   path: [
//     /^\/api\/[a-zA-Z_]+/,
//     /^\/users\/[a-zA-Z_]+/
//   ]
// }))
// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text', 'multipart']
}))
app.use(json())
// api 服务器 允许跨域
app.use(cors())
app.use(logger())
app.use(require('koa-static')(path.resolve(__dirname, './public')))

app.use(views(path.resolve(__dirname, './views'), {
  extension: 'ejs'
}))

// logger
// app.use(async (ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date() - start
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })

// routes

// 针对 /api 的中间件
app.use(async (ctx, next) => {
  await next()
  if (/^\/api\//.test(ctx.path)) {
    // 处理 !==200 错误
    if (ctx.response.status !== 200) {
      ctx.body = {
        obj: {
          code: '0',
          msg: 'ok'
        }
      }
    }

    if (ctx.body) {
      ctx.body.path = ctx.path
      ctx.body.query = ctx.query
      ctx.body.body = ctx.request.body
      ctx.body._req = ctx.request
      ctx.body._res = ctx.response
      ctx.body.apiV = '1.0'
    }
  }
})

app.use(index.routes(), index.allowedMethods())
app.use(api.routes(), api.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  ctx.body = err
  console.error('server error', err, ctx)
})

module.exports = app
