
$(document).ready(function(){
    var myDate = new Date();
//获取当前年
    var year=myDate.getFullYear();
//获取当前月
    var month=myDate.getMonth()+1;
//获取当前日
    var date=myDate.getDate();
    var h=myDate.getHours();       //获取当前小时数(0-23)
    var m=myDate.getMinutes();     //获取当前分钟数(0-59)
    var s=myDate.getSeconds();
    var now=year+'-'+month+"-"+date+" "+h+':'+m+":"+s;

    $("#main").click(function(){
       $.ajax({
           url:"/insert",
           type:"get",
           data:{
               "uname":$("#uname").text(),
               "content":$("#content").val(),
               "time":now
           },
           success:function(result){
               if(result == "-1"){
                   alert("留言失败，请重新操作！");
               }else if(result == "1"){
                   alert("留言成功");
                   window.location.href=("/main");
               };
           }
       })
   });

//    标签页分页

//    $("#ul>li:first-child").addClass("active");
//    $("#ul>li").eq(1).addClass("active");


});