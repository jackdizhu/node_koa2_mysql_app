const router = require('koa-router')()
const cookingModel = require('../models/cooking')
// const log = require('../com/log')()

router.prefix('/api')

router.get('/', async (ctx, next) => {
  ctx.body = {
    'title': '/',
    'code': '0',
    'msg': '成功.',
    'data': []
  }
})

router.get('/get_list', async (ctx, next) => {
  let cookingType = ctx.query.cookingType || 'chuancai'
  let pagesize = 20
  let page = ctx.query.page || 1
  let count = await cookingModel.count({type: cookingType})
  let data = await cookingModel.find({type: cookingType}, pagesize, page)

  ctx.body = {
    'title': 'get_list',
    'code': '0',
    'msg': '成功.',
    'data': {
      count: count,
      pagesize: pagesize,
      page: page,
      data: data
    }
  }
})

module.exports = router
