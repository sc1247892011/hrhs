const app = getApp();
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
    currentUser:"",
    createdate:"",
    latitude:"",
    longitude:"",
    cities: [
      "南京市",
      "无锡市",
      "徐州市",
      "常州市",
      "苏州市",
      "南通市",
      "连云港市",
      "淮安市",
      "盐城市",
      "扬州市",
      "镇江市",
      "泰州市",
      "宿迁市"
    ],
    years: [],
    seasons: ['一季度', '二季度', '三季度','四季度'],//季度在数据库里是数字 1 2 3 4 所以后面插入的时候seasonIndex要+1
    cityIndex: 0,
    yearIndex: 0,
    seasonIndex: 0,
  },
 
  inputTitle: function (e) {
    this.setData({
      title: e.detail.value
    });
  },

  inputContent: function (e) {
    this.setData({
      content: e.detail.value
    });
  },

  chooseImage() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        const uploadImage = res.tempFilePaths[0];
        this.uploadImage(uploadImage);
      }
    });
  },

  uploadImage(filePath) {
    wx.cloud.uploadFile({
      cloudPath: 'images/' + Date.now() + '.png', // 上传至云端的路径
      filePath: filePath, // 小程序临时文件路径
      success: res => {
        this.setData({
          image: res.fileID
        });
        wx.showToast({
          title: '图片上传成功！',
        })
      },
      fail: console.error
    });
  },

  async submitForm(e) {
    console.log('submitForm',e)
    const result = await todos
      .orderBy('id', 'desc')
      .limit(1)
      .get();
    let id = result.data[0].id + 1;

    if (this.data.title.trim() === '') {
      wx.showToast({
        title: '标题未输入！',
      });
      return;
    }
    
    if (this.data.content.trim() === '') {
      wx.showToast({
        title: '内容未输入！',
      });
      return;
    }
    
    if (this.data.image.trim() === '') {
      wx.showToast({
        title: '图片未选择！',
      });
      return;
    }

    const dataToInsert = {
// author
      author: this.data.currentUser, 
// year
      year:this.data.years[this.data.yearIndex],
// season
      season:parseInt(this.data.seasonIndex)+1,
// content
      content:this.data.content,
// createdate
      createdate:this.data.createdate,
// num
      num:0,
// image
      image:this.data.image,
// latitude
      latitude:this.data.latitude,
// longitude
      longitude:this.data.longitude,
// title
      title:this.data.title,
// city
      city:this.data.cities[this.data.cityIndex],
// description
      
// id
      id:id
    };
    //console.log('dataToInsert',dataToInsert);
    app.globalData.cityIndexCache = this.data.cityIndex;
    app.globalData.seasonIndexCache = this.data.seasonIndex;
    app.globalData.yearIndexCache = this.data.yearIndex;
    // 插入数据
    const add = await todos.add({
      data: dataToInsert,
    })
      .then(res => {
        console.log("插入成功", res);
      })
      .catch(err => {
        //console.error("插入失败", err);
      });
     
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 1500,
        complete: function() {
          wx.navigateBack()
        }
      });
  
  },

  onLoad(options) {
    this.setData(options);
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
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    let day = currentDate.getDate().toString().padStart(2, '0');
    let formattedDate = year + '-' + month + '-' + day;
    // 生成从当前年份到2018年的年份数组
    const yearsFromCurrentTo2018 = Array.from({ length: year - 2018 + 1 }, (_, index) => year - index);
    let dataToSet = {};
     
    dataToSet.years = yearsFromCurrentTo2018;
    dataToSet.currentUser = app.globalData.currentUser;
    dataToSet.createdate = formattedDate; 
    if(app.globalData.yearIndexCache!==''){
      dataToSet.yearIndex = app.globalData.yearIndexCache;
    }
    if(app.globalData.cityIndexCache!==''){
      dataToSet.cityIndex = app.globalData.cityIndexCache;
    }
    if(app.globalData.seasonIndexCache!==''){
      dataToSet.seasonIndex = app.globalData.seasonIndexCache;
    }
    this.setData(dataToSet);
  },
  async onPickerChange1(e) {
    this.setData({
      cityIndex: e.detail.value,
    }); 
  },
  async onPickerChange2(e) {
    this.setData({
      yearIndex: e.detail.value,
    }); 
  },
  async onPickerChange3(e) {
    this.setData({
      seasonIndex: e.detail.value,
    }); 
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