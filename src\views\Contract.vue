<template>
  <div class="card">
    <div class="header flex">
      <el-button v-if="meth[0]" type="primary" icon="el-icon-upload" @click="uploadNew">发起签约</el-button>
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
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="(find.currentPage = 1), getNewsList()"
        ></el-button>
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
          style="width: 100%"
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
            <el-form-item label="客户电话:" prop="phone">
              <el-input v-model="ruleForm.phone" placeholder="请输入客户电话" @blur="findVipUser"></el-input>
            </el-form-item>
            <el-form-item label="客户名称:" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入客户名称"></el-input>
            </el-form-item>

            <el-form-item label="放款金额:" prop="expenses">
              <el-input v-model="ruleForm.expenses" placeholder="请输入放款金额"></el-input>
            </el-form-item>
            <el-form-item label="客户经理:" prop="manager1">
              <el-select v-model="ruleForm.manager1" filterable placeholder="请选择">
                <el-option
                  v-for="item in userList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="权证经理:" prop="manager2">
              <el-select v-model="ruleForm.manager2" filterable placeholder="请选择">
                <el-option
                  v-for="item in userList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="审核经理:" prop="manager3">
              <el-select v-model="ruleForm.manager3" filterable placeholder="请选择">
                <el-option
                  v-for="item in userList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="收费方式:" prop="mode">
              <el-select style="width: 100%" v-model="ruleForm.mode" placeholder="请选择收费方式">
                <el-option label="比例收费" value="比例收费"></el-option>
                <el-option label="直接收费" value="直接收费"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="ruleForm.mode == '比例收费'" label="抽成比例(%):" prop="ratio">
              <el-input v-model="ruleForm.ratio" placeholder="抽成比例:例如3"></el-input>
            </el-form-item>
            <el-form-item v-if="ruleForm.mode == '直接收费'" label="服务费用:" prop="service">
              <el-input v-model="ruleForm.service" placeholder="请输入服务费用"></el-input>
            </el-form-item>
            <el-form-item label="贷款类型:" prop="loantype">
              <el-select style="width: 100%" v-model="ruleForm.loantype" placeholder="请选择贷款类型">
                <el-option label="抵押贷款" value="抵押贷款"></el-option>
                <el-option label="信用贷款" value="信用贷款"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="ruleForm.loantype == '抵押贷款' ? '抵押物：':'申请物：'" prop="collateral">
              <el-input v-model="ruleForm.collateral" placeholder="请输入抵押物、申请物"></el-input>
            </el-form-item>
            <el-form-item label="服务保证金:" prop="margin">
              <el-input v-model="ruleForm.margin" placeholder="请输入服务保证金"></el-input>
            </el-form-item>
            <el-form-item label="付款方式:" prop="manner">
              <el-input v-model="ruleForm.manner" placeholder="请输入付款方式"></el-input>
            </el-form-item>
            <el-form-item label="签约提示:" prop="conname">
              <el-input v-model="ruleForm.conname" placeholder="请输入签约提示"></el-input>
            </el-form-item>
            <el-form-item label="起始日期:" prop="startime">
              <el-date-picker
                style="width: 100%"
                v-model="ruleForm.startime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择起始日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="结束日期:" prop="endtime">
              <el-date-picker
                style="width: 100%"
                v-model="ruleForm.endtime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="提示方式:" prop="optertime">
              <el-select style="width: 100%" v-model="ruleForm.optertime" placeholder="请选择提示方式">
                <el-option label="月提示" value="月提示"></el-option>
                <el-option label="年提示" value="年提示"></el-option>
                <el-option label="不提示" value="不提示"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="提示日期:" prop="tipstime">
              <el-input placeholder="请输入提前几天提示,例：7" v-model="ruleForm.tipstime"></el-input>
            </el-form-item>
            
            <el-form-item label="签约状态:" prop="status">
              <el-select
                style="width: 100%"
                v-model="ruleForm.status"
                placeholder="请选择签约状态"
                @change="statusChange"
              >
                <el-option label="待签约" value="待签约"></el-option>
                <el-option label="审核中" value="审核中"></el-option>
                <el-option label="驳回" value="驳回"></el-option>
                <el-option label="签约成功" value="签约成功"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="合同图片:" prop="imgurl">
              <div style="position: relative">
                <el-input placeholder="请上传合同图片" v-model="ruleForm.imgurl" disabled></el-input>
                <el-upload
                  v-if="meth[0] || meth[2]"
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

        <el-button type="primary" @click="proContract">生成合同</el-button>

        <UE class="mt20" v-if="showUE" :defaultMsg="ruleForm.remarks" :config="config" :id="ueId" ref="editor"></UE>
      </span>
      <div class="flex mt10 windBtn">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" v-if="meth[0] || meth[2]" @click="uploadBtn('ruleForm')">确 定</el-button>
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
            <span
              class="colorBlue"
              @click="conDownLoad(scope.row.imgurl, scope.row.name+'-'+scope.row.time)"
            >{{ scope.row.name }}</span>
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
import {contractTxt} from '../assets/js/contractTxt.js'
export default {
  components: {
    UE
  },
  data() {
    return {
      userList:[], //员工列表
      showUE:false,
      uploadHeader: {
        authorization: JSON.parse(sessionStorage.getItem('userInfo') || '{}')
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
      vipUser: {},
      oldPhone: {},
      ruleForm: {
        type: '',
        conname: '',
        name: '',
        phone: '',
        imgurl: '',
        expenses: '', //放款金额
        mode: '比例收费', //收费方式:比例收费、直接收费
        ratio: '', //抽成比例
        service: '', //服务费用
        loantype:'', //贷款类型：抵押贷款，信用贷款
        collateral:'', //抵押物、申请物
        margin:'', //委托服务保证金
        manner: '', //付款方式
        status: '待签约', //签约状态-待签约，待确认，驳回，签约成功
        remarks: '',
        startime: '',
        endtime: '',
        optertime: '',
        tipstime: '7',
        manager1: '', //客户经理
        manager2: '', //权证经理
        manager3: '', //审核经理
        time: '' //创建时间
      },
      rules: {
        name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择合同类型', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入客户电话', trigger: 'blur' }],
        expenses: [
          { required: true, message: '请输入放款金额', trigger: 'blur' }
        ],
        mode: [
          { required: true, message: '请选择收费方式', trigger: 'blur' }
        ],
        loantype: [
          { required: true, message: '请选择贷款类型', trigger: 'blur' }
        ],
        margin: [
          { required: true, message: '请输入委托服务保证金', trigger: 'blur' }
        ],
        startime: [
          { required: true, message: '请选择合同起始日期', trigger: 'blur' }
        ],
        endtime: [
          { required: true, message: '请选择合同结束日期', trigger: 'blur' }
        ],
        optertime: [
          { required: true, message: '请选择提示方式', trigger: 'blur' }
        ]
      },
      tableData: [],
      tableHeader: [
        { name: '合同类型', prop: 'type' },
        { name: '签约状态', prop: 'status' },
        { name: '客户电话', prop: 'phone' },
        { name: '放款金额', prop: 'expenses' },
        { name: '客户经理', prop: 'manager1' },
        { name: '权证经理', prop: 'manager2' },
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
  async created() {
    await this.findUserList()
  },
  mounted() {
    this.mixinMethod(this.$route.path)
    this.getNewsList()
    this.findTagList()
    
  },
  watch:{
    dialogVisible(val){
      if(val){
        this.showUE = val
      }
    }
  },
  methods: {
    // 获取员工列表
    async findUserList() {
      var data = {
        skip: 0,
        limit: 99999999
      }
      await this.$axios.post(this.$api.findUser, data).then(res => {
        if (res.code == 200) {
          this.userList = []
          let arr = res.data[0].data
          arr.map(item=>{
            let obj = {}
            obj.label = `${item.username}（${item.uid}）`
            obj.value = item.uid
            this.userList.push(obj)
          })
        }
      })
    },
    //生成合同
    proContract(){
      this.showUE = false
      this.$confirm('确认生成合同信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        
        this.ruleForm.remarks = ''
        this.ruleForm.remarks = await contractTxt(this.ruleForm,this.vipUser)
        this.showUE = true //赋值之后再将富文本显示
      }).catch(() => {
        this.showUE = true
      })
    },
    //是否生成合同弹框
    async findVipUser() {
      if (this.ruleForm.phone == this.oldPhone) {
        return
      } else if(/^1[3|4|5|7|8]\d{9}$/.test(this.ruleForm.phone)) {
        this.oldPhone = JSON.parse(JSON.stringify(this.ruleForm.phone))
        this.$confirm('是否获取客户信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(async () => {
          await this.finduserInfo()
        })
      }
    },
    //查询用户详情
    async finduserInfo(){
      var data = {
            skip: 0,
            limit: 999999,
            fuzz: 'phone',
            input: this.ruleForm.phone
          }
          let res = await this.$axios.post(this.$api.findCustomer, data)
          if (
            res.code == 200 &&
            res.data[0].data &&
            res.data[0].data.length > 0
          ) {
            this.vipUser = {}
            let arr = res.data[0].data
            //时间排序，拿到最新的数据
            arr.sort(function(a,b){
              return a.time < b.time ? 1 : -1
            })
            this.vipUser = arr[0]
            //查询到用户后将信息赋值
            this.ruleForm.name = this.vipUser.name
            this.ruleForm.expenses = this.vipUser.fund //放款额
            this.ruleForm.manager1 = this.vipUser.manager1
            this.ruleForm.manager2 = this.vipUser.manager2
            this.ruleForm.manager3 = this.vipUser.manager3
          }
    },
    //上传按钮重置
    uploadNew() {
      this.ruleForm = {
        type: '',
        conname: '',
        name: '',
        phone: '',
        imgurl: '',
        expenses: '', //放款金额
        mode: '比例收费', //收费方式:比例收费、直接收费
        ratio: '', //抽成比例
        service: '', //服务费用
        loantype:'', //贷款类型：抵押贷款，信用贷款
        collateral:'', //抵押物、申请物
        margin:'', //委托服务保证金
        manner: '', //付款方式
        status: '待签约', //签约状态-待签约，待确认，驳回，签约成功
        remarks: '',
        startime: '',
        endtime: '',
        optertime: '',
        tipstime: '7',
        manager1: '', //客户经理
        manager2: '', //权证经理
        manager3: '', //审核经理
        time: '' //创建时间
      }
      this.dialogVisible = true
      this.isAdd = true
    },
    statusChange(e) {
      console.log(e)
    },
    async conDownLoad(url, name) {
      await this.$logsImg.createlogsImg('api/downLoad', '下载合同文件') //添加操作日志
      window.open(url)
      // this.$common.download(url, name)
    },
    async findTagList() {
      //查询分类
      await this.$axios.post(this.$api.findProductClass).then(res => {
        if (res.code == 200) {
          this.dynamicTags = res.data
        }
      })
    },
    //上传合同图片成功钩子
    async handSuccess(res, file, fileList) {
      if (res.code == 200) {
        if (!this.isAdd) {
          await this.$axios.post(this.$api.updataContract, {
            _id: this.ruleForm._id,
            imgurl: res.data
          })
        }
        if (this.ruleForm.imgurl) {
          await this.$axios.post(this.$api.delContractImg, this.ruleForm)
        }
        this.ruleForm.imgurl = res.data
        this.fileList = []
        this.$logsImg.createlogsImg(
          this.$api.uploadContractImg,
          this.ruleForm.imgurl
        ) //添加操作日志
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
    async editRow(index, row) {
      this.isAdd = false
      await this.$axios
        .post(this.$api.findOneContract, { _id: row._id })
        .then(async res => {
          if (res.code == 200) {
            this.ruleForm = {}
            this.ruleForm = res.data[0]
            // await this.finduserInfo()
            this.dialogVisible = true
          } else {
            this.$message.error('查询失败')
          }
        })
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
      // this.showUE = false
    },
    //提交信息
    async uploadBtn(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.ruleForm.remarks= this.$refs.editor.getUEContent()
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
  color: #8699ad;
}
</style>
