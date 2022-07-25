var col0={r:85,g:51,b:221};

function RGBtoHSV(col){
	var max=Math.max(col.r,col.g,col.b);
	var min=Math.min(col.r,col.g,col.b);
	var h=0;
	if(col.r==col.g&&col.g==col.b){
		h=0;
	}else if(col.r==max){
		h= 60*((col.g-col.b)/(max-min));
	}else if(col.g==max){
		h= 60*((col.b-col.r)/(max-min))+120;
	}else{
		h= 60*((col.r-col.g)/(max-min))+240;
	}
	if(h<0){
		h+=360;
	}
	if(h>360){
		h-=360;
	}
	var s=255*(max-min)/max;
	var v=max;
	var hsv={h:h,s:s,v:v};
	return hsv
}

function HSVtoRGB(col){
	var max=col.v;
	var min=max-((col.s/255)*max);
	var r=0;
	var g=0;
	var b=0;
	if(col.h<=60){
		r=max;
		g=(col.h/60)*(max-min)+min;
		b=min;
	}else if(col.h<=120){
		r=((120-col.h)/60)*(max-min)+min;
		g=max;
		b=min;
	}else if(col.h<=180){
		r=min;
		g=max;
		b=((col.h-120)/60)*(max-min)+min;
	}else if(col.h<=240){
		r=min;
		g=((240-col.h)/60)*(max-min)+min;
		b=max;
	}else if(col.h<=300){
		r=((col.h-240)/60)*(max-min)+min;
		g=min
		b=max;
	}else{
		r=max;
		g=min;
		b=((360-col.h)/60)*(max-min)+min;
	}
	r=Math.min(r,360);
	g=Math.min(g,360);
	b=Math.min(b,360);
	r=Math.max(r,0);
	g=Math.max(g,0);
	b=Math.max(b,0);
	var rgb={r:r,g:g,b:b};
	return rgb
}

function genColor(col,d){
	var hsv=RGBtoHSV(col);
	hsv.h=hsv.h+d;
	if(hsv.h<0){
		hsv.h+=360;
	}
	if(hsv.h>360){
		hsv.h-=360;
	}
	return HSVtoRGB(hsv);
}

console.log("COLORS");
var col1=genColor(col0,0);
console.log(col1);
var col2=genColor(col0,30);
console.log(col2);
var col3=genColor(col0,90);
console.log(col3);
var col4=genColor(col0,120);
console.log(col4);
var col5=genColor(col0,180);
console.log(col5);
var col6=genColor(col0,210);
console.log(col6);
var col7=genColor(col0,270);
console.log(col7);
var col8=genColor(col0,300);
console.log(col8);
var col9={r:221,g:221,b:221};
var col10={r:34,g:34,b:34};

function convColor(col,per){
	var hsv=RGBtoHSV(col);
	if(hsv.h==0){
		if(hsv.v>127){
			hsv.v+=per*(255-hsv.v)/100;
		}else{
			hsv.v+=per*hsv.v/100;
		}
	}else{
		if(per>0){
			hsv.v+=per*(255-hsv.v)/100;
			hsv.s-=per*hsv.s/100;
		}else{
			hsv.v+=per*hsv.v/100;
			hsv.s-=per*(255-hsv.s)/100;	
		}
	}
	return HSVtoRGB(hsv);
}

function textColor(col){
	return col.r+","+col.g+","+col.b
}

function toHex(col){
	var r=("00"+col.r.toString(16)).slice(-2);
	var g=("00"+col.g.toString(16)).slice(-2);
	var b=("00"+col.b.toString(16)).slice(-2);
	return "#"+r+g+b
}

$(".box").each(function(i, elem) {
	switch($(elem).parent().attr("data-h")){
		case "1":
			var col=col1;
			break;
		case "2":
			var col=col2;
			break;
		case "3":
			var col=col3;
			break;
		case "4":
			var col=col4;
			break;
		case "5":
			var col=col5;
			break;
		case "6":
			var col=col6;
			break;
		case "7":
			var col=col7;
			break;
		case "8":
			var col=col8;
			break;
		case "9":
			var col=col9;
			break;
		case "10":
			var col=col10;
			break;
		default:
			console.log("error");
	}
	var rowRGB=convColor(col,$(elem).attr("data-v"));
	var r=Math.trunc(rowRGB.r);
	var g=Math.trunc(rowRGB.g);
	var b=Math.trunc(rowRGB.b);
	var rgb = {r:r,g:g,b:b};
	var text1=textColor(rgb);
	var hsv=RGBtoHSV(rgb);
	var text3=toHex(rgb);
	if(hsv.v>127){
		var text2="0,0,0";
	}else{
		var text2="255,255,255";
	}
	
	$(elem).css("background-color","rgb("+text1+")");
	$(elem).css("color","rgb("+text2+")");
	$(elem).text(text3);
});