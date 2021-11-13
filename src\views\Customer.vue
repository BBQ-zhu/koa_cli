<template>
  <div class="card">
    <div class="header flex">
      <el-button v-if="meth[0]" type="primary" icon="el-icon-upload" @click="upload">上传客户资料</el-button>
      <el-input placeholder="请输入内容" v-model="input" class="input-with-select findInput ml20">
        <el-select v-model="select" slot="prepend" placeholder="请选择" style="width: 130px">
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
          <el-collapse v-model="activeNames">
            <el-collapse-item title="基本情况" name="1">
              <div class="flex">
                <el-form-item label="客户姓名:" prop="name">
                  <el-input v-model="ruleForm.name" placeholder="请输入客户姓名"></el-input>
                </el-form-item>
                <el-form-item label="联系电话:" prop="phone">
                  <el-input v-model="ruleForm.phone" placeholder="请输入联系电话"></el-input>
                </el-form-item>
                <el-form-item label="身份证号:" prop="idcard">
                  <el-input v-model="ruleForm.idcard" placeholder="请输入身份证号"></el-input>
                </el-form-item>
                <el-form-item label="客户年龄:" prop="age">
                  <el-input v-model="ruleForm.age" placeholder="请输入客户年龄"></el-input>
                </el-form-item>
                <el-form-item label="需求资金(万):" prop="fund">
                  <el-input v-model="ruleForm.fund" placeholder="请输入需求资金(万)"></el-input>
                </el-form-item>
                <el-form-item label="资金用途:" prop="utility">
                  <el-input v-model="ruleForm.utility" placeholder="请输入资金用途"></el-input>
                </el-form-item>
                <el-form-item label="贷款期限(月):" prop="tenor">
                  <el-input v-model="ruleForm.tenor" placeholder="请输入贷款期限(月)"></el-input>
                </el-form-item>
                <el-form-item label="婚姻状况:" prop="matrimony">
                  <el-select style="width: 100%" v-model="ruleForm.matrimony" placeholder="请选择">
                    <el-option label="已婚" value="已婚"></el-option>
                    <el-option label="未婚" value="未婚"></el-option>
                    <el-option label="离异" value="离异"></el-option>
                    <el-option label="丧偶" value="丧偶"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="子女情况:" prop="children">
                  <el-input v-model="ruleForm.children" placeholder="请输入子女情况"></el-input>
                </el-form-item>
                <el-form-item label="配偶是否知晓:" prop="knowing">
                  <el-select style="width: 100%" v-model="ruleForm.knowing" placeholder="请选择">
                    <el-option label="知晓" value="知晓"></el-option>
                    <el-option label="不知晓" value="不知晓"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="户籍所在地:" prop="domicile">
                  <el-input v-model="ruleForm.domicile" placeholder="请输入户籍所在地"></el-input>
                </el-form-item>
                <el-form-item label="现居城市:" prop="address">
                  <el-cascader
                    v-model="ruleForm.address"
                    :options="fixedInfo.address"
                    :props="{ expandTrigger: 'hover' }"
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址:" prop="addressdetail">
                  <el-input v-model="ruleForm.addressdetail" placeholder="请输入详细居住地址"></el-input>
                </el-form-item>
              </div>
            </el-collapse-item>
            <el-collapse-item title="收入情况" name="2">
              <div class="flex">
                <el-form-item label="职业类型:" prop="hires">
                    <el-select style="width:100%" v-model="ruleForm.hires" placeholder="请选择">
                      <el-option
                        v-for="item in fixedInfo.hiresList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                <el-form-item label="年开票金额:" prop="invoicing">
                  <el-input v-model="ruleForm.invoicing" placeholder="请输入年开票金额"></el-input>
                </el-form-item>
                <el-form-item label="年缴税金额:" prop="paying">
                  <el-input v-model="ruleForm.paying" placeholder="请输入年缴税金额"></el-input>
                </el-form-item>
                <el-form-item label="单位名称:" prop="unit">
                  <el-input v-model="ruleForm.unit" placeholder="请输入单位名称"></el-input>
                </el-form-item>
                <el-form-item label="工作岗位:" prop="unitposition">
                  <el-input v-model="ruleForm.unitposition" placeholder="请输入工作岗位"></el-input>
                </el-form-item>
                <el-form-item label="单位地址:" prop="unitadress">
                  <el-input v-model="ruleForm.unitadress" placeholder="请输入单位地址"></el-input>
                </el-form-item>
                <el-form-item label="单位电话:" prop="unitphone">
                  <el-input v-model="ruleForm.unitphone" placeholder="请输入单位电话"></el-input>
                </el-form-item>
                <el-form-item label="入职时间:" prop="entrytime">
                  <el-input v-model="ruleForm.entrytime" placeholder="请输入入职时间"></el-input>
                </el-form-item>
                <el-form-item label="月收入:" prop="revenue">
                  <el-input v-model="ruleForm.revenue" placeholder="请输入月收入"></el-input>
                </el-form-item>
                <el-form-item label="社保情况:" prop="social">
                  <el-select style="width: 100%" v-model="ruleForm.social" placeholder="请选择">
                    <el-option
                      v-for="item in fixedInfo.socialList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="公积金情况:" prop="provident">
                  <el-select style="width: 100%" v-model="ruleForm.provident" placeholder="请选择">
                    <el-option
                      v-for="item in fixedInfo.providentList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="公积金年限:" prop="proyears">
                  <el-input v-model="ruleForm.proyears" placeholder="请输入公积金年限"></el-input>
                </el-form-item>
                <el-form-item label="公积金基数:" prop="probase">
                  <el-input v-model="ruleForm.probase" placeholder="请输入公积金基数"></el-input>
                </el-form-item>
                <el-form-item label="社保年限:" prop="socialyear">
                  <el-input v-model="ruleForm.socialyear" placeholder="请输入社保年限"></el-input>
                </el-form-item>
              </div>
            </el-collapse-item>
            <el-collapse-item title="房屋情况" name="3">
              <div class="flex">
                <el-form-item label="房产情况:" prop="houses">
                  <el-select style="width:100%" v-model="ruleForm.houses" placeholder="请选择">
                    <el-option
                      v-for="item in fixedInfo.housesList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="小区名称:" prop="housesname">
                  <el-input v-model="ruleForm.housesname" placeholder="请输入小区名称"></el-input>
                </el-form-item>
                <el-form-item label="小区地址:" prop="houaddress">
                  <el-input v-model="ruleForm.houaddress" placeholder="请输入小区地址"></el-input>
                </el-form-item>
                <el-form-item label="购买时间:" prop="housetime">
                  <el-input v-model="ruleForm.housetime" placeholder="请输入购买时间"></el-input>
                </el-form-item>
                <el-form-item label="房屋面积:" prop="housearea">
                  <el-input v-model="ruleForm.housearea" placeholder="请输入房屋面积"></el-input>
                </el-form-item>
                <el-form-item label="房屋类型:" prop="housetype">
                  <el-select style="width: 100%" v-model="ruleForm.housetype" placeholder="请选择">
                    <el-option label="自建房" value="自建房"></el-option>
                    <el-option label="商品房" value="商品房"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="购买方式:" prop="houpayment">
                  <el-select style="width: 100%" v-model="ruleForm.houpayment" placeholder="请选择">
                    <el-option label="全款" value="全款"></el-option>
                    <el-option label="按揭" value="按揭"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否抵押:" prop="houmortgage">
                  <el-select style="width: 100%" v-model="ruleForm.houmortgage" placeholder="请选择">
                    <el-option label="已抵押" value="已抵押"></el-option>
                    <el-option label="未抵押" value="未抵押"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="贷款金额:" prop="houamount">
                  <el-input v-model="ruleForm.houamount" placeholder="抵押请输入贷款金额"></el-input>
                </el-form-item>
              </div>
            </el-collapse-item>
            <el-collapse-item title="车辆情况" name="4">
              <div class="flex">
                <el-form-item label="车辆情况:" prop="car">
                  <el-select style="width:100%" v-model="ruleForm.car" placeholder="请选择">
                    <el-option
                      v-for="item in fixedInfo.carList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="车辆品牌:" prop="carbrand">
                  <el-input v-model="ruleForm.carbrand" placeholder="请输入车辆品牌"></el-input>
                </el-form-item>
                <el-form-item label="购车年限:" prop="caryear">
                  <el-input v-model="ruleForm.caryear" placeholder="请输入购车年限"></el-input>
                </el-form-item>
                <el-form-item label="现评估价格:" prop="carprice">
                  <el-input v-model="ruleForm.carprice" placeholder="请输入评估价格"></el-input>
                </el-form-item>
                <el-form-item label="购买方式:" prop="carpayment">
                  <el-select style="width: 100%" v-model="ruleForm.carpayment" placeholder="请选择">
                    <el-option label="按揭" value="按揭"></el-option>
                    <el-option label="全款" value="全款"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="剩余待还:" prop="carema">
                  <el-input v-model="ruleForm.carema" placeholder="按揭请填写待还金额"></el-input>
                </el-form-item>
              </div>
            </el-collapse-item>
            <el-collapse-item title="保单情况" name="5">
              <div class="flex">
                <el-form-item label="商业保险:" prop="policy">
                  <el-select style="width:100%" v-model="ruleForm.policy" placeholder="请选择">
                    <el-option
                      v-for="item in fixedInfo.policyList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="投保公司名称:" prop="policyname">
                  <el-input v-model="ruleForm.policyname" placeholder="请输入投保公司名称"></el-input>
                </el-form-item>
                <el-form-item label="已保年限:" prop="policyear">
                  <el-input v-model="ruleForm.policyear" placeholder="请输入已保年限"></el-input>
                </el-form-item>
                <el-form-item label="缴费金额:" prop="policypre">
                  <el-input v-model="ruleForm.policypre" placeholder="请输入缴费金额"></el-input>
                </el-form-item>
              </div>
            </el-collapse-item>
            <el-collapse-item title="数据情况" name="6">
              <div class="flex">
                <el-form-item label="芝麻分:" prop="sesame">
                    <el-select style="width:100%" v-model="ruleForm.sesame" placeholder="请选择">
                      <el-option
                        v-for="item in fixedInfo.sesameList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="微粒贷:" prop="microcredit">
                    <el-select style="width:100%" v-model="ruleForm.microcredit" placeholder="请选择">
                      <el-option
                        v-for="item in fixedInfo.microcreditList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="信用卡:" prop="credit">
                    <el-select style="width:100%" v-model="ruleForm.credit" placeholder="请选择">
                      <el-option
                        v-for="item in fixedInfo.creditList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="烟草证:" prop="tobacco">
                    <el-select style="width:100%" v-model="ruleForm.tobacco" placeholder="请选择">
                      <el-option
                        v-for="item in fixedInfo.tobaccoList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="企业税贷:" prop="enterprise">
                    <el-select style="width:100%" v-model="ruleForm.enterprise" placeholder="请选择">
                      <el-option
                        v-for="item in fixedInfo.enterpriseList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="企业票贷:" prop="ticket">
                    <el-select style="width:100%" v-model="ruleForm.ticket" placeholder="请选择">
                      <el-option
                        v-for="item in fixedInfo.ticketList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                <el-form-item label="征信白名单:" prop="creditip">
                  <el-select style="width: 100%" v-model="ruleForm.creditip" placeholder="请选择">
                    <el-option label="是" value="是"></el-option>
                    <el-option label="否" value="否"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否有官司:" prop="lawsuits">
                  <el-select style="width: 100%" v-model="ruleForm.lawsuits" placeholder="请选择">
                    <el-option label="是" value="是"></el-option>
                    <el-option label="否" value="否"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否有案底:" prop="record">
                  <el-select style="width: 100%" v-model="ruleForm.record" placeholder="请选择">
                    <el-option label="是" value="是"></el-option>
                    <el-option label="否" value="否"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="不良嗜好:" prop="hobbies">
                  <el-select style="width: 100%" v-model="ruleForm.hobbies" placeholder="请选择">
                    <el-option label="有" value="有"></el-option>
                    <el-option label="无" value="无"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-collapse-item>
            <el-collapse-item title="紧急情况" name="7">
              <div class="flex">
                <el-form-item label="第一联系人:" prop="contacts1">
                  <el-input v-model="ruleForm.contacts1" placeholder="请输入第一联系人姓名"></el-input>
                </el-form-item>
                <el-form-item label="联系人关系:" prop="conrelat1">
                  <el-select
                    style="width: 100%"
                    v-model="ruleForm.conrelat1"
                    placeholder="请选择与第一联系人关系"
                  >
                    <el-option label="配偶" value="配偶"></el-option>
                    <el-option label="直系亲属" value="直系亲属"></el-option>
                    <el-option label="朋友" value="朋友"></el-option>
                    <el-option label="同事" value="同事"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="联系人电话:" prop="conphone1">
                  <el-input v-model="ruleForm.conphone1" placeholder="请输入第一联系人电话"></el-input>
                </el-form-item>
                <el-form-item label="第二联系人:" prop="contacts2">
                  <el-input v-model="ruleForm.contacts2" placeholder="请输入第二联系人姓名"></el-input>
                </el-form-item>
                <el-form-item label="联系人关系:" prop="conrelat2">
                  <el-select
                    style="width: 100%"
                    v-model="ruleForm.conrelat2"
                    placeholder="请选择与第二联系人关系"
                  >
                    <el-option label="配偶" value="配偶"></el-option>
                    <el-option label="直系亲属" value="直系亲属"></el-option>
                    <el-option label="朋友" value="朋友"></el-option>
                    <el-option label="同事" value="同事"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="联系人电话:" prop="conphone2">
                  <el-input v-model="ruleForm.conphone2" placeholder="请输入第二联系人电话"></el-input>
                </el-form-item>
                <el-form-item label="第三联系人:" prop="contacts3">
                  <el-input v-model="ruleForm.contacts3" placeholder="请输入第三联系人姓名"></el-input>
                </el-form-item>
                <el-form-item label="联系人关系:" prop="conrelat3">
                  <el-select
                    style="width: 100%"
                    v-model="ruleForm.conrelat3"
                    placeholder="请选择与第三联系人关系"
                  >
                    <el-option label="配偶" value="配偶"></el-option>
                    <el-option label="直系亲属" value="直系亲属"></el-option>
                    <el-option label="朋友" value="朋友"></el-option>
                    <el-option label="同事" value="同事"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="联系人电话:" prop="conphone3">
                  <el-input v-model="ruleForm.conphone3" placeholder="请输入第三联系人电话"></el-input>
                </el-form-item>
                <el-form-item label="第四联系人:" prop="contacts4">
                  <el-input v-model="ruleForm.contacts4" placeholder="请输入第四联系人姓名"></el-input>
                </el-form-item>
                <el-form-item label="联系人关系:" prop="conrelat4">
                  <el-select
                    style="width: 100%"
                    v-model="ruleForm.conrelat4"
                    placeholder="请选择与第四联系人关系"
                  >
                    <el-option label="配偶" value="配偶"></el-option>
                    <el-option label="直系亲属" value="直系亲属"></el-option>
                    <el-option label="朋友" value="朋友"></el-option>
                    <el-option label="同事" value="同事"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="联系人电话:" prop="conphone4">
                  <el-input v-model="ruleForm.conphone4" placeholder="请输入第四联系人电话"></el-input>
                </el-form-item>
              </div>
            </el-collapse-item>
            <el-collapse-item title="审核情况" name="8">
              <div class="flex">
                <el-form-item label="归属团队:" prop="hometeam">
                  <el-select v-model="ruleForm.hometeam" placeholder="请选择">
                      <el-option
                        v-for="item in teamList"
                        :key="item.teamname"
                        :label="item.teamname"
                        :value="item.teamname"
                      ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户经理:" prop="manager1">
                  <el-select v-model="ruleForm.manager1" filterable placeholder="请选择">
                    <el-option
                      v-for="item in userList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="权证经理:" prop="manager2">
                  <el-select v-model="ruleForm.manager2" filterable placeholder="请选择">
                    <el-option
                      v-for="item in userList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="审核经理:" prop="manager3">
                  <el-select v-model="ruleForm.manager3" filterable placeholder="请选择">
                    <el-option
                      v-for="item in userList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="审核状态:" prop="status">
                  <el-select style="width: 100%" v-model="ruleForm.status" placeholder="请选择审核状态">
                    <el-option label="草稿" value="草稿"></el-option>
                    <el-option label="待审核" value="待审核"></el-option>
                    <el-option label="驳回" value="驳回"></el-option>
                    <el-option label="通过" value="通过"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-collapse-item>
          </el-collapse>
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
      ></el-table-column>
      <el-table-column label="操作" width="100px">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="editRow(scope.$index, scope.row)"
            type="text"
            size="small"
          >编辑</el-button>
          <el-button
            v-if="meth[1]"
            @click.native.prevent="deleteRow(scope.$index, scope.row)"
            type="text"
            size="small"
          >删除</el-button>
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
      userList:[],
      fixedInfo: fixedInfo, //选项配置
      showUE: false,
      activeNames: ['1'],
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 220
      },
      ueId: 'editor6', //多实例情况下使用
      dialogVisible: false,
      isAdd: true,
      select: '',
      input: '',
      ruleForm: {
        name: '', //姓名
        phone: '', //电话
        idcard: '', //身份证
        age: '', //年龄
        fund: '', //需求资金
        utility: '', //用途
        tenor: '', //贷款期限
        matrimony: '', //婚姻状况
        children: '', //是否有子女
        knowing: '', //已婚配偶是否已知晓
        domicile: '', //户籍所在地
        address: '', //现居城市
        addressdetail:'', //详细地址
        hires: '', //雇佣类型
        unit: '', //工作单位名称
        unitposition: '', //工作岗位
        unitadress: '', //单位地址
        unitphone: '', //单位电话
        entrytime: '', //入职时间
        revenue: '', //月收入
        invoicing: '', //年开票金额
        paying: '', //年缴税金额
        social:'', //是否购买社保
        provident: '', //是否购买公积金、
        proyears: '', //公积金已缴存年限
        probase: '', //公积金已缴存基数
        socialyear: '', //社保缴存年限
        houses: '', //是否有房
        housesname: '', //小区名称
        houaddress: '', //小区位置
        housetime: '', //房屋购买时间
        housearea: '', //房屋面积
        housetype: '', //房屋类型：商品房、自建房
        houpayment: '', //全款还是按揭
        houmortgage: '', //是否已抵押
        houamount: '', //抵押贷款金额
        car: '', //是否有车
        carbrand: '', //车辆品牌
        caryear: '', //车辆购买时间
        carprice: '', //车辆评估价
        carpayment: '', //车辆全款还是按揭
        carema: '', //按揭剩余本金
        policy: '', //有无商业保单
        policyname: '', //投保公司名称
        policyear: '', //已投保年限
        policypre: '', //缴费金额
        creditip: '', //征信是否白名单
        lawsuits: '', //是否有官司
        record: '', //是否有案底
        hobbies: '', //是否有不良嗜好
        contacts1: '', //紧急联系人1
        conphone1: '', //联系人电话1
        conrelat1: '', //联系人的关系1
        contacts2: '', //紧急联系人2
        conphone2: '', //联系人电话2
        conrelat2: '', //联系人的关系2
        contacts3: '', //紧急联系人3
        conphone3: '', //联系人电话3
        conrelat3: '', //联系人的关系3
        contacts4: '', //紧急联系人4
        conphone4: '', //联系人电话4
        conrelat4: '', //联系人的关系4
        hometeam:'', //归属团队
        manager1: '', //客户经理
        manager2: '', //权证经理
        manager3: '', //审核经理
        status: '', //审核状态
        remarks: '', //备注信息
        time: '', //创建时间
        sesame: '', //芝麻分
        microcredit: '', //微粒贷
        credit: '', //信用卡
        tobacco: '', //烟草证
        enterprise: '', //企业税贷
        ticket: '', //企业票贷

      },
      cloneRuleForm: {}, //用于备份
      rules: {
        name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入客户电话', trigger: 'blur' }],
        manager1: [
          { required: true, message: '请输入客户经理工号', trigger: 'blur' }
        ],
        hometeam: [{ required: true, message: '请选择归属团队', trigger: 'blur' }],
      },
      tableData: [],
      teamList:[],
      tableHeader: [
        { name: '客户姓名', prop: 'name' },
        { name: '客户电话', prop: 'phone' },
        { name: '身份证号', prop: 'idcard' },
        { name: '是否有车', prop: 'car' },
        { name: '是否有房', prop: 'houses' },
        { name: '商业保险', prop: 'policy' },
        { name: '社保', prop: 'social' },
        { name: '公积金', prop: 'provident' },
        { name: '客户经理', prop: 'manager1' },
        { name: '创建时间', prop: 'time' }
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
    this.mixinMethod(this.$route.path)
    if (this.$route.query.phone) {
      this.select = 'phone'
      this.input = this.$route.query.phone
    }
    this.cloneRuleForm = JSON.parse(JSON.stringify(this.ruleForm))
    this.findUserList()
    this.getNewsList()
    this.findTeams()
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.showUE = val
      }
    }
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
          arr.map(item=>{
            let obj = {}
            obj.label = `${item.username}（${item.uid}）`
            obj.value = item.uid
            this.userList.push(obj)
          })
        }
      })
    },
    findTeams(){
      //查询团队
      this.$axios.post(this.$api.findTeam).then((res) => {
        if (res.code == 200) {
          this.teamList = res.data;
        }
      });
    },
    upload() {
      this.dialogVisible = !this.dialogVisible
      this.isAdd = true
      this.ruleForm = JSON.parse(JSON.stringify(this.cloneRuleForm))
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
        fuzz: this.select,
        input: this.input,
        team:'hometeam',
        teamname:JSON.parse(sessionStorage.getItem("userInfo") || "{}").team || '',
      }
      this.$axios.post(this.$api.findCustomer, data).then(res => {
        this.tableData = res.data[0].data
        this.find.total = res.data[0].total[0].total || 0
      })
    },
    //编辑按钮
    editRow(index, row) {
      this.isAdd = false
      this.ruleForm = row
      // this.showUE = true;
      this.dialogVisible = true
    },
    //删除行
    deleteRow(index, row) {
      this.$confirm('确认删除该信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios
          .post(this.$api.deleteCustomer, { _id: row._id })
          .then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功')
              this.getNewsList()
            }
          })
      })
    },
    handleClose() {
      this.dialogVisible = false
      // this.showUE = false;
    },
    async uploadBtn(formName) {
      //提交
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.ruleForm.remarks = this.$refs.editor.getUEContent()
          if (this.isAdd) {
            //新增
            delete this.ruleForm._id
            var res = await this.$axios.post(
              this.$api.createCustomer,
              this.ruleForm
            )
            let data = {
              proid: 'new',
              type: '提交-企业资料', // 数据来源
              name: this.ruleForm.name, // 客户名称
              phone: this.ruleForm.phone, // 电话
              submitby: this.ruleForm.manager1, // 提交人
              handler: this.ruleForm.manager2, // 处理人
              path: '/Enterprise', // 跳转企业资料
              read: 'false' // 是否已处理
            }
            this.$axios.post(this.$api.createAgent, data)
          } else {
            var res = await this.$axios.post(
              this.$api.updateCustomer,
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
  width: 202px;
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
