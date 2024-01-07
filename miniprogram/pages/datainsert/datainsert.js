const cityDetail = [
  {
    id: 0,
    latitude: 32.0603,
    longitude: 118.7969,
    title: '南京市',
    iconPath: '/images/marker.png', 
    customCallout: {
      anchorY: 0,
      anchorX: 0,
      display: 'ALWAYS',
    },
    width:'0rpx',
    height:'0rpx'
  },
  {
    id: 1,
    latitude: 31.5687,
    longitude: 120.2886,
    title: '无锡市',
    iconPath: '/images/marker.png', 
    customCallout: {
      anchorY: 0,
      anchorX: 0,
      display: 'ALWAYS',
    },
    width:'0rpx',
    height:'0rpx'
  },
  {
    id: 2,
    latitude: 34.2618,
    longitude: 117.1846,
    title: '徐州市',
    iconPath: '/images/marker.png', 
    customCallout: {
      anchorY: 0,
      anchorX: 0,
      display: 'ALWAYS',
    },
    width:'0rpx',
    height:'0rpx'
  },
  {
    id: 3,
    latitude: 31.8107,
    longitude: 119.9733,
    title: '常州市',
    iconPath: '/images/marker.png', 
    customCallout: {
      anchorY: 0,
      anchorX: 0,
      display: 'ALWAYS',
    },
    width:'0rpx',
    height:'0rpx'
  },
  {
    id: 4,
    latitude: 31.2988,
    longitude: 120.5853,
    title: '苏州市',
    iconPath: '/images/marker.png', 
    customCallout: {
      anchorY: 0,
      anchorX: 0,
      display: 'ALWAYS',
    },
    width:'0rpx',
    height:'0rpx'
  },
  {
    id: 5,
    latitude: 32.0147,
    longitude: 120.8686,
    title: '南通市',
    iconPath: '/images/marker.png', 
    customCallout: {
      anchorY: 0,
      anchorX: 0,
      display: 'ALWAYS',
    },
    width:'0rpx',
    height:'0rpx'
  },
  {
    id: 6,
    latitude: 34.5965,
    longitude: 119.2223,
    title: '连云港市',
    iconPath: '/images/marker.png', 
    customCallout: {
      anchorY: 0,
      anchorX: 0,
      display: 'ALWAYS',
    },
    width:'0rpx',
    height:'0rpx'
  },
  {
    id: 7,
    latitude: 33.6104,
    longitude: 119.0153,
    title: '淮安市',
    iconPath: '/images/marker.png', 
    customCallout: {
      anchorY: 0,
      anchorX: 0,
      display: 'ALWAYS',
    },
    width:'0rpx',
    height:'0rpx'
  },
  {
    id: 8,
    latitude: 33.3791,
    longitude: 120.1399,
    title: '盐城市',
    iconPath: '/images/marker.png', 
    customCallout: {
      anchorY: 0,
      anchorX: 0,
      display: 'ALWAYS',
    },
    width:'0rpx',
    height:'0rpx'
  },
  {
    id: 9,
    latitude: 32.3936,
    longitude: 119.4215,
    title: '扬州市',
    iconPath: '/images/marker.png', 
    customCallout: {
      anchorY: 0,
      anchorX: 0,
      display: 'ALWAYS',
    },
    width:'0rpx',
    height:'0rpx'
  },
  {
    id: 10,
    latitude: 31.9044,
    longitude: 119.4349,
    title: '镇江市',
    iconPath: '/images/marker.png', 
    customCallout: {
      anchorY: 0,
      anchorX: 0,
      display: 'ALWAYS',
    },
    width:'0rpx',
    height:'0rpx'
  },
  {
    id: 11,
    latitude: 32.4556,
    longitude: 119.919,
    title: '泰州市',
    iconPath: '/images/marker.png', 
    customCallout: {
      anchorY: 0,
      anchorX: 0,
      display: 'ALWAYS',
    },
    width:'0rpx',
    height:'0rpx'
  },
  {
    id: 12,
    latitude: 33.9619,
    longitude: 118.2755,
    title: '宿迁市',
    iconPath: '/images/marker.png', 
    customCallout: {
      anchorY: 0,
      anchorX: 0,
      display: 'ALWAYS',
    },
    width:'0rpx',
    height:'0rpx'
  },
];
const initScale = 7;
const openScale = 12;
const criticalScale = (initScale+openScale)/2;
const db = wx.cloud.database();
const todos = db.collection('newsData');
const app = getApp();

var newsData =  []; 
var newsDataWithCallout = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationData: {}, 
    subkey:"6HNBZ-BID3T-4ABXM-L3EXQ-IJA3F-YVFRQ",
    latitude:"33.1086",
    longitude:"119.1153",
    scale:initScale,
    markers:cityDetail, 
      circles:[],
      polyline:[],
      polygons:[],
      enable3d:false,
      showLocation:false,
      showCompass:false,
      enableZoom:true,
      enableRotate:false,
      enableSatellite:false,
      enableTraffic:false,
      enableOverlooking:false,
      enableScroll:true,
      enableCustom:true,
      citynum:[],
      currentMarkerType:0,//0大图标 1详细图标
      activeKey:0,
      newMarkerLatitude:"",
      newMarkerLongitude:""
  },
  async onMapTap(e){
    //如果是大图标 不触发点击
    if(this.data.currentMarkerType==0){
      return;
    }
    //如果当前选中的不是新增 不触发 
    if(this.data.activeKey!==0){
       return;
    }
 
    let newMarker = {
      //先随便给一个 后面再改
      id:'99999999',
      latitude:e.detail.latitude,
      longitude:e.detail.longitude,
      title:"点我进入添加页面",
      callout:{
        content: '点我进入添加页面',
        color: "#FFFFFF",
        fontSize: 16,
        borderRadius: 5,
        bgColor: "#4A90E2",
        padding: 5,
        display: 'ALWAYS'
      }
    }

    let newsDataWithCalloutCache = newsDataWithCallout.slice();
    newsDataWithCalloutCache.unshift(newMarker)

    this.setData({
      markers:newsDataWithCalloutCache,
      newMarkerLatitude:e.detail.latitude,
      newMarkerLongitude:e.detail.longitude,
    });
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async markerTap(e) {
    //如果当前点击的是详细图标
    //console.log(this.data.activeKey,e.markerId);
    if(this.data.currentMarkerType==1){
    //如果当前选中的是新增 而且是99999999
    if(this.data.activeKey==0 && e.markerId=='99999999'){
      wx.navigateTo({
        url: '/pages/insertDetail/insertDetail?latitude='+this.data.newMarkerLatitude+'&longitude='+this.data.newMarkerLongitude,
      })
      return;
    }

    //修改资讯 点击气泡会跳转到修改页面
    if(this.data.activeKey==1){
      wx.navigateTo({
        url: '/pages/updateDetail/updateDetail?id='+e.markerId,
      })
      return;
    }
    //删除资讯 点击气泡会弹出确认框 是否删除？
    if(this.data.activeKey==2){
      const res = await todos.where({
        id:e.markerId
      }).get();

      let title = res.data[0].title;

      const confirmResult = await new Promise((resolve, reject) => {
        wx.showModal({
          title: '确认',
          content: '是否确定删除此好人好事？'+title,
          success: (res) => {
            if (res.confirm) {
              resolve(true);
            } else if (res.cancel) {
              resolve(false);
            }
          },
          fail: (err) => {
            reject(err);
          },
        });
      });
    
      if (confirmResult) {
        try {
          const res = await todos.where({
            id: e.markerId
          })
          .remove();
          await this.setCityGoodsCount();
          await this.setGoodsData();
          this.updateMarkers();
        } catch (err) {
          ////console.error('删除失败', err);
        }
      }
      return;
    }
    return;
    }

    //缓存当前的大图标城市id
    app.globalData.cityIndexCache = e.markerId;
    console.log('app.globalData.cityIndexCache',app.globalData.cityIndexCache)
    
    let id = e.markerId;
    //地图定位到点击的城市区域 并且气泡消失 改为自定义标记点
    // 设置新的经纬度，例如北京天安门广场的经纬度
    let newLongitude = this.data.markers[id].longitude;
    let newLatitude = this.data.markers[id].latitude;
    // 更新地图坐标为当前选中城市最新好人好事数据坐标
    const res = await todos.where({
      city: this.data.markers[id].title
    }).orderBy('id','desc').limit(1).get();
    // 更新地图中心点，启动动画
    if(res.data.length>0){
      let location = res.data[0];
      newLongitude = location.longitude;
      newLatitude = location.latitude;
      //console.log("经纬度",newLongitude,newLatitude)
    }
    this.setData({
      latitude: newLatitude,
      longitude: newLongitude,
      scale:"12"
    });
  },

  onRegionChange: function (e) {
    const { type, detail } = e;
    let currentScale = detail.scale;  
    //console.log(e)
    //console.log(currentScale)
    // 缩放结束并且缩放前后的值不相等时执行逻辑
    if (type === 'end' && currentScale !== this.data.scale) {
 
      if (currentScale > criticalScale) {
        // 显示详细图标
        this.setData({
          markers: newsDataWithCallout,
          currentMarkerType:1
        });
      } else {
        // 显示大图标
        this.setData({
          markers: cityDetail,
          currentMarkerType:0
        });
      }
    }
  },
  onLoad() {
    
  },

  async setGoodsData(){
      ////console.log("cityname",cityname)
  try {
      // 异步获取数据
      const res = await todos.get();
      newsData = res.data;
      //console.log('获取到数据', newsData);
      newsDataWithCallout = newsData.map(function(item) {
        // 在每个对象中添加 callout 属性
        item.width = '100%';
        item.height = '100%';
        item.callout = {
        content: item.title ,
        color: "#FFFFFF",
        fontSize: 16,
        borderRadius: 5,
        bgColor: "#4A90E2",
        padding: 5,
        display: 'ALWAYS'
      };
      return item;
      });
  
    } catch (error) {
      //console.error('获取数据失败', error);
    }
  },

  async setCityGoodsCount(){
    try {
      // 使用聚合操作计算每个城市的数据条数
      const result = await db.collection('newsData')
        .aggregate()
        .group({
          _id: '$city',
          count: db.command.aggregate.sum(1)
        })
        .end();

        const countArray = new Array(13).fill(0);

result.list.forEach(item => {
  if (item._id === "南京市") {
    countArray[0] = item.count;
  } else if (item._id === "无锡市") {
    countArray[1] = item.count;
  } else if (item._id === "徐州市") {
    countArray[2] = item.count;
  } else if (item._id === "常州市") {
    countArray[3] = item.count;
  } else if (item._id === "苏州市") {
    countArray[4] = item.count;
  } else if (item._id === "南通市") {
    countArray[5] = item.count;
  } else if (item._id === "连云港市") {
    countArray[6] = item.count;
  } else if (item._id === "淮安市") {
    countArray[7] = item.count;
  } else if (item._id === "盐城市") {
    countArray[8] = item.count;
  } else if (item._id === "扬州市") {
    countArray[9] = item.count;
  } else if (item._id === "镇江市") {
    countArray[10] = item.count;
  } else if (item._id === "泰州市") {
    countArray[11] = item.count;
  } else if (item._id === "宿迁市") {
    countArray[12] = item.count;
  }
});
     this.setData({
       citynum:countArray
     })
    return {
        code: 0,
        data: result.list
      };
    } catch (error) {
      //console.error(error);
      return {
        code: -1,
        message: '查询失败'
      };
    }
  },

  onReady() {
   
  },
  updateMarkers(){
    console.log('this.data.currentMarkerType',this.data.currentMarkerType)
    if(this.data.currentMarkerType==0){
      this.setData({
        markers: cityDetail,
      });
    }else if(this.data.currentMarkerType==1){
      this.setData({
        markers:newsDataWithCallout
      });
    }
  }  ,
  async onShow() {
    //设置当前每个城市的统计数据
    await this.setCityGoodsCount();
    await this.setGoodsData();
    this.updateMarkers();
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
  sidebarOnClick(){
    this.setData({
      activeKey:0
    })
  },

  sidebarOnClick1(){
    this.setData({
      activeKey:1
    })
  },

  sidebarOnClick2(){
    this.setData({
      activeKey:2
    })
  }
})