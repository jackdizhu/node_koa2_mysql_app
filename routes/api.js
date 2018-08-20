const router = require('koa-router')()
const cookingModel = require('../models/cooking')
const moment = require('moment')
const pagesize = 20
// const log = require('../com/log')()

router.prefix('/api')

let cookingType = ['chuancai', 'xiangcai', 'yuecai', 'dongbeicai', 'lucai', 'zhecai', 'sucai', 'qingzhencai', 'mincai', 'hucai', 'jingcai', 'hubeicai', 'huicai', 'yucai', 'xibeicai', 'yunguicai', 'jiangxicai', 'shanxicai', 'guangxicai', 'gangtaicai', 'qitacai']
let random = (min, max) => {
  let R = Math.floor(Math.random() * (max - min)) + min
  return R
}
// 生成 随机推荐数据
async function get_listRandom (_obj) {
  let arr = []
  let _pagesize = 1
  let page = 1
  for (let i = 0; i < cookingType.length; i++) {
    let item = cookingType[i]
    let count = await cookingModel.count({type: item})
    page = random(1, count + 1)
    let data = await cookingModel.find({type: item}, _pagesize, page)
    arr.push(data[0])
  }
  global.dateData.listRandom = arr
  return true
}
// 生成 菜系数据
async function get_list (_obj) {
  let page = 1
  for (let i = 0; i < cookingType.length; i++) {
    let item = cookingType[i]
    let count = await cookingModel.count({type: item})
    let maxPage = Math.ceil(count / pagesize)
    let _page = _obj[item] && _obj[item].page
    page = _page ? (_page + 1) : 1
    if (page > maxPage) {
      page = 1
    }
    let data = await cookingModel.find({type: item}, pagesize, page)
    global.dateData[item] = {}
    global.dateData[item].page = page
    global.dateData[item].data = data
  }
  return true
}

async function init_dateData (dateStr) {
  let thisDate = dateStr || moment().format('YYYY-MM-DD')
  if (global.dateData && global.dateData[thisDate]) {
    return global.dateData
  } else {
    let _obj = global.dateData
    global.dateData = {}
    global.dateData[thisDate] = true
    await get_listRandom(_obj)
    await get_list(_obj)

    return global.dateData
  }
}

router.get('/', async (ctx, next) => {
  let dateStr = ctx.query.dateStr || moment().format('YYYY-MM-DD')
  let obj = await init_dateData(dateStr)
  ctx.body = {
    'title': '/',
    'code': '0',
    'msg': '成功.',
    'data': obj && dateStr
  }
})

router.get('/get_list', async (ctx, next) => {
  let thisDate = moment().format('YYYY-MM-DD')
  let cookingType = ctx.query.cookingType || 'chuancai'
  let page = ctx.query.page || 1
  let data = null

  async function getData () {
    // let count = await cookingModel.count({type: cookingType})
    let data = await cookingModel.find({type: cookingType}, pagesize, page)
    return data
  }

  if (global.dateData && global.dateData[thisDate] && global.dateData[cookingType] && global.dateData[cookingType].data && global.dateData[cookingType].data.length) {
    data = global.dateData[cookingType].data
  } else {
    let arr = await getData()
    data = arr
  }

  ctx.body = {
    'title': 'get_list',
    'code': '0',
    'msg': '成功.',
    'data': data
  }
})

router.get('/get_listRandom', async (ctx, next) => {
  let thisDate = moment().format('YYYY-MM-DD')
  let arr = []
  let pagesize = 1
  let page = ctx.query.page || 1
  let data = null

  async function getData () {
    for (let i = 0; i < cookingType.length; i++) {
      let item = cookingType[i]
      let count = await cookingModel.count({type: item})
      page = random(1, count + 1)
      let data = await cookingModel.find({type: item}, pagesize, page)
      arr.push(data[0])
    }
    return arr
  }

  if (global.dateData && global.dateData[thisDate] && global.dateData.listRandom && global.dateData.listRandom.length) {
    data = global.dateData.listRandom
  } else {
    await getData()
    data = arr
  }

  ctx.body = {
    'title': 'get_list',
    'code': '0',
    'msg': '成功.',
    'data': data
  }
})

module.exports = router
