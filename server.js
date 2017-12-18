var data = {
  name: 'baidu', // 名称 --- 不能中文字符
  port: 8010, // 端口
  path: 'C:/Users/admin/Documents/HBuilderProject/Demo', // 本地项目路径
  index: 'index', // 项目首页的html文件名
  url: 'https://www.baidu.com/' // 请求的url
}

/*备注*/

// nginx -s stop 关闭服务
// ajax请求的时候，用相对路径

/* ------------------------------------- 以下为处理事件 ------------------------------------- */
var _methods = {
  data: {
    now: 0,
    sum: 0,
    log: ''
  },
  _nodeInit: function (mkDir) { /*初始化*/
    this._nodeSum(mkDir)
    this._nodeFor(mkDir)
  },
  _nodeFor: function (mkDir, path) { /*无限子节点异步回调创建目录结构*/
    var self = this
    for (var i = 0; i < mkDir.length; i++) {
      var name = mkDir[i].name
      var child = mkDir[i].child
      var path_block = path ? (path + '/' + name) : name
      if (name.lastIndexOf('.') === -1) { /*判断文件or文件夹 --- 文件夹*/
        (function (path, child, name) { /*防止异步回调后变量被污染  --- (踩坑★★★★)*/
          fs.mkdir(path, function (err) {
            if (err) {
              return console.error(err)
            }
            self._nodeTree(++self.data.now, path, name) /*加载loading*/
            if (child) {
              self._nodeFor(child, path) /*递归*/
            }
          })
        })(path_block, child, name)
      } else { /*文件*/
        (function (path, val, name) {
          /*conf/vhost/为文件默认创建地方*/
          fs.appendFile('conf/vhost/' + path_block, val ? val : '', 'utf8', function (err) {
            if (err) {
              return console.error(err)
            }
            self._nodeTree(++self.data.now, path, name) /*加载loading*/
          })
        })(path_block, mkDir[i].val, name)
      }
    }
  },
  _nodeSum: function (arr) { /*计算总执行次数*/
    console.log('\x1B[90m' + 'Downloading Current JS to ' + __dirname + '\x1B[39m')
    var self = this
    function count (mkDir, j) { /*i为次数, j为层级*/
      for (var i = 0; i < mkDir.length; i++) {
        (function (mkDir, i, j) {
          var log = log_j(j)
          var name = mkDir[i].name.lastIndexOf('.') === -1 ? mkDir[i].name : ('\x1B[90m' + mkDir[i].name + '\x1B[39m')
          self.data.log += log + '--' + name + '\n'
          if (mkDir[i].child) {
            count(mkDir[i].child, ++j)
          }
          self.data.sum++
        })(mkDir, i, j ? j : 0)
      }
    }
    function log_j (val) {
      var log = ''
      if (val === 0) return '|'
      for (var i = 0; i < val; i++) {
        log += '　' + '|'
      }
      return '|' + log
    }
    count(arr)
    console.log('\x1B[90m' + 'Altogether contains ' + this.data.sum + 'second Execution process' + '\x1B[90m')
  },
  _nodeTree: function (now, path, name) { /*异步过程界面化*/
    console.log('[' + now + '/' + this.data.sum + ']\x1B[90m ' + name + '\x1B[39m' + '\x1B[32m' + ' installed ' + '\x1B[39m' + 'at ' + path)
    if (now === this.data.sum) {
      console.log('\x1B[32m' + 'All package installed ' + this.data.sum + ' project installed from ' + __dirname + '\x1B[39m')
      console.log('\x1B[35m' + 'Project catalogue:' + '\x1B[39m')
      console.log(this.data.log + '------------------------------------')
      console.log(",'''╭⌒╮⌒╮.',''',,',.'',,','',.\n" +
      " ╱◥██◣''o',''',,',.''.'',,',.\n" +
      "｜田｜田田│ '',,',.',''',,',.''\n" +
      "╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬" + '\n------------------------------------')
      console.log('\x1B[35m' + 'MAKE：o︻そ╆OVE▅▅▅▆▇◤\nBLOG：http://blog.csdn.net/mcky_love\nGITHUB：https://github.com/gs3170981' + '\x1B[39m')
    }
  }
}

var fs = require("fs")

/*------------------------注意事项------------------------
1、文件夹名称不可相同、文件名称相同的情况下后缀名不可相同
2、文件夹内方可创建child子项目目录，文件下创建child对象不执行
3、文件夹名称不可包含'.'字符
----------------------------END--------------------------*/

var mkDir = [
  {
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
]

_methods._nodeInit(mkDir)