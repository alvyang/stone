var config = {
	img:[
		"img/1.jpg",
		"img/2.jpg",
		"img/3.jpg",
		"img/4.jpg",
		"img/5.jpg",
		"img/6.jpg",
		"img/7.jpg",
		"img/8.jpg",
		"img/9.jpg",
		"img/10.jpg",
		"img/11.png",
		"img/12.png",
		"img/13.png",
		"img/14.png",
		"img/15.png",
		"img/16.png",
		"img/17.png",
		"img/18.png",
		"img/19.png",
		"img/20.png",
		"img/21.png",
		"img/22.png",
		"img/23.png",
		"img/24.png",
		"img/25.png",
		"img/26.png",
		"img/27.png",
		"img/28.png",
		"img/29.png",
		"img/30.png",
		"img/31.png",
		"img/32.png",
		"img/33.png",
		"img/34.png",
		"img/35.png",
		"img/36.png",
		"img/37.png",
		"img/38.png",
		"img/39.png",
		"img/40.png",
		"img/41.png",
		"img/42.png",
		"img/43.png",
		"img/44.png",
		"img/45.png",
		"img/46.png",
		"img/47.png",
		"img/48.png",
		"img/49.png",
		"img/50.png",
		"img/51.png",
		"img/52.png",
		"img/43.png",
		"img/54.png",
		"img/55.png",
		"img/56.png",
		"img/57.png",
		"img/58.png",
		"img/59.png",
		"img/60.png",
		"img/61.png",
		"img/62.png",
		"img/63.png",
		"img/64.png",
		"img/65.png",
		"img/66.png",
		"img/67.png"
	],
	loading_bg:{
		backgroundColor:"red"
	},
	loading_img:{
		width:"200px",
		height:"50px",
		backgroundColor:"green",
		type:1 //0表示图片 , 1表示为进度条
	},
	loaing_percent:{
		fontSize: "20px"
	}
}

var loading = function(){
	self = this;	
	
	self.alpha = 1;//loading_bg的透明度
	self.animateid = 0;
	
	//获取浏览器页面可见高度和宽度
	self._PageHeight = document.documentElement.clientHeight;
	self._PageWidth = document.documentElement.clientWidth;
	
	self._loadingHtml = '<div id="loading_bg" style="width:100%;"><div id="loading_img" style="position: absolute;" ></div><p id="loading_percent" style="position: absolute;text-align: center;width:100%;" >0</p></div>';
	document.write(self._loadingHtml);

	window.requestAnimFrame=function(){
		return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,1000/60)}
	}();
	window.cancelAnimFrame=function(){
		return window.CancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||window.oCancelAnimationFrame||window.msCancelAnimationFrame
	}();
	
	self.init = function (c){
		self.currentNum = 0 ;
		self.total = config.img.length;
		self.initStyle();
		self.loadImg();
	}
		
	self.initStyle = function(){
		var bg = document.getElementById("loading_bg");
		var img = document.getElementById("loading_img");
		var percent = document.getElementById("loading_percent");

		for(var i in config.loading_bg){
			bg.style[i] = config.loading_bg[i];
		}
		for(var i in config.loading_img){
			if(config.loading_img.type == 0 || i != "width"){
				img.style[i] = config.loading_img[i];
			}
		}
		for(var i in config.loading_percent){
			percent.style[i] = config.loading_percent[i];
		}
		//根据大小设置div position
		bg.style.height = self._PageHeight+"px";
		
		//计算loading框距离顶部和左部的距离（loading框的宽度为215px，高度为61px）
		var w = parseInt(config.loading_img.width.substring(0,config.loading_img.width.length - 2)),
			h = parseInt(config.loading_img.height.substring(0,config.loading_img.height.length - 2));
		var loadingTop = self._PageHeight > h ? (self._PageHeight - h - 120) / 2 : 0;
		var loadingLeft = self._PageWidth > w ? (self._PageWidth - w) / 2 : 0;
		img.style.top = loadingTop + "px";
		img.style.left = loadingLeft + "px";
		percent.style.top = loadingTop + h/2 + 20 + "px";
	}
	self.complate = function(){
		self.alpha = Math.round((self.alpha - 0.01)*100)/100 ;
		var bg = document.getElementById("loading_bg");
		bg.style.opacity = self.alpha;
		self.animateid = requestAnimFrame(self.complate);
		if(self.alpha == 0){
			cancelAnimFrame(self.animateid);
			alert("加载完毕");
		}
	}
}
loading.prototype.loadImg = function(){
	for(var i = 0 ; i < config.img.length ; i++){
		var image = new Image();
        image.onload = function(){ self.progress();};
        image.onerror = function(){ self.progress();};
        image.src = config.img[i];
	}
}
loading.prototype.progress = function(){
	self.currentNum ++;
	self.percent = self.currentNum / self.total;
	self.percent = self.percent > 1 ? 1 : Math.round(self.percent*100);
	if(config.loading_img.type == 1){
		var w = config.loading_img.width;
		document.getElementById("loading_img").style.width = parseInt(w.substring(0,w.length - 2)) * self.percent/100 + "px"; 
	}
	document.getElementById("loading_percent").innerHTML = self.percent + "%";
	if(self.percent == 100 && document.readyState == "complete"){
		self.complate();
	}
}
new loading().init();