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

npm install js-export-excel -s
src\views\Statistics.vue
src\views\Contract.vue  //207行 新增<el-option label="合同生效" value="合同生效"></el-option>
src\views\Information.vue //27行 { name: "个人信贷" }, { name: "企业信贷" }, { name: "抵押" }

@@二：uniapp_cli
src\pages\internal\internal.vue //210行 item.status == '合同生效'
src\pages\sign\sign.vue //151行 item.status == "合同生效"
src\pages\internalDetail\internalDetail.vue  //71行 、110行{ name: "个人信贷" }, { name: "企业信贷" }, { name: "抵押" }
