# node_koa2_mysql_app 菜系菜谱小程序服务端

* node koa mysql sequelize 增 改 查
* 数据表关联

```
// 生成数据 分类列表 随机推荐
/api/
/api/get_list
/api/get_listRandom
```

``` js
User.create({
  userName: userName,
  password: password
})
User.update({
  userName: user.userName,
  password: user.password
}, {
  where: {
    id: user.id
  }
})
User.findOne({
  where: where
})
User.findAll({
  where: where
})

// 因为 Sequelize 做了很多神奇的事，所以你必须在设置关联后调用 Sequelize.sync
// 指定 User 和 UserChildren 的关系为 1：1 的关系 User.userChildrenId === UserChildren.id
// user
var User = DB.define('user', {
  userChildrenId: {
    type: Sequelize.STRING
  },
  userName: {
    type: Sequelize.STRING,
    field: 'user_name'
  },
  password: {
    type: Sequelize.STRING
  }
},
{
  freezeTableName: true
})
// userChildren
var User = DB.define('userChildren', {
  userName: {
    type: Sequelize.STRING,
    field: 'user_name'
  },
  password: {
    type: Sequelize.STRING
  }
},
{
  freezeTableName: true
})

User.belongsTo(UserChildrenModal.User, {foreignKey: 'userChildrenId', targetKey: 'id'})

// user
var User = DB.define('user', {
  userName: {
    type: Sequelize.STRING,
    field: 'user_name'
  },
  password: {
    type: Sequelize.STRING
  }
},
{
  freezeTableName: true
})
// userChildren
var User = DB.define('userChildren', {
  userId: {
    type: Sequelize.STRING
  },
  userName: {
    type: Sequelize.STRING,
    field: 'user_name'
  },
  password: {
    type: Sequelize.STRING
  }
},
{
  freezeTableName: true
})
// 指定 User 和 UserChildren 的关系为 1 : n 的关系 User.id === UserChildren.userId
User.hasMany(UserChildrenModal.User, {foreignKey: 'id', targetKey: 'userId'})
```
