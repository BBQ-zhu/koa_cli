var port = normalizePort(process.env.PORT || config.port);
console.log( config.port + '端口号监听成功!')
# vue_cli

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


教学网址：https://blog.csdn.net/weixin_46182770/article/details/112974311

全局安装koa的脚手架（只需要安装一次）：npm install koa-generator -g

安装脚手架目录koa2 server （server是项目名称）

安装依赖npm install

进入到server文件夹中

启动命令：npm run dev / node bin/www

在bin/www文件中prot中修改端口号

注意：用脚手架搭建的koa2项目的启动方式和普通的node app.js启动方式不同

1、在使用ueditor中注意事项

现在后端安装koa2-ueditor 由于后端使用的是koa-multer解析图片，而我使用的是koa-body，所以会造成冲突问题， 解决办法：分开设置，在main，js中引入koaBody但是不配置允许上传文件，而在对应接口中去设置 //上传员工图片(假上传) router.post('/userImg',KoaBody({multipart: true}),uploads.userImg)

2、在配置ueditor加载本地文件失败的情况
 ueditor基本教程：https://blog.csdn.net/weixin_46561402/article/details/105899004 
 ueditor官方文档：http://fex.baidu.com/ueditor/#server-deploy 
 ueditor下载：https://github.com/sealice/koa2-ueditor/tree/master/example/public 
 下载ueditor文件夹后，需要把名称改为UE且把该文件夹放在前端项目public文件目录下，且把该文件中的ueditor.config.js中的 window.UEDITOR_HOME_URL="/UE/" //静态文件访问的重要配置，默认public下的文件夹，还要修改请求接口，注意和后端一致， // 服务器统一请求接口路径 ，api只是前缀 , serverUrl: "/api/editor/controller"

main.js中引入

import '../public/UE/ueditor.config.js' import '../public/UE/ueditor.all.min.js' import '../public/UE/lang/zh-cn/zh-cn.js' import '../pub/('public'))

图片的请求接口记得做代理至后端接口，不然他会使用脚手架本地搭建的服务端口，后端还要做好跨域处理

注意点：
数据可视化：https://github.com/bym110/vue-echarts
1、用户点击某个产品得立即办理后，会发送一条代办消息，代办消息默认是all，即所有人可见，如果是贷款资料得提交则会提交给对应的人。
2、代办中心展示给处理人为all和金融客服
4、线上和本地切换时，短信登录处需要修改
5、线上和本地切换时，记得把请求地址改了
6、vue_cli的右上角logo记得更换
7、src\static\imgs\stamped.png 公章二维码需要添加
8、添加用户协议
9、本地调试时要把短信通知打开

1、两个客户端首页添加了判断是移动端还是pc端的代码，再正式环境和本地环境需要改改跳转地址

2、线上和本地需要切换短信发送接口 koa--- routes\Mobile\vipUser.js 137行

3、综合服务中的领取人为客户经理，而贷款客户和企业客户领取人是金融客服，大数据权限不开就没法看全部客户

uniapp中：
loan上传限制了，新增了一个文件用来保存js以下的代码
src\pages\loan\loan2.vue
移动前端index.html文件删除客服代码

-----------------------------------------------------------------------------------------------
@@一：vue_cli
src\assets\js\fixedInfo.js  //vipstatusList 加一个 空号 字段
需求资金(万)——需求资金(元)

全局给表格添加序号
搜索：<el-table

<el-table-column
          label="序号"
          type="index"
          width="50">
</el-table-column>

@@二：uniapp_cli
需求资金(万)——需求资金(元)


@@三：koa_cli
config\index.js  //数据库地址更换回来本地  localhost
controller\schedule.js //定时任务去重修改
routes\customer.js //添加了跟进时间的查询判断
routes\contract.js //合同查询加了分类
routes\integrate.js
全局搜索：更新接口/updata  /update两个接口前缀，然后将以下文件中添加data.time = dateTime()
C:\Users\zWX990233\Desktop\2021-12-21\新建文件夹\koa\routes\mortgages.js
C:\Users\zWX990233\Desktop\2021-12-21\新建文件夹\koa\routes\internal.js
C:\Users\zWX990233\Desktop\2021-12-21\新建文件夹\koa\routes\integrate.js
C:\Users\zWX990233\Desktop\2021-12-21\新建文件夹\koa\routes\customer.js
C:\Users\zWX990233\Desktop\2021-12-21\新建文件夹\koa\routes\product.js


数据迁移：
controller\dataMigration.js //新增数据迁移文件

app.js文件加入
// 报备客户导入测试
const {dataMig1,dataMig2} = require('./controller/dataMigration') 
// dataMig1()
// dataMig2()

将数据json文件改为js文件
controller\tbbaobeis.js
const dataChange1 = JSON.stringify([])
module.exports = dataChange1 

controller\tbslbs.js
const dataChange2 = JSON.stringify([])
module.exports = dataChange2 


@@四：vue_pc



开发情况：

表格前面加序列号，修改之后的数据数据时间放到前面




        1}/${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`

data.time = dateTime()

app.js中19行增加如下代码 用完记得删除
const {datas} = require('./controller/datatime') //刷新时间脚本
datas()
