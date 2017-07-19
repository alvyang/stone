/* 
 * 整理平时项目中，用到的共用方法，多了以后，再整理成util
 */
function toDecimal2(x) {
	if(x == ''){
		return '0.00';
	}
	var f = parseFloat(x);    
	if (isNaN(f)) {    
		return false;    
	}    
	var f = Math.round(x*100)/100;    
	var s = f.toString();    
	var rs = s.indexOf('.');    
	if (rs < 0) {    
		rs = s.length;    
		s += '.';    
	}    
	while (s.length <= rs + 2) {    
		s += '0';    
	}    
	return s;    
}