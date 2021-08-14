<template>
  <div class="content">
    <div class="formDiv">
      <div class="title color1">登录</div>
      <div>
        <div class="line-around">
          <span class="compants color2">xxxxxx</span>
        </div>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm formFlex">
        <el-form-item label="账号" prop="uid">
          <el-input v-model="ruleForm.uid" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" class="subBtn">登录</el-button>
      </el-form>
    </div>
    <div class="footer color2 f16">版权所有 @铸力金融服务有限公司 2018. 保留一切权力</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        uid: '',
        password: ''
      },
      rules: {
        uid: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  mouted(){
    
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios.post(this.$api.loginUser, this.ruleForm).then(async res => {
            if (res.code === 200) {
              //获取并存到本地中
              sessionStorage.clear()
              this.$store.commit('storageUserInfo', res.data)
              await this.$store.dispatch('getNav', this.$router)
              this.$router.push('/Home')
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.content {
  width: 100%;
  height: 100% !important;
  display: flex;
  justify-content: center;
  align-items: center;
}
.formDiv {
  width: 350px;
  height: 350px;
  box-shadow: 0 0 10px #ebebeb;
  padding: 50px;
  border-radius: 5px;
  background: white;
  margin-top: 10%;
}
::v-deep .el-form-item__label {
  font-size: 16px;
  color: #909399;
}
.title {
  width: 100%;
  text-align: center;
  margin-bottom: 30px;
  font-weight: 700;
  font-size: 30px;
}
.compants {
  width: 120px;
  height: 20px;
  display: inline-block;
  background: white;
  position: relative;
  top: -2px;
}
.line-around {
  width: 350px;
  text-align: center;
  border-top: 1px solid #c7cbd3;
  line-height: 0.1em;
  /* margin: 10px 0 20px; */
}
.subBtn {
  width: 100%;
  height: 50px;
  font-size: 18px;
  font-weight: 600;
  margin-top: 20px;
}
.footer {
  width: 100%;
  height: 50px;
  text-align: center;
  line-height: 50px;
  box-shadow: 1px 1px 10px #909399;
  background: #fff;
  position: fixed;
  bottom: 0;
}
</style>
