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
    <div class="card mt20" v-if="userInfo.uid == '00000' || userInfo.team == '铸力内勤'">
      <div class="flexBetween">
        <div></div>
        <div>
          <el-tag
            :type="tagNowDate == '今日'?'danger':'info'"
            class="mr10 pointer"
            @click="tagNowDate = '今日',getAllData()"
          >今日</el-tag>
          <el-tag
            :type="tagNowDate == '今月'?'danger':'info'"
            class="mr10 pointer"
            @click="tagNowDate = '今月',getAllData()"
          >今月</el-tag>
          <el-tag
            :type="tagNowDate == '今年'?'danger':'info'"
            class="mr10 pointer"
            @click="tagNowDate = '今年',getAllData()"
          >今年</el-tag>
          <el-tag
            :type="tagNowDate == '全部'?'danger':'info'"
            class="pointer"
            @click="tagNowDate = '全部',getAllData()"
          >全部</el-tag>
        </div>
      </div>
      <div style="border-bottom: 1px solid #909399;padding-bottom:10px;">
        <el-tag
          :type="activeName == '意向客户量'?'success':'info'"
          class="mr10 pointer"
          @click="activeName = '意向客户量',getAllData()"
        >意向客户量</el-tag>
        <el-tag
          :type="activeName == '贷款客户量'?'success':'info'"
          class="mr10 pointer"
          @click="activeName = '贷款客户量',getAllData()"
        >贷款客户量</el-tag>
        <el-tag
          :type="activeName == '企业客户量'?'success':'info'"
          class="mr10 pointer"
          @click="activeName = '企业客户量',getAllData()"
        >企业客户量</el-tag>
      </div>
      <div v-loading="loading" class="mt20" id="main3" style="width: 100%;height:400px;"></div>
    </div>
    <!-- 个人业绩 -->
    <div class="card mt20">
      <el-tabs v-model="resultsActive">
        <el-tab-pane label="分时统计" name="分时统计">
          <div>
            <div class="flex">
              <!-- <div class="f16 fw600 ml10">{{userInfo.team}}个人业绩分时统计</div> -->
              <!-- <span class="f12 color2" style="padding-top: 3px">（点击表头三角符号实现排序）</span> -->
            </div>
            <el-table
              :data="tableData"
              stripe
              height="350"
              :default-sort="{ prop: 'all', order: 'descending' }"
            >
              <el-table-column label="#" type="index" width="50"></el-table-column>
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
        </el-tab-pane>
        <el-tab-pane
          v-if="this.userInfo.uid == '00000' || this.userInfo.team == '铸力内勤'"
          label="明细统计"
          name="明细统计"
        >
          <div>
            <div class="flexBetween">
              <div>
                <!-- <div class="f16 fw600 ml10">个人业绩明细统计</div>
                <span class="f12 color2" style="padding-top: 3px">（点击表头三角符号实现排序）</span>-->
              </div>
              <div>
                <el-dropdown @command="handleCommand">
                  <el-button type="primary">
                    导出
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="今月">今月</el-dropdown-item>
                    <el-dropdown-item command="今年">今年</el-dropdown-item>
                    <el-dropdown-item command="全部">全部</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
            <el-table
              :data="tableDataStated"
              stripe
              height="350"
              :default-sort="{ prop: 'expenses', order: 'descending' }"
            >
              <el-table-column label="#" type="index" width="50"></el-table-column>
              <el-table-column
                sortable
                v-for="(item, index) in tableDataStatedHeader"
                :key="index"
                :prop="item.prop"
                :label="item.name"
                show-overflow-tooltip
                min-width="100px"
              ></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 团队业绩 -->
    <div class="card mt20 mb20">
      <div class="header flex">
        <div class="f16 fw600 ml10">{{userInfo.team}}业绩</div>
        <span class="f12 color2" style="padding-top: 3px">（仅展示所在团队的业绩）</span>
      </div>
      <el-table
        :data="teamData"
        stripe
        height="350"
        :default-sort="{ prop: 'all', order: 'descending' }"
      >
        <el-table-column label="#" type="index" width="50"></el-table-column>
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
import ExportJsonExcel from 'js-export-excel'
export default {
  data() {
    return {
      resultsActive: '分时统计',
      userInfo: {},
      tagNowDate: '今日',
      activeName: '意向客户量',
      allData: [],
      allUser: [],
      nearrLength: 0,
      loading: false,
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
      tableDataStatedHeader: [
        { name: '员工名称', prop: 'username' },
        { name: '员工ID', prop: 'uid' },
        { name: '角色', prop: 'role' },
        { name: '所属团队', prop: 'team' },
        { name: '处理经理', prop: 'manager' },
        { name: '客户名称', prop: 'name' },
        { name: '放款金额', prop: 'expenses' },
        { name: '起始日期', prop: 'startime' },
        { name: '结束日期', prop: 'endtime' },
        { name: '签约时间', prop: 'time' }
      ],
      tableDataStated: [], //个人明细业绩
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
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}')
    await this.getContractList() //合同列表
    await this.getVipUserList() //vip用户量
    await this.getUserList() //员工列表
    await this.getProductList() // 产品数量和热度统计
    await this.statistic() //访问量统计
    if (this.userInfo.uid == '00000' || this.userInfo.team == '铸力内勤') {
      await this.getAllData() // 意向客户、贷款客户、企业客户统计
    }
    await this.echart() // 图表初始化
  },
  methods: {
    // 下载为Excle表格
    handleCommand(command) {
      this.$confirm('确认导出' + command + '个人业绩吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let date = this.$common.dateTime()
        let time = ''
        if (command == '今月') {
          time = date.split('/')[0] + '/' + date.split('/')[1]
        } else if (command == '今年') {
          time = date.split('/')[0]
        } else if (command == '全部') {
          time = '2' //空格查询所有时间 2021
        }
        let newData = []
        this.tableDataStated.map(item => {
          if (item.time.indexOf(time) == 0) {
            newData.push(item)
          }
        })
        if (newData.length > 0) {
          this.exportExcel(newData)
        } else {
          this.$message.error('暂无数据')
        }
      })
    },
    // 下载为Excle表格事件
    exportExcel(newData) {
      var option = {}
      option.fileName = '个人业绩' + this.$common.dateTime() //文件名
      let sheetFilter = []
      let sheetHeader = []
      this.tableDataStatedHeader.map(val => {
        sheetFilter.push(val.prop)
        sheetHeader.push(val.name)
      })
      option.datas = [
        {
          //第一个sheet（第一个excel表格）
          sheetData: newData, //数据
          sheetName: '个人业绩',
          sheetFilter: sheetFilter, //表头数据对应的sheetData数据
          sheetHeader: sheetHeader, //表头数据
          columnWidths: ['6', '6', '6', '6', '6', '6', '6', '6', '6', '9'] // 列宽
        }
        // {
        //   //第二个sheet（第二个excel）
        //   sheetData:[{one:'一行一列',two:'一行二列'},{one:'二行一列',two:'二行二列'}]
        // }
      ]
      var toExcel = new ExportJsonExcel(option)
      toExcel.saveExcel()
    },
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
      this.loading = true
      let date = this.$common.dateTime()
      let time = ''
      if (this.tagNowDate == '今日') {
        time = date
      } else if (this.tagNowDate == '今月') {
        time = date.split('/')[0] + '/' + date.split('/')[1]
      } else if (this.tagNowDate == '今年') {
        time = date.split('/')[0]
      } else if (this.tagNowDate == '全部') {
        time = '2' //空格查询所有时间 2021
      }
      var data = {
        skip: 0,
        limit: 9999999999,
        category: '全部客户', //客户类别 我的客户、公海客户、全部客户
        classTypename: 'type',
        classType: this.activeName != '企业客户量' ? '意向客户' : '', // 业务类别
        fuzz: 'time',
        input: time
        // uid: uid || ''
      }
      let URL = ''
      if (this.activeName == '意向客户量') {
        URL = this.$api.findIntegrate
      } else if (this.activeName == '贷款客户量') {
        URL = this.$api.findCustomer
      } else if (this.activeName == '企业客户量') {
        URL = this.$api.findEnterprise
      }
      await this.$axios
        .post(URL, data)
        .then(async res => {
          if (res.code == 200) {
            let arr = res.data[0].data
            let newarr = []
            arr.map(item => {
              if (item.status != '草稿' && item.status) {
                newarr.push(item)
              }
            })
            this.nearrLength = newarr.length
            await this.chichData(newarr) // 计算分拆合成图表数据
            this.loading = false
          } else {
            this.loading = false
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 计算分拆合成图表数据
    chichData(arr) {
      let obj = {}
      for (let item of arr) {
        let manager1 = `${this.getChaName(item.manager1) || item.manager1}(${
          item.manager1
        })` //工号反查
        if (obj[manager1]) obj[manager1]++
        else obj[manager1] = 1
      }
      let arr1 = []
      for (var o in obj) {
        arr1.push({
          el: o,
          count: obj[o]
        })
      }
      let arr2 = this.$common.bubbleSort(arr1, 'count').reverse() //对象排序 //倒叙排列
      this.allData = []
      this.allUser = []
      for (let item of arr2) {
        this.allData.push(item.count)
        this.allUser.push(item.el)
      }
      //客户数据提交量统计
      var myChart3 = echarts.init(document.getElementById('main3'))
      myChart3.setOption({
        color: '#ff6600',
        title: {
          text: '数据提交量统计:共' + this.nearrLength + '个'
        },
        tooltip: {},
        xAxis: {
          data: this.allUser,
          axisLabel: {
            // 竖向排列名称
            interval: 0,
            formatter: function(val) {
              let name = val.split('(')[0].split('')
              return name.join('\n')
            }
          }
        },
        yAxis: {},
        series: [
          {
            name: '提交量',
            type: 'bar',
            data: this.allData
          }
        ]
      })
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
    },
    //反查员工中文名
    getChaName(uid) {
      let name = ''
      for (let item of this.userList) {
        if (item.uid == uid) {
          name = item.username
          break
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
        limit: 9999999,
        fuzz: 'team',
        input: this.userInfo.team == '铸力内勤' ? '' : this.userInfo.team
      }
      let res = await this.$axios.post(this.$api.findUser, data)
      if (res.code == 200) {
        this.userList = res.data[0].data
        this.tableData = []
        this.tableDataStated = []
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
      //个人业绩分时统计
      let userResults = await this.statistics(arr)
      userResults.username = item.username
      userResults.uid = item.uid
      userResults.team = item.team
      this.tableData.push(userResults)
      //个人业绩明细统计
      let oldarr = []
      for (let val of arr) {
        let obj = {}
        obj.username = item.username
        obj.uid = item.uid
        obj.team = item.team
        obj.role = item.role
        obj.manager = val.manager
        obj.name = val.name
        obj.expenses = val.expenses
        obj.startime = val.startime
        obj.endtime = val.endtime
        obj.time = val.time
        oldarr.push(obj)
        this.tableDataStated.push(obj)
      }
    },
    async findthree(uid) {
      // 合同总数查询
      let arr1 = await this.findCont('manager1', uid)
      let arr2 = await this.findCont('manager2', uid)
      let arr3 = await this.findCont('manager3', uid)
      let arr = arr1.concat(arr2).concat(arr3)
      return arr || [] // 业绩统计（只要当前员工包含在客户经理、客服经理、代办客服中的一个，都会算业绩，且可以同时担任多个经理，业绩就翻倍）
    },
    //根据合同列表分时间段统计业绩
    statistics(arr) {
      let obj = { month: 0, year: 0, all: 0 }
      let nowTieme = this.$common.dateTime().split('/')
      arr.map(item => {
        let time = item.time.split('/') // 合同起始时间
        let exp = parseInt(item.expenses) || 0
        obj.all += exp
        if (nowTieme[0] == time[0]) {
          //年
          obj.year += exp
        }
        if (nowTieme[0] == time[0] && nowTieme[1] == time[1]) {
          //月
          obj.month += exp
        }
      })
      return obj
    },
    async findCont(name, uid) {
      //查询经理的合同
      let arr = []
      this.contractList.map(item => {
        const newObj = JSON.parse(JSON.stringify(item))
        if (newObj[name] == uid) {
          newObj.manager = ''
          if (name === 'manager1') {
            newObj.manager = '客户经理'
          } else if (name === 'manager2') {
            newObj.manager = '客服经理'
          } else if (name === 'manager3') {
            newObj.manager = '代办客服'
          }
          arr.push(newObj)
        }
      })
      return arr
    },
    //合同列表
    async getContractList() {
      var data = {
        skip: 0,
        limit: 99999999,
        fuzz: 'status',
        input: '合同生效' // '合同生效'
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
