const db = wx.cloud.database();
const todos = db.collection("usersData");
Page({

  data: {
    username: '',
    password: '',
    errorMessage:''
  },
  onAccountInput(e) {
    this.setData({
      username: e.detail.value
    });
  },
  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    });
  },
  async onLogin() {
    //console.log(this.data.username,"this.data.username")
    //console.log(this.data.password,"this.data.password")

    if(this.data.password.trim()==''
      ||this.data.username.trim()==''
      ){
      this.setData({
        errorMessage:"账户或密码不可为空！"
      });
      return;
    }
    // 处理登录逻辑，可以向服务器发送请求等
    const res = await todos.where({
      username:this.data.username
    }).get();
    //console.log("res",res.data)
    if(res.data[0].password!==this.data.password){
      this.setData({
        errorMessage:"账户或密码错误！"
      });
      return;
    }
    //console.log("login success")
    const app = getApp();
    app.globalData.currentUser = this.data.username;
    wx.navigateTo({
      url: '/pages/admin/admin',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})