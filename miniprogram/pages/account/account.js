const db = wx.cloud.database();
const todos = db.collection("usersData");

Page({

  /**
   * 页面的初始数据
   */
  data: { 
      activeKey: 0, 
      adminArr:[],
      account:"",
      password:"",
      passwordConfirm:"",
      passwordConfirm2:"",
      errorMessage:"",
      currentUser:""
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
  },
  onLoad(options) {

  },

  async sign(){
    const history =await todos.where({
      username:this.data.account
    }).get();

    if(history.data.length>0){
      this.setData({
        errorMessage:"该用户名已经被使用！"
      })
      return;
    }

    if(this.data.password!==this.data.passwordConfirm){
      this.setData({
        errorMessage:"两次输入的密码不一致！"
      })
      return;
    }
    const dataToInsert = {
      username: this.data.account,
      password: this.data.password
    };
    
    // 插入数据
    const add = await todos.add({
      data: dataToInsert,
    })
      .then(res => {
        //console.log("插入成功", res);
      })
      .catch(err => {
        //console.error("插入失败", err);
      });

    const res = await todos.get();
     
    this.setData({
      activeKey:0,
      adminArr:res.data
    })
  },
  onAccountInput(e){
    this.setData({
      account: e.detail.value
    });
  },
  onPasswordInput(e){
    this.setData({
      password: e.detail.value
    });
  },
  onPasswordConfirm(e){
    this.setData({
      passwordConfirm: e.detail.value
    });
  },
  onPasswordConfirm2(e){
    this.setData({
      passwordConfirm2: e.detail.value
    });
  },
  async deleteUser(e){
    const confirmResult = await new Promise((resolve, reject) => {
      wx.showModal({
        title: '确认',
        content: '是否确定执行此操作？',
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
          username: e.currentTarget.dataset.username,
        })
        .remove();
      } catch (err) {
        //console.error('删除失败', err);
      }
    }

    const res = await todos.get();
    this.setData({
      adminArr:res.data
    });
  },

  async changePassword(){
    if(this.data.passwordConfirm.trim()==''){
      this.setData({
        errorMessage:"新密码不可为空！"
      });
      return;
    }

    if(this.data.passwordConfirm!==this.data.passwordConfirm2){
      this.setData({
        errorMessage:"两次输入的密码不一致！"
      });
      return;
    }

    const res = await todos.where({
       username:this.data.currentUser
    }).get();

    if(res.data[0].password!==this.data.password){
      this.setData({
        errorMessage:"密码错误！"
      });
      return;
    }

    const res2 = await todos.where({
      username:this.data.currentUser
    }).update({
      data: {
        password:this.data.passwordConfirm,
      },
    });

    wx.showToast({
      title: '修改成功！',
    })
    
    this.setData({
      activeKey:1
    });
  },

  onReady() {

  },

  async onShow() {
    const app = getApp();
    const res = await todos.get();
    this.setData({
      adminArr:res.data,
      currentUser:app.globalData.currentUser
    }); 
  
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