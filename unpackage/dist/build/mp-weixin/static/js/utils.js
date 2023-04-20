const useGlobal = {
	serverUrl: "https://meet.lgdzmj.top",
	// serverUrl: "http://192.168.0.108:8082",
	apiPath: {
		//获取用户在微信的唯一标识
		wxLogin: "/wx_login",
		//用户注册，绑定微信唯一标识openid
		register : "/register",
		//获取会议室列表
		getMeet : "/meeting",
		//预定会议室
		makeMeet : "/make_meeting",
		//获取已经预约的会议室记录列表
		getMakeMeetList : "/get_make_meet",
		//上传图片
		createMakeMeetImg : "/upload_img",
		//获取上传会议室预约结束后拍的照片
		meet_img : "/meet_img",
		//预约的会议室审核通过
		passed : "/passed",
		//预约的会议室审核不通过
		refuse : "/refuse",
		//更新用户信息
		upUser : "/upUser",
		//意见反馈
		feedback : "/feedback",
		//获取指定会议室已经预约的还未结束的会议
		activeMakeMeet : "/active_make_meet",
	},
	pages : {
		home : "/pages/index/index",
		register : "/pages/component/UserInfo",
	},
	expiredTime : +new Date() + 1*24*60*60*1000,
	//设置本地缓存
	setCache (obj) {
		for (let key in obj) {
			if (obj[key] != "") {
				uni.setStorageSync(key, obj[key]);
			}
		}
	},
	//获取本地缓存内容
	getCache (key) {
		return uni.getStorageSync(key);
	},
	//获取微信登录code
	getCode (callback = function () {}) {
		uni.login({
			provider: 'weixin', //使用微信登录
			success: (loginRes) => {
				return callback(loginRes.code);
			}
		})
	},
	wxLogin (callback = function () {}) {
		uni.login({
			provider: 'weixin', //使用微信登录
			success: (loginRes) => this.loginSuccess(loginRes.code,callback)
		})
	},
	loginSuccess (code,callback) {
		let requestParam = {
			url: this.serverUrl + this.apiPath.wxLogin,
			data: {
				code
			},
			success: (res) => {return callback(res.data, code)}
		};
		uni.request(requestParam);
	},
	//对登录处理
	loginHandle () {
		this.wxLogin(function (info,code) {
			if (info.Code != 1 && info.Data == "redirect") {
				uni.navigateTo({url: "../component/setting/UserInfo"});
			}else {
				let data = JSON.parse(info.Data);
				data = {...data, "expiredTime" : useGlobal.expiredTime};
				//添加本地缓存
				useGlobal.setCache({"user" : data});
				useGlobal.timerLoginStatus();
			}
		})
	},
	checkIsLogin () {
		let user = this.getCache("user");
		//如果缓存中过期时间为空或者现在时间大于或等于过期时间，说明登录状态到期了
		if (user == "" || user.expiredTime == "" || +new Date() >= user.expiredTime) {
			//清除定时器
			clearInterval(getApp().globalData.setInterval);
			//清除缓存中的用户信息
			uni.removeStorageSync('user');
			return false;
		}
		return true;
	},
	//定时器检查登录状态
	timerLoginStatus () {
		clearInterval(getApp().globalData.setInterval);
		let timer = setInterval(function () {
			console.log("正在检查登录状态");
			// let user = useGlobal.getCache("user");
			// //如果缓存中过期时间为空或者现在时间大于或等于过期时间，说明登录状态到期了
			// if (user == "" || user.expiredTime == "" || +new Date() >= user.expiredTime) {
			// 	//清除定时器
			// 	clearInterval(timer);
			// 	//清除缓存中的用户信息
			// 	uni.removeStorageSync('user');
			// 	//重新静默登录
			// 	useGlobal.loginHandle();
			// }
			// useGlobal.checkIsLogin();
			if (useGlobal.checkIsLogin() == false) {
				//重新静默登录
				useGlobal.loginHandle();
			}
		},3000);
		getApp().globalData.setInterval = timer;
	},
	//获取当前日期，格式：年-月-日
	getDate (type = '',time = '') {
		let date = new Date();
		if (time != '') {
			date = new Date(time);
		}
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		
		if (type === 'end') {
			year = year + 1;
		}
		// if (type === 'start') {
		// 	year = year - 60;
		// } else if (type === 'end') {
		// 	year = year + 1;
		// }
		month = month > 9 ? month : '0' + month;
		day = day > 9 ? day : '0' + day;
		return `${year}-${month}-${day}`;
	},
	//获取当前时间，格式：时:分
	getTime(time = '') {
		let date = new Date();
		if (time != '') {
			date = new Date(time);
		}
		let hours = date.getHours();
		let minutes = date.getMinutes();
		hours = hours > 9 ? hours : '0' + hours;
		minutes = minutes > 9 ? minutes : '0' + minutes;
		return `${hours}:${minutes}`;
	},
	//获取任意时候的时间(例如：2023-03-22， -5 ，，，，意思就是22日往前推五天)
	getAnyDate(date, AddDayCount = 0) {
		if (!date) {
			date = new Date()
		}
		if (typeof date !== 'object') {
			date = date.replace(/-/g, '/')
		}
		const dd = new Date(date)
	
		dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
	
		const y = dd.getFullYear()
		const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
		const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
		return {
			fullDate: y + '-' + m + '-' + d,
			year: y,
			month: m,
			date: d,
			day: dd.getDay()
		}
	},
	//会议室预约时间处理
	handleMakeMeetTime (startTime, endTime) {
		let hd = this.getDate('',startTime),
		s = this.getTime(startTime),
		e = this.getTime(endTime);
		return hd + ' ' + s + ' ~ ' + e;
	},
	//获取会议室列表
	getMeetList (callback = '') {
		uni.showLoading({
			title: '加载中'
		});
		let requestParam = {
			url: this.serverUrl + this.apiPath.getMeet,
			success: (res) => {
				uni.hideLoading();
				if (res.data.Code == 2) {
					uni.showToast({"title" : res.data.Msg, "icon" : "error"});
					return
				}
				useGlobal.setCache({"meetList" : res.data.Data});
				if (callback != '') {
					return callback(res.data.Data);
				}
			},
			fail (resInfo) {
				uni.hideLoading();
				uni.showToast({"title" : "服务器连接失败", "icon" : "error"});
			},
		};
		uni.request(requestParam);
	},
	//将微信返的临时图片转为base64格式图
	pathToBase64(path) {
	    return new Promise(function(resolve, reject) {
	        if (typeof window === 'object' && 'document' in window) {
	            if (typeof FileReader === 'function') {
	                var xhr = new XMLHttpRequest()
	                xhr.open('GET', path, true)
	                xhr.responseType = 'blob'
	                xhr.onload = function() {
	                    if (this.status === 200) {
	                        let fileReader = new FileReader()
	                        fileReader.onload = function(e) {
	                            resolve(e.target.result)
	                        }
	                        fileReader.onerror = reject
	                        fileReader.readAsDataURL(this.response)
	                    }
	                }
	                xhr.onerror = reject
	                xhr.send()
	                return
	            }
	            var canvas = document.createElement('canvas')
	            var c2x = canvas.getContext('2d')
	            var img = new Image
	            img.onload = function() {
	                canvas.width = img.width
	                canvas.height = img.height
	                c2x.drawImage(img, 0, 0)
	                resolve(canvas.toDataURL())
	                canvas.height = canvas.width = 0
	            }
	            img.onerror = reject
	            img.src = path
	            return
	        }
	        if (typeof plus === 'object') {
	            plus.io.resolveLocalFileSystemURL(getLocalFilePath(path), function(entry) {
	                entry.file(function(file) {
	                    var fileReader = new plus.io.FileReader()
	                    fileReader.onload = function(data) {
	                        resolve(data.target.result)
	                    }
	                    fileReader.onerror = function(error) {
	                        reject(error)
	                    }
	                    fileReader.readAsDataURL(file)
	                }, function(error) {
	                    reject(error)
	                })
	            }, function(error) {
	                reject(error)
	            })
	            return
	        }
	        if (typeof wx === 'object' && wx.canIUse('getFileSystemManager')) {
	            wx.getFileSystemManager().readFile({
	                filePath: path,
	                encoding: 'base64',
	                success: function(res) {
	                    resolve('data:image/png;base64,' + res.data)
	                },
	                fail: function(error) {
	                    reject(error)
	                }
	            })
	            return
	        }
	        reject(new Error('not support'))
	    })
	},
}
export {
	useGlobal as utils,
}