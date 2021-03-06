// miniprogram/pages/editUserInfo/head/head.js

const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhoto: ''
  },

  handleUploadImage () {
    // 使用微信自带api接口，打开手机相册或者相机
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
    }).then((res) => {
      // console.log(res)
      // tempFilePath可以作为img标签的src属性显示图片
      const tempFilePaths = res.tempFilePaths[0]
      
      // 将所选头像渲染在页面
      this.setData({
        userPhoto: tempFilePaths
      })
    })
  },
  handleBut () {
    wx.showLoading({
      title: '上传中...',
    })
    // 上传的路径，加上一个时间戳
    let cloudPath = "userPhoto/" + app.userInfo._openid + Date.now() + 'jpg';
    wx.cloud.uploadFile({ 
      // 指定上传到的云路径
      cloudPath,
      // 指定要上传的文件的小程序临时文件路径
      filePath: this.data.userPhoto
    }).then((res) => {
      // console.log(res)
      let fileID = res.fileID;
      if (fileID) {
        db.collection('users').doc(app.userInfo._id).update({
          data: {
            userPhoto: fileID
          }
        }).then((res) => {
          wx.hideLoading();
          wx.showToast({
            title: '上传并更新成功',
          })
          app.userInfo.userPhoto = fileID
        })
      }
    })
  },

  bindGetUserInfo (ev) {
    // console.log(ev)
    let userInfo = ev.detail.userInfo
    this.setData ({
      userPhoto: userInfo.avatarUrl
    }, () => {
      // 利用setdata的第二个参数，回调函数
      wx.showLoading({
        title: '上传中...',
      })
      db.collection('users').doc(app.userInfo._id).update({
        data: {
          userPhoto: userInfo.avatarUrl
        }
      }).then((res) => {
        wx.hideLoading();
        wx.showToast({
          title: '上传并更新成功',
        })
        app.userInfo.userPhoto = userInfo.avatarUrl
      })
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
    this.setData({
      userPhoto: app.userInfo.userPhoto
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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