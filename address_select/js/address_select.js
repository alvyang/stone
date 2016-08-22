/*
 * address_select地址选择控件
 * 作者：吕扬
 * 邮箱：626183528@qq.com
 * 创建于：2016-08-01
 */
var address = function(params) {
	this.url = params.url;//数据请求的URL
	this.id=params.id;//触发弹出地址选择的input  id
	this.data;//返回的地址数据
	this.addressMask;//地址选择dom
	
	this.index = 0;
	//初始化地址控件
	this.init();
}
address.prototype = {
	init:function(){
		//获取地址json
		this.initData();
		//初始化地址选择控件，以及事件		
		this.initEvent();
		
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
	initEvent:function(){
		var _self = this;
		self.addressMask = document.createElement("div");
		self.addressMask.className = "address_mask";
		self.addressMask.innerHTML = "<div class='address_select'>"+
										 "<div class='address_btn_box'>"+
											 "<div class='btn_cancel'>取消</div>"+
											 "<div class='btn_confirm'>确定</div>"+
										 "</div>"+
									 	"<div class='address_roll'>"+
											 "<div>"+
											 	"<div class='address_province'></div>"+
											 "</div>"+
											 "<div>"+
											 	"<div class='address_city'></div>"+
											 "</div>"+
											 "<div>"+
											 	"<div class='address_county'></div>"+
											 "</div>"+
										 "</div>"+
									 "</div>";
		document.body.appendChild(self.addressMask);
		//初始化地址信息
		_self.setAddressData();
		
		var cancel = self.addressMask.querySelector(".btn_cancel");
		cancel.addEventListener("touchstart",function(){
			_self.close();
		});
		
		var confirm = self.addressMask.querySelector(".btn_confirm");
		confirm.addEventListener("touchstart",function(){
			_self.finish();
		});
		//省市区 操作
		var province = self.addressMask.querySelector(".address_province");
		var city = self.addressMask.querySelector(".address_city");
		var county = self.addressMask.querySelector(".address_county");
		province.addEventListener("touchstart",_self.touchStart);
		city.addEventListener("touchstart",_self.touchStart);
		county.addEventListener("touchstart",_self.touchStart);
		province.addEventListener("touchmove",_self.touchMove);
		city.addEventListener("touchmove",_self.touchMove);
		county.addEventListener("touchmove",_self.touchMove);
		province.addEventListener("touchend",_self.touchEnd);
		city.addEventListener("touchend",_self.touchEnd);
		county.addEventListener("touchend",_self.touchEnd);
	},
	touchStart:function(){
		
	},
	touchMove:function(){
		
	},
	touchEnd:function(){
		
	},
	setAddressData:function(){
		console.log(this.data);
		var _self = this,h;
		for(var i = 0 ; i < _self.data.length ;i++){
			h += "<div ref='"+_self.data[i].code+"'>"+_self.data[i].name+"</div>";
		}
	},
	finish:function(){
		console.log("finish");
	},
	close:function(a){
		console.log("close");
	}
}

new address({
	url:"../address_select/db/address.json",
	id:"#input-address"
});