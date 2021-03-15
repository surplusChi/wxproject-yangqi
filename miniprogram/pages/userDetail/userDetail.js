// miniprogram/pages/userDetail/userDetail.js

const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    detail: {}, // 详情页数据
    isFriend: false, // 判断是否为好友关系
    isHidden: false // 判断是否是进入自己主页
  },
  handleAddFriend () {
    if (app.userInfo._id) {
      // 已登录，在信息列表数据中，查找当前要添加的用户数据
      db.collection('message')
      .where({
        userId: this.data.detail._id
      })
      .get()
      .then((res) => {
        if (res.data.length) { // 更新操作
          // 如果申请列表有了该好友申请，提示用户
          if ( res.data[0].list.includes(app.userInfo._id) ) { 
            wx.showToast({
              title: '已申请过！',
              icon: 'none'
            })
          } else {
            // 没有申请，就进行更新，添加操作-- 通过云函数来更新
            wx.cloud.callFunction({
              name: 'update',
              data: {
                collection: 'message',
                where: {
                  userId: this.data.detail._id
                },
                data: `{list: _.unshift('${app.userInfo._id}') }`
              }
            }).then((res) => {
              wx.showToast({
                title: '申请成功~',
              })
            })

          }
        } else { // 添加操作
          db.collection('message').add({
            data: {
              userId: this.data.detail._id, // 添加好友的id
              list: [app.userInfo._id] // 登录的用户id
            }
          }).then((res) => {
            wx.showToast({
              title: '申请成功！',
            })
          })
        }
      })

    } else {
      // 如果没有登录，提示用户进行登录，并进行跳转
      wx.showToast({
        title: '请先登录',
        duration: 2000,
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/user/user',
            })
          },2000)
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    let userId = options.userId
    db.collection('users').doc(userId).get().then((res) => {
      this.setData({
        detail: res.data  
      })

      // 进入详情页，判断该详情页用户的好友列表是否有登录用户id
      let friendList = res.data.friendList
      if (friendList.includes(app.userInfo._id)) {
        this.setData({
          isFriend: true
        })
      } else {
        this.setData({
          isFriend: false
        }, () => {
          //  判断是否进入自己主页
          if (userId == app.userInfo._id) {
            this.setData({
              isFriend: true,
              isHidden: true
            })
          }
        })
      }

    })  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!app.userInfo._id) {
      this.setData({
        show: false
      })
      // 如果没有登录，提示用户进行登录，并进行跳转
      wx.showToast({
        title: '请先登录',
        duration: 2000,
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/user/user',
            })
          },1000)
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})