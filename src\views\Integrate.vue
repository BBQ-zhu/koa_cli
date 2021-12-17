<template>
  <div class="card">
    <div class="header flex">
      <!-- <el-button
        type="primary"
        v-if="meth[0]"
        icon="el-icon-upload"
        @click="upload"
        >上传咨询客户</el-button
      >-->
      <el-select
        @change="tabelShow = false"
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
      <el-select
        clearable
        class="ml20"
        style="width: 202px"
        v-model="selectInput"
        placeholder="请选择"
      >
        <el-option
          v-for="item in productClass"
          :key="item._id"
          :label="item.name"
          :value="item.name"
        ></el-option>
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
            <el-form-item label="业务类别:" prop="type">
              <el-select clearable class v-model="ruleForm.type" placeholder="请选择">
                <el-option
                  v-for="item in productClass"
                  :key="item._id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务名称:" prop="proname">
              <el-input clearable disabled v-model="ruleForm.proname" placeholder="请输入服务名称"></el-input>
            </el-form-item>
            <el-form-item label="客户姓名:" prop="name">
              <el-input clearable v-model="ruleForm.name" placeholder="请输入客户姓名"></el-input>
            </el-form-item>
            <el-form-item label="客户电话:" prop="phone">
              <el-input clearable v-model="ruleForm.phone" placeholder="请输入客户电话"></el-input>
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
            <!-- <el-form-item label="金融客服:" prop="manager2">
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
            </el-form-item>-->
            <div class="flex">
              <el-form-item label="客户状态:" prop="vipstatus">
                <el-select
                  clearable
                  style="width: 100%"
                  v-model="ruleForm.vipstatus"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in fixedInfo.vipstatusList"
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
          </div>

          <div v-if="ruleForm.type == '意向客户'">
            <div class="fw600 f16 mb20">意向客户资料</div>
            <div class="flex" v-if="ruleForm.proname == '金融客户'">
              <el-form-item label="职业类型:" prop="hires">
                <el-select clearable style="width: 100%" v-model="ruleForm.hires" placeholder="请选择">
                  <el-option
                    v-for="item in fixedInfo.hiresList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否有房:" prop="houses">
                <el-select
                  clearable
                  style="width: 100%"
                  v-model="ruleForm.houses"
                  placeholder="请选择"
                >
                  <el-option label="是" value="是"></el-option>
                  <el-option label="否" value="否"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否有车:" prop="car">
                <el-select clearable style="width: 100%" v-model="ruleForm.car" placeholder="请选择">
                  <el-option label="是" value="是"></el-option>
                  <el-option label="否" value="否"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否有商保:" prop="policy">
                <el-select
                  clearable
                  style="width: 100%"
                  v-model="ruleForm.policy"
                  placeholder="请选择"
                >
                  <el-option label="是" value="是"></el-option>
                  <el-option label="否" value="否"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否有社保:" prop="social">
                <el-select
                  clearable
                  style="width: 100%"
                  v-model="ruleForm.social"
                  placeholder="请选择是否有社保"
                >
                  <el-option
                    v-for="item in fixedInfo.socialList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否有公积金:" prop="provident">
                <el-select
                  clearable
                  style="width: 100%"
                  v-model="ruleForm.provident"
                  placeholder="请选择是否有公积金"
                >
                  <el-option
                    v-for="item in fixedInfo.providentList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="芝麻分:" prop="sesame">
                <el-select
                  clearable
                  style="width: 100%"
                  v-model="ruleForm.sesame"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in fixedInfo.sesameList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="微粒贷:" prop="microcredit">
                <el-select
                  clearable
                  style="width: 100%"
                  v-model="ruleForm.microcredit"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in fixedInfo.microcreditList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否有信用卡:" prop="credit">
                <el-select
                  clearable
                  style="width: 100%"
                  v-model="ruleForm.credit"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in fixedInfo.creditList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否有烟草证:" prop="tobacco">
                <el-select
                  clearable
                  style="width: 100%"
                  v-model="ruleForm.tobacco"
                  placeholder="请选择"
                >
                  <el-option label="是" value="是"></el-option>
                  <el-option label="否" value="否"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="flex" v-if="ruleForm.proname == '企业客户'">
              <el-form-item label="企服类型:" prop="comtype">
                <el-select
                  clearable
                  style="width: 100%"
                  v-model="ruleForm.comtype"
                  placeholder="请选择"
                >
                  <el-option label="公司注册" value="公司注册"></el-option>
                  <el-option label="代理记账" value="代理记账"></el-option>
                  <el-option label="商标注册" value="商标注册"></el-option>
                  <el-option label="其他服务" value="其他服务"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="ruleForm.comtype == '其他服务'" label="其他服务:" prop="othercomtype">
                <el-input clearable v-model="ruleForm.othercomtype" placeholder="请输入其他服务"></el-input>
              </el-form-item>
            </div>
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
            v-if="!scope.row.manager1 && category=='公海客户'"
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
      userList: [],
      fixedInfo: fixedInfo, //选项配置
      showUE: false,
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 220
      },
      ueId: 'editor3',
      selectInput: '',
      category: '我的客户', //客户类别切换
      dialogVisible: false,
      isAdd: true,
      select: '',
      input: '',
      ruleForm: {
        type: '',
        proname: '', // 服务名称
        name: '', //提交人姓名
        phone: '', //提交人电话
        manager1: '', //客户经理
        manager2: '', //金融客服
        hires: '', //职业类型
        social: '', //社保情况
        provident: '', //公积金情况
        houses: '', //房屋情况
        car: '', //车辆情况
        policy: '', //保险情况
        sesame: '', //芝麻分
        microcredit: '', //微粒贷
        credit: '', //信用卡
        tobacco: '', //是否有烟草证
        comtype: '', //企业客户类型 公司注册、代理记账、商标注册、其他服务
        othercomtype: '', //其他服务补充
        vipstatus: '', //客户状态 新客户、正在跟进、邀约上面、上门签单、放款成功、拒绝客户、放弃客户
        status: '', //审核状态 草稿、待审核、审核中、驳回、拒绝、通过、放弃、审核结束
        feedback: '', //审批反馈
        remarks: '',
        time: ''
      },
      cloneRuleForm: {}, //用于备份
      rules: {
        type: [{ required: true, message: '请选择业务类别', trigger: 'blur' }],
        proname: [
          { required: true, message: '请输入产品名字', trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入客户电话', trigger: 'blur' }]
      },
      productClass: [],
      tableData: [],
      userInfo: {},
      tableHeader: [
        { name: '业务类别', prop: 'type' },
        { name: '服务名称', prop: 'proname' },
        { name: '客户姓名', prop: 'name' },
        { name: '客户电话', prop: 'phone' },
        { name: '咨询备注', prop: 'remarks' },
        { name: '客户经理', prop: 'manager1' },
        // { name: '金融客服', prop: 'manager2' },
        { name: '审核状态', prop: 'status' },
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
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}')
    this.mixinMethod(this.$route.path)
    if (this.$route.query.phone) {
      this.select = 'phone'
      this.input = this.$route.query.phone
    }
    this.cloneRuleForm = JSON.parse(JSON.stringify(this.ruleForm))
    this.findProductClass()
    this.getNewsList()
    this.findUserList()
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.showUE = val
      }
    }
  },
  methods: {
    async findProductClass() {
      await this.$axios.post(this.$api.findProductClass).then(res => {
        if (res.code == 200) {
          let arr = [
            { _id: '1', name: '意向客户' },
            { _id: '2', name: '专业顾问' },
            { _id: '3', name: '推荐客户' },
            { _id: '4', name: '商务合作' },
            { _id: '5', name: '意见投诉' }
          ]
          this.productClass = arr.concat(res.data)
        }
      })
    },
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
    upload() {
      this.isAdd = true
      this.ruleForm = JSON.parse(JSON.stringify(this.cloneRuleForm))
      this.dialogVisible = !this.dialogVisible
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
      this.$axios.post(this.$api.findIntegrate, data).then(res => {
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
        row.manager1 =
          JSON.parse(sessionStorage.getItem('userInfo') || '{}').uid || ''
        var res = await this.$axios.post(this.$api.updateIntegrate, row)
        await this.getNewsList()
      })
    },
    //编辑按钮
    editRow(index, row) {
      this.isAdd = false
      this.ruleForm = row
      this.dialogVisible = true
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
          .post(this.$api.deleteIntegrate, { _id: row._id })
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
        .post(this.$api.updateIntegrate, row)
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
        var data = {
          skip: 0,
          limit: 9999999,
          category: '公海客户', //客户类别 我的客户、公海客户、全部客户
          fuzz: 'phone',
          input: row.phone
        }
        let res = await this.$axios.post(this.$api.findIntegrate, data)
        if (res.code == 200) {
          let tableData = res.data[0].data
          tableData.map(async item => {
            await this.$axios.post(this.$api.deleteIntegrate, { _id: item._id })
          })
        }
        row.manager1 = ''
        await this.$axios.post(this.$api.updateIntegrate, row)
        await this.getNewsList()
      })
    },
    handleClose() {
      this.dialogVisible = false
      //  this.showUE = false;
    },
    async uploadBtn(formName) {
      //提交
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (!/^1[3|4|5|7|8]\d{9}$/.test(this.ruleForm.phone)) {
            this.$message.error('请输入正确手机号')
            return
          }
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
