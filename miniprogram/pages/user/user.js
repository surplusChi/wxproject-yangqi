// miniprogram/pages/user/user.js

const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhoto: "/images/user/user-no.png", // 用户头像
    nickName: "Surplus", // 用户昵称
    logged: false, // 控制用户是否登录
    disabled: true, // 控制授权登录按钮是否可用
    id: '' // 登录用户id
  },
  // 登录按钮的回调函数
  bindGetUserInfo (ev) {
    // console.log(ev)
    let userInfo = ev.detail.userInfo
    if (!this.data.logged && userInfo) {
      // 在云数据库中插入一个用户信息
      db.collection('users').add({
        data: {
          userPhoto: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          signature: '', // 个性签名
          phoneNumber: '', // 手机号码
          weixinNumber: '', //  微信号
          links: 0,  // 点赞数
          time: new Date(), // 用户创建时间
          isLocation: true, // 位置共享信息
          longitude: this.longitude, // 用户当位置经度
          latitude: this.latitude, // 用户当位置纬度
          location: db.Geo.Point(this.longitude, this.latitude),
          friendList: []  // 好友列表

        }
      }).then((res) => {
        // console.log(res)
        // 拿到当前插入用户的所有信息
        db.collection('users').doc(res._id).get().then((res) => {
          // res.data 是当前用户的所有信息
          // console.log(res.data)

          // 将用户信息 拷贝到全局userInfo里面
          app.userInfo = Object.assign( app.userInfo, res.data)

          // 点击登录之后，将用户信息渲染到页面
          this.setData({
            userPhoto: app.userInfo.userPhoto,
            nickName : app.userInfo.nickName,
            logged: true,
            id: app.userInfo._id
          })

        })
      })
    }
  },
  // 实时监听消息的方法
  getMessage () {
    db.collection('message').where({
      userId: app.userInfo._id
    }).watch({
      onChange: function(snapshot) {
        if (snapshot.docChanges.length ) {
          let list = snapshot.docChanges[0].doc.list;
          if ( list.length ) {
             wx.showTabBarRedDot({
               index: 2
             })
             app.userMessage = list;
          } else {
            wx.hideTabBarRedDot({
              index: 2,
            })
            app.userMessage = [];
          }
        }
      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    })
  },
  // 获取当前位置信息的方法
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.latitude = res.latitude
        this.longitude = res.longitude 
      }
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 在页面初次渲染时，查询云数据库找到当前用户的openid，拿到用户数据，并渲染页面
    this.getLocation()

    wx.cloud.callFunction({
      name: 'login', // 查询的云函数名称
      data: {} // 是否上传数据
    }).then((res) => {
      // console.log(res)
      db.collection('users').where({
        // 利用where语句，来判断查询的用户openid是否是当前用户的id
        _openid : res.result.openid
      }).get().then((res) => {

        // 判断是否查询到了用户信息，有就直接渲染页面，没有就用户点击登录
        if ( res.data.length ) {

           // 在页面初次渲染时，将用户信息拷贝到全局
          app.userInfo = Object.assign( app.userInfo, res.data[0])

          // 在页面初次渲染时，将用户信息渲染到页面
          this.setData({
            userPhoto: app.userInfo.userPhoto,
            nickName : app.userInfo.nickName,
            logged: true,
            id: app.userInfo._id
          })
          this.getMessage(); // 登录之后，实时监听信息推送
        } else {
          
          // 没有用户信息就让用户可以点击登录
          this.setData({
            disabled: false
          })
        }

      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userPhoto: app.userInfo.userPhoto,
      nickName: app.userInfo.nickName,
      id: app.userInfo._id
    })
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