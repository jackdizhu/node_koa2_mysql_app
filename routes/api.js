const router = require('koa-router')()
const cookingModel = require('../models/cooking')

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
  let data = await cookingModel.find({type: cookingType}, 20, 1)

  ctx.body = {
    'title': 'get_list',
    'code': '0',
    'msg': '成功.',
    'data': data
  }
})

module.exports = router
