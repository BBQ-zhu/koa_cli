前端：
src\main.js
src\components\home\Header.vue
src\components\home\Aside.vue
src\views\Home.vue
src\request\api.js
src\views\Contract.vue
src\views\Operation.vue
src\views\ScroImage.vue
查询 slot="append"   加上 find.currentPage=1 ,

后端：
controller\index.js
config\password.js    新增文件
npm install crypto --save 安装插件

config\index.js  增加：port:3030
bin\www  10到16条

const config = require('../config')
/**
 * Get port from environment and store in KOA.
 */

var port = normalizePort(process.env.PORT || config.port);
console.log( config.port + '端口号监听成功!')

