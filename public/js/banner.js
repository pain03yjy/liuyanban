/*
* @Author: Administrator
* @Date:   2017-05-26 10:43:12
* @Last Modified by:   Administrator
* @Last Modified time: 2017-06-15 19:10:39
*/
$(document).ready(function(){
	var num = 1;
	var count = $(".banner_img img").length;console.log(count);

	//圆点
	function points(index){
		$(".banner ul li").eq(index).addClass("current").siblings('li').removeClass('current');
			// console.log(index);
	}

	//文字
	function wenzi(index){
		$(".down_txt p").eq(index).show().siblings('p').hide()
	}

	//右按键
	$(".right_btn").click(function(){
		if(num == count){
			$(".banner_img img").eq(0).show().siblings('img').hide();
			num=1
		}else{
			$(".banner_img img").eq(num).show().siblings("img").hide();
		num++
		console.log(num);

	};
	points(num-1);
	wenzi(num-1);
	});

	//左按键
	$(".left_btn").click(function(){
		if(num == 1){
			$(".banner_img img").eq(count-1).show().siblings('img').hide();
			num=count
		}else{
			$(".banner_img img").eq(num-2).show().siblings("img").hide();
		num--
		console.log(num);
	};
	points(num-1);
	wenzi(num-1);
	});

	//鼠标经过
	$(".banner ul li").mouseover(function(){
		var i = $(this).index();console.log(i);
		$('.banner_img img').eq(i).show().siblings("img").hide();
		points(i)
		wenzi(i);
		num= i+1
	});

	//鼠标点击
	$(".banner ul li").click(function(){
		var i = $(this).index();console.log(i);
		$('.banner_img img').eq(i).show().siblings("img").hide();
		points(i)
		wenzi(i);
		num= i+1
	});

	//自动轮播，鼠标移入禁止，
	var t = setInterval('$(".right_btn").click()',3000);
	$(".banner").mouseover(function(){
		clearInterval(t)
	}).mouseout(function(){
		t = setInterval('$(".right_btn").click()',3000);
	});


})
