<template>
  <div class="card">
    <div class="flex header">
      <el-button v-if="meth[0]" type="primary" icon="el-icon-plus" @click="addUser()">新增员工</el-button>
      <el-input
        clearable
        placeholder="请输入内容"
        v-model="input"
        class="input-with-select findInput ml20"
      >
        <el-select clearable v-model="select" slot="prepend" placeholder="请选择">
          <el-option
            v-for="(item, index) in tableHeader"
            :key="index + 'h'"
            :label="item.name"
            :value="item.prop"
          ></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="(find.currentPage = 1), findFuzz()"></el-button>
      </el-input>
    </div>
    <el-table :data="tableData" stripe>
      <el-table-column label="头像" min-width="100px">
        <template slot-scope="scope">
          <el-tooltip placement="right">
            <div slot="content">
              <img :src="scope.row.imgurl" />
            </div>
            <img :src="scope.row.imgurl" class="tableImg" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        v-for="(item, index) in tableHeader"
        :key="index + '1'"
        :prop="item.prop"
        :label="item.name"
        min-width="100px"
      >
        <template slot-scope="scope">
          <span v-if="item.prop == 'phone'">{{$common.phoneNum(scope.row[item.prop])}}</span>
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100px">
        <template slot-scope="scope" v-if="scope.row.uid!='00000'">
          <el-button
            @click.native.prevent="editRow(scope.$index, scope.row)"
            type="text"
            size="small"
          >编辑</el-button>
          <el-button
            v-if="meth[1]"
            @click.native.prevent="deleteRow(scope.$index, scope.row)"
            type="text"
            size="small"
          >删除</el-button>
          <el-button
            v-if="meth[2]"
            @click.native.prevent="newPwd(scope.$index, scope.row)"
            type="text"
            size="small"
          >重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 页码条 -->
    <el-pagination
      class="mt20"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="find.currentPage"
      :page-sizes="[10, 20, 50, 100, 200]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="find.total"
    ></el-pagination>

    <!-- 弹出框 :visible.sync="dialogVisible" -->
    <el-dialog title="员工信息" :visible="dialogVisible" width="90%" :before-close="handleClose">
      <span>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <div class="flex">
            <el-form-item label="姓名:" prop="username">
              <el-input
                clearable
                v-model="ruleForm.username"
                placeholder="请输入员工姓名"
                class="inputWidth"
              ></el-input>
            </el-form-item>
            <el-form-item label="角色:" prop="role">
              <el-select
                clearable
                style="width: 217px"
                v-model="ruleForm.role"
                placeholder="请选择员工角色"
              >
                <el-option
                  v-for="item in roleLists"
                  :key="item._id"
                  :label="item.rolename"
                  :value="item.rolename"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="电话:" prop="phone">
              <el-input clearable v-model="ruleForm.phone" placeholder="请输入员工电话" class="inputWidth"></el-input>
            </el-form-item>
            <el-form-item label="团队:" prop="team">
              <el-select
                clearable
                style="width: 217px"
                v-model="ruleForm.team"
                placeholder="请选择员工团队"
              >
                <el-option
                  v-for="item in teamList"
                  :key="item._id"
                  :label="item.teamname"
                  :value="item.teamname"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="身份证:" prop="idcard">
              <el-input
                clearable
                v-model="ruleForm.idcard"
                placeholder="请输入员工身份证"
                class="inputWidth"
              ></el-input>
            </el-form-item>
            <el-form-item label="住址:" prop="address">
              <el-input
                clearable
                v-model="ruleForm.address"
                placeholder="请输入员工住址"
                class="inputWidth"
              ></el-input>
            </el-form-item>
            <el-form-item label="咨询顾问:" prop="isrecomed">
              <el-select
                clearable
                style="width: 217px"
                v-model="ruleForm.isrecomed"
                placeholder="是否为咨询顾问"
              >
                <el-option label="是" value="是"></el-option>
                <el-option label="否" value="否"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="顾问介绍:" prop="intro">
              <el-input
                clearable
                v-model="ruleForm.intro"
                placeholder="请输入咨询师介绍"
                class="inputWidth"
              ></el-input>
            </el-form-item>
            <el-tooltip
              effect="dark"
              content="是否有权使用移动端-员工中心-客户查询权限"
              placement="top"
            >
              <el-form-item label="客户查询:" prop="seedata">
                <el-select
                  clearable
                  style="width: 217px"
                  v-model="ruleForm.seedata"
                  placeholder="是否开启权限"
                >
                  <el-option label="是" value="是"></el-option>
                  <el-option label="否" value="否"></el-option>
                </el-select>
              </el-form-item>
            </el-tooltip>
            <el-tooltip
              v-if="userInfo.uid=='00000'"
              effect="dark"
              content="是否有权查看综合服务、贷款客户、企业客户中的全部客户数据"
              placement="top"
            >
              <el-form-item label="全部客户:" prop="seeall" color="red">
                <el-select
                  clearable
                  style="width: 217px"
                  v-model="ruleForm.seeall"
                  placeholder="是否开启权限"
                >
                  <el-option label="是" value="是"></el-option>
                  <el-option label="否" value="否"></el-option>
                </el-select>
              </el-form-item>
            </el-tooltip>
            <el-form-item label="员工头像:" prop="imgurl">
              <div style="position: relative;width: 217px">
                <el-input clearable placeholder="请上传员工头像" v-model="ruleForm.imgurl" disabled></el-input>
                <el-upload
                  v-if="meth[0] || meth[2]"
                  style="position: absolute; top: 0; right: -110px"
                  class="upload-demo"
                  :data="ruleForm"
                  :action="this.$api.uploadUserImg"
                  :headers="uploadHeader"
                  :on-error="onError"
                  :on-success="handSuccess"
                  :show-file-list="false"
                >
                  <el-button type="primary">点击上传</el-button>
                </el-upload>
              </div>
            </el-form-item>
          </div>
        </el-form>
        <UE v-if="showUE" :defaultMsg="ruleForm.remarks" :config="config" :id="ueId" ref="editor"></UE>
      </span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" v-if="meth[0] || meth[2]" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import UE from '@/components/common/UE'
export default {
  components: {
    UE
  },
  data() {
    return {
      userInfo:{},
      showUE: false,
      uploadHeader: {
        authorization: JSON.parse(sessionStorage.getItem('userInfo') || '{}')
          .token
      },
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 220
      },
      ueId: 'editor4', //多实例情况下使用
      isAdd: true,
      fileList: [],
      tableData: [],
      tableHeader: [
        { name: '工号', prop: 'uid' },
        { name: '姓名', prop: 'username' },
        { name: '团队', prop: 'team' },
        { name: '角色', prop: 'role' },
        { name: '电话', prop: 'phone' },
        { name: '身份证', prop: 'idcard' },
        { name: '住址', prop: 'address' },
        { name: '咨询师', prop: 'isrecomed' }
      ],
      roleLists: [],
      input: '',
      select: 'uid',
      find: {
        currentPage: 1, //当前页码
        total: 0, //总页数
        skip: 0, //偏移量
        limit: 10 //每一页的数量
      },
      dialogVisible: false,
      teamList: [],
      ruleForm: {
        imgurl: '',
        uid: '',
        team: '',
        username: '',
        role: '',
        phone: '',
        idcard: '', //身份证
        address: '', //家庭住址
        isrecomed: '', //是否推荐至咨询顾问
        intro: '', //顾问介绍
        seedata: '否', //客户查询
        seeall: '否', //全部客户
        remarks: '',
        time: ''
      },
      rules: {
        username: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
        role: [{ required: true, message: '请选择员工角色', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入员工电话', trigger: 'blur' }],
        team: [{ required: true, message: '请选择团队', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.mixinMethod(this.$route.path)
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}')
    this.getUserList()
    this.findRoleList()
    this.findteam()
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.showUE = val
      }
    }
  },
  methods: {
    findteam() {
      //查询团队
      this.$axios.post(this.$api.findTeam).then(res => {
        if (res.code == 200) {
          this.teamList = res.data
        }
      })
    },
    //获取用户列表
    getUserList() {
      var data = {
        skip: this.find.limit * (this.find.currentPage - 1),
        limit: this.find.limit,
        team: 'team',
        teamname:
          JSON.parse(sessionStorage.getItem('userInfo') || '{}').team || ''
      }
      this.$axios.post(this.$api.findUser, data).then(res => {
        this.tableData = res.data[0].data
        this.find.total = (res.data[0].total[0] || {}).total || 0
      })
    },
    //查询角色列表
    findRoleList() {
      this.$axios.post(this.$api.findRole).then(res => {
        if (res.code == 200) {
          this.roleLists = res.data
        }
      })
    },
    //模糊查询
    findFuzz() {
      var data = {
        skip: this.find.limit * (this.find.currentPage - 1),
        limit: this.find.limit,
        fuzz: this.select,
        input: this.input,
        team: 'team',
        teamname:
          JSON.parse(sessionStorage.getItem('userInfo') || '{}').team || ''
      }
      this.$axios.post(this.$api.findUser, data).then(res => {
        this.tableData = res.data[0].data
        this.find.total = (res.data[0].total[0] || {}).total || 0
      })
    },
    newPwd(index, row) {
      let _this = this
      _this
        .$confirm('此操作将重置密码为:123456, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {
          var data = {
            uid: row.uid,
            newPassword: '123456'
          }
          await _this.$axios.post(_this.$api.resetPassword, data).then(res => {
            _this.$message({
              type: 'success',
              message: '重置成功!'
            })
          })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消'
          // })
        })
    },
    //编辑行
    editRow(index, row) {
      this.isAdd = false
      this.ruleForm = row
      // this.showUE = true
      this.dialogVisible = true
    },
    //删除行
    deleteRow(index, row) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.ruleForm = row
          if (this.ruleForm.imgurl) {
            let delateImg = await this.delateImgAll()
            if (delateImg.code == 200) {
              await this.$axios
                .post(this.$api.deleteUser, { uid: row.uid })
                .then(res => {
                  this.getUserList()
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  })
                })
            }
          } else {
            await this.$axios
              .post(this.$api.deleteUser, { uid: row.uid })
              .then(res => {
                this.getUserList()
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    addUser() {
      this.fileList = []
      this.dialogVisible = true
      this.isAdd = true
      this.ruleForm = {
        imgurl: '',
        uid: '',
        team: '',
        username: '',
        role: '',
        phone: '',
        idcard: '', //身份证
        address: '', //家庭住址
        isrecomed: '', //是否推荐至咨询顾问
        intro: '', //顾问介绍
        seedata: '否', //客户查询
        seeall: '否', //全部客户
        remarks: '',
        time: ''
      }
    },
    //提交信息
    submitForm(formName) {
      let _this = this
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (!/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.ruleForm.phone)) {
            this.$message.error('请输入正确手机号')
            return
          }
          if (this.ruleForm.idcard && this.ruleForm.idcard.length != 18) {
            this.$message.error('请输入正确身份证号')
            return
          }
          
          _this.ruleForm.remarks = _this.$refs.editor.getUEContent()
          if (_this.isAdd) {
            let newdata = {
            skip: 0,
            limit: 9,
            fuzz: 'phone',
            input: this.ruleForm.phone
          }
          let rel = await this.$axios.post(this.$api.findUser, newdata)
          if (rel.code == 200) {
            if (rel.data[0].data.length > 0) {
              this.$message.error('该手机号已存在')
              return
            }
          }
            //新增
            delete _this.ruleForm._id
            _this.createNewUser()
            _this.dialogVisible = false
          } else {
            var res = await _this.$axios.post(
              _this.$api.updateUser,
              _this.ruleForm
            )
            if (res.code == 200) {
              _this.$message.success('操作成功')
              _this.dialogVisible = false
              _this.getUserList()
            }
          }
        }
      })
    },
    delateImgAll() {
      //删除图片封装
      var url = this.ruleForm.imgurl
      var index = url.lastIndexOf('/')
      var fileName = url.slice(index + 1)
      return this.$axios.post(this.$api.delateUserImg, {
        fileName
      })
    },
    onError(err, file, fileList) {
      this.$message.error('文件上传失败')
    },
    //上传图片成功钩子
    async handSuccess(res, file, fileList) {
      if (res.code == 200) {
        if (!this.isAdd) {
          await this.$axios.post(this.$api.updateUser, {
            uid: this.ruleForm.uid,
            imgurl: res.data
          })
        }
        if (this.ruleForm.imgurl) {
          var url = this.ruleForm.imgurl
          var index = url.lastIndexOf('/')
          var fileName = url.slice(index + 1)
          await this.$axios.post(this.$api.delateUserImg, { fileName })
        }
        this.ruleForm.imgurl = res.data
        this.fileList = []
        this.$logsImg.createlogsImg(
          this.$api.uploadUserImg,
          this.ruleForm.imgurl
        ) //添加操作日志
        this.$message.success('文件上传成功')
      }
    },
    async createNewUser() {
      var arr = JSON.parse(JSON.stringify(this.ruleForm))
      arr.password = '123456' //默认初始密码
      let createUser = await this.$axios.post(this.$api.createUser, arr)
      if (createUser.code == 200) {
        this.getUserList()
        this.$message.success('创建成功')
      }
    },
    //取消修改
    resetForm(formName) {
      // this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    handleSizeChange(val) {
      this.find.limit = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.find.currentPage = val
      this.getUserList()
    },
    handleClose(done) {
      this.dialogVisible = false
      // this.showUE = false;
    }
  }
}
</script>

<style scoped>
::v-deep .el-select {
  min-width: 100px;
}
.findInput {
  width: 400px;
}
.header {
  border-bottom: 1px solid #909399;
  padding-bottom: 15px;
}
.inputWidth {
  width: 217px;
}
</style>
