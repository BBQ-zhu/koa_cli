<template>
  <div class="card">
    <div class="header flex">
      <el-button type="primary" v-if="meth[0]" icon="el-icon-upload" @click="upload">上传咨询客户</el-button>
      <el-select
        class="ml20"
        style="width: 202px"
        v-model="selectInput"
        placeholder="请选择"
        @change="(classType = 'type'), findClass()"
      >
        <el-option
          v-for="item in productClass"
          :key="item._id"
          :label="item.name"
          :value="item.name"
        ></el-option>
      </el-select>
      <el-input placeholder="请输入内容" v-model="input" class="input-with-select findInput ml20">
        <el-select v-model="select" slot="prepend" placeholder="请选择" style="width: 130px">
          <el-option
            v-for="(item, index) in tableHeader"
            :key="index + 'h'"
            :label="item.name"
            :value="item.prop"
          ></el-option>
        </el-select>
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="(find.currentPage = 1), getNewsList()"
        ></el-button>
      </el-input>
    </div>
    <div v-if="dialogVisible" class="window">
      <span>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="120px"
          class="demo-ruleForm"
        >
          <div class>
            <el-form-item label="业务类别:" prop="type">
              <el-select class v-model="ruleForm.type" placeholder="请选择">
                <el-option
                  v-for="item in productClass"
                  :key="item._id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产品名称:" prop="proname">
              <el-input v-model="ruleForm.proname" placeholder="请输入产品名称"></el-input>
            </el-form-item>
            <el-form-item label="咨询人姓名:" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入咨询人姓名"></el-input>
            </el-form-item>
            <el-form-item label="咨询人电话:" prop="phone">
              <el-input v-model="ruleForm.phone" placeholder="请输入咨询人电话"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div class="title mt20 mb20">备注信息</div>
        <UE :defaultMsg="ruleForm.remarks" :config="config" :id="ueId" ref="editor"></UE>
      </span>
      <div class="flex mt10 windBtn">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" v-if="meth[0] || meth[2]" @click="uploadBtn('ruleForm')">确 定</el-button>
      </div>
    </div>
    <el-table v-if="!dialogVisible" :data="tableData" stripe>
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
            v-if="meth[1]"
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
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 220
      },
      ueId: 'editor3',
      selectInput: '',
      dialogVisible: false,
      isAdd: true,
      select: '',
      input: '',
      ruleForm: {
        type: '', //分类
        proname: '', //产品名称
        name: '', //姓名
        phone: '', //电话
        remarks: '', //备注
        time: ''
      },
      cloneRuleForm: {}, //用于备份
      rules: {
        type: [{ required: true, message: '请选择业务类别', trigger: 'blur' }],
        proname: [
          { required: true, message: '请输入产品名字', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入咨询人姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入咨询人电话', trigger: 'blur' }
        ]
      },
      productClass: [],
      tableData: [],
      tableHeader: [
        { name: '咨询人姓名', prop: 'proname' },
        { name: '咨询类型', prop: 'type' },
        { name: '咨询人电话', prop: 'phone' },
        { name: '咨询时间', prop: 'time' }
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
    this.mixinMethod(this.$route.path)
    if (this.$route.query.phone) {
      this.select = 'phone'
      this.input = this.$route.query.phone
    }
    this.cloneRuleForm = JSON.parse(JSON.stringify(this.ruleForm))
    this.findProductClass()
    this.getNewsList()
  },
  methods: {
    async findProductClass() {
      await this.$axios.post(this.$api.findProductClass).then(res => {
        if (res.code == 200) {
          let arr = [
            { _id: '1', name: '专业顾问' },
            { _id: '2', name: '加入我们' },
            { _id: '3', name: '推荐客户' },
            { _id: '4', name: '商务合作' }
          ]
          this.productClass = res.data.concat(arr)
        }
      })
    },
    upload() {
      this.dialogVisible = !this.dialogVisible
      this.isAdd = true
      this.ruleForm = JSON.parse(JSON.stringify(this.cloneRuleForm))
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
      await this.$axios.post(this.$api.findIntegrate, data).then(res => {
        this.tableData = res.data[0].data
        this.find.total = res.data[0].total[0].total
      })
      this.input = ''
    },
    async getNewsList() {
      var data = {
        skip: this.find.limit * (this.find.currentPage - 1),
        limit: this.find.limit,
        fuzz: this.select,
        input: this.input
      }
      this.$axios.post(this.$api.findIntegrate, data).then(res => {
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
      this.$confirm('确认删除该信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios
          .post(this.$api.deleteIntegrate, { _id: row._id })
          .then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功')
              this.getNewsList()
            }
          })
      })
    },
    handleClose() {
      this.dialogVisible = false
    },
    async uploadBtn(formName) {
      //提交
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.ruleForm.remarks = this.$refs.editor.getUEContent()
          if (this.isAdd) {
            //新增
            delete this.ruleForm._id
            var res = await this.$axios.post(
              this.$api.createIntegrate,
              this.ruleForm
            )
          } else {
            var res = await this.$axios.post(
              this.$api.updateIntegrate,
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
.el-select {
  width: 100%;
}
::v-deep .el-collapse-item__header {
  font-weight: 700 !important;
  font-size: 15px !important;
}
.title {
  font-weight: 600 !important;
  font-size: 15px !important;
}
::v-deep .el-select {
  min-width: 100px;
}
.findInput {
  width: 400px;
}
</style>
