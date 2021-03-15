// miniprogram/pages/editUserInfo/name/name.js

const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: ''
  },

  // 获取输入框的value值
  handleText (ev) {
    // console.log(ev.detail.value)
    let value = ev.detail.value
    this.setData({
      nickName: value
    })
  },
  // 按钮事件，点击自定义昵称
  handleBut () {
    this.updataNickName()
  },
  // 自定义昵称的方法
  updataNickName () {
    wx.showLoading({
      title: '更新中',
    })
    db.collection('users').doc(app.userInfo._id).update({
      data: {
        nickName: this.data.nickName
      }
    }).then((res) => {
      wx.hideLoading();
      wx.showToast({
        title: '更新成功！',
      })
      app.userInfo.nickName = this.data.nickName
    })
  },
  bindGetUserInfo (ev) {
    // console.log(ev)
    let userInfo = ev.detail.userInfo
    this.setData ({
      nickName: userInfo.nickName 
    }, () => {
      // 利用setdata的第二个参数，回调函数(等输入框值更新之后，再回调)
      this.updataNickName()
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
      nickName: app.userInfo.nickName
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