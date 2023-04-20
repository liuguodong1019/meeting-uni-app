"use strict";const e=require("../../../common/vendor.js"),a=require("../../../static/js/utils.js");if(!Array){(e.resolveComponent("nut-form-item")+e.resolveComponent("nut-button")+e.resolveComponent("nut-form"))()}Math||((()=>"../../../uni_modules/sky-nutui/components/sky-nutui/packages/__VUE/formitem/index.js")+(()=>"../../../uni_modules/sky-nutui/components/sky-nutui/packages/__VUE/button/index.js")+(()=>"../../../uni_modules/sky-nutui/components/sky-nutui/packages/__VUE/form/index.js"))();const t={__name:"UserInfo",setup(t){const o=e.reactive({name:"",mobile:"",number:"",avatarUrl:"",nickname:""}),n=e.ref(!1);function r(e){a.useGlobal.pathToBase64(e.detail.avatarUrl).then((e=>{o.avatarUrl=e})).catch((e=>{console.error(e)}))}function i(e){o.nickname=e.detail.value}function l(t){e.index.showLoading({title:"加载中"});let o={name:t.name,mobile:t.mobile,jobNumber:t.number,avatarUrl:t.avatarUrl,nickname:t.nickname},n=a.useGlobal.getCache("user");""!=n&&n.ID>0?function(t){t={...t,id:a.useGlobal.getCache("user").ID};let o={url:a.useGlobal.serverUrl+a.useGlobal.apiPath.upUser,data:t,method:"POST",success:o=>{if(e.index.hideLoading(),1!=o.data.Code)return e.index.showToast({title:o.data.Msg,icon:"error"});e.index.showToast({title:o.data.Msg,icon:"success"});let{keys:n}=Object,r=a.useGlobal.getCache("user");for(let e of n(t))r[e]=t[e];a.useGlobal.setCache({user:r}),setTimeout((function(){e.index.navigateBack({delta:1})}),500)},fail:a=>{e.index.hideLoading(),e.index.showToast({title:"服务器连接失败",icon:"error"})}};e.index.request(o)}(o):function(t){let o={url:a.useGlobal.serverUrl+a.useGlobal.apiPath.register,data:t,method:"POST",header:{"content-type":"application/x-www-form-urlencoded"},success:t=>{if(e.index.hideLoading(),1!=t.data.Code)return e.index.showToast({title:t.data.Msg,icon:"error"});e.index.showToast({title:t.data.Msg,icon:"success"});let o=JSON.parse(t.data.Data);o={...o,expiredTime:a.useGlobal.expiredTime},a.useGlobal.setCache({user:o}),clearInterval(getApp().globalData.setInterval),a.useGlobal.timerLoginStatus(),setTimeout((function(){e.index.navigateBack({delta:1})}),500)},fail:a=>{e.index.hideLoading(),e.index.showToast({title:"服务器连接失败",icon:"error"})}};a.useGlobal.getCode((a=>{o.data={...o.data,code:a},e.index.request(o)}))}(o)}return e.onLoad((()=>{let e=a.useGlobal.getCache("user");o.name=e.name,o.mobile=e.mobile,o.number=e.jobNumber})),(a,t)=>e.e({a:n.value},n.value?{b:e.n(""==o.avatarUrl?"avatar-img":""),c:o.avatarUrl,d:e.o(r),e:e.p({label:"头像",required:!0})}:{},{f:n.value},n.value?{g:e.o(i),h:o.nickname,i:e.o((e=>o.nickname=e.detail.value)),j:e.p({label:"昵称",required:!0})}:{},{k:o.name,l:e.o((e=>o.name=e.detail.value)),m:e.p({label:"姓名",prop:"name",required:!0,rules:[{required:!0,message:"请填写姓名"}]}),n:o.mobile,o:e.o((e=>o.mobile=e.detail.value)),p:e.p({label:"手机号",prop:"mobile",required:!0,rules:[{required:!0,message:"请填写手机号"}]}),q:o.number,r:e.o((e=>o.number=e.detail.value)),s:e.p({label:"工号",prop:"number",required:!0,rules:[{required:!0,message:"请填写职工号"}]}),t:e.o((e=>l(o))),v:e.p({block:!0,type:"primary"}),w:e.p({"model-value":o})})}};wx.createPage(t);
