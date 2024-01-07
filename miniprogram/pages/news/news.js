const db = wx.cloud.database();
const todos = db.collection('newsData');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperArr:[
      {
        image:"/images/default.png",
        title:"默认数据"
      },
    ],
    NewsArr:[],
    isLoading:false,
    cities: ["不限",
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
    seasons: ['不限','一季度', '二季度', '三季度','四季度'],
    cityIndex: 1,
    yearIndex: 1,
    seasonIndex: 1,
    searchText:""
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
  async onShow() {
    //console.log("onShow!")
    const swiperData = await todos.orderBy('id','desc').limit(4).get();
    if(swiperData.data.length>0){
      this.setData({
        swiperArr:swiperData.data
      });
    }

    // 获取当前年份
    const currentYear = new Date().getFullYear();
    // 生成从当前年份到2018年的年份数组
    const yearsFromCurrentTo2018 = Array.from({ length: currentYear - 2018 + 1 }, (_, index) => currentYear - index);
    yearsFromCurrentTo2018.unshift("不限");
    const {searchText, cities, years, seasons, cityIndex, yearIndex, seasonIndex} = this.data;
    // search会自动更新NewsArr数据 
    const resdata =await this.search(searchText, cities, yearsFromCurrentTo2018, seasons, cityIndex, yearIndex, seasonIndex);
    this.setData({
      years:yearsFromCurrentTo2018,
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

  },
  onInput: function (e) {
    this.setData({
      searchText:e.detail.value
    })
  },
  async onPickerChange1(e) {
    const {searchText, cities, years, seasons, cityIndex, yearIndex, seasonIndex} = this.data;
    await this.search(searchText, cities, years, seasons, e.detail.value, yearIndex ,seasonIndex);
    this.setData({
      cityIndex: e.detail.value,
    }); 
  },
  async onPickerChange2(e) {
    const {searchText, cities, years, seasons, cityIndex, yearIndex, seasonIndex} = this.data;
    await this.search(searchText, cities, years, seasons, cityIndex,  e.detail.value, seasonIndex);
    this.setData({
      yearIndex: e.detail.value,
    }); 
  },
  async onPickerChange3(e) {
    // 处理下拉框选择事件 
    const {searchText, cities, years, seasons, cityIndex, yearIndex, seasonIndex} = this.data;
    await this.search(searchText, cities, years, seasons, cityIndex, yearIndex, e.detail.value);
    this.setData({
      seasonIndex: e.detail.value,
    });  
  },
  async onSearch(){
     const {searchText, cities, years, seasons, cityIndex, yearIndex, seasonIndex} = this.data;
     let result = await this.search(searchText, cities, years, seasons, cityIndex, yearIndex, seasonIndex);
     return result;
  },
  async search(searchText, cities, years, seasons, cityIndex, yearIndex, seasonIndex) {
   const city = cities[cityIndex] === '不限' ? '' : cities[cityIndex];
   const year = years[yearIndex] === '不限' ? '' : years[yearIndex];
   const season = seasons[seasonIndex] === '不限' ? '' :  parseInt(seasonIndex);

   // 构建查询条件
   const conditions = {};
   if (searchText.trim()) {
     conditions.title = db.RegExp({
       regexp: searchText,
       options: 'i',
     });
   }
 
   if (city) {
     conditions.city = city;
   }
 
   if (year) {
     conditions.year = year;
   }
 
   if (season) {
     conditions.season = season;
   }
   //console.log("conditions",conditions)

   let result = [];
    // 发起云数据库查询
   await todos.where(conditions).orderBy('id', 'desc').get().then(res => {
     //console.log('查询结果：', res.data);
     result = res.data;
      // 这里可以处理查询结果，更新页面或其他逻辑
   }).catch(err => {
      //console.error('查询失败：', err);
   });

   this.setData({
      NewsArr:result
   })
  },
})

