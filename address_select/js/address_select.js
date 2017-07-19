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
	this.trigger;
	
	this.index = [0,0,0];//记录选中this.data的下标
	this.code = [0,0,0];//记录选中this.code值 
	this.name = ["","",""];//记录选中this.name值
	//初始化地址控件
	this.init();
	
}
address.prototype = {
	init:function(){
		//获取地址json
		this.trigger = document.body.querySelector(this.id);
		this.initEvent();
	},
	//初始化地址选择控件，以及事件	
	initData:function(trigger){
		var _self = this;
		xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET",this.url, false); // 异步处理返回
		xmlHttp.onload = function(){
			_self.data =  JSON.parse(xmlHttp.responseText);
		};
		xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");
		xmlHttp.send();
		trigger && trigger();
	},
	initEvent:function(){
		var _self = this;
		
		function writeHtml(){
			_self.addressMask = document.createElement("div");
			_self.addressMask.className = "address_mask";
			_self.addressMask.innerHTML = "<div class='address_select slideInUp'>"+
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
			document.body.appendChild(_self.addressMask);
			//初始化地址信息
			_self.setAddressData();
			
			var cancel = _self.addressMask.querySelector(".btn_cancel");
			cancel.addEventListener("touchstart",function(){
				_self.close();
			});
			
			var confirm = _self.addressMask.querySelector(".btn_confirm");
			confirm.addEventListener("touchstart",function(){
				_self.finish();
			});
			//省市区 操作
			var province = _self.addressMask.querySelector(".address_province");
			var city = _self.addressMask.querySelector(".address_city");
			var county = _self.addressMask.querySelector(".address_county");
			
			province.addEventListener("touchstart",touchStart);
			city.addEventListener("touchstart",touchStart);
			county.addEventListener("touchstart",touchStart);
			province.addEventListener("touchmove",touchMove);
			city.addEventListener("touchmove",touchMove);
			county.addEventListener("touchmove",touchMove);
			province.addEventListener("touchend",touchEnd);
			city.addEventListener("touchend",touchEnd);
			county.addEventListener("touchend",touchEnd);
		}
		
		function touchStart(e){
			e.preventDefault();
			for(var b = e.target;;){
				if(b.classList.contains("gear")) break;
				b = b.parentElement;
			}
			b["old_" + b.id] = e.targetTouches[0].screenY;//记录手指触摸的初始位置 
			b["o_t_" + b.id] = (new Date).getTime();//记录手指开始触摸的时间
			var currentTop = b.getAttribute("top");//获取当前高度
			if(currentTop){//记录当前高度
				b["o_d_" + b.id] = parseFloat(currentTop.replace(/px/g, ""));
			}else{
				b["o_d_" + b.id] = 0;
			}
		}
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
		}
		function touchEnd(e){
			e.preventDefault();
			for(var b = e.target;;){
				if(b.classList.contains("gear")) break;
				b = b.parentElement;
			}
			//滑动结束时，计算单位毫秒（ms）内，手指滑动的距离
			var speed = (b["new_" + b.id] - b["old_" + b.id]) / (b["n_t_" + b.id] - b["o_t_" + b.id]);
			b["spd_" + b.id] = speed;
	
			var pos = Math.round(b["pos_" + b.id]/35)*35;
			//pos大于0,说明到了最上面。强制显示第一条数据。flag做标识
			pos > 0 && (pos = 0, flag = !0);
			var gearMax = (b.dataset.len - 1) * 35;//35表示css高度
			//pos小于最大值，说明到了最下面。强制显示最后一条数据。flag做标识
			gearMax < Math.abs(pos) && (pos = -gearMax, flag = !0);
			
			b["pos_" + b.id] = pos;
			b.style["-webkit-transform"] = "translate3d(0," + pos + "px,0)";
			b.setAttribute("top", pos + "px");
			
			if(b.classList.contains("address_province")){
				_self.index[0] = Math.abs(pos/35);
				_self.index[1] = 0;
				_self.index[2] = 0;
				var city = _self.addressMask.querySelector(".address_city");
				city.style["-webkit-transform"] = "translate3d(0,0,0)";
				var county = _self.addressMask.querySelector(".address_county");
				county.style["-webkit-transform"] = "translate3d(0,0,0)";
			}else if(b.classList.contains("address_city")){
				_self.index[1] = Math.abs(pos/35);
				_self.index[2] = 0;
				var county = _self.addressMask.querySelector(".address_county");
				county.style["-webkit-transform"] = "translate3d(0,0,0)";
			}else if(b.classList.contains("address_county")){
				_self.index[2] = Math.abs(pos/35);
			} 
			_self.setAddressData();
		}
		
		_self.initData(function(){
			_self.trigger.addEventListener("click",writeHtml);
		});
	},
	setAddressData:function(){
		var _self = this,h="";
		provinceIndex = _self.index[0];
		cityIndex = _self.index[1];
		countyIndex = _self.index[2];
		for(var i = 0 ; i < _self.data.length ;i++){
			h += "<div class='tooth' ref='"+_self.data[i].code+"'>"+_self.data[i].name+"</div>";
		}
		var province = _self.addressMask.querySelector(".address_province");
		//记录省长度		
		province.setAttribute("data-len",_self.data.length);
		//默认位置
		province.style["-webkit-transform"] = "translate3d(0,"+(-_self.index[0]*35)+"px,0)";
		province.innerHTML = h;
		
		h = "";
		for(var j = 0 ; j < _self.data[provinceIndex]["child_code"].length ; j++){
			var second = _self.data[provinceIndex]["child_code"][j];
			h += "<div class='tooth' ref='"+second.code+"'>"+second.name+"</div>";
		}
		var city = _self.addressMask.querySelector(".address_city");
		//记录城市长度
		city.setAttribute("data-len",_self.data[provinceIndex]["child_code"].length);
		//默认位置
		city.style["-webkit-transform"] = "translate3d(0,"+(-_self.index[1]*35)+"px,0)";
		city.innerHTML = h;
		
		h = "";
		var countyTemp = _self.data[provinceIndex]["child_code"][cityIndex];
		var county = _self.addressMask.querySelector(".address_county");
		//默认位置
		county.style["-webkit-transform"] = "translate3d(0,"+(-_self.index[2]*35)+"px,0)";
		if(countyTemp){
			for(var m = 0 ; m < countyTemp["child_code"].length ; m++){
				var thrid = countyTemp["child_code"][m];
				h += "<div class='tooth' ref='"+thrid.code+"'>"+thrid.name+"</div>";
			}
			//记录乡镇长度
			county.setAttribute("data-len",countyTemp["child_code"].length);
			county.innerHTML = h;
		}else{
			county.innerHTML = "";
		}
		
	},
	finish:function(){
		var _self = this;
		//当前省
		_self.code[0] = _self.data[_self.index[0]].code;
		_self.name[0] = _self.data[_self.index[0]].name;
		
		//当前城市
		if(_self.data[_self.index[0]]["child_code"].length > 0){
			_self.code[1] = _self.data[_self.index[0]]["child_code"][_self.index[1]].code;
			_self.name[1] = _self.data[_self.index[0]]["child_code"][_self.index[1]].name;
		}else{
			_self.code[1] = 0;
			_self.name[1] = "";
		}

		if(_self.data[_self.index[0]]["child_code"].length > 0 && _self.data[_self.index[0]]["child_code"][_self.index[1]]["child_code"].length > 0){
			//当前乡镇
			_self.code[2] = _self.data[_self.index[0]]["child_code"][_self.index[1]]["child_code"][_self.index[2]].code;
			_self.name[2] = _self.data[_self.index[0]]["child_code"][_self.index[1]]["child_code"][_self.index[2]].name;
		}else{
			_self.code[2] = 0;
			_self.name[2] = "";
		}

		_self.trigger.value = _self.name.toString().replace(/,/g," ");
		console.log("code:"+_self.code.toString());
		console.log("name:"+_self.name.toString());
		document.body.removeChild(this.addressMask);
	},
	close:function(){
		var _self = this;
		document.body.removeChild(this.addressMask);
	}
}

new address({
	url:"../address_select/db/address.json",
	id:"#input_address"
});