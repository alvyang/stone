/*
 * address_select地址选择控件
 * 
 * 作者：吕扬
 * 
 * 邮箱：626183528@qq.com
 * 
 * 创建于：2016-08-01
 */
var address = function(params) {
	this.url = params.url;
	this.data = 1;
	this.index = 0;
	
	this.init();
}
address.prototype = {
	init:function(){
		//获取地址json
		this.getData();
		
		
		
	},
	getData:function(){
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
	url:"../address_select/db/address.json"
});