const db = wx.cloud.database();
const todos = db.collection('newsData');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:"",
    image:"",
    title:"",
    author:"",
    createdate:"",
    num:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let pid = options.id;
    //这个id必不可能为空
    const res = await todos.where({
      id:parseInt(pid)
    }).get();
    const {title,content,image,author,createdate,num} = res.data[0];
    const updateResult = await todos.where({
      id:parseInt(pid)
    }).update({
      data: {
        num: db.command.inc(1), // 使用 db.command.inc 进行自增操作
      },
    });
    //console.log(updateResult)
    this.setData({
      title: title,
      content: content,
      image: image,
      author: author,
      createdate: createdate,
      num:num+1
    })
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