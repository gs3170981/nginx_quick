# nginx反向代理so easy妈妈再也不用担心我跨域了！

-------------------
## 一些废话（直接看代码的可跳过）

“跨域了，咋搞啊！”
“问你自己啊，我们后台不配合解决的。”
“你们写几句话就好了啊，cors、jsonp、header ......”
“搞不来！不合法！不安全！......”
“卧槽，这接口又跨域了，我CNMLGB”
“你TM不会自己url-get、form-post、写nginx代理啊！”
......

  几个月后

“这接口跨域了！”
“写反向代理啊，上次你不是弄过吗？”
“我TM早忘了......”

如果你无论如何都得仍受并面对这样的后台小伙伴的话，那这篇文章来解救你了，让你的nginx配置信息管理的又简单，又清晰，而且fork一下github随时都不会忘了呢~


-------------------

### 面向读者

 1. 无论如何都si不配合跨域的后台儿子们
 2. 总忘记咋配置nginx代理的前端爸爸们
 3. 老想跨域干些heiheihei的爬虫绅士们
 4. 想解决或想了解跨域问题的萌新们
 ......

### 想要达到的目的

 1. 只用**一句命令行**来执行配置文件的**创建、修改**
 2. JS配置**简单明了**，不会JS的小伙伴懂json格式就能**轻易维护**
 3. 对于水平稍高的朋友们可对代码进行**二次开发**
 4. **跨域不再困难**

-------------------

### 需要的工具

- **node**
- **cmd（命令指示符）**

-------------------

### Tips

  以下内容会以初学者的角度进行并言简意赅的方式急速说明，掌握者可以跳着看


-------------------

## 在开始之前您可能需要初步了解这些东西

#### **1. 什么是正向/反向代理**
#### **2. 什么是跨域**


-------------------

### 1）什么是正向/反向代理

#### **正向代理：**

我要拿C的数据，但请求不到C（例如谷歌），不过我知道B是能请求到C的，于是我去告诉B，B帮我拿回了C的数据，有点翻墙的意思。敲黑板，划重点（**C只知道B是他的小伙伴，并不知道A是谁**）


#### **反向代理：**

我又要去拿C的数据了，不过这次运气好，C我能直接访问到（比如百度），那很棒哦，我自己搭建了个服务器B，B帮我拿回了C的数据。敲黑板，划重点（**C并不知道B是他的小伙伴，因为AB是一伙的**）

-------------------

### 2）什么是跨域

  请求非自身(地址||端口)都算跨域

-------------------

## 写一个非自身地址的AJAX的请求（起步）

-------------------

### 步骤一：找接口

首先咋们开始在网站上找各种接口，那我这边找了一个百度贴吧的post接口

#### **请求头**
![贴吧post请求图 --- 请求头](http://img.blog.csdn.net/20171220015149066?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvTWNreV9Mb3Zl/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

#### **请求值**
![贴吧post请求图 --- 请求值](http://img.blog.csdn.net/20171220015809270?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvTWNreV9Mb3Zl/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

#### **返回值**
![贴吧post请求图 --- 返回值](http://img.blog.csdn.net/20171220015854899?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvTWNreV9Mb3Zl/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

-------------------

### 步骤二：创建index.html发起AJAX请求
打开你善用的编辑器直接复制以下代码
``` js
<!DOCTYPE>
<html>
  <meta charset="UTF-8" />
  <head>
    <title></title>
  </head>
  <body></body>
  <script src="https://code.jquery.com/jquery-3.0.0.min.js"></script>
  <script>
    $.ajax({
      type: "post",
      url: "http://tieba.baidu.com/connectmanager/user/updateFlashInfo",
      data: '{"appid":"tieba","cuid":"73118464C47E43476FB3E50ACD8E32C9:FG:1","connection_id":"","lcs_ip":"10.46.235.62","lcs_port":"8891","lcs_fd":"10619","device_type":"21"}',
      async: true,
      success: function (res) {
        document.write(JSON.stringify(res))
      }
    })
  </script>
</html>
```
跑服务试试？（这里是从8020端口开启的服务器）

![ajax请求](http://img.blog.csdn.net/20171220020646813?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvTWNreV9Mb3Zl/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

哇塞通啦，200诶！我啥都没操作只是写了个$.ajax就通了呀？通个毛......
  
  以上console是标准的跨域error，就算返回200也会被浏览器自身给截掉，无论如何success都获取不到Response里的值

-------------------

## 开始nginx反向代理（进阶）

这里就不讲正常情况下nginx如何配置了，百度很多。
这里直接附上我的github，大家去下载并且我对以下代码进行**JS配置讲述**
（**下载是非常必要的，因为在github上我内置了nginx**）

Github：https://github.com/gs3170981/nginx_quick

-------------------

### 步骤一：配置server.js

1）下载完目录结构应该是这样的

  这里我内置了nginx，开不开心。

![目录结构](http://img.blog.csdn.net/20171220022231579?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvTWNreV9Mb3Zl/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

2）打开server.js，里面大致内容是这样的

![配置内容](http://img.blog.csdn.net/20171220022430307?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvTWNreV9Mb3Zl/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

3）如果你了解过或曾经配过nginx，那你一定很鸡冻，没错，这里呈现的就是配置项，意味着以后管理配置文件只需要修改这儿就OK了，因为有注释我就不一一解释了。
**注意'/'别写反了，不然会被转义报错**

-------------------

### 步骤二：执行node命令

1）win+r 打开你的cmd，cd到nginx所在的目录（即是下载后所在的目录）执行

>node server

如果cmd没报错的话，你的文件结构应该变成如此了

![文件结构](http://img.blog.csdn.net/20171220103601770?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvTWNreV9Mb3Zl/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

2）那么请再执行

>nginx

如果你除了关闭啥都点不了的话，说明开启成功了（老司机一般都不会这样用...嘿嘿，**推荐到目录下双击执行**）

-------------------

### 步骤三：请求试试！

nginx是服务器，所以开启的port必须为js文件中设置的port

  打开127.0.0.1:8016

![8016服务器](http://img.blog.csdn.net/20171220104538663?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvTWNreV9Mb3Zl/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

我擦，咋啥都没显示？不是js中都输出了吗？我们来看看控制台

![请求](http://img.blog.csdn.net/20171220105036139?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvTWNreV9Mb3Zl/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

汗，还是跨域了，不过如果你是老手的话，应该已经意识到为什么开始要讲解下什么是正向/反向代理，因为还少一步

-------------------

### 步骤四：最后再战！

打开index.html，修改一点点的代码

```
<!DOCTYPE>
<html>
  <meta charset="UTF-8" />
  <head>
    <title></title>
  </head>
  <body></body>
  <script src="https://code.jquery.com/jquery-3.0.0.min.js"></script>
  <script>
    $.ajax({
      type: "post",
      url: "connectmanager/user/updateFlashInfo", // 注意这里改成了相对路径
      data: '{"appid":"tieba","cuid":"73118464C47E43476FB3E50ACD8E32C9:FG:1","connection_id":"","lcs_ip":"10.46.235.62","lcs_port":"8891","lcs_fd":"10619","device_type":"21"}',
      async: true,
      success: function (res) {
        document.write(JSON.stringify(res))
      }
    })
  </script>
</html>
```

A、B是相互认识并在同一服务器上的，B代理了C，则相当于同在了一个地址下，所以需改成**相对路径**

好，保存刷新一下

![再请求](http://img.blog.csdn.net/20171220105930065?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvTWNreV9Mb3Zl/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

天啦噜，好像成功呢了，再看下请求

![正确返回](http://img.blog.csdn.net/20171220110021837?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvTWNreV9Mb3Zl/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

没有报错，正确返回了呢！

-------------------

## 相关技术链接

该文章运用到了node（fs模块）想多了解的，请移步下方链接查看

CSDN：http://blog.csdn.net/Mcky_Love/article/details/78679291

掘金：https://juejin.im/post/5a28aead6fb9a0450c494bc6

-------------------

## 关于

make：o︻そ╆OVE▅▅▅▆▇◤（清一色天空）

blog：http://blog.csdn.net/mcky_love

github：https://github.com/gs3170981/nginx_quick（好用的话记得加星哦！）

-------------------


## 结束语


该功能的实现主归功于fs的文件创建便利，此项可用于多种批量文件/文件夹操作的环境，不单指向开发哦~