/**
 * 此工具用户定义背景图片随屏幕大小自动缩放功能
 */
(function(){
	
	var zoom = function(id,w,h){
		self = this;
		self.id = id || "scale";
		self.width = w || 750;
		self.height = h || 1200;
		return zoom.fn.init();
	}
	
	zoom.fn = zoom.prototype = {
		init:function(){
			//此处写返回DOM元素对象
			return this;
		},
		//输入标签id，将该div设置成div手机设备大小
		adaptWindiw:function(){
			var pDiv = document.getElementById(self.id);
			//获取屏幕宽高
			var cHeight = document.documentElement.clientHeight;
			var cWidth = document.documentElement.clientWidth;
			pDiv.style.width = cWidth;
			pDiv.style.height = cHeight;
			
		},
		//计算等比缩放比例，取较小的值
		getMinScale:function(){
			//获取屏幕宽高
			var cWidth = document.documentElement.clientWidth;
			var cHeight = document.documentElement.clientHeight;
			var sc=1 , scaleX = (cWidth / self.width).toFixed(6) ,scaleY = (cHeight / self.height).toFixed(6);
			sc = cWidth/cHeight > self.width/self.height ? scaleY : scaleX; 
			return sc;
		},
		//计算等比缩放比例，取较小的值
		getMaxScale:function(){
			//获取屏幕宽高
			var cWidth = document.documentElement.clientWidth;
			var cHeight = document.documentElement.clientHeight;
			var sc=1 , scaleX = (cWidth / self.width).toFixed(6) ,scaleY = (cHeight / self.height).toFixed(6);
			sc = cWidth/cHeight > self.width/self.height ? scaleX : scaleY;
			return sc;
		},
		//适应手机屏幕，并设置div的left值或者top值适应。会导致上下留白或左右留白
		adaptMin:function(){
			var zoomDiv = document.getElementById(self.id);
			//获取屏幕宽高
			var cWidth = document.documentElement.clientWidth;
			var cHeight = document.documentElement.clientHeight;
			//计算等比缩放比例
			var scale = this.getMinScale();
			
			//设置div等比例缩放
			zoomDiv.style.webkitTransform="matrix("+scale+",0,0,"+scale+",0,0)";
			//设置left或top将等比缩放的div放到屏幕中间
			cWidth/cHeight > self.width/self.height? (
				zoomDiv.style.left = (cWidth-self.width*scale)/2+"px",
				zoomDiv.style.top = "0px"
			) : (
				zoomDiv.style.left = "0px",
				zoomDiv.style.top = (cHeight-self.height*scale)/2+"px"
			);
		},
		adaptMax:function(){
			var zoomDiv = document.getElementById(self.id);
			//获取屏幕宽高
			var cWidth = document.documentElement.clientWidth;
			var cHeight = document.documentElement.clientHeight;
			//计算等比缩放比例
			var scale = this.getMaxScale();
			
			//设置div等比例缩放
			zoomDiv.style.webkitTransform="matrix("+scale+",0,0,"+scale+",0,0)";
			//对div进行裁剪
			cWidth/cHeight > self.width/self.height? (
				zoomDiv.style.left = "0px",
				zoomDiv.style.top = (cHeight-self.height*scale)/2+"px"
			) : (
				zoomDiv.style.left = (cWidth-self.width*scale)/2+"px",
				zoomDiv.style.top = "0px"
			);
			zoomDiv.parentNode.style.height = cHeight + "px";
			zoomDiv.parentNode.style.width = cWidth + "px";
			zoomDiv.parentNode.style.overflow = "hidden";
		}
	}
	zoom.fn.init.prototype = zoom.fn;
	
	window.zoom = zoom;
})();