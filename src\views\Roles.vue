<template>
  <div class="flex flexCenter">
    <div class="card1" style="width:49%">
      <div class="flex header" v-if="meth[0]">
        <el-input
          class="mr20"
          style="width:217px"
          placeholder="请输入角色名称"
          v-model="roleName"
          clearable
        ></el-input>
        <el-button type="primary" icon="el-icon-plus" @click="addUser()">新增角色</el-button>
      </div>
      <el-select v-model="rloeValue" @change="collapse()" placeholder="请选择角色" class="mt20 mb20">
        <el-option
          v-for="item in roleLists"
          :key="item._id"
          :label="item.rolename"
          :value="item._id"
        ></el-option>
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
      >

        <span class="custom-tree-node flexBetween" slot-scope="{ node, data }">
        <div>{{ node.label }}</div>
        <el-checkbox-group v-model="data.meth" v-if="!data.children" style="margin-left:40px">
          <el-checkbox label="新增"></el-checkbox>
          <el-checkbox label="删除"></el-checkbox>
          <el-checkbox label="修改"></el-checkbox>
          <el-checkbox label="查询" disabled></el-checkbox>
        </el-checkbox-group>
      </span>

      </el-tree>
      <div class="mt20">
        <el-button
          v-if="meth[2]"
          size="small"
          type="primary"
          icon="el-icon-edit"
          @click="updateRole()"
          :disabled="roleLoading"
        >更新权限</el-button>
        <el-button
          v-if="meth[1]"
          size="small"
          type="danger"
          icon="el-icon-delete"
          @click="delRole()"
          :disabled="roleLoading"
        >删除角色</el-button>
      </div>
    </div>

    <div class="card1" style="width:49%;margin-left:1%">
      <div class="flex header" v-if="meth[0]">
        <el-input
          class="mr20"
          style="width:217px"
          placeholder="请输入团队名称"
          v-model="teamName"
          clearable
        ></el-input>
        <el-button type="primary" icon="el-icon-plus" @click="addteam()">新增团队</el-button>
      </div>
      <div>
        <el-tag
          class="mt20 mr20"
          v-for="item in teamList"
          :key="item.teamname"
          closable
          :type="item.type"
          @close="meth[1] && handleClose(item)"
        >{{item.teamname}}</el-tag>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkList:['新增'],
      //团队数据
      teamName: '',
      tags: ['', 'success', 'info', 'warning', 'danger'],
      //角色数据
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
      roleLoading: false,
      teamList: []
    }
  },
  async mounted() {

    this.mixinMethod(this.$route.path)

    //查询菜单导航
    this.$axios.post(this.$api.findNavMenus).then(res => {
      if (res.code == 200) {
        this.navList = res.data
        // console.log(this.navList)
        this.findRoleList()
        this.findteam()
      }
    })
  },
  methods: {
    addteam() {
      //新增团队
      if (this.teamName == '') {
        this.$message.error('请输入团队名称')
      } else {
        this.$axios
          .post(this.$api.addTeam, { teamname: this.teamName })
          .then(res => {
            if (res.code == 200) {
              this.$message.success('创建团队成功')
              this.findteam()
            }
          })
      }
    },
    findteam() {
      //查询团队
      this.$axios.post(this.$api.findTeam).then(res => {
        if (res.code == 200) {
          this.teamList = res.data
          var k = 0
          for (let i = 0; i < this.teamList.length; i++) {
            k++
            if (k > 4) k = 0
            this.teamList[i].type = this.tags[k]
          }
        }
      })
    },
    handleClose(tag) {
      //删除团队
      this.$confirm('此操作将永久删除该团队, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(this.$api.delTeam, { _id: tag._id }).then(res => {
          if (res.code == 200) {
            this.teamList = res.data
            this.findteam()
            this.$message.success('删除成功')
          }
        })
      }).catch(()=>{})
    },
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
      for (let item of this.roleLists) {
        if (this.rloeValue == item._id) {
          this.check = item //角色信息
          this.changePer(item.navList)
        }
      }
      this.$refs.tree.setCheckedKeys(this.check.roleList)
    },
    //将当前角色的操作权限赋值给导航菜单
    changePer(rolePer){
      if(!rolePer){
        return
      }
      for(let i=0;i<this.navList.length;i++){
        for(let j=0;j<this.navList[i].children.length;j++){
          let path = this.navList[i].children[j].path

          let isOk = false
          for(let k=0;k<rolePer.length;k++){
            for(let n=0;n<rolePer[k].children.length;n++){
              if(path == rolePer[k].children[n].path){
                isOk = true
                if(rolePer[k].children[n].meth){
                  this.navList[i].children[j].meth = ['查询']
                  rolePer[k].children[n].meth.map(item=>{
                    if(item != '查询'){
                      this.navList[i].children[j].meth.push(item)
                    }
                  })
                }else{
                  this.navList[i].children[j].meth = ['查询']
                }
                break;
              }
            }
            if(isOk){
              break
            }
          }

        }
      }
      console.log(this.navList)
    },
    //更新角色权限
    updateRole() {
      // console.log(this.$refs.tree.getCheckedNodes())
      if (!this.rloeValue) {
        this.$message.error('请先选择角色')
        return
      }
      let roleList = this.$refs.tree.getCheckedKeys()
      this.check.roleList = roleList
      this.check.navList = this.navList
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
      if (!this.rloeValue) {
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
.card1 {
  min-height: 200px;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 15px;
  background: #fff;
  box-shadow: 0 -3px 31px 0 rgb(0 0 0 / 5%), 0 6px 20px 0 rgb(0 0 0 / 2%);
}
</style>
