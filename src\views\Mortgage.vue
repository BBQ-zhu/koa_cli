<template>
  <div class="card">
    <div class="header flex">
      <el-button
        type="primary"
        v-if="meth[0]"
        icon="el-icon-upload"
        @click="upload"
        >上传抵押客户</el-button
      >
      <!-- <el-select clearable 
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
      </el-select> -->
      <el-input clearable 
        placeholder="请输入内容"
        v-model="input"
        class="input-with-select findInput ml20"
      >
        <el-select clearable 
          v-model="select"
          slot="prepend"
          placeholder="请选择"
          style="width: 130px"
        >
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
          <div class="flex">
            <el-form-item label="抵押人姓名:" prop="name">
              <el-input clearable 
                v-model="ruleForm.name"
                placeholder="请输入抵押人姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="抵押人电话:" prop="phone">
              <el-input clearable 
                v-model="ruleForm.phone"
                placeholder="请输入抵押人电话"
              ></el-input>
            </el-form-item>
            <el-form-item label="放款金额:" prop="loanamount">
              <el-input clearable  placeholder="请输入放款金额" v-model="ruleForm.loanamount"></el-input>
            </el-form-item>
            
            <el-form-item label="每月还款金额:" prop="monthmoney">
              <el-input clearable  placeholder="请输入每月还款金额" v-model="ruleForm.monthmoney"></el-input>
            </el-form-item>
            <el-form-item label="保证金:" prop="deposit">
              <el-input clearable  placeholder="请输入保证金" v-model="ruleForm.deposit"></el-input>
            </el-form-item>
            <el-form-item label="佣金比例(%):" prop="commission">
              <el-input clearable  placeholder="请输入佣金比例(%)" v-model="ruleForm.commission"></el-input>
            </el-form-item>
            <el-form-item label="贷款期限(月):" prop="loanterm">
              <el-input clearable  placeholder="请输入贷款期限(月)" v-model="ruleForm.loanterm"></el-input>
            </el-form-item>
            <el-form-item label="资金渠道:" prop="fundchannel">
              <el-input clearable  placeholder="请输入资金渠道" v-model="ruleForm.fundchannel"></el-input>
            </el-form-item>
            <el-form-item label="抵押权人:" prop="mortgagee">
              <el-input clearable  placeholder="请输入抵押权人" v-model="ruleForm.mortgagee"></el-input>
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
            <el-form-item label="还款提示:" prop="optertime">
              <el-select clearable  style="width: 100%" v-model="ruleForm.optertime" placeholder="请选择还款提示">
                <el-option label="月提示" value="月提示"></el-option>
                <el-option label="年提示" value="年提示"></el-option>
                <el-option label="不提示" value="不提示"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="提示日期:" prop="tipstime">
              <el-input clearable  placeholder="结束日期前N天提示" v-model="ruleForm.tipstime"></el-input>
            </el-form-item>
            
            <el-form-item label="客户经理:" prop="manager1">
                  <el-select clearable  style="width:100%" v-model="ruleForm.manager1" filterable placeholder="还款提示接收人">
                    <el-option
                      v-for="item in userList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
            </el-form-item>
            <el-form-item label="金融客服:" prop="manager2">
                  <el-select clearable  style="width:100%" v-model="ruleForm.manager2" filterable placeholder="请选择">
                    <el-option
                      v-for="item in userList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
            </el-form-item>
            
            <el-form-item label="客户状态:" prop="status">
              <el-select clearable  style="width: 100%" v-model="ruleForm.status" placeholder="请选择客户状态">
                <el-option label="已通知" value="已通知"></el-option>
                <el-option label="待收款" value="待收款"></el-option>
                <el-option label="已收款" value="已收款"></el-option>
                <el-option label="已逾期" value="已逾期"></el-option>
                <el-option label="已起诉" value="已起诉"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
        <div class="title mt20 mb20">备注信息</div>
        <UE
          v-if="showUE"
          :defaultMsg="ruleForm.remarks"
          :config="config"
          :id="ueId"
          ref="editor"
        ></UE>
      </span>
      <div class="flex mt10 windBtn">
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          type="primary"
          v-if="meth[0] || meth[2]"
          @click="uploadBtn('ruleForm')"
          >确 定</el-button
        >
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
      <el-table-column label="操作" width="100px">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="editRow(scope.$index, scope.row)"
            type="text"
            size="small"
            >编辑</el-button
          >
          <el-button
            v-if="meth[1]"
            @click.native.prevent="deleteRow(scope.$index, scope.row)"
            type="text"
            size="small"
            >删除</el-button
          >
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
import UE from "@/components/common/UE";
export default {
  components: {
    UE,
  },
  data() {
    return {
      showUE: false,
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 220,
      },
      ueId: "editor9",
      userList: [],
      dialogVisible: false,
      isAdd: true,
      select: "",
      input: "",
      ruleForm: {
        name: '',
        phone: '',
        type:'抵押贷款', //抵押贷款
        loanamount:'', //放款金额
        tipstime: '7', //每月还款提前N天提示
        monthmoney:'', //每月还款金额
        deposit:'', //保证金
        commission:'', //佣金比例
        loanterm:'', //贷款期限
        startime:'', //开始日期
        endtime:'', //结束日期
        manager1:'', //客户经理
        manager2: '', //金融客服
        fundchannel: '', //资金渠道
        mortgagee: '', //抵押权人
        status: '', //客户状态 已通知、已收款、待收款、逾期、已起诉
        optertime: '月提示', //还款 月提示 年提示 不提示
        remarks:'', //备注详情
        time: ''
      },
      cloneRuleForm: {}, //用于备份
      rules: {
        name: [
          { required: true, message: "请输入抵押人姓名", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入抵押人电话", trigger: "blur" },
        ],
        endtime: [
          { required: true, message: "请输入结束时间", trigger: "blur" },
        ],
      },
      productClass: [],
      tableData: [],
      tableHeader: [
        { name: "抵押人姓名", prop: "name" },
        { name: "抵押人电话", prop: "phone" },
        { name: "放款金额", prop: "loanamount" },
        { name: "每月还款金额", prop: "monthmoney" },
        { name: "客户状态", prop: "status" },
        { name: "客户经理", prop: "manager1" },
        { name: "金融客服", prop: "manager2" },
        { name: "创建时间", prop: "time" },
      ],
      find: {
        currentPage: 1, //当前页码
        total: 0, //总页数
        skip: 0, //偏移量
        limit: 10, //每一页的数量
      },
    };
  },
  mounted() {
    this.mixinMethod(this.$route.path);
    this.cloneRuleForm = JSON.parse(JSON.stringify(this.ruleForm));
    this.findUserList();
    this.getNewsList();
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.showUE = val;
      }
    },
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
    upload() {
      this.isAdd = true;
      this.ruleForm = JSON.parse(JSON.stringify(this.cloneRuleForm));
      this.dialogVisible = !this.dialogVisible;
    },
    handleSizeChange(val) {
      this.find.limit = val;
      this.getNewsList();
    },
    handleCurrentChange(val) {
      this.find.currentPage = val;
      this.getNewsList();
    },
    // async findClass() {
    //   var data = {
    //     skip: this.find.limit * (this.find.currentPage - 1),
    //     limit: this.find.limit,
    //     fuzz: this.classType,
    //     input: this.selectInput,
    //   };
    //   await this.$axios.post(this.$api.findIntegrate, data).then((res) => {
    //     this.tableData = res.data[0].data;
    //     this.find.total = res.data[0].total[0].total;
    //   });
    //   this.input = "";
    // },
    async getNewsList() {
      var data = {
        skip: this.find.limit * (this.find.currentPage - 1),
        limit: this.find.limit,
        fuzz: this.select,
        input: this.input,
      };
      this.$axios.post(this.$api.findMortgages, data).then((res) => {
        this.tableData = res.data[0].data;
        this.find.total = res.data[0].total[0].total;
      });
      // this.selectInput = "";
    },
    //编辑按钮
    editRow(index, row) {
      this.isAdd = false;
      this.ruleForm = row;
      this.dialogVisible = true;
      // this.showUE = true
    },
    //删除行
    deleteRow(index, row) {
      this.$confirm("确认删除该信息吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$axios
          .post(this.$api.deleteMortgages, { _id: row._id })
          .then((res) => {
            if (res.code == 200) {
              this.$message.success("删除成功");
              this.getNewsList();
            }
          });
      });
    },
    handleClose() {
      this.dialogVisible = false;
      //  this.showUE = false;
    },
    async uploadBtn(formName) {
      //提交
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (!/^1[3|4|5|7|8]\d{9}$/.test(this.ruleForm.phone)) {
            this.$message.error('请输入正确手机号')
            return
          }
          this.ruleForm.remarks = this.$refs.editor.getUEContent();
          if (this.isAdd) {
            //新增
            delete this.ruleForm._id;
            var res = await this.$axios.post(
              this.$api.createMortgages,
              this.ruleForm
            );
          } else {
            var res = await this.$axios.post(
              this.$api.updateMortgages,
              this.ruleForm
            );
          }
          if (res.code == 200) {
            this.$message.success("操作成功");
            this.dialogVisible = false;
            this.getNewsList();
          }
        } else {
          return false;
        }
      });
    },
  },
};
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
