<template>
  <div class="card">
    <div class="header flex">
      <el-button
        type="primary"
        icon="el-icon-collection-tag"
        class="mr20"
        @click="typeClass=true"
      >分类管理</el-button>
      <el-button type="primary" icon="el-icon-upload" @click="dialogVisible=true,isAdd=true">上传产品</el-button>
      <el-select class="ml20" v-model="selectInput" placeholder="请选择" @change="classType = 'type',findClass()">
        <el-option
          v-for="item in dynamicTags"
          :key="item.type"
          :label="item.type"
          :value="item.type"
        ></el-option>
      </el-select>
      <el-input placeholder="请输入内容" v-model="input" class="input-with-select findInput ml20">
        <el-select v-model="classType" slot="prepend" placeholder="请选择" style="width:120px">
          <el-option
            v-for="(item,index) in tableHeader"
            :key="index+'h'"
            :label="item.name"
            :value="item.prop"
          ></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="getNewsList()"></el-button>
      </el-input>
      <!-- <el-input placeholder="请输入产品名称" v-model="input" class="input-with-select findInput ml20">
        <el-button slot="append" icon="el-icon-search" @click="classType = 'name',getNewsList()"></el-button>
      </el-input> -->
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
          style="width:80%"
        >
        <div class="flex">
          <el-form-item label="产品名称:" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入产品名称"></el-input>
          </el-form-item>
          <el-form-item label="产品分类:" prop="type">
            <el-select style="width:100%" v-model="ruleForm.type" placeholder="请选择">
              <el-option
                v-for="item in dynamicTags"
                :key="item.type"
                :label="item.type"
                :value="item.type"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品价格:" prop="newprice">
            <el-input v-model="ruleForm.newprice" placeholder="请输入产品价格"></el-input>
          </el-form-item>
          <el-form-item label="产品原价格:" prop="oldprice">
            <el-input v-model="ruleForm.oldprice" placeholder="请输入产品原价格"></el-input>
          </el-form-item>
          
          <el-form-item label="产品描述:" prop="description">
            <el-input v-model="ruleForm.description" placeholder="请输入产品描述"></el-input>
          </el-form-item>
          <el-form-item label="产品推荐:" prop="recommend">
            <el-select style="width:100%" v-model="ruleForm.recommend" placeholder="请选择">
              <el-option label="推荐" value="推荐"></el-option>
              <el-option label="不推荐" value="不推荐"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品图片:" prop="productimg">
            <div style="position:relative;">
              <el-input placeholder="请上传产品图片" v-model="ruleForm.productimg" disabled></el-input>
              <el-upload
                style="position:absolute;top:0;right:-110px"
                class="upload-demo"
                :data="ruleForm"
                :action="this.$api.uploadProductImg"
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
        <UE :defaultMsg="ruleForm.details" :config="config" :id="ueId" ref="editor"></UE>
      </span>
      <div class="flex mt10 windBtn">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="uploadBtn('ruleForm')">确 定</el-button>
      </div>
    </div>
    <!-- 表格区域 -->
    <el-table v-if="!dialogVisible" :data="tableData" stripe>
      <el-table-column label="产品图片" min-width="100px">
        <template slot-scope="scope">
          <el-tooltip placement="right">
            <div slot="content">
              <img :src="scope.row.productimg" />
            </div>
            <img :src="scope.row.productimg" class="tableImg" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item,index) in tableHeader"
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
    <!-- 分类管理 -->
    <el-dialog title="产品分类" :visible.sync="typeClass" width="40%">
      <span>
        <el-tag
          class="mr10 mt10"
          :key="index +'tag'"
          v-for="(tag,index) in dynamicTags"
          closable
          :disable-transitions="false"
          @close="tagClose(tag)"
        >{{tag.type}}</el-tag>
        <el-input
          class="input-new-tag mt10"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        ></el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新增分类</el-button>
      </span>
    </el-dialog>
    <!-- 页码条 -->
    <el-pagination
      v-if="!dialogVisible"
      class="mt20"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="find.currentPage"
      :page-sizes="[find.limit, 20, 50, 100,200]"
      :page-size="find.limit"
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
      classType:'name',
      dynamicTags: [], //团队标签
      inputVisible: false,
      inputValue: '',
      selectInput:'',
      input: '', //查询框
      ueId: 'editor5', //多实例情况下使用
      dialogVisible: false,
      isAdd: true,
      typeClass: false,
      ruleForm: {
        name: '',
        description:'', //产品描述
        recommend:'', //不推荐 推荐
        type: '',
        newprice: '',
        oldprice: '',
        productimg: '',
        details: '',
        time:''
      },
      rules: {
        name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择产品分类', trigger: 'blur' }],
        newprice: [
          { required: true, message: '请输入产品价格', trigger: 'blur' }
        ],
        productimg: [
          { required: true, message: '请上传产品图片', trigger: 'blur' }
        ]
      },
      tableData: [],
      tableHeader: [
        { name: '产品名称', prop: 'name' },
        { name: '产品描述', prop: 'description' },
        { name: '产品类型', prop: 'type' },
        { name: '产品现价', prop: 'newprice' },
        { name: '产品推荐', prop: 'recommend' },
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
    async findTagList() {
      //查询团队
      await this.$axios.post(this.$api.findProductClass).then(res => {
        if (res.code == 200) {
          this.dynamicTags = res.data
        }
      })
    },
    async tagClose(tag) {
      //删除团队标签
      this.$confirm('此操作将永久删除该产品分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$axios
            .post(this.$api.delProductClass, { _id: tag._id })
            .then(res => {
              if (res.code == 200) {
                this.findTagList()
              }
            })
        })
        .catch(() => {})
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async handleInputConfirm() {
      //新增产品分类
      let inputValue = this.inputValue
      if (inputValue) {
        var data = {
          type: inputValue
        }
        await this.$axios.post(this.$api.createProductClass, data).then(res => {
          if (res.code == 200) {
            this.dynamicTags.push(res.data)
          }
        })
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    //上传图片成功钩子
    handSuccess(res, file, fileList) {
      if (res.code == 200) {
        this.ruleForm.productimg = res.data
        this.$message.success('图片上传成功')
      }
    },
    onError(err, file, fileList) {
      this.$message.error('图片上传失败')
    },
    handleSizeChange(val) {
      this.find.limit = val
      this.getNewsList()
    },
    handleCurrentChange(val) {
      this.find.currentPage = val
      this.getNewsList()
    },
    async findClass(){
      var data = {
        skip: this.find.limit * (this.find.currentPage - 1),
        limit: this.find.limit,
        fuzz: this.classType,
        input: this.selectInput
      }
      await this.$axios.post(this.$api.findProduct, data).then(res => {
        this.tableData = res.data[0].data
        this.find.total = res.data[0].total[0].total
      })
      this.input = ""
    },
    async getNewsList() {
      var data = {
        skip: this.find.limit * (this.find.currentPage - 1),
        limit: this.find.limit,
        fuzz: this.classType,
        input: this.input
      }
      await this.$axios.post(this.$api.findProduct, data).then(res => {
        this.tableData = res.data[0].data
        this.find.total = res.data[0].total[0].total
      })
      this.selectInput = ""
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
        this.$axios.post(this.$api.delProductImg, this.ruleForm).then(res => {
          this.ruleForm.productimg = ''
          this.$axios
            .post(this.$api.delateProduct, { _id: row._id })
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
      if (this.isAdd) {
        //新增产品时点了删除，要把图片删除
        this.$axios.post(this.$api.delProductImg, this.ruleForm).then(res => {
          if (res.code == 200) {
            this.ruleForm.productimg = ''
          }
        })
      }
      this.dialogVisible = false
    },
    async uploadBtn(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.ruleForm.details = this.$refs.editor.getUEContent()
          if (this.isAdd) {
            //新增
            delete this.ruleForm._id
            var res = await this.$axios.post(
              this.$api.uploadProduct,
              this.ruleForm
            )
          } else {
            var res = await this.$axios.post(
              this.$api.updataProduct,
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
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
