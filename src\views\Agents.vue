<template>
  <div class="card">
    <div>
      <div class="header flex">
        <div class="f16 fw600 ml10">代办中心</div>
        <span class="f12 color2" style="padding-top: 3px"
          >（仅展示移动端提交且标记中的数据,取消标记后，移动端用户可再次提交申请）</span
        >
      </div>
      <el-table :data="tableData" stripe>
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
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="editRow(scope.$index, scope.row)"
              type="text"
              size="small"
              >查看</el-button
            >
            <el-button
              v-if="meth[1]"
              @click.native.prevent="check(scope.$index, scope.row)"
              type="text"
              size="small"
              style="color: #f56c6c"
              >取消标记</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableHeader: [
        { name: "客户姓名", prop: "name" },
        { name: "手机号码", prop: "phone" },
        { name: "数据来源", prop: "type" },
        { name: "提交人", prop: "submitby" },
        { name: "处理人", prop: "handler" },
        { name: "创建时间", prop: "time" },
      ],
      tableData: [],
    };
  },
  mounted() {
    this.mixinMethod(this.$route.path);
    this.getAgentsList();
  },
  methods: {
    //跳转界面
    editRow(index, row) {
      this.$router.push({
        path: row.path,
        query: {
          phone: row.phone,
        },
      });
    },
    // 已处理按钮
    check(index, row) {
      this.$confirm("已处理的代办提示将不再显示？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        row.read = "true";
        this.$axios.post(this.$api.updateAgent, row).then((res) => {
          if (res.code == 200) {
            this.getAgentsList();
          }
        });
      });
    },
    //获取数据
    async getAgentsList() {
      this.tableData = [];
      var data = {
        skip: 0,
        limit: 9999,
        fuzz: "handler",
        input: JSON.parse(sessionStorage.getItem("userInfo") || "{}").uid,
      };
      await this.$axios.post(this.$api.findAgent, data).then((res) => {
        if (res.code == 200) {
          let arr = res.data[0].data;
          arr.map((item) => {
            if (item.read == "false") {
              this.tableData.push(item);
            }
          });
        }
      });
      var data1 = {
        skip: 0,
        limit: 9999,
        fuzz: "handler",
        input: "all",
      };
      await this.$axios.post(this.$api.findAgent, data1).then((res) => {
        if (res.code == 200) {
          let arr = res.data[0].data;
          arr.map((item) => {
            if (item.read == "false") {
              this.tableData.push(item);
            }
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.headName {
  font-weight: 600;
  font-size: 16px;
}
</style>
