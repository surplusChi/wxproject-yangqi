// components/search/search.js

const app = getApp()
const db = wx.cloud.database()
Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    value: '',
    isFoucs: false,
    historyList: [],
    searchList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleFocus () {
      this.setData({
        isFoucs: true
      })
      wx.getStorage({
        key: 'searchHistory',
        success: (res) => {
          this.setData({
            historyList: res.data
          })
        }
      })
    },
    handleCancel() {
      this.setData({
        isFoucs: false,
        value: ''
      })
    },
    handleConfirm (ev) {
      // console.log(ev.detail.value)
      let value = ev.detail.value
      let cloneHistoryList = [...this.data.historyList]
      cloneHistoryList.unshift(value)
      wx.setStorage({
        key: 'searchHistory',
        data: [...new Set(cloneHistoryList)],
      })
      this.changeSearchList(value)

    },
    handleDelete () {
      wx.removeStorage({
        key: 'searchHistory',
        success: (res) => {
          this.setData({
            historyList: []
          })
        }
      })
    },
    handleHistoryItemDel (ev) {
      // console.log(ev.target.dataset.value)
      let value = ev.target.dataset.value
      this.changeSearchList(value)
      this.setData({
        value
      })
    },
    changeSearchList (value) {
      db.collection('users').where({
        nickName: db.RegExp({
          regexp: value,
          options: 'i',
        })
      }).field({
        userPhoto: true,
        nickName: true
      }).get().then((res) => {
        this.setData({
          searchList: res.data
        })
      })
    }
  }
})
