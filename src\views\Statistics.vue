<template>
  <div>
    <div class="flexBetween">
      <div class="headCard">
        <div class="headTitle flexBetween">
          <div class="headLeft">总访问量</div>
          <i class="el-icon-data-line colorBlue"></i>
        </div>
        <div class="headNum colorBlue flowellipsis">{{$common.moneyFormat(allStatic)}}(次)</div>
        <div class="flexBetween">
          <i class="el-icon-s-data f20 color3"></i>
          <div class="color3">率真存厚</div>
        </div>
      </div>
      <div class="headCard">
        <div class="headTitle flexBetween">
          <div class="headLeft">总放款额</div>
          <i class="el-icon-money colorRed"></i>
        </div>
        <div class="headNum colorBlue">{{$common.moneyFormat(expenses)}}(元)</div>
        <div class="flexBetween">
          <i class="el-icon-s-data f20 color3"></i>
          <div class="color3">奋斗为本</div>
        </div>
      </div>
      <div class="headCard">
        <div class="headTitle flexBetween">
          <div class="headLeft">总用户数</div>
          <i class="el-icon-user" style="color: #11BBB8;"></i>
        </div>
        <div class="headNum colorBlue flowellipsis">{{vipUser}}(位)</div>
        <div class="flexBetween">
          <i class="el-icon-s-data f20 color3"></i>
          <div class="color3">创造分享</div>
        </div>
      </div>
      <div class="headCard">
        <div class="headTitle flexBetween">
          <div class="headLeft">总产品量</div>
          <i class="el-icon-goods" style="color: #ff6600;"></i>
        </div>
        <div class="headNum colorBlue flowellipsis">{{productAll}}(个)</div>
        <div class="flexBetween">
          <i class="el-icon-s-data f20 color3"></i>
          <div class="color3">成就客户</div>
        </div>
      </div>
    </div>
    <!-- 访问量和产品图表 -->
    <div class="mt20">
      <div class="flexBetween">
        <div class="card" id="main1" style="width: 59.3%;height:400px;"></div>
        <div class="card" id="main2" style="width: 39.3%;height:400px;"></div>
      </div>
    </div>

    <!-- 客户数据图表 -->
    <div class="card mt20">
      <div class="flexBetween">
        <div></div>
        <div>
          <el-tag
            :type="tagNowDate == '今日'?'danger':'info'"
            class="mr10 pointer"
            @click="tagNowDate = '今日'"
          >今日</el-tag>
          <el-tag
            :type="tagNowDate == '今月'?'danger':'info'"
            class="mr10 pointer"
            @click="tagNowDate = '今月'"
          >今月</el-tag>
          <el-tag
            :type="tagNowDate == '今年'?'danger':'info'"
            class="mr10 pointer"
            @click="tagNowDate = '今年'"
          >今年</el-tag>
          <el-tag
            :type="tagNowDate == '全部'?'danger':'info'"
            class="pointer"
            @click="tagNowDate = '全部'"
          >全部</el-tag>
        </div>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="意向客户量" name="意向客户量">
          <!-- <div id="main3" style="width: 100%;height:400px;"></div> -->
        </el-tab-pane>
        <el-tab-pane label="贷款客户量" name="贷款客户量">
          <!-- <div id="main4" style="width: 100%;height:400px;"></div> -->
        </el-tab-pane>
        <el-tab-pane label="企业客户量" name="企业客户量">
          <!-- <div id="main5" style="width: 100%;height:400px;"></div> -->
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="card mt20">
      <div class="header flex">
        <div class="f16 fw600 ml10">个人业绩</div>
        <span class="f12 color2" style="padding-top: 3px">（点击表头三角符号实现排序）</span>
      </div>
      <el-table
        :data="tableData"
        stripe
        height="350"
        :default-sort="{ prop: 'all', order: 'descending' }"
      >
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
    <div class="card mt20 mb20">
      <div class="header flex">
        <div class="f16 fw600 ml10">团队业绩</div>
        <span class="f12 color2" style="padding-top: 3px">（仅展示使用中团队的业绩）</span>
      </div>
      <el-table
        :data="teamData"
        stripe
        height="350"
        :default-sort="{ prop: 'all', order: 'descending' }"
      >
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
var echarts = require('echarts')
export default {
  data() {
    return {
      tagNowDate: '今日',
      activeName: '意向客户量',
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
      teamData: [], //团队业绩
      userList: [], // 用户列表
      contractList: [], // 合同列表
      userResults: [], // 个人业绩
      productAll: 0, //总产品数量
      anglepro: [], //产品热度前十位
      vipUser: 0, //系统会员用户量
      expenses: 0, //总放款额
      monthlist: [], //当年访问量分月
      allStatic: 0 //总访问量
    }
  },
  async mounted() {
    this.mixinMethod(this.$route.path)
    await this.getContractList() //合同列表
    await this.getVipUserList() //vip用户量
    await this.getUserList() //员工列表
    await this.getProductList() // 产品数量和热度统计
    await this.statistic() //访问量统计
    await this.getAllData() // 意向客户、贷款客户、企业客户统计
    await this.echart() // 图表初始化
  },
  methods: {
    //访问量统计
    async statistic() {
      var data = { year: new Date().getFullYear() }
      await this.$axios.post(this.$api.findStatistics, data).then(res => {
        if (res.code == 200) {
          this.monthlist = res.data[0].monthlist
        }
      })
      this.$axios.post(this.$api.findStatistics, {}).then(res => {
        if (res.code == 200) {
          let arr = res.data
          for (let item of arr) {
            item.monthlist.map(val => {
              this.allStatic = parseInt(this.allStatic) + parseInt(val)
            })
          }
        }
      })
    },
    // 产品数量和热度统计
    async getProductList() {
      var data = {
        skip: 0,
        limit: 999999999
      }
      await this.$axios.post(this.$api.findProduct, data).then(res => {
        let productList = res.data[0].data
        this.productAll = ((res.data[0] || {}).total[0] || {}).total || 0
        let arr = productList.sort(this.$common.compare('totalview')).slice(-10)
        arr.map(item => {
          let obj = { value: parseInt(item.totalview), name: item.name }
          this.anglepro.push(obj)
        })
      })
    },
    // 意向客户、贷款客户、企业客户统计
    async getAllData() {
      var data = {
        skip: 0,
        limit: 9999999999,
        category: '全部客户', //客户类别 我的客户、公海客户、全部客户
        classTypename: 'type',
        classType: '意向客户' // 业务类别
      }
      this.$axios.post(this.$api.findIntegrate, data).then(res => {
        let arr = res.data[0].data
        this.chichData(arr)
      })
    },
    chichData(data) {
      // tagNowDate:'今日', activeName:'意向客户量',
      let nowdate = `${new Date().getFullYear()}/${new Date().getMonth() +
        1}/${new Date().getDate()}`
      if (this.tagNowDate == '今日') {
        let obj = {}
        for (let item of data) {
          console.log(item.time.split(' ')[0])
          if (item.time.split(' ')[0] == nowdate) {
            if (obj[item.manager1]) obj[item.manager1]++
            else obj[item.manager1] = 1
          }
        }
        let arr1 = []
        for (var o in obj) {
          arr1.push({
            el: o,
            count: obj[o]
          })
        }
        console.log(arr1)
        console.log(this.getChaName('00056'))
      }
    },
    // 统计类别切换
    handleClick(tab, event) {
      console.log(this.activeName)
    },
    // 图表初始化
    echart() {
      var myChart1 = echarts.init(document.getElementById('main1'))
      // 分月统计访问量
      myChart1.setOption({
        title: {
          text: '访问量分月统计'
        },
        tooltip: {},
        xAxis: {
          data: [
            '1月',
            '2月',
            '3月',
            '4月',
            '5月',
            '6月',
            '7月',
            '8月',
            '9月',
            '10月',
            '11月',
            '12月'
          ]
        },
        yAxis: {},
        series: [
          {
            name: '访问量',
            type: 'bar',
            data: this.monthlist
          }
        ]
      })
      //产品热度前十
      var myChart2 = echarts.init(document.getElementById('main2'))
      myChart2.setOption({
        title: {
          text: '产品热度前十'
        },
        series: [
          {
            name: '产品热度',
            type: 'pie', // 设置图表类型为饼图
            radius: '55%', // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
            roseType: 'angle',
            data: this.anglepro
          }
        ]
      })
      //客户数据提交量统计
      var myChart3 = echarts.init(document.getElementById('main3'))
      myChart3.setOption({
        title: {
          text: '客户数据提交量统计'
        },
        tooltip: {},
        xAxis: {
          data: [
            '1月',
            '2月',
            '3月',
            '4月',
            '5月',
            '6月',
            '7月',
            '8月',
            '9月',
            '10月',
            '11月',
            '12月'
          ]
        },
        yAxis: {},
        series: [
          {
            name: '访问量',
            type: 'bar',
            data: this.monthlist
          }
        ]
      })
    },
    //反查员工中文名
    getChaName(uid){
      let name=''
      for(let item of this.userList){
        if(item.uid == uid){
          name = item.username
          break;
        }
      }
      return name
    },
    //获取系统用户列表
    async getVipUserList() {
      var data = {
        skip: 0,
        limit: 9999999
      }
      let res = await this.$axios.post(this.$api.findVipuser, data)
      if (res.code == 200) {
        this.vipUser = (res.data[0].total[0] || {}).total || 0
      }
    },
    //获取员工用户列表
    async getUserList() {
      var data = {
        skip: 0,
        limit: 9999999
      }
      let res = await this.$axios.post(this.$api.findUser, data)
      if (res.code == 200) {
        this.userList = res.data[0].data
        this.tableData = []
        for (let item of this.userList) {
          await this.findUserPer(item)
        }
        this.findTeamPer()
      }
    },
    // 查询团队业绩
    async findTeamPer() {
      this.teamData = []
      this.tableData.map(item => {
        let key = false
        for (let val of this.teamData) {
          if (val.team == item.team) {
            val.teamusers.push('，' + item.username + '(' + item.uid + ')')
            val.month += parseInt(item.month)
            val.year += parseInt(item.year)
            val.all += parseInt(item.all)
            key = true
          }
        }
        if (!key) {
          let obj = {
            team: item.team,
            teamusers: [item.username + '(' + item.uid + ')'],
            month: item.month,
            year: item.year,
            all: item.all
          }
          this.teamData.push(obj)
        }
      })
    },
    // 查询个人业绩
    async findUserPer(item) {
      let arr = await this.findthree(item.uid)
      //个人业绩统计
      let userResults = await this.statistics(arr)
      // if(userResults.month || userResults.year || userResults.all){
      userResults.username = item.username
      userResults.uid = item.uid
      userResults.team = item.team
      this.tableData.push(userResults)
      // }
    },
    async findthree(uid) {
      // 合同总数查询
      let arr1 = await this.findCont('manager1', uid)
      let arr2 = await this.findCont('manager2', uid)
      let arr3 = await this.findCont('manager3', uid)
      let arr = arr1.concat(arr2).concat(arr3)
      return arr // 业绩统计（只要当前员工包含在客户经理、客服经理、代办客服中的一个，都会算业绩，且可以同时担任多个经理，业绩就翻倍）
    },
    //根据合同列表分时间段统计业绩
    statistics(arr) {
      let obj = { month: 0, year: 0, all: 0 }
      let nowTieme = `${new Date().getFullYear()}/${new Date().getMonth() +
        1}/${new Date().getDate()}`.split('/')
      arr.map(item => {
        // let time = item.time.split(" ")[0].split("/"); // 用户签字时间
        let time = item.startime.split('-') // 合同起始时间
        let exp = parseInt(item.expenses) || 0
        obj.all += exp
        if (nowTieme[0] == parseInt(time[0])) {
          obj.year += exp
        }
        if (nowTieme[1] == parseInt(time[1])) {
          obj.month += exp
        }
      })
      return obj
    },
    async findCont(name, uid) {
      //查询经理的合同
      let arr = []
      this.contractList.map(item => {
        if (item[name] == uid) {
          arr.push(item)
        }
      })
      return arr
    },
    //合同列表
    async getContractList() {
      var data = {
        skip: 0,
        limit: 99999999
      }
      let arr = await this.$axios.post(this.$api.findContract, data)
      if (
        arr.code == 200 &&
        arr.data.length > 0 &&
        arr.data[0].data.length > 0
      ) {
        this.contractList = arr.data[0].data
        this.contractList.map(item => {
          this.expenses += parseInt(item.expenses)
        })
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
.headCard {
  width: 24%;
  height: 165px;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 15px;
  background: #fff;
  box-shadow: 0 -3px 31px 0 rgb(0 0 0 / 5%), 0 6px 20px 0 rgb(0 0 0 / 2%);
}
.headTitle {
  font-size: 20px;
  font-weight: 800;
  padding-bottom: 10px;
  border-bottom: 1px solid #909399;
}
.headNum {
  font-size: 26px;
  padding: 30px 0;
  font-weight: 800;
}
.headLeft {
  border-left: 3px solid #45b2fd;
  padding-left: 4px;
}
</style>
