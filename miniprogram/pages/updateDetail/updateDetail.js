const app = getApp();
const db = wx.cloud.database();
const todos = db.collection('newsData');
Page({
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
    id:99999999
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

  async submitForm(e) {
    //console.log('submitForm',e) 
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

    const dataToUpdate = {
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
      id:parseInt(this.data.id)
    };
    //console.log('dataToUpdate',dataToUpdate);
    // 修改数据
    const update = await todos.where({
      id:parseInt(this.data.id)
    }).update({
      data: dataToUpdate,
    })
      .then(res => {
        console.log("修改成功", res);
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
  async onLoad(options) {
    console.log('options',options);
    let pid = options.id;
    //这个id必不可能为空
    const res = await todos.where({
      id:parseInt(pid)
    }).get();
    console.log('res.data:',res.data);
    const {title,content,image,author,createdate,city,year,season,latitude,longitude} = res.data[0];
    //数据库的season 是从1开始的 代表一季度 需要-1
    let seasonIndex= parseInt(season)-1;
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    let day = currentDate.getDate().toString().padStart(2, '0');
    let formattedDate = currentYear + '-' + month + '-' + day;
    // 生成从当前年份到2018年的年份数组
    const yearsFromCurrentTo2018 = Array.from({ length: currentYear - 2018 + 1 }, (_, index) => currentYear - index);

    this.setData({
      id:pid,
      years:yearsFromCurrentTo2018,
      currentUser: app.globalData.currentUser,
      createdate:formattedDate,
      title: title,
      content: content,
      image: image,
      author: author,
      createdate: createdate,
      cityIndex:this.data.cities.indexOf(city),
      yearIndex:yearsFromCurrentTo2018.indexOf(year),
      seasonIndex:seasonIndex,
      latitude:latitude,
      longitude:longitude
    })
  },

  onReady() {

  },

  onShow() {
   
  },

  onHide() {

  },

  onUnload() {

  },

  onPullDownRefresh() {

  },

  onReachBottom() {

  },

  onShareAppMessage() {

  }
})