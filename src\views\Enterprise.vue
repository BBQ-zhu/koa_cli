<template>
  <div class="card">
    <div class="header flex">
      <el-button v-if="meth[0]" type="primary" icon="el-icon-upload" @click="upload">上传企业资料</el-button>
      <el-select
        @change="tabelShow = false"
        class="ml20"
        style="width: 202px"
        v-model="category"
        placeholder="请选择数据类别"
      >
        <el-option label="我的客户" value="我的客户"></el-option>
        <el-option label="公海客户" value="公海客户"></el-option>
        <el-option
          v-if="userInfo && userInfo.seedata && userInfo.seedata=='是'"
          label="全部客户"
          value="全部客户"
        ></el-option>
      </el-select>
      <el-select clearable class="ml20" v-model="selectInput" placeholder="请选择">
        <el-option label="代理记账" value="代理记账"></el-option>
        <el-option label="企业注册" value="企业注册"></el-option>
        <el-option label="商标注册" value="商标注册"></el-option>
        <el-option label="公司变更" value="公司变更"></el-option>
        <el-option label="公司注销" value="公司注销"></el-option>
        <el-option label="许可证办理" value="许可证办理"></el-option>
        <el-option label="道路运输" value="道路运输"></el-option>
        <el-option label="建筑资质" value="建筑资质"></el-option>
        <el-option label="网站建设" value="网站建设"></el-option>
        <el-option label="其他服务" value="其他服务"></el-option>
      </el-select>
      <el-input
        clearable
        placeholder="请输入内容"
        v-model="input"
        class="input-with-select findInput ml20"
      >
        <el-select clearable v-model="select" slot="prepend" placeholder="请选择" style="width: 130px">
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
          @click="(find.currentPage = 1), getNewsList(),tabelShow = true"
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
          <div class="flex">
            <el-form-item label="业务类型:" prop="type">
              <el-select
                clearable
                style="width: 100%"
                v-model="ruleForm.type"
                placeholder="请选择业务类型"
              >
                <el-option label="代理记账" value="代理记账"></el-option>
                <el-option label="企业注册" value="企业注册"></el-option>
                <el-option label="商标注册" value="商标注册"></el-option>
                <el-option label="公司变更" value="公司变更"></el-option>
                <el-option label="公司注销" value="公司注销"></el-option>
                <el-option label="许可证办理" value="许可证办理"></el-option>
                <el-option label="道路运输" value="道路运输"></el-option>
                <el-option label="建筑资质" value="建筑资质"></el-option>
                <el-option label="网站建设" value="网站建设"></el-option>
                <el-option label="其他服务" value="其他服务"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="企业名称:" prop="entername">
              <el-input clearable v-model="ruleForm.entername" placeholder="请输入企业名称"></el-input>
            </el-form-item>
            <el-form-item label="负责人姓名:" prop="name">
              <el-input clearable v-model="ruleForm.name" placeholder="请输入负责人姓名"></el-input>
            </el-form-item>
            <el-form-item label="负责人电话:" prop="phone">
              <el-input clearable v-model="ruleForm.phone" placeholder="请输入负责人电话"></el-input>
            </el-form-item>
            <el-form-item label="身份证号:" prop="idcard">
              <el-input clearable v-model="ruleForm.idcard" placeholder="请输入身份证号"></el-input>
            </el-form-item>
            <el-form-item label="法人姓名:" prop="gener">
              <el-input clearable v-model="ruleForm.gener" placeholder="请输入法人姓名"></el-input>
            </el-form-item>
            <el-form-item label="主营业务:" prop="main">
              <el-input clearable v-model="ruleForm.main" placeholder="请输入主营业务"></el-input>
            </el-form-item>
            <el-form-item label="归属团队:" prop="hometeam">
              <el-select
                clearable
                style="width: 100%"
                v-model="ruleForm.hometeam"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in teamList"
                  :key="item.teamname"
                  :label="item.teamname"
                  :value="item.teamname"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客户经理:" prop="manager1">
              <el-select
                clearable
                style="width:100%"
                v-model="ruleForm.manager1"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in userList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="金融客服:" prop="manager2">
              <el-select
                clearable
                style="width:100%"
                v-model="ruleForm.manager2"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in userList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="代办客服:" prop="manager3">
              <el-select
                clearable
                style="width:100%"
                v-model="ruleForm.manager3"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in userList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="审核状态:" prop="status">
              <el-select
                clearable
                style="width: 100%"
                v-model="ruleForm.status"
                placeholder="请选择审核状态"
              >
                <el-option
                  v-for="item in fixedInfo.statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="审批反馈:" prop="feedback">
              <el-input
                clearable
                type="textarea"
                :rows="3"
                v-model="ruleForm.feedback"
                placeholder="请输入审批反馈"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div class="title mt20 mb20">备注信息</div>
        <UE v-if="showUE" :defaultMsg="ruleForm.remarks" :config="config" :id="ueId" ref="editor"></UE>
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
      >
      <template slot-scope="scope">
          <span v-if="item.prop == 'phone'">{{$common.phoneNum(scope.row[item.prop])}}</span>
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope" v-if="tabelShow">
          <el-button
            v-if="!scope.row.manager2 && category=='公海客户'"
            @click.native.prevent="pickUp(scope.$index, scope.row)"
            type="text"
            size="small"
          >领取</el-button>
          <el-button
            v-if="category=='我的客户' || category=='全部客户'"
            @click.native.prevent="editRow(scope.$index, scope.row)"
            type="text"
            size="small"
          >编辑</el-button>
          <el-button
            v-if="meth[1] && (category=='我的客户' || category=='全部客户')"
            @click.native.prevent="deleteRow(scope.$index, scope.row)"
            type="text"
            size="small"
          >删除</el-button>
          <el-button
            v-if="category=='我的客户' || category=='全部客户'"
            @click.native.prevent="followUp(scope.$index, scope.row)"
            type="text"
            size="small"
          >跟进中({{scope.row.schedate || 0}})</el-button>
          <el-button
            v-if="category=='我的客户' || category=='全部客户'"
            @click.native.prevent="abandonment(scope.$index, scope.row)"
            type="text"
            size="small"
          >放弃</el-button>
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
import fixedInfo from '../assets/js/fixedInfo.js'
export default {
  components: {
    UE
  },
  data() {
    return {
      tabelShow: true,
      fixedInfo: fixedInfo, //选项配置
      userList: [], //员工列表
      teamList: [], //团队列表
      showUE: false,
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 220
      },
      category: '我的客户', //客户类别切换
      ueId: 'editor7',
      selectInput: '',
      dialogVisible: false,
      isAdd: true,
      select: '',
      input: '',
      ruleForm: {
        type: '', //代理记账、企业注册
        entername: '', //企业名称
        name: '', //负责人姓名
        phone: '', //负责人电话
        idcard: '', //身份证
        gener: '', //法人
        zone: '', //区域
        fund: '', //注册资金
        super: '', //公司监事
        main: '', //主营项目
        scope: '', //经营范围
        accout: '', //天府通账号
        hometeam: '', //归属团队
        manager1: '', //客户经理
        manager2: '', //金融客服
        manager3: '', //代办客服
        status: '草稿', //审核状态 草稿、待审核、审核中、驳回、拒绝、通过、审核结束
        remarks: '', //备注
        time: ''
      },
      cloneRuleForm: {}, //用于备份
      rules: {
        type: [{ required: true, message: '请选择业务类别', trigger: 'blur' }],
        entername: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入负责人姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入负责人电话', trigger: 'blur' }
        ],
        idcard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' }
        ],
        manager1: [
          { required: true, message: '请输入客户经理工号', trigger: 'blur' }
        ]
      },
      tableData: [],
      userInfo: {},
      tableHeader: [
        { name: '业务类型', prop: 'type' },
        { name: '企业名称', prop: 'entername' },
        { name: '负责人姓名', prop: 'name' },
        { name: '负责人电话', prop: 'phone' },
        { name: '客户经理', prop: 'manager1' },
        { name: '金融客服', prop: 'manager2' },
        { name: '审核状态', prop: 'status' },
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
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}')
    this.mixinMethod(this.$route.path)
    if (this.$route.query.phone) {
      this.select = 'phone'
      this.input = this.$route.query.phone
    }
    this.cloneRuleForm = JSON.parse(JSON.stringify(this.ruleForm))
    this.findUserList()
    this.getNewsList()
    this.findTeams()
  },
  watch: {
    dialogVisible(val) {
      if (val) {
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
          arr.map(item => {
            let obj = {}
            obj.label = `${item.username}（${item.uid}）`
            obj.value = item.uid
            this.userList.push(obj)
          })
        }
      })
    },
    findTeams() {
      //查询团队
      this.$axios.post(this.$api.findTeam).then(res => {
        if (res.code == 200) {
          this.teamList = res.data
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
    async getNewsList() {
      var data = {
        skip: this.find.limit * (this.find.currentPage - 1),
        limit: this.find.limit,
        category: this.category, //客户类别 我的客户、公海客户、全部客户
        classTypename: 'type',
        classType: this.selectInput, // 业务类别
        fuzz: this.select,
        input: this.input,
        uid:
          JSON.parse(sessionStorage.getItem('userInfo') || '{}').uid || 'none'
      }
      this.$axios.post(this.$api.findEnterprise, data).then(res => {
        this.tableData = res.data[0].data
        this.find.total = ((res.data[0] || {}).total[0] || {}).total || 0
      })
    },
    //领取按钮
    async pickUp(index, row) {
      this.$confirm('确认领取该客户资料吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        row.schedate = '7'
        row.manager2 =
          JSON.parse(sessionStorage.getItem('userInfo') || '{}').uid || ''
        var res = await this.$axios.post(this.$api.updateEnterprise, row)
        await this.getNewsList()
      })
    },
    //编辑按钮
    editRow(index, row) {
      this.ruleForm = row
      this.dialogVisible = true
      this.isAdd = false
      // this.showUE = true
    },
    //删除行
    deleteRow(index, row) {
      this.$confirm('确认删除该信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios
          .post(this.$api.deleteEnterprise, { _id: row._id })
          .then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功')
              this.getNewsList()
            }
          })
      })
    },
    //跟进中
    async followUp(index, row) {
      row.schedate = '7'
      var res = await this.$axios
        .post(this.$api.updateEnterprise, row)
        .then(res => {
          if (res.code == 200) {
            this.$message.success('跟进时间刷新成功')
          }
        })
      await this.getNewsList()
    },
    //放弃
    async abandonment(index, row) {
      this.$confirm('确认放弃该客户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        row.manager2 = ''
        var res = await this.$axios.post(this.$api.updateEnterprise, row)
        await this.getNewsList()
      })
    },
    handleClose() {
      this.dialogVisible = false
      // this.showUE = false;
    },
    async uploadBtn(formName) {
      //提交
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (!/^1[3|4|5|7|8]\d{9}$/.test(this.ruleForm.phone)) {
            this.$message.error('请输入正确手机号')
            return
          }
          if (this.ruleForm.idcard.length != 18) {
            this.$message.error('请输入正确身份证号')
            return
          }
          this.ruleForm.remarks = this.$refs.editor.getUEContent()
          if (this.isAdd) {
            //新增
            delete this.ruleForm._id
            var res = await this.$axios.post(
              this.$api.createEnterprise,
              this.ruleForm
            )
            let data = {
              proid: 'new',
              type: '提交-企业客户', // 数据来源
              name: this.ruleForm.name, // 客户名称
              phone: this.ruleForm.phone, // 电话
              submitby: this.ruleForm.manager1, // 提交人
              handler: this.ruleForm.manager2, // 处理人
              path: '/Enterprise', // 跳转企业客户
              read: 'false' // 是否已处理
            }
            this.$axios.post(this.$api.createAgent, data)
          } else {
            var res = await this.$axios.post(
              this.$api.updateEnterprise,
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
  width: 202px;
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
