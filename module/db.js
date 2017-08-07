//这个模块里面封装了所有对数据库的常用操作
var MongoClient = require('mongodb').MongoClient;
function _connectDB(callback) {
    var url ="mongodb://localhost:27017/test2";
    //var url = settings.dburl;   //从settings文件中，都数据库地址
    //连接数据库
    MongoClient.connect(url, function (err, db) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(err, db);
    });
}

//4.插入数据
exports.insertOne = function (collectionName, json, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).insertOne(json, function (err, result) {
            callback(err, result);
            db.close(); //关闭数据库
        })
    })
};
//5 查找数据，找到所有数据。args是个对象查找4个参数，在哪个集合查，查什么，分页设置，查完之后做什么(也许没有分页设置)
exports.find = function (collectionName, json, C, D) {
    var result = [];    //结果数组
    //先判断传入的参数有几个  如何解析数据
    if (arguments.length == 3) {
        //那么参数C就是callback，参数D没有传。
        var callback = C;
        var skipnumber = 0;
        //数目限制
        var limit = 0;
    } else if (arguments.length == 4) {
        var callback = D;
        var args = C;
        //应该省略的条数(第一页5条数据则第2页就是从跳过前5=5*(2-1)条 开始查起)
                             //每页显示大小      页码
        var skipnumber = args.pageSize * (args.page-1) || 0;
        //数目限制
        var limit = args.pageSize || 0;
        //排序方式
        var sort = args.sort || {};
    } else {
        throw new Error("find函数的参数个数，必须是3个，或者4个。");
        return;
    }

    //连接数据库，连接之后查找所有
    _connectDB(function (err, db) {
        var cursor = db.collection(collectionName).find(json).skip(skipnumber).limit(limit).sort(sort);
        cursor.toArray(function(err,docs){
                if (err) {
                    callback(err, null);
                    db.close(); //关闭数据库
                    return;
                }
                result=docs;
                //遍历结束，没有更多的文档了
                callback(null, result);
                db.close(); //关闭数据库
        });
    });
}

//删除
exports.deleteMany = function (collectionName, json, callback) {
    _connectDB(function (err, db) {
        //删除
        db.collection(collectionName).deleteMany(
            json,
            function (err, results) {
                if(err){
                    console.log("删除失败");
                }
                callback(err, results);
                db.close(); //关闭数据库
            }
        );
    });
}

//修改
exports.updateMany = function (collectionName, json1, json2, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).updateMany(
            json1,
            json2,
            function (err, results) {
                callback(err, results);
                db.close();
            });
    })
}

exports.getAllCount = function (collectionName,callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).count({}).then(function(count) {
            callback(count);
            db.close();
        });
    })
}