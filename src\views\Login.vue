<template>
  <div>
    <vue-particles
      class="newCanvs"
      hoverMode="grab"
      shapeType="circle"
      clickMode="push"
    ></vue-particles>
    <div class>
      <div class="formDiv">
        <div class="title color1">平台管理系统</div>
        <div>
          <div class="line-around">
            <span class="compants color2">众创空间</span>
          </div>
        </div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          class="demo-ruleForm formFlex"
        >
          <el-form-item label prop="uid" class="mt30" style="margin-left: 25px">
            <el-input
              v-model="ruleForm.uid"
              placeholder="请输入账号"
            ></el-input>
          </el-form-item>
          <el-form-item label prop="password" style="margin-left: 25px">
            <el-input
              type="password"
              v-model="ruleForm.password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-button @click="submitForm('ruleForm')" class="subBtn"
            >登录</el-button
          >
        </el-form>
        <div class="footer color2 f12 mt20">
          版权所有 @铸力金融服务外包有限公司
          <br />备案号：蜀ICP备20004812号-1
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        uid: "",
        password: "",
      },
      rules: {
        uid: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  mouted() {},
  methods: {
    submitForm(formName) {
      let _this = this;
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          sessionStorage.setItem(
            "userInfo",
            JSON.stringify({ uid: _this.ruleForm.uid })
          );
          _this.$axios
            .post(_this.$api.loginuser, _this.ruleForm)
            .then(async (res) => {
              if (res.code === 200) {
                //获取并存到本地中
                sessionStorage.clear();
                await _this.setUserPer(res.data);
                await _this.$store.commit("storageUserInfo", res.data);
                await _this.$store.dispatch("getNav", _this.$router);
                _this.$router.push("/Home");
              }
            });
        } else {
          return false;
        }
      });
    },
    //将当前角色的权限保存起来,供main.js中混入使用
    setUserPer(user) {
      this.$axios
        .post(this.$api.findOneRole, { rolename: user.role })
        .then(async (res) => {
          if (res.code === 200) {
            sessionStorage.setItem("userPermission", JSON.stringify(res.data));
          }
        });
    },
  },
};
</script>

<style scoped>
.newCanvs {
  width: 100%;
  height: calc(100vh);
  background: #2b3a4a;
}
.formDiv {
  width: 350px;
  height: 350px;
  padding: 30px;
  border-radius: 5px;
  background: white;
  opacity: 0.8;
  position: fixed;
  top: calc(50vh - 190px);
  left: calc(50% - 210px);
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
  width: 100px;
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
  background: #2b3a4a;
  color: #fff;
  border-radius: 8px;
}
.footer {
  width: 100%;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
}
</style>
