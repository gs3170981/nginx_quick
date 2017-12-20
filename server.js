/* ------------------------------------- nginx配置处 ------------------------------------- */
/*栗子*/
var data = [
  {
    name: 'tieba', // 名称 --- 不能中文字符
    port: 8016, // 端口
    path: 'C:/Users/admin/Documents/HBuilderProject/Demo/', // 本地项目路径
    index: 'index', // 项目首页的html文件名
    url: 'http://tieba.baidu.com/' // 请求的url
  }, {
    name: 'juejin', // 名称 --- 不能中文字符
    port: 8017, // 端口
    path: 'C:/Users/admin/Documents/HBuilderProject/Demo/', // 本地项目路径
    index: 'index', // 项目首页的html文件名
    url: 'https://timeline-merger-ms.juejin.im/' // 请求的url
  }
]

/*备注*/

// nginx -s stop 关闭服务
// ajax请求的时候，用相对路径
// 开启nginx服务需要到文件夹中双击打开，切莫IDE里打开

/* ------------------------------------- 以下为处理事件 ------------------------------------- */

var _nodeInit = function (data) { /*初始化*/
  var sum = 0
  var pathImg = 'conf/vhost/'
  files = fs.readdirSync(pathImg)
  files.forEach(function (file, index) { // 记总共步数
    sum = index
  })
  if (fs.existsSync(pathImg)) { // 先清空内部所有配置文件
    files.forEach(function (file, index) {
      var curPath = pathImg + "/" + file
      if (fs.statSync(curPath).isDirectory()) {
        fs.rmdirSync(pathImg)
      } else {
        fs.unlinkSync(curPath,function (err) {
          if (err) throw err
        })
      }
      if (index === sum) { // 结束时添加
        for (var i = 0; i < data.length; i++) {
          (function (data) {
            /*conf/vhost/为文件默认创建地方*/
            var mkDir = {
              name: data.name + '.conf',
              val: '#'+ data.name +'\n'+
              'server{\n'+
                'listen  '+ data.port +';\n'+
                'server_name 127.0.0.1 localhost;\n'+
                'access_log  logs/'+ data.name +'.log;\n'+
                'charset utf-8;\n'+
                'location =/ {\n'+
                  'rewrite / /'+ data.index +'.html permanent;\n'+
                '}\n'+
                'location / {\n'+
                  'proxy_pass  '+ data.url +';\n'+
                  'proxy_redirect  default;\n'+
                '}\n'+
                'location ~* ^.+\.(ico|gif|jpg|jpeg|png|html)$ {\n'+
                  'root  '+ data.path +';\n'+
                '}\n'+
                'location ~* ^.+\.(css|js|txt|xml|swf|wav|json)$ {\n'+
                  'root  '+ data.path +';\n'+
                '}\n'+
              '}\n'
            }
            fs.appendFile(pathImg + data.name + '.conf', mkDir.val, 'utf8', function (err) {
              if (err) {
                return console.error(err)
              }
            })
          })(data[i])
        }
      }
    })
  }
}
var fs = require("fs")
_nodeInit(data)