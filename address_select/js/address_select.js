/*
 * address_select地址选择控件
 * 作者：吕扬
 * 邮箱：626183528@qq.com
 * 创建于：2016-08-01
 */
var address = function(params) {
	this.url = params.url;
	this.id=params.id;
	this.data;
	this.index = 0;
	
	this.init();
}
address.prototype = {
	init:function(){
		//获取地址json
		this.initData();
		//添加弹出事件
		var trigger = document.querySelector(this.id);
		if(trigger){
			trigger.addEventListener("click",this.showAddress);
		}
	},
	initData:function(){
		var _self = this;
		xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET",this.url, false); // 异步处理返回
		xmlHttp.onload = function(){
			_self.data =  JSON.parse(xmlHttp.responseText);
		};
		xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");
		xmlHttp.send();
	},
	showAddress:function(){
		console.log("show");
	},
	touchStart:function(){
		
	},
	touchMove:function(){
		
	},
	touchEnd:function(){
		
	},
	refresh:function(){
		
	},
	finish:function(){
		
	},
	close:function(){
		
	}
}

new address({
	url:"../address_select/db/address.json",
	id:"#input-address"
});