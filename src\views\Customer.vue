<template>
  <div class="card">
    <div class="header flex">
      <el-button v-if="meth[0]" type="primary" icon="el-icon-upload" @click="upload">上传客户资料</el-button>
      <el-select
        @change="tabelShow = false"
        class="ml20"
        style="width: 202px"
        v-model="category"
        placeholder="请选择数据类别"
      >
        <el-option label="我的客户" value="我的客户"></el-option>
        <el-option label="公海客户" value="公海客户"></el-option>
        <el-option
          v-if="userInfo && userInfo.seeall && userInfo.seeall=='是'"
          label="全部客户"
          value="全部客户"
        ></el-option>
      </el-select>
      <el-input clearable
        placeholder="请输入内容"
        v-model="input"
        class="input-with-select findInput ml20"
      >
        <el-select clearable v-model="select" slot="prepend" placeholder="请选择" style="width: 130px">
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
          @click="(find.currentPage = 1), getNewsList(),tabelShow = true"
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
                  <el-input clearable  v-model="ruleForm.name" placeholder="请输入客户姓名"></el-input>
                </el-form-item>
                <el-form-item label="联系电话:" prop="phone">
                  <el-input clearable  v-model="ruleForm.phone" placeholder="请输入联系电话"></el-input>
                </el-form-item>
                <el-form-item label="身份证号:" prop="idcard">
                  <el-input clearable  v-model="ruleForm.idcard" placeholder="请输入身份证号"></el-input>
                </el-form-item>
                <el-form-item label="客户年龄:" prop="age">
                  <el-input clearable  v-model="ruleForm.age" placeholder="请输入客户年龄"></el-input>
                </el-form-item>
                <el-form-item label="需求资金(万):" prop="fund">
                  <el-input clearable  v-model="ruleForm.fund" placeholder="请输入需求资金(万)"></el-input>
                </el-form-item>
                <el-form-item label="资金用途:" prop="utility">
                  <el-input clearable  v-model="ruleForm.utility" placeholder="请输入资金用途"></el-input>
                </el-form-item>
                <el-form-item label="贷款期限(月):" prop="tenor">
                  <el-input clearable  v-model="ruleForm.tenor" placeholder="请输入贷款期限(月)"></el-input>
                </el-form-item>
                <el-form-item label="婚姻状况:" prop="matrimony">
                  <el-select
                    clearable
                    style="width: 100%"
                    v-model="ruleForm.matrimony"
                    placeholder="请选择"
                  >
                    <el-option label="已婚" value="已婚"></el-option>
                    <el-option label="未婚" value="未婚"></el-option>
                    <el-option label="离异" value="离异"></el-option>
                    <el-option label="丧偶" value="丧偶"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  v-if="ruleForm.matrimony == '已婚' || ruleForm.matrimony == '离异' || ruleForm.matrimony == '丧偶'"
                  label="子女姓名:"
                  prop="children"
                >
                  <el-input clearable  v-model="ruleForm.children" placeholder="请输入子女姓名"></el-input>
                </el-form-item>
                <el-form-item v-if="ruleForm.matrimony == '已婚'" label="配偶是否知晓:" prop="knowing">
                  <el-select
                    clearable
                    style="width: 100%"
                    v-model="ruleForm.knowing"
                    placeholder="请选择"
                  >
                    <el-option label="知晓" value="知晓"></el-option>
                    <el-option label="不知晓" value="不知晓"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="户籍所在地:" prop="domicile">
                  <el-input clearable  v-model="ruleForm.domicile" placeholder="请输入户籍所在地"></el-input>
                </el-form-item>
                <el-form-item label="现居城市:" prop="address">
                  <el-cascader
                    v-model="ruleForm.address"
                    :options="fixedInfo.address"
                    :props="{ expandTrigger: 'hover' }"
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址:" prop="addressdetail">
                  <el-input clearable  v-model="ruleForm.addressdetail" placeholder="请输入详细居住地址"></el-input>
                </el-form-item>
              </div>
            </el-collapse-item>
            <el-collapse-item title="收入情况" name="2">
              <div class="flex">
                <el-form-item label="职业类型:" prop="hires">
                  <el-select
                    clearable
                    style="width: 100%"
                    v-model="ruleForm.hires"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in fixedInfo.hiresList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <span
                  class="flex"
                  v-show="ruleForm.hires && (ruleForm.hires == '企业主' || ruleForm.hires == '上班族' || ruleForm.hires == '个体户' || ruleForm.hires == '公务员')"
                >
                  <el-form-item label="单位名称:" prop="unit">
                    <el-input clearable  v-model="ruleForm.unit" placeholder="请输入单位名称"></el-input>
                  </el-form-item>
                  <el-form-item label="单位地址:" prop="unitadress">
                    <el-input clearable  v-model="ruleForm.unitadress" placeholder="请输入单位地址"></el-input>
                  </el-form-item>
                  <el-form-item label="工作职级:" prop="unitposition">
                    <el-input clearable  v-model="ruleForm.unitposition" placeholder="请输入工作职级"></el-input>
                  </el-form-item>
                  <el-form-item
                    :label="(ruleForm.hires == '企业主' || ruleForm.hires == '个体户')?'负责人电话:':'单位电话:'"
                    prop="unitphone"
                  >
                    <el-input clearable  v-model="ruleForm.unitphone" placeholder="请输入电话号码"></el-input>
                  </el-form-item>
                  <el-form-item
                    v-if="ruleForm.hires != '企业主' && ruleForm.hires != '个体户'"
                    label="入职时间(月):"
                    prop="entrytime"
                  >
                    <el-input clearable  v-model="ruleForm.entrytime" placeholder="请输入时间(月)"></el-input>
                  </el-form-item>
                </span>
                <el-form-item label="月收入(元):" prop="revenue">
                  <el-input clearable  v-model="ruleForm.revenue" placeholder="请输入月收入(元)"></el-input>
                </el-form-item>
                <el-form-item label="是否有社保:" prop="social">
                  <el-select
                    clearable
                    style="width: 100%"
                    v-model="ruleForm.social"
                    placeholder="请选择是否有社保"
                  >
                    <el-option
                      v-for="item in fixedInfo.socialList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  v-show="ruleForm.social && ruleForm.social !='无社保'"
                  label="社保年限(月):"
                  prop="socialyear"
                >
                  <el-input clearable  v-model="ruleForm.socialyear" placeholder="请输入社保年限(月)"></el-input>
                </el-form-item>
                <el-form-item label="是否有公积金:" prop="provident">
                  <el-select
                    clearable
                    style="width: 100%"
                    v-model="ruleForm.provident"
                    placeholder="请选择是否有公积金"
                  >
                    <el-option
                      v-for="item in fixedInfo.providentList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  v-show="ruleForm.provident && ruleForm.provident !='无公积金'"
                  label="公积金年限(月):"
                  prop="proyears"
                >
                  <el-input clearable  v-model="ruleForm.proyears" placeholder="请输入公积金年限(月)"></el-input>
                </el-form-item>
                <el-form-item
                  v-show="ruleForm.provident && ruleForm.provident !='无公积金'"
                  label="公积金基数:"
                  prop="probase"
                >
                  <el-input clearable  v-model="ruleForm.probase" placeholder="请输入公积金基数"></el-input>
                </el-form-item>
              </div>
            </el-collapse-item>
            <el-collapse-item title="房屋情况" name="3">
              <div class="flex">
                <el-form-item label="房产情况:" prop="houses">
                  <el-select
                    clearable
                    style="width: 100%"
                    v-model="ruleForm.houses"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in fixedInfo.housesList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <div class="flex" v-if="ruleForm.houses && ruleForm.houses == '是'">
                  <el-form-item label="房屋类型:" prop="housetype">
                    <el-select
                      clearable
                      style="width: 100%"
                      v-model="ruleForm.housetype"
                      placeholder="请选择"
                    >
                      <el-option label="商品房" value="商品房"></el-option>
                      <el-option label="商铺" value="商铺"></el-option>
                      <el-option label="公寓" value="公寓"></el-option>
                      <el-option label="安置房" value="安置房"></el-option>
                      <el-option label="自建房" value="自建房"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="小区名称:" prop="housesname">
                    <el-input clearable  v-model="ruleForm.housesname" placeholder="请输入小区名称"></el-input>
                  </el-form-item>
                  <el-form-item label="坐落位置:" prop="houaddress">
                    <el-input clearable  v-model="ruleForm.houaddress" placeholder="请输入坐落位置"></el-input>
                  </el-form-item>
                  <el-form-item label="购买时间:" prop="housetime">
                    <el-input clearable  v-model="ruleForm.housetime" placeholder="请输入购买时间"></el-input>
                  </el-form-item>
                  <el-form-item label="产权面积:" prop="housearea">
                    <el-input clearable  v-model="ruleForm.housearea" placeholder="请输入产权面积"></el-input>
                  </el-form-item>

                  <el-form-item label="房屋状态:" prop="houpayment">
                    <el-select
                      clearable
                      style="width: 100%"
                      v-model="ruleForm.houpayment"
                      placeholder="请选择"
                    >
                      <el-option label="全款" value="全款"></el-option>
                      <el-option label="按揭" value="按揭"></el-option>
                      <el-option label="抵押" value="抵押"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    v-if="ruleForm.houpayment && ruleForm.houpayment!='全款'"
                    label="欠款金额:"
                    prop="houamount"
                  >
                    <el-input clearable  v-model="ruleForm.houamount" placeholder="请输入欠款金额"></el-input>
                  </el-form-item>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item title="车辆情况" name="4">
              <div class="flex">
                <el-form-item label="车辆情况:" prop="car">
                  <el-select clearable style="width: 100%" v-model="ruleForm.car" placeholder="请选择">
                    <el-option
                      v-for="item in fixedInfo.carList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <div class="flex" v-if="ruleForm.car && ruleForm.car == '是'">
                  <el-form-item label="车辆品牌:" prop="carbrand">
                    <el-input clearable  v-model="ruleForm.carbrand" placeholder="请输入车辆品牌"></el-input>
                  </el-form-item>
                  <el-form-item label="购车年限:" prop="caryear">
                    <el-input clearable  v-model="ruleForm.caryear" placeholder="请输入购车年限"></el-input>
                  </el-form-item>
                  <el-form-item label="现评估价格:" prop="carprice">
                    <el-input clearable  v-model="ruleForm.carprice" placeholder="请输入现评估价格"></el-input>
                  </el-form-item>
                  <el-form-item label="车辆状态:" prop="carpayment">
                    <el-select
                      clearable
                      style="width: 100%"
                      v-model="ruleForm.carpayment"
                      placeholder="请选择"
                    >
                      <el-option label="全款" value="全款"></el-option>
                      <el-option label="按揭" value="按揭"></el-option>
                      <el-option label="抵押" value="抵押"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    v-if="ruleForm.carpayment && ruleForm.carpayment!='全款'"
                    label="欠款金额:"
                    prop="carema"
                  >
                    <el-input clearable  v-model="ruleForm.carema" placeholder="请输入欠款金额"></el-input>
                  </el-form-item>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item title="商保情况" name="5">
              <div class="flex">
                <el-form-item label="商业保险:" prop="policy">
                  <el-select
                    clearable
                    style="width: 100%"
                    v-model="ruleForm.policy"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in fixedInfo.policyList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <div class="flex" v-if="ruleForm.policy && ruleForm.policy=='是'">
                  <el-form-item label="投保公司名称:" prop="policyname">
                    <el-input clearable  v-model="ruleForm.policyname" placeholder="请输入投保公司名称"></el-input>
                  </el-form-item>
                  <el-form-item label="投保时间:" prop="policyear">
                    <el-select
                      clearable
                      style="width: 100%"
                      v-model="ruleForm.policyear"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in fixedInfo.policyearList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="缴费方式:" prop="paymentmethod">
                    <el-select
                      clearable
                      style="width: 100%"
                      v-model="ruleForm.paymentmethod"
                      placeholder="请选择"
                    >
                      <el-option label="年缴" value="年缴"></el-option>
                      <el-option label="月缴" value="月缴"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="缴费金额:" prop="policypre">
                    <el-input clearable  v-model="ruleForm.policypre" placeholder="请输入缴费金额"></el-input>
                  </el-form-item>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item
              v-if="ruleForm.hires && (ruleForm.hires == '企业主' || ruleForm.hires == '个体户')"
              title="企业情况"
              name="6"
            >
              <div class="flex">
                <el-form-item label="法人/股东:" prop="identity">
                  <el-select
                    clearable
                    style="width: 100%"
                    v-model="ruleForm.identity"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in fixedInfo.identityList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="企业成立时间:" prop="establishment">
                  <el-select
                    clearable
                    style="width: 100%"
                    v-model="ruleForm.establishment"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in fixedInfo.establishmentList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="年开票金额:" prop="invoicing">
                  <el-select
                    clearable
                    style="width: 100%"
                    v-model="ruleForm.invoicing"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in fixedInfo.invoicingList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="开票记录:" prop="taxrecord">
                  <el-select
                    clearable
                    style="width: 100%"
                    v-model="ruleForm.taxrecord"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in fixedInfo.taxrecordList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="纳税等级:" prop="grade">
                  <el-select
                    clearable
                    style="width: 100%"
                    v-model="ruleForm.grade"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in fixedInfo.gradeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="年纳税金额:" prop="paying">
                  <el-select
                    clearable
                    style="width: 100%"
                    v-model="ruleForm.paying"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in fixedInfo.payingList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  :label="ruleForm.identity == '法人' ? '法人变更:':'股东变更:'"
                  prop="enterprise"
                >
                  <el-select
                    clearable
                    style="width: 100%"
                    v-model="ruleForm.enterprise"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in fixedInfo.enterpriseList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="ruleForm.identity == '法人' ? '法人占股:':'股东占股:'" prop="ticket">
                  <el-select
                    clearable
                    style="width: 100%"
                    v-model="ruleForm.ticket"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in fixedInfo.ticketList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-collapse-item>
            <el-collapse-item title="烟草证情况" name="7">
              <div class="flex">
                <el-form-item label="是否有烟草证:" prop="tobacco">
                  <el-select
                    clearable
                    style="width: 100%"
                    v-model="ruleForm.tobacco"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in fixedInfo.tobaccoList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <div v-if="ruleForm.tobacco == '是'" class="flex">
                  <el-form-item label="办证时间:" prop="tobaccotime">
                    <el-select
                      clearable
                      style="width: 100%"
                      v-model="ruleForm.tobaccotime"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in fixedInfo.tobaccotimeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="月开烟量:" prop="volumesmoke">
                    <el-select
                      clearable
                      style="width: 100%"
                      v-model="ruleForm.volumesmoke"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in fixedInfo.volumesmokeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="烟草证等级:" prop="tobaccorank">
                    <el-select
                      clearable
                      style="width: 100%"
                      v-model="ruleForm.tobaccorank"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in fixedInfo.tobaccorankList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item title="数据情况" name="8">
              <div class="flex">
                <el-form-item label="芝麻分:" prop="sesame">
                  <el-select
                    clearable
                    style="width: 100%"
                    v-model="ruleForm.sesame"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in fixedInfo.sesameList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="微粒贷:" prop="microcredit">
                  <el-select
                    clearable
                    style="width: 100%"
                    v-model="ruleForm.microcredit"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in fixedInfo.microcreditList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否有信用卡:" prop="credit">
                  <el-select
                    clearable
                    style="width: 100%"
                    v-model="ruleForm.credit"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in fixedInfo.creditList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否白户:" prop="creditip">
                  <el-select
                    clearable
                    style="width: 100%"
                    v-model="ruleForm.creditip"
                    placeholder="请选择"
                  >
                    <el-option label="是" value="是"></el-option>
                    <el-option label="否" value="否"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否执行:" prop="lawsuits">
                  <el-select
                    clearable
                    style="width: 100%"
                    v-model="ruleForm.lawsuits"
                    placeholder="请选择"
                  >
                    <el-option label="是" value="是"></el-option>
                    <el-option label="否" value="否"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否有案底:" prop="record">
                  <el-select
                    clearable
                    style="width: 100%"
                    v-model="ruleForm.record"
                    placeholder="请选择"
                  >
                    <el-option label="是" value="是"></el-option>
                    <el-option label="否" value="否"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="征信等级:" prop="hobbies">
                  <el-select
                    clearable
                    style="width: 100%"
                    v-model="ruleForm.hobbies"
                    placeholder="请选择"
                  >
                    <el-option label="A级" value="A级"></el-option>
                    <el-option label="B级" value="B级"></el-option>
                    <el-option label="C级" value="C级"></el-option>
                    <el-option label="D级" value="D级"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-collapse-item>
            <el-collapse-item title="紧急联系人" name="9">
              <div class="flex">
                <el-form-item label="第一联系人:" prop="contacts1">
                  <el-input clearable  v-model="ruleForm.contacts1" placeholder="请输入第一联系人姓名"></el-input>
                </el-form-item>
                <el-form-item label="联系人关系:" prop="conrelat1">
                  <el-select
                    clearable
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
                  <el-input clearable  v-model="ruleForm.conphone1" placeholder="请输入第一联系人电话"></el-input>
                </el-form-item>
                <el-form-item label="第二联系人:" prop="contacts2">
                  <el-input clearable  v-model="ruleForm.contacts2" placeholder="请输入第二联系人姓名"></el-input>
                </el-form-item>
                <el-form-item label="联系人关系:" prop="conrelat2">
                  <el-select
                    clearable
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
                  <el-input clearable  v-model="ruleForm.conphone2" placeholder="请输入第二联系人电话"></el-input>
                </el-form-item>
                <el-form-item label="第三联系人:" prop="contacts3">
                  <el-input clearable  v-model="ruleForm.contacts3" placeholder="请输入第三联系人姓名"></el-input>
                </el-form-item>
                <el-form-item label="联系人关系:" prop="conrelat3">
                  <el-select
                    clearable
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
                  <el-input clearable  v-model="ruleForm.conphone3" placeholder="请输入第三联系人电话"></el-input>
                </el-form-item>
                <!-- <el-form-item label="第四联系人:" prop="contacts4">
                  <el-input clearable  
                    v-model="ruleForm.contacts4"
                    placeholder="请输入第四联系人姓名"
                  ></el-input>
                </el-form-item>
                <el-form-item label="联系人关系:" prop="conrelat4">
                  <el-select clearable 
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
                  <el-input clearable  
                    v-model="ruleForm.conphone4"
                    placeholder="请输入第四联系人电话"
                  ></el-input>
                </el-form-item>-->
              </div>
            </el-collapse-item>
            <el-collapse-item title="审核情况" name="10">
              <div class="flex">
                <el-form-item label="归属团队:" prop="hometeam">
                  <el-select
                    clearable
                    style="width:100%"
                    v-model="ruleForm.hometeam"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in teamList"
                      :key="item.teamname"
                      :label="item.teamname"
                      :value="item.teamname"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="客户经理:" prop="manager1">
                  <el-select
                    clearable
                    style="width:100%"
                    v-model="ruleForm.manager1"
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in userList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="客服经理:" prop="manager2">
                  <el-select
                    clearable
                    style="width:100%"
                    v-model="ruleForm.manager2"
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in userList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="代办客服:" prop="manager3">
                  <el-select
                    clearable
                    style="width:100%"
                    v-model="ruleForm.manager3"
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in userList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="审核状态:" prop="status">
                  <el-select
                    clearable
                    style="width: 100%"
                    v-model="ruleForm.status"
                    placeholder="请选择审核状态"
                  >
                    <el-option
                      v-for="item in fixedInfo.statusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="审批反馈:" prop="feedback">
                  <el-input clearable
                    type="textarea"
                    :rows="3"
                    v-model="ruleForm.feedback"
                    placeholder="请输入审批反馈"
                  ></el-input>
                </el-form-item>
              </div>
            </el-collapse-item>
            <el-collapse-item
              v-if="ruleForm.productList && ruleForm.productList.length>0"
              title="匹配产品"
              name="11"
            >
              <div class="f18">
                可贷笔数：
                <span class="colorYellow">{{ruleForm.productList.length || 0}}</span>
              </div>
              <div class="f18">
                最高可贷金额：
                <span class="colorYellow">{{ruleForm.recomMony || 0}}万元</span>
              </div>
              <div class="flex mt10">
                <el-tag
                  class="mr20 mb20 pointer"
                  v-for="item in ruleForm.productList"
                  :key="item"
                  @click="productTag(item)"
                >{{item}}</el-tag>
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
      >
      <template slot-scope="scope">
          <span v-if="item.prop == 'phone'">{{$common.phoneNum(scope.row[item.prop])}}</span>
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope" v-if="tabelShow">
          <el-button
            v-if="!scope.row.manager2 && category=='公海客户'"
            @click.native.prevent="pickUp(scope.$index, scope.row)"
            type="text"
            size="small"
          >领取</el-button>
          <el-button
            v-if="category=='我的客户' || category=='全部客户'"
            @click.native.prevent="editRow(scope.$index, scope.row)"
            type="text"
            size="small"
          >编辑</el-button>
          <el-button
            v-if="meth[1] && (category=='我的客户' || category=='全部客户')"
            @click.native.prevent="deleteRow(scope.$index, scope.row)"
            type="text"
            size="small"
          >删除</el-button>
          <el-button
            v-if="category=='我的客户' || category=='全部客户'"
            @click.native.prevent="followUp(scope.$index, scope.row)"
            type="text"
            size="small"
          >跟进中({{scope.row.schedate || 0}})</el-button>
          <el-button
            v-if="category=='我的客户' || category=='全部客户'"
            @click.native.prevent="abandonment(scope.$index, scope.row)"
            type="text"
            size="small"
          >放弃</el-button>
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
      tabelShow:true,
      userList: [],
      fixedInfo: fixedInfo, //选项配置
      showUE: false,
      category: '我的客户', //客户类别切换
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
        addressdetail: '', //详细地址
        hires: '', //雇佣类型
        unit: '', //工作单位名称
        unitposition: '', //工作岗位
        unitadress: '', //单位地址
        unitphone: '', //单位电话
        entrytime: '', //入职时间
        revenue: '', //月收入
        social: '', //是否购买社保
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
        paymentmethod: '', //缴费方式
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
        hometeam: '', //归属团队
        manager1: '', //客户经理
        manager2: '', //客服经理
        manager3: '', //代办客服
        status: '待审核', //审核状态
        remarks: '', //备注信息
        time: '', //创建时间
        sesame: '', //芝麻分
        microcredit: '', //微粒贷
        credit: '', //信用卡
        tobacco: '', //是否有烟草证
        tobaccotime: '', //烟草证办证时间
        volumesmoke: '', //烟草证月开烟量
        tobaccorank: '', //烟草证等级
        enterprise: '', //法人/股东变更
        ticket: '', //法人/股东占股
        invoicing: '', //年开票金额
        paying: '', //年缴税金额
        taxrecord: '', //开票记录
        grade: '', //纳税等级
        identity: '', //法人/股东
        establishment: '', //企业成立时间
        feedback: '', //审批反馈
        productList: [], //匹配产品
        recomMony:0, //匹配产品最高可贷金额
      },
      cloneRuleForm: {}, //用于备份
      rules: {
        name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入客户电话', trigger: 'blur' }],
        idcard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' }
        ],
        manager1: [
          { required: true, message: '请输入客户经理工号', trigger: 'blur' }
        ]
        // hometeam: [
        //   { required: true, message: '请选择归属团队', trigger: 'blur' }
        // ]
      },
      tableData: [],
      teamList: [],
      userInfo:{},
      tableHeader: [
        { name: '客户姓名', prop: 'name' },
        { name: '客户电话', prop: 'phone' },
        // { name: '身份证号', prop: 'idcard' },
        { name: '是否有车', prop: 'car' },
        { name: '是否有房', prop: 'houses' },
        { name: '客户经理', prop: 'manager1' },
        { name: '客服经理', prop: 'manager2' },
        { name: '审核状态', prop: 'status' },
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
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}')
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
    //匹配产品列表点击跳转
    productTag(item){
      window.open(this.$router.resolve({
        path: 'Product',
        query: {name:item}
      }).href, '_blank')
    },
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
    findTeams() {
      //查询团队
      this.$axios.post(this.$api.findTeam).then(res => {
        if (res.code == 200) {
          this.teamList = res.data
        }
      })
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
        category: this.category, //客户类别 我的客户、公海客户、全部客户
        fuzz: this.select,
        input: this.input,
        uid:
          JSON.parse(sessionStorage.getItem('userInfo') || '{}').uid || 'none'
      }
      this.$axios.post(this.$api.findCustomer, data).then(res => {
        this.tableData = res.data[0].data
        this.find.total = ((res.data[0] || {}).total[0] || {}).total || 0
      })
    },
    //领取按钮
    async pickUp(index, row) {
      this.$confirm('确认领取该客户资料吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        row.schedate = '7'
        row.manager2 =
        JSON.parse(sessionStorage.getItem('userInfo') || '{}').uid || ''
        var res = await this.$axios.post(this.$api.updateCustomer, row)
        await this.getNewsList()
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
    //跟进中
    async followUp(index, row){
      row.schedate = '7'
        var res = await this.$axios.post(this.$api.updateCustomer, row).then(res=>{
          if(res.code == 200){
            this.$message.success('跟进时间刷新成功')
          }
        })
        await this.getNewsList()
    },
    //放弃
    async abandonment(index, row){
      this.$confirm('确认放弃该客户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        row.manager2 = ''
        var res = await this.$axios.post(this.$api.updateCustomer, row)
        await this.getNewsList()
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
          if (!/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.ruleForm.phone)) {
            this.$message.error('请输入正确手机号')
            return
          }
          if (this.ruleForm.status != '草稿') {
            if (this.ruleForm.idcard.length != 18) {
              this.$message.error('请输入正确身份证号')
              return
            }
            if (
              this.ruleForm.hires &&
              this.ruleForm.hires != '自由职业' &&
              this.ruleForm.hires != '无固定职业' &&
              !/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.ruleForm.unitphone)
            ) {
              this.$message.error('请输入正确单位/负责人电话')
              return
            }
            if (
              (this.ruleForm.contacts1 &&
                !/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.ruleForm.conphone1)) ||
              (this.ruleForm.contacts2 &&
                !/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.ruleForm.conphone2)) ||
              (this.ruleForm.contacts3 &&
                !/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.ruleForm.conphone3))
            ) {
              this.$message.error('请输入正确紧急联系人手机号')
              return
            }
          }
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
              type: '提交-贷款客户', // 数据来源
              name: this.ruleForm.name, // 客户名称
              phone: this.ruleForm.phone, // 电话
              submitby: this.ruleForm.manager1, // 提交人
              handler: this.ruleForm.manager2, // 处理人
              path: '/Customer', // 跳转贷款客户
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
          this.$message.error('请完善必填字段')
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
