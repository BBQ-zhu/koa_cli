<template>
  <div class="card">
    <div class="header flex">
      <el-button
        type="primary"
        icon="el-icon-upload"
        @click="(dialogVisible = true), (isAdd = true)"
      >发起签约</el-button>
      <el-select
        class="ml20"
        v-model="selectInput"
        placeholder="请选择合同类型"
        @change="(classType = 'type'), findClass()"
      >
        <el-option
          v-for="item in dynamicTags"
          :key="item._id"
          :label="item.name"
          :value="item.name"
        ></el-option>
      </el-select>
      <el-input placeholder="请输入内容" v-model="input" class="input-with-select findInput ml20">
        <el-select v-model="classType" slot="prepend" placeholder="请选择" style="width: 120px">
          <el-option
            v-for="(item, index) in tableHeader"
            :key="index + 'h'"
            :label="item.name"
            :value="item.prop"
          ></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="getNewsList()"></el-button>
      </el-input>
      <!-- <el-input placeholder="请输入产品名称" v-model="input" class="input-with-select findInput ml20">
        <el-button slot="append" icon="el-icon-search" @click="classType = 'name',getNewsList()"></el-button>
      </el-input>-->
    </div>
    <!-- 编辑区域 -->
    <div v-if="dialogVisible" class="window">
      <span>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          style="width: 80%"
        >
          <div class="flex">
            <el-form-item label="合同类型:" prop="type">
              <el-select style="width: 100%" v-model="ruleForm.type" placeholder="请选择合同类型">
                <el-option
                  v-for="item in dynamicTags"
                  :key="item._id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客户名称:" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入客户名称"></el-input>
            </el-form-item>
            <el-form-item label="客户电话:" prop="phone">
              <el-input v-model="ruleForm.phone" placeholder="请输入客户电话"></el-input>
            </el-form-item>
            <el-form-item label="付款方式:" prop="manner">
              <el-input v-model="ruleForm.manner" placeholder="请输入付款方式"></el-input>
            </el-form-item>
            <el-form-item label="约定费用:" prop="expenses">
              <el-input v-model="ruleForm.expenses" placeholder="请输入约定费用"></el-input>
            </el-form-item>
            <el-form-item label="合同名称:" prop="conname">
              <el-input disabled v-model="ruleForm.conname" placeholder="请输入合同名称"></el-input>
            </el-form-item>
            <el-form-item label="合同文档:" prop="imgurl">
              <div style="position: relative">
                <el-input placeholder="请上传合同文档" v-model="ruleForm.imgurl" disabled></el-input>
                <el-upload
                  style="position: absolute; top: 0; right: -110px"
                  class="upload-demo"
                  :data="ruleForm"
                  :action="this.$api.uploadContractImg"
                  :headers="uploadHeader"
                  :on-error="onError"
                  :on-success="handSuccess"
                  :show-file-list="false"
                  :limit="1"
                >
                  <el-button type="primary">点击上传</el-button>
                </el-upload>
              </div>
            </el-form-item>
          </div>
        </el-form>
        <UE :defaultMsg="ruleForm.remarks" :config="config" :id="ueId" ref="editor"></UE>
      </span>
      <div class="flex mt10 windBtn">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="uploadBtn('ruleForm')">确 定</el-button>
      </div>
    </div>
    <!-- 表格区域 -->
    <el-table v-if="!dialogVisible" :data="tableData" stripe>
      <el-table-column label="电子合同" min-width="100px">
        <template slot-scope="scope">
          <el-tooltip placement="right">
            <div slot="content">
              <img :src="scope.row.imgurl" />
            </div>
            <!-- <img :src="scope.row.imgurl" class="tableImg" /> -->
            <span
              class="tableImg"
              @click="$common.download(scope.row.imgurl,scope.row.conname)"
            >{{scope.row.conname}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in tableHeader"
        :key="index"
        :prop="item.prop"
        :label="item.name"
        show-overflow-tooltip
        min-width="100px"
      ></el-table-column>
      <el-table-column label="操作" width="100px">
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
      v-if="!dialogVisible"
      class="mt20"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="find.currentPage"
      :page-sizes="[10, 20, 50, 100, 200]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="find.total"
    ></el-pagination>
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
      uploadHeader: {
        authorization: JSON.parse(sessionStorage.getItem('userInfo') || {})
          .token
      },
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 220
      },
      dynamicTags: [], //分类
      fileList: [],
      classType: '',
      inputVisible: false,
      inputValue: '',
      selectInput: '',
      input: '', //查询框
      ueId: 'editor8', //多实例情况下使用
      dialogVisible: false,
      isAdd: true,
      ruleForm: {
        type: '',
        conname: '',
        name: '',
        phone: '',
        imgurl: '',
        expenses: '', //费用
        manner: '', //付款方式
        status: '', //签约状态 //初始，待签，待确认，签订完成
        remarks: '',
        time: ''
      },
      rules: {
        name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择合同类型', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入客户电话', trigger: 'blur' }],
        expenses: [
          { required: true, message: '请输入约定费用', trigger: 'blur' }
        ],
        imgurl: [
          { required: true, message: '请上传合同扫描件', trigger: 'blur' }
        ]
      },
      tableData: [],
      tableHeader: [
        { name: '合同类型', prop: 'type' },
        { name: '签约状态', prop: 'status' },
        { name: '客户名称', prop: 'name' },
        { name: '客户电话', prop: 'phone' },
        { name: '约定费用', prop: 'expenses' },
        { name: '付款方式', prop: 'manner' },
        { name: '创建时间', prop: 'time' }
      ],
      find: {
        currentPage: 1, //当前页码
        total: 0, //总页数
        skip: 0, //偏移量
        limit: 10 //每一页的数量
      }
    }
  },
  mounted() {
    this.getNewsList()
    this.findTagList()
  },
  methods: {
    downLoad(url) {
      this.$common.download(url)
    },
    async findTagList() {
      //查询分类
      await this.$axios.post(this.$api.findProductClass).then(res => {
        if (res.code == 200) {
          this.dynamicTags = res.data
        }
      })
    },
    //上传产品图片成功钩子
    handSuccess(res, file, fileList) {
      if (res.code == 200) {
        this.ruleForm.imgurl = res.data
        var fileName = res.data.split('/')
        this.ruleForm.conname = fileName[fileName.length - 1]
        this.fileList = []
        this.$message.success('文件上传成功')
      }
    },
    onError(err, file, fileList) {
      this.$message.error('文件上传失败')
    },
    handleSizeChange(val) {
      this.find.limit = val
      this.getNewsList()
    },
    handleCurrentChange(val) {
      this.find.currentPage = val
      this.getNewsList()
    },
    async findClass() {
      var data = {
        skip: this.find.limit * (this.find.currentPage - 1),
        limit: this.find.limit,
        fuzz: this.classType,
        input: this.selectInput
      }
      await this.$axios.post(this.$api.findContract, data).then(res => {
        this.tableData = res.data[0].data
        this.find.total = res.data[0].total[0].total
      })
      this.input = ''
    },
    async getNewsList() {
      var data = {
        skip: this.find.limit * (this.find.currentPage - 1),
        limit: this.find.limit,
        fuzz: this.classType,
        input: this.input
      }
      await this.$axios.post(this.$api.findContract, data).then(res => {
        this.tableData = res.data[0].data
        this.find.total = res.data[0].total[0].total
      })
      this.selectInput = ''
    },
    //编辑按钮
    editRow(index, row) {
      this.dialogVisible = true
      this.isAdd = false
      this.ruleForm = row
    },
    //删除行
    deleteRow(index, row) {
      this.$confirm('确认删除该产品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(this.$api.delContractImg, this.ruleForm).then(res => {
          this.ruleForm.productimg = ''
          this.$axios
            .post(this.$api.delateContract, { _id: row._id })
            .then(res => {
              if (res.code == 200) {
                this.$message.success('删除成功')
                this.getNewsList()
              }
            })
        })
      })
    },
    handleClose() {
      if (this.isAdd && this.ruleForm.imgurl != '') {
        //新增产品时点了删除，要把图片删除
        this.$axios.post(this.$api.delContractImg, this.ruleForm).then(res => {
          if (res.code == 200) {
            this.ruleForm.imgurl = ''
          }
        })
      }
      this.dialogVisible = false
    },
    //提交信息
    async uploadBtn(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.ruleForm.details = this.$refs.editor.getUEContent()
          if (this.isAdd) {
            //新增
            delete this.ruleForm._id
            var res = await this.$axios.post(
              this.$api.uploadContract,
              this.ruleForm
            )
          } else {
            var res = await this.$axios.post(
              this.$api.updataContract,
              this.ruleForm
            )
          }
          if (res.code == 200) {
            this.$message.success('操作成功')
            this.dialogVisible = false
            this.getNewsList()
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.window {
  width: 100%;
  height: auto;
  /* background:red; */
  box-sizing: border-box;
  padding: 15px 0;
}
.windBtn {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.findInput {
  width: 500px;
}
.new-input {
  width: 220px !important;
}
.tableImg:hover {
  color: #409eff;
}
/* .el-form-item{
  width:302px!important;
} */
</style>
