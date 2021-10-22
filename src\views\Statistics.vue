<template>
  <div >
    <div class="card">
      <div class="header flex">
        <div class="f16 fw600 ml10">个人业绩</div>
        <span class="f12 color2" style="padding-top: 3px"
          >（点击表头三角符号排序）</span
        >
      </div>
      <el-table :data="tableData" stripe height="350" :default-sort = "{prop: 'all', order: 'descending'}">
        <el-table-column
          sortable
          v-for="(item, index) in tableHeader"
          :key="index"
          :prop="item.prop"
          :label="item.name"
          show-overflow-tooltip
          min-width="100px"
        ></el-table-column>
      </el-table>
    </div>
        <div class="card mt20">
      <div class="header flex">
        <div class="f16 fw600 ml10">团队业绩</div>
        <span class="f12 color2" style="padding-top: 3px"
          >（仅展示使用中团队的业绩）</span
        >
      </div>
      <el-table :data="teamData" stripe height="350" :default-sort = "{prop: 'all', order: 'descending'}">
        <el-table-column
          sortable
          v-for="(item, index) in teamHeader"
          :key="index"
          :prop="item.prop"
          :label="item.name"
          show-overflow-tooltip
          min-width="100px"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableHeader: [
        { name: '员工姓名', prop: 'username' },
        { name: '员工ID', prop: 'uid' },
        { name: '所属团队', prop: 'team' },
        { name: '当月业绩', prop: 'month' },
        { name: '当年业绩', prop: 'year' },
        { name: '总业绩', prop: 'all' }
      ],
      teamHeader: [
        { name: '团队名称', prop: 'team' },
        { name: '团队成员', prop: 'teamusers' },
        { name: '当月业绩', prop: 'month' },
        { name: '当年业绩', prop: 'year' },
        { name: '总业绩', prop: 'all' }
      ],
      tableData: [], //个人业绩
      teamData:[], //团队业绩
      userList:[], // 用户列表
      contractList:[], // 合同列表
      userResults:[], // 个人业绩
    }
  },
  async mounted() {
    this.mixinMethod(this.$route.path)
    await this.getContractList()
    await this.getUserList()
    
  },
  methods: {
    //获取用户列表
    async getUserList() {
      var data = {
        skip: 0,
        limit: 9999999,
      };
      let res = await this.$axios.post(this.$api.findUser, data)
        if(res.code == 200){
          this.userList = res.data[0].data;
          this.tableData = []
          for(let item of this.userList){
           await this.findUserPer(item)
          }
          this.findTeamPer()
        }
    },
    // 查询团队业绩
    async findTeamPer() {
      this.teamData = []
      this.tableData.map(item=>{
        let key = false
        for(let val of this.teamData){
          if(val.team == item.team){
            val.teamusers.push('，'+item.username+'('+item.uid+')')
            val.month += parseInt(item.month)
            val.year += parseInt(item.year)
            val.all += parseInt(item.all)
            key = true
          }
        }
        if(!key){
          let obj = {team:item.team,teamusers:[item.username+'('+item.uid+')'],month:item.month,year:item.year,all:item.all}
          this.teamData.push(obj)
        }
      })
    },
    // 查询个人业绩
    async findUserPer(item) {
      let arr = await this.findthree(item.uid);
      //个人业绩统计
      let userResults = await this.statistics(arr);
      // if(userResults.month || userResults.year || userResults.all){
        userResults.username = item.username
        userResults.uid = item.uid
        userResults.team = item.team
        this.tableData.push(userResults)
      // }
    },
    async findthree(uid) {
      // 合同总数查询
      let arr1 = await this.findCont("manager1", uid);
      let arr2 = await this.findCont("manager2", uid);
      let arr3 = await this.findCont("manager3", uid);
      let arr = arr1.concat(arr2).concat(arr3);
      return arr; // 业绩统计（只要当前员工包含在客户经理、权证经理、审核经理中的一个，都会算业绩，且可以同时担任多个经理，业绩就翻倍）
    },
    //根据合同列表分时间段统计业绩
    statistics(arr) {
      let obj = { month: 0, year: 0, all: 0 };
      let nowTieme = new Date().toLocaleString().split(" ")[0].split("/");
      arr.map((item) => {
        // let time = item.time.split(" ")[0].split("/"); // 用户签字时间
        let time = item.startime.split("-"); // 合同起始时间
        let exp = parseInt(item.expenses) || 0;
        obj.all += exp;
        if (nowTieme[0] == parseInt(time[0])) {
          obj.year += exp;
        }
        if (nowTieme[1] == parseInt(time[1])) {
          obj.month += exp;
        }
      });
      return obj;
    },
    async findCont(name, uid) {
      //查询经理的合同
      let arr = []
      this.contractList.map(item=>{
        if(item[name] == uid){
          arr.push(item)
        }
      })
      return arr
    },
    //合同列表
    async getContractList(){
      var data = {
        skip: 0,
        limit: 9999999
      };
      let arr = await this.$axios.post(this.$api.findContract, data);
      if (
        arr.code == 200 &&
        arr.data.length > 0 &&
        arr.data[0].data.length > 0
      ) {
        this.contractList = arr.data[0].data;
      }
    }
  }
}
</script>

<style scoped>
.headName {
  font-weight: 600;
  font-size: 16px;
}
</style>
