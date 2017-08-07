
var express = require("express");
var session = require("express-session");
var router = require("./controller/router.js");
var app = express();
app.listen(4000);console.log("开启");

app.set("view engine","ejs");
app.use(express.static("./public"));
app.use(express.static("./avactor"));
app.use(express.static("./uploads"));

app.use(session({
    secret:"keyboard cat",
    resave:false,
    saveUninitialized:true
}));
//首页
app.get("/",router.showIndex);

//注册页面
app.get("/regist",router.registIndex);

//处理注册提交
app.get("/doRegist",router.doRegistIndex);

//注册进入登录成功状态
app.get("/main",router.mainIndex);

//处理退出请求
app.get("/exit",router.exitIndex);

//登录页面
app.get("/login",router.loginIndex);

//处理登录请求
app.get("/doLogin",router.doLoginIndex);

//处理发表留言
app.get("/insert",router.insertIndex);

//处理设置头像请求
app.get("/headerPic",router.headerPic);

//处理剪切头像请求
app.get("/doCut",router.doCut);

//处理上传头像请求
app.post("/doUp",router.doUp);

//处理我的说说
app.get("/myIndex",router.myIndex)

//处理所有成员列表
app.get("/allUser",router.allUser)

//处理删除个人留言
app.get("/delMy",router.delMy);
