
var db = require("../module/db.js");
var md5 = require("../module/md5.js");
var gm = require("gm");
var fs = require("fs");
var formidable = require("formidable");
var path =require("path");
var ObjectId = require("mongodb").ObjectID;

//首页展示
exports.showIndex = function(req,res){
  res.render("index");
};

//注册页面
exports.registIndex = function(req,res){
  res.render("regist");
};

//处理注册提交
exports.doRegistIndex = function(req,res){
  var uname = req.query.uname;
  var pwd = req.query.pwd;
  //console.log(req.query);

  //    根据用户名查找用户是否已被用
  db.find("user",{"uname":uname},function(err,result){
    if(err){
      console.log(err);
      return;
    };
    if(result.length != 0){
      res.send("-1");//已有用户名

    }else{
      //    将明文转密文
      pwd = md5(pwd);
      inserObj = {"uname":uname,"pwd":pwd};
      //插入数据库
      db.insertOne("user",inserObj,function(err,result){
        if(err){
          console.log(err);
          res.send("err");
          return;
        };
        //记录登录
        req.session.username = uname;
        req.session.login = "1";
        res.send("1");
      });
    //    一注册创建默认头像在avactor
        gm("./uploads/userP/pic.jpg").crop(460,460,0,0).write("./avactor/"+uname+".jpg",function(err){
            if(err){
                console.log("剪切失败",err);
                return;
            };
            //console.log("剪切成功");
        });
    };
  });
};

//注册成功并且登录 ,登录进去界面
exports.mainIndex = function(req,res){
  var username = req.session.username;
  var login = req.session.login;
  var num = req.query.number || 1;
    //console.log(num);
  console.log(login);
  db.getAllCount("liuyanben",function(count){
    //console.log(count);
    if(username){
      db.find("liuyanben",{}, {"pageSize":3,"page":num,"sort":{"_id":-1}},function(err,result){
        if(err){
          console.log(err);
          return;
        };
        //console.log(count);
        //console.log(result);
          //res.send(result);
        var labelnum = Math.ceil(count/3);
        res.render("main",{"username":username,"arr":result,"labelnum":labelnum});
      })
    }else{
      res.redirect("/");
    }
  });
};

//处理发表留言 ，插入数据库
exports.insertIndex = function(req,res){
  //console.log(req.query);
  var uname = req.query.uname;
  var content = req.query.content;
  var time = req.query.time;
  var headp = req.query.headp;
  var insertObj = {"uname":uname,"content":content,"time":time};

  db.insertOne("liuyanben",insertObj,function(err,result){
    if(err){
      console.log(err);
      res.send("-1")
    };
    res.send("1");
  });
};

//处理退出请求
exports.exitIndex = function(req,res){
  req.session.username = "";
  req.session.login = "";
  res.redirect("/");
};

//跳转登录页面
exports.loginIndex = function(req,res){
  res.render("login");
};

//处理登录请求
exports.doLoginIndex = function(req,res){
  var uname = req.query.uname;
  var pwd = req.query.pwd;
  //console.log(req.query);
//    根据用户名查找用户是否存在
  db.find("user",{"uname":uname},function(err,result){
    if(err){
      console.log(err);
      return;
    };
    //console.log(result);
    if(result.length == 0){
      res.send("0");//用户名不存在
      return;
    };
    //    若用户存在
    var oldpwd = result[0].pwd;
    if(oldpwd == md5(pwd)){
      //    密码正确 登录成功 记录登录
      req.session.username = result[0].uname;
      req.session.login = "1";
      res.send("1");
    }else{
      res.send("-1")//密码错误
    }
  });
};

//处理设置头像请求
exports.headerPic = function(req,res){
    var uname = req.session.username;
    var pic;
    fs.readdir("./uploads/userP",function(err,data){
        if(err){
            console.log(err);
            return;
        };
        //console.log(data[1].slice(0,-4));
        //console.log(uname);
        //console.log(data.indexOf(uname+".jpg"));

        if(data.indexOf(uname+".jpg") == -1){
            pic = "pic";
        }else{
            pic = uname;
        }
        //console.log(pic);
        res.render("header_pic.ejs",{"pic":pic});
    });

};

//处理剪切头像请求
exports.doCut = function(req,res){
  var w = parseInt(req.query.w);
  var h = parseInt(req.query.h);
  var x = parseInt(req.query.x);
  var y = parseInt(req.query.y);
    var cutPic = req.query.picSrc;
    var uname = req.session.username
  //console.log(cutPic);
  //console.log(req.session.username);
//    通过gm模块进行裁剪
    if(uname){
        gm("./uploads/"+cutPic).crop(w,h,x,y).write("./avactor/"+uname+".jpg",function(err){
            if(err){
                console.log("剪切失败",err);
                res.send("-1");
                return;
            };
            res.send("1");
            //console.log("剪切成功")
        });
    }else{
            res.redirect("/");
        };
};

//处理上传头像请求
exports.doUp = function(req,res){
    var uname = req.session.username;
    if(uname){
        if(req.url == "/doUp" && req.method.toLowerCase() == "post") {
        var form = new formidable.IncomingForm();
        form.uploadDir = "./uploads";//临时存放路径
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.log(err);
                return;
            }
            ;
            //console.log(fields);
            //console.log(files);
            console.log(uname);

            //修改图片路径名字
            var oldname = files.file.path;
            var newname = "./uploads/userP/"+uname+".jpg"
            fs.rename(oldname,newname,function(err,data){
                if(err){
                    console.log(err);
                    return;
                };
            });
        })
            res.redirect("/headerPic");
    };
    }else{
        res.redirect("/");
    }
}

//处理我的说说
exports.myIndex = function(req,res){
    var uname = req.session.username;
    //console.log(uname);
    if(uname){
        db.find("liuyanben",{"uname":uname},function(err,result){
            if(err){
                console.log(err);
                return;
            };
            //console.log(result);
            res.render("myIndex",{"uname":uname,"arr":result})
        })
    }else{
        res.redirect("/")
    }
}

//处理成员列表
exports.allUser = function(req,res){
    var uname = req.session.username;
    if(uname){
        db.find("user",{},function(err,result){
            if(err){
                console.log(err);
                return;
            };
            //console.log(result);
            res.render("allUser",{"uname":uname,"arr":result})
        })
    }else{
        res.redirect("/")
    }

}

//处理删除个人留言
exports.delMy = function(req,res){
    var uname = req.session.username;
    var id = req.query.delid;
    id = ObjectId(id);
    console.log(id);
    if(uname){
        db.deleteMany("liuyanben",{"_id":id},function(err,result){
            if(err){
                console.log(err);
                res.send("-1");
                return;
            };
            res.send("1");
            //console.log(result);
        })
    }else{
        res.redirect("/")
    }
}