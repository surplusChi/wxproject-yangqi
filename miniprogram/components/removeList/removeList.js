// components/removeList/removeList.js

const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    messageId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    userMessage: {}
  },

  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      db.collection('users').doc(this.data.messageId).field({
        userPhoto: true,
        nickName: true
      })
      .get()
      .then((res) => {
        this.setData({
          userMessage: res.data
        })
      })
    } 
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleDelMessage () {
      wx.showModal({
        title: '提示信息',
        content: '是否删除该信息？',
        confirmText: '删除',
        success: (res) => {
          if (res.confirm) {
            // 点击删除，之后的操作
            this.removeMessage()

          } else if (res.cancel) {
            console.log("取消")
          }
        }
      })
    },
    handleAddFriend () {
      wx.showModal({
        title: '提示信息',
        content: '是否同意好友申请?',
        confirmText: '同意',
        success: (res) => {
          if (res.confirm) {
            // 更新自己的好友列表
            db.collection('users').doc(app.userInfo._id).update({
              data: {
                friendList: _.unshift(this.data.messageId)
              }
            }).then((res) => {})

            // 更新对方的好友列表
            wx.cloud.callFunction({
              name: 'update',
              data: {
                collection: 'users',
                doc: this.data.messageId,
                data: `{
                  friendList:  _.unshift('${app.userInfo._id}')
                }`
              }
            }).then((res) => {})

            // 删除好友申请信息
            this.removeMessage()
            wx.showToast({
              title: '已同意该申请',
            })

          } else if (res.cancel) {
            console.log("取消")
          }
        }
      })
    },
    removeMessage () {
      // 点击删除，之后的操作
      db.collection('message').where({
        userId: app.userInfo._id
      }).get().then((res) => {

        let list = res.data[0].list
        list = list.filter((val, i) => {
          return val != this.data.messageId
        })

        wx.cloud.callFunction({
          name: 'update',
          data: {
            collection: 'message',
            where: {
              userId: app.userInfo._id
            },
            data: {list}
          }
        }).then((res) => {
           this.triggerEvent('myevent', list)
        })
      })

    }
  }
})
