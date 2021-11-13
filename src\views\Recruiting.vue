<template>
  <div class="card">
    <div class="header">
      <el-button
        v-if="meth[0]"
        type="primary"
        icon="el-icon-upload"
        @click="(dialogVisible = true), (isAdd = true)"
        >上传招聘信息</el-button
      >
    </div>
    <div v-if="dialogVisible" class="window">
      <span>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm flex"
          style="width: 90%"
        >
          <el-form-item label="招聘职位:" prop="name">
            <el-input
              v-model="ruleForm.name"
              placeholder="请输入招聘职位"
            ></el-input>
          </el-form-item>
          <el-form-item label="薪资范围:" prop="salary">
            <el-input
              v-model="ruleForm.salary"
              placeholder="请输入薪资范围"
            ></el-input>
          </el-form-item>
          <el-form-item label="工作地址:" prop="address">
            <el-input
              v-model="ruleForm.address"
              placeholder="请输入工作地址"
            ></el-input>
          </el-form-item>
          <el-form-item label="学历要求:" prop="education">
            <el-input
              v-model="ruleForm.education"
              placeholder="请输入学历要求"
            ></el-input>
          </el-form-item>
        </el-form>
        <UE
          v-if="showUE"
          :defaultMsg="ruleForm.details"
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
      showUE:false,
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 220,
      },
      ueId: "editor2", //多实例情况下使用
      dialogVisible: false,
      isAdd: true,
      ruleForm: {
        name: "",
        salary: "",
        address: "",
        education: "",
        details: "",
      },
      rules: {
        name: [{ required: true, message: "请输入招聘岗位", trigger: "blur" }],
        salary: [
          { required: true, message: "请输入薪资范围", trigger: "blur" },
        ],
        address: [
          { required: true, message: "请输入工作地址", trigger: "blur" },
        ],
        education: [
          { required: true, message: "请输入学历要求", trigger: "blur" },
        ],
      },
      tableData: [],
      tableHeader: [
        { name: "招聘岗位", prop: "name" },
        { name: "薪资范围", prop: "salary" },
        { name: "工作地址", prop: "address" },
        { name: "学历要求", prop: "education" },
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
  },
  watch:{
    dialogVisible(val){
      if(val){
        this.showUE = val
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.find.limit = val;
      this.getNewsList();
    },
    handleCurrentChange(val) {
      this.find.currentPage = val;
      this.getNewsList();
    },
    async getNewsList() {
      var data = {
        skip: this.find.limit * (this.find.currentPage - 1),
        limit: this.find.limit,
      };
      this.$axios.post(this.$api.findRecruiting, data).then((res) => {
        this.tableData = res.data[0].data;
        this.find.total = res.data[0].total[0].total;
      });
    }, 
    //编辑按钮
    editRow(index, row) {
      
      this.isAdd = false;
      this.ruleForm = row;
      // this.showUE = true
      this.dialogVisible = true;
    },
    //删除行
    deleteRow(index, row) {
      this.$confirm("确认删除该信息吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$axios
          .post(this.$api.delateRecruiting, { _id: row._id })
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
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.ruleForm.details = this.$refs.editor.getUEContent();
          if (this.isAdd) {
            //新增
            delete this.ruleForm._id;
            var res = await this.$axios.post(
              this.$api.uploadRecruiting,
              this.ruleForm
            );
          } else {
            var res = await this.$axios.post(
              this.$api.updataRecruiting,
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
</style>
