
$(document).ready(function(){


    $("#inputName").blur(function(){
        var str = $("#inputName").val();
        var ret = /^[a-zA-Z][a-zA-Z0-9_]{5,12}$/;
        if(ret.test(str)){
            $(".error").css({"display":"none"})
            if($("#inputPassword").val() == ""){
                $(".error span").html("密码不能为空")
                $(".error").css({"display":"block"})
                $(".error").css({"top":"95px"})

                $("#regist").click(function(){
                    $.ajax({
                        url:"/doRegist",
                        type:"get",
                        data:{
                            "uname":$("#inputName").val(),
                            "pwd":$("#inputPassword").val(),
                        },
                        success:function(result){
                            if(result == "-1"){
                                $(".error span").html("用户名已存在")
                                $(".error").css({"display":"block"})
                                $(".error").css({"top":"27px"})
                                //alert("用户名已存在");
                            }else if(result == "1"){
                                alert("注册成功");
                                window.location.href=("/main")
                            };

                        }
                    })
                })
            }else{
                $(".error").css({"display":"none"})
            }
        }else{
            $(".error").css({"display":"block"})
        }
    })

})