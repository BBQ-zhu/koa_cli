<template>
  <div class="card">
    <div class="header" v-if="meth[0]">
      <el-button
        type="primary"
        icon="el-icon-upload"
        @click="(dialogVisible = true), (isAdd = true)"
        >上传新闻</el-button
      >
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
          <div class="">
            <el-form-item label="新闻标题:" prop="newsname">
              <el-input
                v-model="ruleForm.newsname"
                placeholder="请输入新闻标题"
                style="width: 200%"
              ></el-input>
            </el-form-item>
            <el-form-item label="新闻描述:" prop="message">
              <el-input
                v-model="ruleForm.message"
                placeholder="请输入新闻描述"
                style="width: 200%"
              ></el-input>
            </el-form-item>
            <el-form-item label="阅读量:" prop="num">
              <el-input
                v-model="ruleForm.num"
                placeholder="请输入阅读量"
                style="width: 200%"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div class="title mt20 mb20">新闻详情</div>
        <UE
          v-if="showUE"
          :defaultMsg="ruleForm.content"
          :config="config"
          :id="ueId"
          ref="editor"
        ></UE>
      </span>
      <div class="flex mt10 windBtn">
        <el-button @click="handleClose">取 消</el-button>
        <el-button v-if="meth[2] || meth[0]" type="primary" @click="uploadAdd"
          >确 定</el-button
        >
      </div>
    </div>
    <el-table v-if="!dialogVisible" :data="tableData" stripe>
      <el-table-column
      sortable
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
      content: "",
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 220,
      },
      ueId: "editor1", //多实例情况下使用
      dialogVisible: false,
      isAdd: true,
      ruleForm: {
        newsname: "",
        message: "",
        num: "",
        creators: "",
        content: "",
        time: "",
      },
      rules: {
        newsname: [
          { required: true, message: "请输入新闻标题", trigger: "blur" },
        ],
        message: [
          { required: true, message: "请输入新闻描述", trigger: "blur" },
        ],
        num: [{ required: true, message: "请输入阅读量", trigger: "blur" }],
      },
      row: "",
      tableData: [],
      tableHeader: [
        { name: "新闻标题", prop: "newsname" },
        { name: "新闻描述", prop: "message" },
        { name: "阅读量", prop: "num" },
        { name: "发布者", prop: "creators" },
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
    console.log(this.meth);
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
      this.$axios.post(this.$api.findNews, data).then((res) => {
        this.tableData = res.data[0].data;
        this.find.total = res.data[0].total[0].total;
      });
    },
    //编辑按钮
    editRow(index, row) {
      
      this.isAdd = false;
      this.ruleForm = row;
      this.row = row;
      // this.showUE = true
      this.dialogVisible = true;
    },
    //删除行
    deleteRow(index, row) {
      this.$confirm("确认删除该新闻吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$axios.post(this.$api.deleteNews, { _id: row._id }).then((res) => {
          if (res.code == 200) {
            this.$message.success("删除成功");
            this.getNewsList();
          }
        });
      });
    },
    handleClose() {
      this.ruleForm = {
        newsname: "",
        message: "",
        num: "",
        creators: "",
        content: "",
        time: "",
      }
      this.dialogVisible = false;
      // this.showUE = false;
    },
    async uploadAdd() {
      if (!this.ruleForm.newsname) {
        this.$message.error("请先输入标题");
        return;
      }
      this.ruleForm.content = this.$refs.editor.getUEContent();
      if (this.isAdd) {
        //新增
        delete this.ruleForm._id;
        this.ruleForm.creators = JSON.parse(
          sessionStorage.getItem("userInfo") || "{}"
        ).username;
        var res = await this.$axios.post(this.$api.createNews, this.ruleForm);
      } else {
        var res = await this.$axios.post(this.$api.updateNews, this.ruleForm);
      }
      if (res.code == 200) {
        this.$message.success("操作成功");
        this.dialogVisible = false;
        this.getNewsList();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
