<template>
  <div class="card">
    <div class="flex header">
      <el-button type="primary" icon="el-icon-plus" @click="addUser()">新增员工</el-button>
      <el-input placeholder="请输入内容" v-model="input" class="input-with-select findInput ml20">
        <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option
            v-for="(item,index) in tableHeader"
            :key="index+'h'"
            :label="item.name"
            :value="item.prop"
          ></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="findFuzz()"></el-button>
      </el-input>
    </div>
      <el-table :data="tableData" stripe >
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
          v-for="(item,index) in tableHeader"
          :key="index+'1'"
          :prop="item.prop"
          :label="item.name"
          min-width="100px"
        ></el-table-column>
        <el-table-column label="操作" min-width="100px">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="editRow(scope.$index, scope.row)"
              type="text"
              size="small"
            >编辑</el-button>
            <el-button
              @click.native.prevent="deleteRow(scope.$index, scope.row)"
              type="text"
              size="small"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    <!-- 页码条 -->
    <el-pagination
      class="mt20"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="find.currentPage"
      :page-sizes="[10, 20, 50, 100,200]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="find.total"
    ></el-pagination>

    <!-- 弹出框 -->
    <el-dialog title="员工信息" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="姓名:" prop="username">
            <el-input v-model="ruleForm.username" placeholder="请输入员工姓名" class="inputWidth"></el-input>
          </el-form-item>
          <el-form-item label="角色:" prop="role">
            <el-select v-model="ruleForm.role" placeholder="请选择员工角色">
              <el-option
                v-for="item in roleLists"
                :key="item._id"
                :label="item.rolename"
                :value="item.rolename"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电话:" prop="phone">
            <el-input v-model="ruleForm.phone" placeholder="请输入员工电话" class="inputWidth"></el-input>
          </el-form-item>
          <el-form-item label="照片:" prop="imgurl">
            <el-upload
              class="upload-demo"
              :action="this.$api.userImgUrl"
              :headers="uploadHeader"
              :on-remove="handleRemove"
              :on-success="handSuccess"
              :file-list="fileList"
              :limit="imgLimit"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传一张图片，重新上传前请先删除原图片</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      uploadHeader: {
        authorization: JSON.parse(sessionStorage.getItem('userInfo') || {}).token
      },
      fileList: [],
      imgLimit: 1, //最多上传一张
      isAdd: true,
      tableData: [],
      tableHeader: [
        { name: '工号', prop: 'uid' },
        { name: '姓名', prop: 'username' },
        { name: '角色', prop: 'role' },
        { name: '电话', prop: 'phone' }
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
      ruleForm: {
        imgurl: '',
        uid: '',
        username: '',
        role: '',
        phone: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        role: [{ required: true, message: '请选择员工角色', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.getUserList()
    this.findRoleList()
  },
  methods: {
    //获取用户列表
    getUserList() {
      var data = {
        skip: this.find.limit * (this.find.currentPage - 1),
        limit: this.find.limit
      }
      this.$axios.post(this.$api.findUser, data).then(res => {
        this.tableData = res.data[0].data
        this.find.total = res.data[0].total[0].total
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
        input: this.input
      }
      this.$axios.post(this.$api.findUser, data).then(res => {
        this.tableData = res.data[0].data
        this.find.total = res.data[0].total ? res.data[0].total[0].total : 0
      })
    },
    //编辑行
    editRow(index, row) {
      this.dialogVisible = true
      this.isAdd = false
      this.ruleForm = row
      console.log(this.ruleForm)
      if (this.ruleForm.imgurl) {
        this.fileList = []
        this.fileList.push({ name: '头像', url: this.ruleForm.imgurl })
      } else {
        this.fileList = []
      }
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
            await this.$axios.post(this.$api.deleteUser, row.uid).then(res => {
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
    },
    //提交信息
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          console.log(this.fileList)
          if (this.isAdd) {
            //新增
            if (this.fileList.length) {
              //有图片的情况就先上传图片
              let uploadImg = await this.$axios.post(this.$api.uploadImg, {
                name: this.fileList[0].name,
                path: this.fileList[0].url
              })
              if (uploadImg.code == 200) {
                this.ruleForm.imgurl = uploadImg.data
                this.createNewUser()
              }
            } else {
              this.createNewUser()
            }
          } else {
            //更新
            if (this.fileList.length && this.ruleForm.imgurl) {
              console.log('this.fileList.length && this.ruleForm.imgurl')
              let delateImg = await this.delateImgAll()
              if (delateImg.code == 200) {
                let uploadImg = await this.$axios.post(this.$api.uploadImg, {
                  name: this.fileList[0].name,
                  path: this.fileList[0].url
                })
                if (uploadImg.code == 200) {
                  this.ruleForm.imgurl = uploadImg.data
                }
              }
            } else if (!this.fileList.length && this.ruleForm.imgurl) {
              console.log('!this.fileList.length && this.ruleForm.imgurl')
              let delateImg = await this.delateImgAll()
              if (delateImg.code == 200) {
                this.ruleForm.imgurl = ''
              }
            } else if (this.fileList.length && !this.ruleForm.imgurl) {
              console.log('this.fileList.length && !this.ruleForm.imgurl')
              let uploadImg = await this.$axios.post(this.$api.uploadImg, {
                name: this.fileList[0].name,
                path: this.fileList[0].url
              })
              if (uploadImg.code == 200) {
                this.ruleForm.imgurl = uploadImg.data
              }
            }
            console.log(this.ruleForm)
            console.log(this.fileList)
            this.$axios.post(this.$api.updateUser, this.ruleForm).then(res => {
              this.$message.success('修改成功')
            })
          }
          this.getUserList()
          this.dialogVisible = false
        }
      })
    },
    delateImgAll() {
      //删除图片封装
      var url = this.ruleForm.imgurl
      var index = url.lastIndexOf('/')
      var fileName = url.slice(index + 1)
      return this.$axios.post(this.$api.delateImg, {
        fileName
      })
    },
    //删除图片钩子（假删除）
    handleRemove(file, fileList) {
      this.fileList = []
    },
    //上传图片成功钩子
    handSuccess(res, file, fileList) {
      if (res.code == 200) {
        this.fileList = []
        this.fileList.push({ name: file.name, url: res.data })
        console.log(res, file, fileList)
      }
    },
    async createNewUser() {
      var arr = JSON.parse(JSON.stringify(this.ruleForm))
      arr.password = 123456 //默认初始密码
      let createUser = await this.$axios.post(this.$api.createUser, arr)
      if (createUser.code == 200) {
        this.getUserList()
        this.$message.success('创建成功')
      }
    },
    //取消修改
    resetForm(formName) {
      this.$refs[formName].resetFields()
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
    }
  }
}
</script>

<style scoped>
::v-deep .el-select {
  min-width: 100px;
}
::v-deep .el-input-group__append {
  background-color: #fff;
}
::v-deep .el-input-group__prepend {
  background-color: #fff;
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
