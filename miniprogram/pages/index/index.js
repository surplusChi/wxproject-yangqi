// miniprogram/pages/index/index.js

const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      '../../images/swiper/1111.jpg',
      '../../images/swiper/2222.jpg',
      '../../images/swiper/3333.jpg',
      '../../images/swiper/4444.jpg',
    ],
    listData: [],
    current: 'links'
  },
  handleCurrent (ev) {
    let current = ev.target.dataset.current
    if (current == this.data.current) {
      return false;
    }
    this.setData({
      current
    }, () => {
      this.getListData()
    })
  },

  // 点赞功能
  handleLinks (ev) {
    // console.log(ev)
    let id = ev.target.dataset.id
    // 调用云函数实现修改功能(点赞-可以对别的用户点赞)
    wx.cloud.callFunction({
      name: 'update',
      data: {
        collection: 'users',
        doc: id,
        data: "{links : _.inc(1)}"
      }
    }).then((res) => {
      // console.log(res)
      let updated = res.result.stats.updated
      if (updated) {
        let cloneListData = [...this.data.listData]
        for (let i = 0; i < cloneListData.length; i++ ) {
          if (cloneListData[i]._id == id ) {
            cloneListData[i].links++
          }
        }
        this.setData({
          listData: cloneListData
        })
      }
    })
  },
  // 获取数据的方法--不同排序方式(根据排序条件)
  getListData () {
    db.collection('users').field({
      // field 拿到想要的字段数据
      userPhoto: true,
      nickName: true,
      links: true
    })
    .orderBy(this.data.current, 'desc') // 排序条件和排序方式
    .get().then((res) => {
      // console.log(res.data)
      this.setData({
        listData: res.data
      })
    })
  },

  handleDetail (ev) {
    let id = ev.target.dataset.id
    // console.log(id)
    wx.navigateTo({
      url: '/pages/userDetail/userDetail?userId='+id,
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
    this.getListData()
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