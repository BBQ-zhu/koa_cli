<template>
  <div class="card">
    <div class="flex header">
      <el-input class="mr20" style="width:217px" placeholder="请输入角色名称" v-model="roleName" clearable></el-input>
      <el-button type="primary" icon="el-icon-plus" @click="addUser()">新增角色</el-button>
    </div>
    <el-select v-model="rloeValue" @change="collapse()" placeholder="请选择角色" class="mt20 mb20">
      <el-option v-for="item in roleLists" :key="item._id" :label="item.rolename" :value="item._id"></el-option>
    </el-select>
    <el-tree
      class="mt20"
      :data="navList"
      show-checkbox
      default-expand-all
      node-key="id"
      ref="tree"
      highlight-current
      :props="defaultProps"
    ></el-tree>
    <div class="mt20">
      <el-button size="small" type="primary" icon="el-icon-edit" @click="updateRole()" :disabled="roleLoading">更新权限</el-button>
      <el-button size="small" type="danger" icon="el-icon-delete" @click="delRole()" :disabled="roleLoading">删除角色</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageId: '', //当前打开页
      roleName: '', //新增角色名称
      rloeValue: '', //选中的角色名称
      navList: [], //导航菜单
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      roleLists: [], //角色列表
      check: {},
      roleLoading: false
    }
  },
  mounted() {
    //查询菜单导航
    this.$axios.post(this.$api.findNavMenus).then(res => {
      if (res.code == 200) {
        this.navList = res.data
        this.findRoleList()
      }
    })
  },
  methods: {
    //查询角色列表
    findRoleList() {
      this.$axios.post(this.$api.findRole).then(res => {
        if (res.code == 200) {
          this.roleLists = res.data
        }
      })
    },
    //角色切换事件
    collapse() {
      console.log(this.rloeValue)
      for (let item of this.roleLists) {
        if (this.rloeValue == item._id) {
          this.check = item
        }
      }
      
      this.$refs.tree.setCheckedKeys(this.check.roleList)
    },
    //更新角色权限
    updateRole() {
      console.log(this.$refs.tree.getCheckedNodes());
      if(!this.rloeValue){
        this.$message.error('请先选择角色')
        return
      }
      let roleList = this.$refs.tree.getCheckedKeys()
      this.check.roleList = roleList
      this.$axios.post(this.$api.updateRole, this.check).then(res => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '提交成功'
          })
        }
      })
    },
    //删除角色
    delRole() {
      if(!this.rloeValue){
        this.$message.error('请先选择角色')
        return
      }
      this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let { _id } = this.check
          this.$axios.post(this.$api.delRole, { _id }).then(res => {
            if (res.code == 200) {
              this.$router.go(0)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    addUser() {
      //提交角色
      if (this.roleName) {
        var data = {
          rolename: this.roleName,
          roleList: []
        }
        this.$axios.post(this.$api.addRole, data).then(res => {
          if (res.code == 200) {
            this.roleName = ''
            this.findRoleList()
            this.$router.go(0)
            this.$message({
              type: 'success',
              message: '添加成功'
            })
          }
        })
      } else {
        this.$message.error('请输入角色名称')
      }
    }
  }
}
</script>

<style scoped>
.header {
  border-bottom: 1px solid #909399;
  padding-bottom: 15px;
}
</style>
