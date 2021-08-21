const axios = require("../request/http")
const api = require("../request/api")
import {Message} from 'element-ui';
export async function getNavMenus(userInfo,router) {
  await axios.post(api.findNavMenus).then(async res => {
    if (res.code == 200) {
      var NavList = res.data
      await axios.post(api.findOneRole, {
          rolename: userInfo.role
        })
        .then(rel => {
          if (rel.code == 200 && rel.data.roleList.length>0) {
            console.log(rel)
            var roleList = rel.data.roleList
            //判断当前角色有哪些权限，并重组导航菜单
            for (let i = 0; i < roleList.length; i++) {
              for (let j = 0; j < NavList.length; j++) {
                for (let k = NavList[j].children.length - 1; k >= 0; k--) {
                  if (NavList[j].children[k].id == roleList[i]) {
                    NavList[j].children[k].show = true
                    NavList[j].show = true
                    NavList[j].redirect = NavList[j].children[k].path
                  }
                }
              }
            }
            //将show为false的导航菜单删除
            for (let j = 0; j < NavList.length; j++) {
              var showPar = true
              for (let k = 0; k < NavList[j].children.length; k++) {
                if (NavList[j].children[k].show) {
                  showPar = false
                  NavList[j].children[k].component = () =>
                    import('@/views' + NavList[j].children[k].path + '.vue')
                } else {
                  NavList[j].children.splice(k, 1)
                    --k
                }
              }
              if (showPar) {
                NavList.splice(j, 1)
                  --j
              } else {
                NavList[j].component = () =>
                  import('@/views' + NavList[j].path + '.vue')
              }
            }
            // router.go(0)
            router.options.router = []
            var arr = [{
              path: '/',
              name:'登录',
              component: () => import("@/views/Login"),
            }]

            sessionStorage.setItem('oldNavMenu', JSON.stringify(NavList))
            router.options.routes = arr.concat(NavList)
            router.addRoutes(NavList)
          }else{
            Message.error({
              message: '暂无权限'
            });
          }
        })
    }else{
      Message.error({
        message: '导航菜单查询失败'
      });
    }
  })

}
// module.exports = {
//   getNavMenus
// }
