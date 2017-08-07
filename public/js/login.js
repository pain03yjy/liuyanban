
$("document").ready(function(){
    $("#login").click(function(){
        $.ajax({
            url:"/doLogin",
            type:"get",
            data:{
                "uname":$("#inputName").val(),
                "pwd":$("#inputPassword").val()
            },
            success:function(result){
                if(result == "0"){
                    $(".error span").html("用户名不存在")
                    $(".error").css({"display":"block"})
                    $(".error").css({"top":"27px"})
                }else if(result == "-1" ){
                    $(".error span").html("密码错误")
                    $(".error").css({"display":"block"})
                    $(".error").css({"top":"95px"})
                }else if(result == "1"){
                    alert("登录成功");
                    window.location.href=("/main")
                };
            }
        })
    });
});