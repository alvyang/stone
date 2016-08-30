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
											 	"<div class='gear address_province'></div>"+
											 	"<div class='select_area'></div>"+
											 "</div>"+
											 "<div>"+
											 	"<div class='gear address_city'></div>"+
											 	"<div class='select_area'></div>"+
											 "</div>"+
											 "<div>"+
											 	"<div class='gear address_county'></div>"+
											 	"<div class='select_area'></div>"+
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
		province.addEventListener("touchstart",touchStart);
		city.addEventListener("touchstart",touchStart);
		county.addEventListener("touchstart",touchStart);
		province.addEventListener("touchmove",touchMove);
		city.addEventListener("touchmove",touchMove);
		county.addEventListener("touchmove",touchMove);
		province.addEventListener("touchend",touchEnd);
		city.addEventListener("touchend",touchEnd);
		county.addEventListener("touchend",touchEnd);
		
		function touchStart(e){
			e.preventDefault();
			for(var b = e.target;;){
				if(b.classList.contains("gear")) break;
				b = b.parentElement;
			}
			clearInterval(b["int_" + b.id]); 
			b["old_" + b.id] = e.targetTouches[0].screenY;//记录手指触摸的初始位置 
			b["o_t_" + b.id] = (new Date).getTime();//记录手指开始触摸的时间
			var currentTop = b.getAttribute("top");//获取当前高度
			if(currentTop){//记录当前高度
				b["o_d_" + b.id] = parseFloat(currentTop.replace(/px/g, ""));
			}else{
				b["o_d_" + b.id] = 0;
			}
		};
		function touchMove(e){
			e.preventDefault();
			for(var b = e.target;;){
				if(b.classList.contains("gear")) break;
				b = b.parentElement;
			}
			b["new_" + b.id] = e.targetTouches[0].screenY;//手指滑动的当前位置
			b["n_t_" + b.id] = (new Date).getTime();//手指滑动的当前时间
			//计算出手指滑动的距离
			var gap = b["new_" + b.id] - b["old_" + b.id];
			b["pos_" + b.id] = b["o_d_" + b.id] + gap; 
			
			b.style["-webkit-transform"] = "translate3d(0," + b["pos_" + b.id] + "px,0)";
			b.setAttribute("top", b["pos_" + b.id] + "px");
		};
		function touchEnd(e){
			e.preventDefault();
			for(var b = e.target;;){
				if(b.classList.contains("gear")) break;
				b = b.parentElement;
			}
			//滑动结束时，计算单位毫秒（ms）内，手指滑动的距离
			var speed = (b["new_" + b.id] - b["old_" + b.id]) / (b["n_t_" + b.id] - b["o_t_" + b.id]);
			
			if(Math.abs(speed) <= 0.2){//记录手指滑动的速度
				b["spd_" + b.id] = 0 > speed ? -0.08 : 0.08;
			}else if(Math.abs(speed) <= 0.5){
				b["spd_" + b.id] = 0 > speed ? -0.16 : 0.16;
			}else{
				b["spd_" + b.id] = speed / 2;
			}
			
			b["pos_" + b.id] || (b["pos_" + b.id] = 0);
			scroll(b);
		};
		function scroll(a) {
			//速度控制参数speedControl  flag用于标识是否进入刷新数据if语句
			var speedControl = 0,flag = !1;
			
			clearInterval(a["int_" + a.id]);
			a["int_" + a.id] = setInterval(function() {
				//滑动后的位置
				var pos = a["pos_" + a.id],
					//b值越大，速度越小，滚动效果，滑到最后时，速度变小。
					speed = a["spd_" + a.id] * Math.exp(-.03 * speedControl);
				if(pos += speed, Math.abs(speed) > 0.1);
				else {
					speed = 0.1;
					var f = 2 * Math.round(pos / 2);
					if(Math.abs(pos - f) < .02){
						flag = !0;
					}else if(pos > f){
						pos -= speed;
					}else{
						pos += speed;
					}
				}
				//pos大于0,说明到了最上面。强制显示第一条数据。flag做标识
				pos > 0 && (pos = 0, flag = !0);
				var gearMax = 2 * -(a.dataset.len - 1);
				//pos小于最大值，说明到了最下面。强制显示最后一条数据。flag做标识
				gearMax> pos && (pos = gearMax, flag = !0);
				if(flag) {
					var i = Math.abs(pos) / 2;
					h(a, i);
					clearInterval(a["int_" + a.id]);
				}
				a["pos_" + a.id] = pos;
				a.style["-webkit-transform"] = "translate3d(0," + pos + "px,0)";
				a.setAttribute("top", pos + "px");
				speedControl++;
			}, 30)
		};
		function h(a, b) {
			b = Math.round(b);
			a.setAttribute("val", b);
			//i.setGearTooth(3,4,2);
		}
	},
	setAddressData:function(provinceIndex,cityIndex,countyIndex){
		var _self = this,h="";
		provinceIndex = provinceIndex || 0;
		cityIndex = cityIndex || 0;
		countyIndex = countyIndex || 0;
		for(var i = 0 ; i < _self.data.length ;i++){
			h += "<div class='tooth' ref='"+_self.data[i].code+"'>"+_self.data[i].name+"</div>";
		}
		var province = self.addressMask.querySelector(".address_province");
		province.setAttribute("data-len",_self.data.length);
		province.innerHTML = h;
		
		h = "";
		for(var j = 0 ; j < _self.data[provinceIndex]["child_code"].length ; j++){
			var second = _self.data[provinceIndex]["child_code"][j];
			h += "<div class='tooth' ref='"+second.code+"'>"+second.name+"</div>";
		}
		var city = self.addressMask.querySelector(".address_city");
		city.setAttribute("data-len",_self.data[provinceIndex]["child_code"].length);
		city.innerHTML = h;
		
		h = "";
		for(var m = 0 ; m < _self.data[provinceIndex]["child_code"][cityIndex]["child_code"].length ; m++){
			var thrid = _self.data[provinceIndex]["child_code"][cityIndex]["child_code"][m];
			h += "<div class='tooth' ref='"+thrid.code+"'>"+thrid.name+"</div>";
		}
		var county = self.addressMask.querySelector(".address_county");
		county.setAttribute("data-len",_self.data[provinceIndex]["child_code"][cityIndex]["child_code"].length);
		county.innerHTML = h;
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