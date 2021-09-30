<template>
  <div class="header bgColor">
    <i v-if="isCollapse" class="el-icon-s-unfold f20 color0 pointer" @click="checkCollapse"></i>
    <i v-else class="el-icon-s-fold f20 color0 pointer" @click="checkCollapse"></i>
    <div class="header_right">
      <div class="badge_item" style="line-height:60px;"><a href="#" class="f16">商城系统</a></div>
      <div class="badge_item" style="line-height:60px;"><a href="#" class="f16">客服系统</a></div>
      <!-- 全屏 -->
      <i class="el-icon-full-screen badge_item pointer" @click="fullScree"></i>
      <!-- 警铃 -->
      <el-badge :value="100" :max="10" class="badge_item pointer">
        <i class="el-icon-bell"></i>
      </el-badge>
      <!-- 头像 -->
      <el-tooltip class="item pointer" effect="dark" :content="userInfo.role" placement="right">
        <div class="block mr20">
          <el-tooltip placement="bottom">
            <div slot="content">
              <img :src="userInfo.imgurl" />
            </div>
            <el-avatar :size="35" :src="userInfo.imgurl"></el-avatar>
          </el-tooltip>
        </div>
      </el-tooltip>
      <!-- 下拉菜单 -->
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link pointer">
          {{userInfo.username}} | {{userInfo.uid}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="changePwd">修改密码</el-dropdown-item>
          <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="旧密码" prop="oldPass">
            <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import screenfull from 'screenfull' //全屏按钮F11效果
export default {
  data() {
    var validateOldPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入的新密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      isCollapse: false,
      userInfo: '',
      dialogVisible: false,
      ruleForm: {
        oldPass: '',
        pass: '',
        checkPass: ''
      },
      rules: {
        oldPass: [{ validator: validateOldPass, trigger: 'blur' }],
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}')
  },
  methods: {
    fullScree() {
      screenfull.toggle()
    },
    checkCollapse() {
      this.isCollapse = !this.isCollapse
      this.$parent.$refs.aside.checkCollapse()
    },
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.logout()
          break
        case 'changePwd':
          this.changePwd()
          break
        default:
          break
      }
    },
    async logout() {
      // sessionStorage.clear()
      // this.$logsImg.createlogsImg(this.$api.uploadContractImg,this.ruleForm.imgurl) //添加操作日志
      let data = {
        user: `${this.userInfo.username}(${this.userInfo.uid})`,
        logdata: '',
        remarks: '退出登录'
      }
      await this.$axios.post(this.$api.createlogs, data) //创建日志
      this.$router.push('/')
    },
    //重置密码提交按钮
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            uid: this.userInfo.uid,
            oldPassword: this.ruleForm.oldPass,
            newPassword: this.ruleForm.pass
          }
          this.$axios
            .post(this.$api.updatePassword, data)
            .then(res => {
              if (res.code == 200) {
                this.$message({
                  type: 'success',
                  message: '修改密码成功'
                })
                // this.handleClose()
                this.logout()
              } else {
                this.$message.error('修改密码失败')
              }
            })
            .catch(err => {
              this.$message.error('原密码错误或服务器出错')
            })
        } else {
          return false
        }
      })
    },
    changePwd() {
      this.dialogVisible = true
    },
    handleClose(done) {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 60px;
  padding: 0 20px 0 0;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 4px 3px 3px #c7cbd3;
}
.header_right {
  width: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.badge_item {
  font-size: 25px;
  color: #fff;
  margin-right: 30px;
}
::v-deep .el-dropdown {
  color: #fff;
}
</style>
