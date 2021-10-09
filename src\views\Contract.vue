<template>
  <div class="card">
    <div class="header flex">
      <el-button
        v-if="meth[0]"
        type="primary"
        icon="el-icon-upload"
        @click="uploadNew"
        >发起签约</el-button
      >
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
      <el-input
        placeholder="请输入内容"
        v-model="input"
        class="input-with-select findInput ml20"
      >
        <el-select
          v-model="classType"
          slot="prepend"
          placeholder="请选择"
          style="width: 120px"
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
          @click="find.currentPage=1 ,getNewsList()"
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
          style="width: 80%"
        >
          <div class="flex">
            <el-form-item label="合同类型:" prop="type">
              <el-select
                style="width: 100%"
                v-model="ruleForm.type"
                placeholder="请选择合同类型"
              >
                <el-option
                  v-for="item in dynamicTags"
                  :key="item._id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客户名称:" prop="name">
              <el-input
                v-model="ruleForm.name"
                placeholder="请输入客户名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="客户电话:" prop="phone">
              <el-input
                v-model="ruleForm.phone"
                placeholder="请输入客户电话"
              ></el-input>
            </el-form-item>
            <el-form-item label="服务费用:" prop="expenses">
              <el-input
                v-model="ruleForm.expenses"
                placeholder="请输入服务费用"
              ></el-input>
            </el-form-item>
            <el-form-item label="付款方式:" prop="manner">
              <el-input
                v-model="ruleForm.manner"
                placeholder="请输入付款方式"
              ></el-input>
            </el-form-item>
            <el-form-item label="签约提示:" prop="conname">
              <el-input
                v-model="ruleForm.conname"
                placeholder="请输入签约提示"
              ></el-input>
            </el-form-item>
            <el-form-item label="起始日期:" prop="startime">
              <el-date-picker
                style="width: 100%"
                v-model="ruleForm.startime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择起始日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束日期:" prop="endtime">
              <el-date-picker
                style="width: 100%"
                v-model="ruleForm.endtime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择结束日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="提示方式:" prop="optertime">
              <el-select
                style="width: 100%"
                v-model="ruleForm.optertime"
                placeholder="请选择提示方式"
              >
                <el-option label="月提示" value="月提示"></el-option>
                <el-option label="年提示" value="年提示"></el-option>
                <el-option label="不提示" value="不提示"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="提示日期:" prop="tipstime">
              <el-input
                placeholder="请输入提前几天提示,例：7"
                v-model="ruleForm.tipstime"
              ></el-input>
            </el-form-item>
            <el-form-item label="客户经理:" prop="manager1">
              <el-input
                placeholder="请输入客户经理工号"
                v-model="ruleForm.manager1"
              ></el-input>
            </el-form-item>
            <el-form-item label="权证经理:" prop="manager2">
              <el-input
                placeholder="请输入权证经理工号"
                v-model="ruleForm.manager2"
              ></el-input>
            </el-form-item>
            <el-form-item label="审核经理:" prop="manager2">
              <el-input
                placeholder="请输入审核经理工号"
                v-model="ruleForm.manager3"
              ></el-input>
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
                <el-input
                  placeholder="请上传合同图片"
                  v-model="ruleForm.imgurl"
                  disabled
                ></el-input>
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
        <UE
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
              @click="conDownLoad(scope.row.imgurl, scope.row.name)"
              >{{ scope.row.name }}</span
            >
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
      uploadHeader: {
        authorization: JSON.parse(sessionStorage.getItem("userInfo") || "{}")
          .token,
      },
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 220,
      },
      dynamicTags: [], //分类
      fileList: [],
      classType: "",
      inputVisible: false,
      inputValue: "",
      selectInput: "",
      input: "", //查询框
      ueId: "editor8", //多实例情况下使用
      dialogVisible: false,
      isAdd: true,
      ruleForm: {
        type: "",
        conname: "",
        name: "",
        phone: "",
        imgurl: "",
        expenses: "", //费用
        manner: "", //付款方式
        status: "待签约", //签约状态-待签约，待确认，驳回，签约成功
        remarks: "",
        startime: "",
        endtime: "",
        optertime: "",
        tipstime: "7",
        manager1: "", //客户经理
        manager2: "", //权证经理
        manager3: "", //审核经理
        time: "", //创建时间
      },
      rules: {
        name: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
        type: [{ required: true, message: "请选择合同类型", trigger: "blur" }],
        phone: [{ required: true, message: "请输入客户电话", trigger: "blur" }],
        expenses: [
          { required: true, message: "请输入约定费用", trigger: "blur" },
        ],
        startime: [
          { required: true, message: "请选择合同起始日期", trigger: "blur" },
        ],
        endtime: [
          { required: true, message: "请选择合同结束日期", trigger: "blur" },
        ],
        optertime: [
          { required: true, message: "请选择提示方式", trigger: "blur" },
        ],
      },
      tableData: [],
      tableHeader: [
        { name: "合同类型", prop: "type" },
        { name: "签约状态", prop: "status" },
        { name: "签约提示", prop: "conname" },
        { name: "客户电话", prop: "phone" },
        { name: "约定费用", prop: "expenses" },
        { name: "客户经理", prop: "manager1" },
        { name: "权证经理", prop: "manager2" },
        { name: "审核经理", prop: "manager3" },
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
    this.getNewsList();
    this.findTagList();
  },
  methods: {
    //上传按钮重置
    uploadNew() {
      this.dialogVisible = true;
      this.isAdd = true;
      this.ruleForm = {
        type: "",
        conname: "",
        name: "",
        phone: "",
        imgurl: "",
        expenses: "", //费用
        manner: "", //付款方式
        status: "待签约", //签约状态-待签约，待确认，驳回，签约成功
        remarks: "",
        startime: "",
        endtime: "",
        optertime: "",
        tipstime: "7",
        manager1: "", //客户经理
        manager2: "", //权证经理
        manager3: "", //审核经理
        time: "", //创建时间
      };
    },
    statusChange(e) {
      console.log(e);
    },
    async conDownLoad(url,name) {
      await this.$logsImg.createlogsImg('api/downLoad', "下载合同文件"); //添加操作日志
      this.$common.download(url,name);
    },
    async findTagList() {
      //查询分类
      await this.$axios.post(this.$api.findProductClass).then((res) => {
        if (res.code == 200) {
          this.dynamicTags = res.data;
        }
      });
    },
    //上传合同图片成功钩子
    async handSuccess(res, file, fileList) {
      if (res.code == 200) {
        if (!this.isAdd) {
          await this.$axios.post(this.$api.updataContract, {
            _id: this.ruleForm._id,
            imgurl: res.data,
          });
        }
        if (this.ruleForm.imgurl) {
          await this.$axios.post(this.$api.delContractImg, this.ruleForm);
        }
        this.ruleForm.imgurl = res.data;
        this.fileList = [];
        this.$logsImg.createlogsImg(
          this.$api.uploadContractImg,
          this.ruleForm.imgurl
        ); //添加操作日志
        this.$message.success("文件上传成功");
      }
    },
    onError(err, file, fileList) {
      this.$message.error("文件上传失败");
    },
    handleSizeChange(val) {
      this.find.limit = val;
      this.getNewsList();
    },
    handleCurrentChange(val) {
      this.find.currentPage = val;
      this.getNewsList();
    },
    async findClass() {
      var data = {
        skip: this.find.limit * (this.find.currentPage - 1),
        limit: this.find.limit,
        fuzz: this.classType,
        input: this.selectInput,
      };
      await this.$axios.post(this.$api.findContract, data).then((res) => {
        this.tableData = res.data[0].data;
        this.find.total = res.data[0].total[0].total;
      });
      this.input = "";
    },
    async getNewsList() {
      var data = {
        skip: this.find.limit * (this.find.currentPage - 1),
        limit: this.find.limit,
        fuzz: this.classType,
        input: this.input,
      };
      await this.$axios.post(this.$api.findContract, data).then((res) => {
        this.tableData = res.data[0].data;
        this.find.total = res.data[0].total[0].total;
      });
      this.selectInput = "";
    },
    //编辑按钮
    async editRow(index, row) {
      this.dialogVisible = true;
      this.isAdd = false;
      await this.$axios
        .post(this.$api.findOneContract, { _id: row._id })
        .then((res) => {
          if (res.code == 200) {
            this.ruleForm = res.data[0];
          } else {
            this.$message.error("查询失败");
          }
        });
    },
    //删除行
    deleteRow(index, row) {
      this.$confirm("确认删除该产品吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$axios
          .post(this.$api.delContractImg, this.ruleForm)
          .then((res) => {
            this.ruleForm.productimg = "";
            this.$axios
              .post(this.$api.delateContract, { _id: row._id })
              .then((res) => {
                if (res.code == 200) {
                  this.$message.success("删除成功");
                  this.getNewsList();
                }
              });
          });
      });
    },
    handleClose() {
      if (this.isAdd && this.ruleForm.imgurl != "") {
        //新增产品时点了删除，要把图片删除
        this.$axios
          .post(this.$api.delContractImg, this.ruleForm)
          .then((res) => {
            if (res.code == 200) {
              this.ruleForm.imgurl = "";
            }
          });
      }
      this.dialogVisible = false;
    },
    //提交信息
    async uploadBtn(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.ruleForm.remarks = this.$refs.editor.getUEContent();
          if (this.isAdd) {
            //新增
            delete this.ruleForm._id;
            var res = await this.$axios.post(
              this.$api.uploadContract,
              this.ruleForm
            );
          } else {
            console.log(this.ruleForm);
            var res = await this.$axios.post(
              this.$api.updataContract,
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
