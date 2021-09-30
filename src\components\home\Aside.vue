<template>
  <div>
    
    <el-menu
      router
      default-active="1"
      open="1"
      class="el-menu-vertical-demo aside"
      :collapse="isCollapse"
      background-color="#2b3a4a"
      text-color="#8699AD"
      active-text-color="#fff"
    >
    <div class="bgColor logo">
      <img :src="isCollapse ? '/imgs/logo2.PNG': '/imgs/logo.PNG'" />
    </div>
      <el-submenu v-for="(item,index) in routerList" :key="index+'1'" :index="index+''">
        <template slot="title">
          <i :class="item.icon"></i>
          <span>{{item.name}}</span>
        </template>
        <el-menu-item
          v-for="(children,indey) in item.children"
          :key="indey+'2'"
          :index="children.path"
        >
          <i :class="children.icon"></i>
          {{children.name}}
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      routerList: []
    }
  },
  mounted() {
    //将导航菜单放入路由中
    var arr = this.$router.options.routes
    var newRouter = []
    for (let item of arr) {
      if (item.path != '/') {
        //删除login登录的router
        newRouter.push(item)
      }
    }
    this.routerList = newRouter
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    checkCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="scss" scoped>
.aside {
  height: calc(100vh);
  box-sizing: content-box;
  overflow:auto;
}
.logo {
  width: 100%;
  height: 60px;
  .logo img {
    min-width: 64px;
    max-width: 200px;
    height: 60px;
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
::v-deep .el-header {
  padding: 0;
}
::v-deep .el-menu {
  border-right: none;
}
</style>
