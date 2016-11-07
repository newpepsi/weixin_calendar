//index.js
//获取应用实例

var app = getApp()
var util = require('../../utils/util.js')
Page({
    data: {    },
   onLoad: function () {
        var that = this        
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    device_width: res.windowWidth,
                    device_height: res.windowHeight,
                    pic_height: parseInt(255 * res.windowWidth / 400)
                })
            }
        })
    },
    onReady: function () {
        var that = this
        wx.request({
            url: 'https://www.hicraft.cn/api/v2/hi/topic/',
            data: { s: 10 },
            header: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                console.log(res.data)
                that.setData({ videos: res.data.data })
                console.log(that.data)
            }
        })
    }
})
