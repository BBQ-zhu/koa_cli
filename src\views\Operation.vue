<template>
  <div class="card">
    <div class="flex header">
      <el-input
        placeholder="请输入内容"
        v-model="input"
        class="input-with-select findInput"
      >
        <el-select v-model="select" slot="prepend" placeholder="请选择">
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
          @click="find.currentPage=1 ,findFuzz() "
        ></el-button>
      </el-input>
    </div>
    <el-table :data="tableData" stripe>
      <el-table-column
        show-overflow-tooltip
        v-for="(item, index) in tableHeader"
        :key="index + '1'"
        :prop="item.prop"
        :label="item.name"
        min-width="100px"
      ></el-table-column>
    </el-table>
    <!-- 页码条 -->
    <el-pagination
      class="mt20"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="find.currentPage"
      :page-sizes="[10, 15, 20, 50, 100, 200]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="find.total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      tableHeader: [
        { name: "操作人", prop: "user" },
        { name: "操作模块", prop: "remarks" },
        { name: "修改后的数据", prop: "logdata" },
        { name: "操作时间", prop: "time" },
      ],
      input: "",
      select: "",
      find: {
        currentPage: 1, //当前页码
        total: 0, //总页数
        skip: 0, //偏移量
        limit: 10, //每一页的数量
      },
      ruleForm: {
        user: "",
        logdata: "",
        remarks: "",
        time: "",
      },
    };
  },
  mounted() {
    this.findFuzz();
  },
  methods: {
    //模糊查询
    findFuzz() {
      var data = {
        skip: this.find.limit * (this.find.currentPage - 1),
        limit: this.find.limit,
        fuzz: this.select,
        input: this.input,
      };
      this.$axios.post(this.$api.findlogs, data).then((res) => {
        this.tableData = res.data[0].data;
        this.find.total = res.data[0].total ? res.data[0].total[0].total : 0;
      });
    },
    handleSizeChange(val) {
      this.find.limit = val;
      this.findFuzz();
    },
    handleCurrentChange(val) {
      this.find.currentPage = val;
      this.findFuzz();
    },
  },
};
</script>

<style scoped>
::v-deep .el-select {
  min-width: 100px;
}
.findInput {
  width: 400px;
}
.header {
  border-bottom: 1px solid #909399;
  padding-bottom: 15px;
}
.inputWidth {
  width: 217px;
}
</style>
