//index.js
//获取应用实例

var app = getApp()
var util = require('../../utils/util.js')
Page({
    vid: 0,
    danmu_text: '',
    animation: null,

    data: {
        animation: {},
        danmu_text: '弹幕'
    },
    video_ctx: wx.createVideoContext('player'),
    onLoad: function (option) {
        console.log(option)
        this.vid = option.id
        console.log(this.vid)
    },

    onReady: function () {
        var animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease'
        })
        this.animation = animation
        var that = this
        wx.request({
            url: 'https://www.hicraft.cn/api/v2/hi/topic/',
            data: { id: that.vid },
            header: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                console.log(res.data)
                that.setData({ video: res.data.data[0] })
            }
        })
    },
    danmu_blur: function (e) {
        this.danmu_text = e.detail.value
        console.log(this.danmu_text)
    },

    send_danmu: function () {
        let that = this
        console.log('send_danmu', that.danmu_text)
        this.animation.translate(0, 0).step({ duration: 10 }).translate(600, 0).step(0)
        this.setData({
            // danmu_text: that.danmu_text,
            animation: this.animation.export()
        })
    }
})
