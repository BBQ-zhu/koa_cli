<template>
  <div class="card">
    <div class="header flex">
      <el-button
        type="primary"
        icon="el-icon-collection-tag"
        class="mr20"
        @click="typeClass = true"
      >分类管理</el-button>
      <el-button v-if="meth[0]" type="primary" icon="el-icon-upload" @click="uploadNew">上传产品</el-button>
      <el-select
        clearable
        class="ml20"
        v-model="selectInput"
        placeholder="请选择产品类型"
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
        clearable
        placeholder="请输入内容"
        v-model="input"
        class="input-with-select findInput ml20"
      >
        <el-select
          clearable
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
          @click="(find.currentPage = 1), getNewsList()"
        ></el-button>
      </el-input>
      <!-- <el-input clearable  placeholder="请输入产品名称" v-model="input" class="input-with-select findInput ml20">
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
          label-width="120px"
          class="demo-ruleForm"
          style="width: 100%"
        >
          <div class="flex">
            <el-form-item label="产品名称:" prop="name">
              <el-input clearable v-model="ruleForm.name" placeholder="请输入产品名称"></el-input>
            </el-form-item>
            <el-form-item label="产品分类:" prop="type">
              <el-select clearable style="width: 100%" v-model="ruleForm.type" placeholder="请选择">
                <el-option
                  v-for="item in dynamicTags"
                  :key="item._id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产品价格:" prop="newprice">
              <el-input clearable v-model="ruleForm.newprice" placeholder="请输入产品价格"></el-input>
            </el-form-item>
            <el-form-item label="产品原价:" prop="oldprice">
              <el-input clearable v-model="ruleForm.oldprice" placeholder="请输入产品原价格"></el-input>
            </el-form-item>
            <el-form-item label="活动类型:" prop="recomtype">
              <el-select clearable v-model="ruleForm.recomtype" placeholder="请选择">
                <el-option
                  v-for="item in fixedInfo.recomtypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="介绍类型:" prop="recomintro">
              <el-select
                clearable
                v-model="ruleForm.recomintro"
                multiple
                :multiple-limit="3"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in fixedInfo.recomintroList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="总计咨询:" prop="consulting">
              <el-input clearable v-model="ruleForm.consulting" placeholder="请输入总计咨询"></el-input>
            </el-form-item>
            <el-form-item label="总计销量:" prop="volume">
              <el-input clearable v-model="ruleForm.volume" placeholder="请输入总计销量"></el-input>
            </el-form-item>
            <el-form-item label="总浏览量:" prop="totalview">
              <el-input clearable v-model="ruleForm.totalview" placeholder="请输入总浏览量"></el-input>
            </el-form-item>
            <el-form-item label="产品描述:" prop="description">
              <el-input clearable v-model="ruleForm.description" placeholder="请输入产品描述"></el-input>
            </el-form-item>
            <el-form-item label="是否推荐:" prop="recommend">
              <el-select
                clearable
                style="width: 100%"
                v-model="ruleForm.recommend"
                placeholder="请选择"
              >
                <el-option label="是" value="是"></el-option>
                <el-option label="否" value="否"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="Logo:" prop="productlogo">
              <div style="position: relative">
                <el-input clearable placeholder="请上传产品Logo" v-model="ruleForm.productlogo" disabled></el-input>
                <el-upload
                  style="position: absolute; top: 3px; right: -35px"
                  class="upload-demo f20"
                  :data="ruleForm"
                  :action="this.$api.uploadProductLogo"
                  :headers="uploadHeader"
                  :on-error="onError"
                  :on-success="logoSuccess"
                  :show-file-list="false"
                >
                  <i class="el-icon-upload" v-if="meth[0] || meth[2]" style="font-size: 30px"></i>
                </el-upload>
              </div>
            </el-form-item>

            <el-form-item label="图片:" prop="productimg">
              <div style="position: relative">
                <el-input clearable placeholder="请上传产品图片" v-model="ruleForm.productimg" disabled></el-input>
                <el-upload
                  style="position: absolute; top: 3px; right: -34px"
                  class="upload-demo f20"
                  :data="ruleForm"
                  :action="this.$api.uploadProductImg"
                  :headers="uploadHeader"
                  :on-error="onError"
                  :on-success="handSuccess"
                  :show-file-list="false"
                >
                  <!-- <el-button type="primary" v-if="meth[0] || meth[2]"
                    >点击上传</el-button 
                  >-->
                  <i class="el-icon-upload" v-if="meth[0] || meth[2]" style="font-size: 30px"></i>
                </el-upload>
              </div>
            </el-form-item>

            <el-form-item label="资质要求:" prop="cation">
              <el-switch
                style="width: 200px"
                v-model="ruleForm.cation"
                active-color="#13ce66"
                inactive-color="#C0C4CC"
                active-value="true"
                inactive-value="false"
              ></el-switch>
            </el-form-item>
            <div v-if="ruleForm.cation == 'true'" style="width: 100%">
              <!-- 资质要求 -->
              <div class="proBg">
                <div
                  class="fw600 f18 mb20"
                  style="padding: 15px; border-bottom: 1px solid #909399"
                >资质要求</div>
                <span class="flex">
                  <el-form-item label="最低额度(万):" prop="minamount">
                    <el-input clearable v-model="ruleForm.minamount" placeholder="请输入最低额度"></el-input>
                  </el-form-item>
                  <el-form-item label="最高额度(万):" prop="maxamount">
                    <el-input clearable v-model="ruleForm.maxamount" placeholder="请输入最高额度"></el-input>
                  </el-form-item>
                  <el-form-item label="最低贷款期限:" prop="minterm">
                    <el-input clearable v-model="ruleForm.minterm" placeholder="请输入最低贷款期限(月)"></el-input>
                  </el-form-item>
                  <el-form-item label="最高贷款期限:" prop="maxterm">
                    <el-input clearable v-model="ruleForm.maxterm" placeholder="请输入最高贷款期限(月)"></el-input>
                  </el-form-item>
                  <el-form-item label="月利息(%):" prop="interest">
                    <el-input clearable v-model="ruleForm.interest" placeholder="请输入月利息"></el-input>
                  </el-form-item>
                  <el-form-item label="放款时间(天):" prop="loandays">
                    <el-input clearable v-model="ruleForm.loandays" placeholder="请输入放款时间"></el-input>
                  </el-form-item>
                  <el-form-item v-if="ruleForm.match.includes('address')" label="放款城市:" prop="address">
                    <el-cascader
                      v-model="ruleForm.address"
                      :options="fixedInfo.address"
                      :props="{ expandTrigger: 'hover' }"
                    ></el-cascader>
                  </el-form-item>
                  <el-form-item v-if="ruleForm.match.includes('age')" label="年龄要求:" prop="age">
                    <el-input clearable v-model="ruleForm.age" placeholder="请输入多少岁以下"></el-input>
                  </el-form-item>
                  <el-form-item v-if="ruleForm.match.includes('revenue')" label="工资要求(元):" prop="revenue">
                    <el-input clearable v-model="ruleForm.revenue" placeholder="输入多少月收入以上"></el-input>
                  </el-form-item>
                  <el-form-item v-if="ruleForm.match.includes('social')" label="社保情况:" prop="social">
                    <el-select clearable v-model="ruleForm.social" multiple placeholder="请选择">
                      <el-option
                        v-for="item in fixedInfo.socialList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="ruleForm.match.includes('provident')" label="公积金情况:" prop="provident">
                    <el-select clearable v-model="ruleForm.provident" multiple placeholder="请选择">
                      <el-option
                        v-for="item in fixedInfo.providentList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  
                  <el-form-item v-if="ruleForm.match.includes('houses')" label="是否有房:" prop="houses">
                    <el-select clearable v-model="ruleForm.houses" placeholder="请选择">
                      <el-option
                        v-for="item in fixedInfo.housesList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="ruleForm.match.includes('car')" label="是否有车:" prop="car">
                    <el-select clearable v-model="ruleForm.car" placeholder="请选择">
                      <el-option
                        v-for="item in fixedInfo.carList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="ruleForm.match.includes('policy')" label="是否有商保:" prop="policy">
                    <el-select clearable v-model="ruleForm.policy" placeholder="请选择">
                      <el-option
                        v-for="item in fixedInfo.policyList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  
                  <el-form-item v-if="ruleForm.match.includes('sesame')" label="芝麻分:" prop="sesame">
                    <el-select clearable v-model="ruleForm.sesame" multiple placeholder="请选择">
                      <el-option
                        v-for="item in fixedInfo.sesameList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="ruleForm.match.includes('microcredit')" label="微粒贷:" prop="microcredit">
                    <el-select clearable v-model="ruleForm.microcredit" multiple placeholder="请选择">
                      <el-option
                        v-for="item in fixedInfo.microcreditList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="ruleForm.match.includes('credit')" label="是否有信用卡:" prop="credit">
                    <el-select clearable v-model="ruleForm.credit" placeholder="请选择">
                      <el-option
                        v-for="item in fixedInfo.creditList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="ruleForm.match.includes('hires')" label="职业要求:" prop="hires">
                    <el-select clearable v-model="ruleForm.hires" multiple placeholder="请选择">
                      <el-option
                        v-for="item in fixedInfo.hiresList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </span>
              </div>
              <!-- 企业要求 -->
              <div class="proBg mt20" v-if="
              ruleForm.match.includes('identity') || 
              ruleForm.match.includes('establishment') || 
              ruleForm.match.includes('invoicing') || 
              ruleForm.match.includes('taxrecord') || 
              ruleForm.match.includes('grade') || 
              ruleForm.match.includes('paying') || 
              ruleForm.match.includes('enterprise') || 
              ruleForm.match.includes('ticket') 
              ">
                <div
                  class="fw600 f18 mb20"
                  style="padding: 15px; border-bottom: 1px solid #909399"
                >企业要求</div>
                <span>
                  <div class="flex">
                    <el-form-item v-if="ruleForm.match.includes('identity')" label="法人/股东:" prop="identity">
                      <el-select
                        multiple
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
                    <el-form-item v-if="ruleForm.match.includes('establishment')" label="企业成立时间:" prop="establishment">
                      <el-select
                        multiple
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
                    <el-form-item v-if="ruleForm.match.includes('invoicing')" label="年开票金额:" prop="invoicing">
                      <el-select
                        multiple
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
                    <el-form-item v-if="ruleForm.match.includes('taxrecord')" label="开票记录:" prop="taxrecord">
                      <el-select
                        multiple
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
                    <el-form-item v-if="ruleForm.match.includes('grade')" label="纳税等级:" prop="grade">
                      <el-select
                        multiple
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
                    <el-form-item v-if="ruleForm.match.includes('paying')" label="年纳税金额:" prop="paying">
                      <el-select
                        multiple
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
                    <el-form-item v-if="ruleForm.match.includes('enterprise')" label="法人/股东变更" prop="enterprise">
                      <el-select
                        multiple
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
                    <el-form-item v-if="ruleForm.match.includes('ticket')" label="法人/股东占股:" prop="ticket">
                      <el-select
                        multiple
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
                </span>
              </div>
              <!-- 烟草证要求 -->
              <div class="proBg mt20" v-if="ruleForm.match.includes('tobaccotime') || ruleForm.match.includes('volumesmoke') ||ruleForm.match.includes('tobaccorank') ">
                <div
                  class="fw600 f18 mb20"
                  style="padding: 15px; border-bottom: 1px solid #909399"
                >烟草证要求</div>
                <span>
                  <div class="flex">
                    <el-form-item v-if="ruleForm.match.includes('tobaccotime')" label="办证时间:" prop="tobaccotime">
                      <el-select
                        multiple
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
                    <el-form-item v-if="ruleForm.match.includes('volumesmoke')" label="月开烟量:" prop="volumesmoke">
                      <el-select
                        multiple
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
                    <el-form-item v-if="ruleForm.match.includes('tobaccorank')" label="烟草证等级:" prop="tobaccorank">
                      <el-select
                        multiple
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
                </span>
              </div>

              <!-- 匹配关键 -->
              <div class="proBg mt20">
                <div
                  class="fw600 f18 mb20"
                  style="padding: 15px; border-bottom: 1px solid #909399"
                >匹配关键</div>
                <span>
                  <el-form-item label="匹配条件:" prop="match">
                    <el-select
                      clearable
                      style="width: 400%"
                      v-model="ruleForm.match"
                      multiple
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="(item,index) in fixedInfo.match"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="条件关键:" prop="key">
                    <el-select
                      clearable
                      style="width: 400%"
                      v-model="ruleForm.key"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in fixedInfo.key"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="其他要求:" prop="othercomponents" style="width: 100% !important">
                    <el-tag
                      :key="index + 'tag'"
                      v-for="(tag, index) in ruleForm.othercomponents"
                      closable
                      :disable-transitions="false"
                      @close="handleClose(tag)"
                    >{{ tag }}</el-tag>
                    <el-input
                      clearable
                      class="input-new-tag"
                      v-if="otherVisible"
                      v-model="otherValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm"
                      @blur="handleInputConfirm"
                    ></el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新增要求</el-button>
                  </el-form-item>
                </span>
              </div>
              <!-- 所需资料 -->
              <div class="proBg mt20">
                <div
                  class="fw600 f18 mb20"
                  style="padding: 15px; border-bottom: 1px solid #909399"
                >所需资料</div>
                <span>
                  <el-form-item label="所需资料:" prop="demand" style="width: 100%">
                    <el-select
                      clearable
                      style="width: 400%"
                      v-model="ruleForm.demand"
                      multiple
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in fixedInfo.demand"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="其他资料:" prop="otherinformation" style="width: 100%">
                    <el-input
                      clearable
                      style="width: 400%"
                      v-model="ruleForm.otherinformation"
                      placeholder="请输入其他所需资料"
                    ></el-input>
                  </el-form-item>
                </span>
              </div>
            </div>
          </div>
        </el-form>

        <UE
          class="mt20"
          v-if="showUE"
          :defaultMsg="ruleForm.details"
          :config="config"
          :id="ueId"
          ref="editor"
        ></UE>
      </span>
      <div class="flex mt10 windBtn">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" v-if="meth[2] || meth[0]" @click="uploadBtn('ruleForm')">确 定</el-button>
      </div>
    </div>
    <!-- 表格区域 -->
    <el-table v-if="!dialogVisible" :data="tableData" stripe>
      <el-table-column label="产品Logo" min-width="100px">
        <template slot-scope="scope">
          <el-tooltip placement="right">
            <div slot="content">
              <img :src="scope.row.productlogo" />
            </div>
            <img :src="scope.row.productlogo" class="tableImg" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="产品图片" min-width="100px">
        <template slot-scope="scope">
          <el-tooltip placement="right">
            <div slot="content">
              <img :src="scope.row.productimg" />
            </div>
            <img :src="scope.row.productimg" class="tableImg" />
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
    <!-- 分类管理 -->
    <el-dialog title="产品分类" :visible.sync="typeClass" width="50%" :before-close="iconClose">
      <span>
        <el-form
          :model="iconForm"
          :rules="iconrules"
          ref="iconForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="分类名称:" prop="name">
            <el-input clearable v-model="iconForm.name" placeholder="请输入分类名称" class="new-input"></el-input>
          </el-form-item>
          <el-form-item label="分类描述:" prop="remaks">
            <el-input clearable v-model="iconForm.remaks" placeholder="请输入分类描述" class="new-input"></el-input>
          </el-form-item>
          <el-form-item label="展示顺序:" prop="number">
            <el-input
              clearable
              v-model="iconForm.number"
              type="number"
              placeholder="展示顺序:数值越小越靠前"
              class="new-input"
            ></el-input>
          </el-form-item>
          <el-form-item label="首页导航:" prop="super">
            <el-select
              clearable
              v-model="iconForm.super"
              placeholder="请选择是否在首页展示"
              class="new-input"
            >
              <el-option label="是" value="是"></el-option>
              <el-option label="否" value="否"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="图片:" prop="imgurl">
            <el-input
              clearable
              disabled
              v-model="iconForm.imgurl"
              placeholder="图片访问地址"
              class="new-input"
            ></el-input>
            <el-upload
              class="upload-demo"
              :data="ruleForm"
              :action="this.$api.uploadIconlImg"
              :headers="uploadHeader"
              :on-error="onError"
              :file-list="fileList"
              :on-success="iconFormSuccess"
              :show-file-list="false"
              :limit="1"
            >
              <el-button size="small" type="primary" v-if="meth[0] || meth[2]">点击上传</el-button>
              <span slot="tip" class="el-upload__tip" v-if="meth[0] || meth[2]">图标为1:1方形</span>
            </el-upload>
          </el-form-item>
        </el-form>
        <div class="flex">
          <div
            class="mr10 mb20"
            style="width: 120px; position: relative"
            v-for="(item, index) in dynamicTags"
            :key="index + 'img'"
          >
            <i
              v-if="meth[1]"
              class="el-icon-circle-close colorRed pointer"
              style="font-size: 20px; position: absolute; top: 2px; left: 2px"
              @click="tagClose(item._id, item.imgurl)"
            ></i>
            <img :src="item.imgurl" style="width: 120px; height: 120px; margin: 0 auto" />
            <div class="nameText">
              <div style="text-align: center">{{ item.name }}</div>
              <div class="color2" style="margin-top: 2px">{{ item.remaks }}</div>
            </div>
          </div>
        </div>
      </span>
      <div class="flex mt10 windBtn">
        <el-button @click="iconClose">取 消</el-button>
        <el-button type="primary" v-if="meth[0] || meth[2]" @click="uploadIconBtn('iconForm')">确 定</el-button>
      </div>
    </el-dialog>
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
      fixedInfo: fixedInfo, //选项配置
      showUE: false,
      uploadHeader: {
        authorization: JSON.parse(sessionStorage.getItem('userInfo') || '{}')
          .token
      },
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 220
      },
      iconForm: {
        name: '', //导航名称
        number: '', //导航顺序
        super: '', //是否推荐至首页
        imgurl: '', //导航图标
        remaks: '' //分类描述
      },
      iconrules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        number: [
          {
            required: true,
            message: '请输入分类排序：数值越小越靠前',
            trigger: 'blur'
          }
        ],
        super: [
          { required: true, message: '请输入是否展示到首页', trigger: 'blur' }
        ],
        imgurl: [{ required: true, message: '请上传图标图片', trigger: 'blur' }]
      },
      fileList: [],
      classType: 'name',
      dynamicTags: [], //团队标签
      inputVisible: false,
      inputValue: '',
      selectInput: '',
      input: '', //查询框
      ueId: 'editor5', //多实例情况下使用
      dialogVisible: false,
      isAdd: true,
      typeClass: false,
      otherVisible: false, //其他要求显示
      otherValue: '', //其他要求值
      ruleForm: {
        name: '',
        description: '', //产品描述
        recommend: '否', //不推荐 推荐
        type: '',
        newprice: '',
        oldprice: '',
        productlogo: '',
        productimg: '',
        consulting: '', // 总计咨询
        volume: '', // 总计销量
        totalview: '', // 总计浏览
        details: '',
        time: '',
        recomtype: '', //推荐类型 爆款、独家、新品、优惠、限时
        recomintro: [], //介绍类型 无隐形费用、全程托管、专家顾问、一对一服务、急速办理、官方保障、银企合作、
        cation: 'false', //资质要求：'false'\'true'
        minamount: '', //最低额度
        maxamount: '', //最高额度
        minterm: '', //最低期限
        maxterm: '', //最高期限
        interest: '', //月利息
        loandays: '', //放款天数
        address: [], //放款省市
        age: '', //n岁以下
        revenue: '', //月收入
        social: [], //社保情况
        provident: [], //公积金情况
        houses: '', //房屋情况
        car: '', //车辆情况
        policy: '', //保险情况
        sesame: [], //芝麻分
        microcredit: [], //微粒贷
        credit: '', //信用卡
        invoicing: [], //年开票金额
        paying: [], //年缴税金额
        enterprise: [], //法人/股东变更
        ticket: [], //法人/股东占股
        identity: [], //法人/股东
        establishment: [], //企业成立时间
        taxrecord: [], //开票记录
        grade: [], //纳税等级
        tobacco: '', //是否有烟草证
        tobaccotime: [], //烟草证办证时间
        volumesmoke: [], //烟草证月开烟量
        tobaccorank: [], //烟草证等级
        hires: [], //职业要求 数组
        match: [], //匹配条件 数组
        key: '', //条件关键
        othercomponents: [], //其他要求 数组
        demand: [], //所需资料
        otherinformation: '' //其他资料
      },
      rules: {
        name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择产品分类', trigger: 'blur' }],
        // newprice: [
        //   { required: true, message: "请输入产品价格", trigger: "blur" },
        // ],
        productlogo: [
          { required: true, message: '请上传产品Logo', trigger: 'blur' }
        ],
        productimg: [
          { required: true, message: '请上传产品图片', trigger: 'blur' }
        ]
      },
      tableData: [],
      tableHeader: [
        { name: '产品名称', prop: 'name' },
        { name: '产品描述', prop: 'description' },
        { name: '产品类型', prop: 'type' },
        { name: '产品现价', prop: 'newprice' },
        { name: '产品推荐', prop: 'recommend' },
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
  mounted(opaction) {
    this.mixinMethod(this.$route.path)
    if(this.$route.query.name){
      this.classType = 'name'
      this.input = this.$route.query.name
    } 
    this.getNewsList()
    this.findTagList()
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.showUE = val
      }
    }
  },
  methods: {
    handleClose(tag) {
      this.ruleForm.othercomponents.splice(
        this.ruleForm.othercomponents.indexOf(tag),
        1
      )
    },
    showInput() {
      this.otherVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      let otherValue = this.otherValue
      if (otherValue) {
        this.ruleForm.othercomponents.push(otherValue)
      }
      this.otherVisible = false
      this.otherValue = ''
    },
    //上传按钮重置
    uploadNew() {
      ;(this.ruleForm = {
        name: '',
        description: '', //产品描述
        recommend: '否', //不推荐 推荐
        type: '',
        newprice: '',
        oldprice: '',
        productlogo: '',
        productimg: '',
        consulting: '', // 总计咨询
        volume: '', // 总计销量
        totalview: '', // 总计浏览
        details: '',
        time: '',
        recomtype: '', //推荐类型 爆款、独家、新品、优惠、限时
        recomintro: [], //介绍类型 无隐形费用、全程托管、专家顾问、一对一服务、急速办理、官方保障、银企合作、
        cation: 'false', //资质要求：'false'\'true'
        minamount: '', //最低额度
        maxamount: '', //最高额度
        minterm: '', //最低期限
        maxterm: '', //最高期限
        interest: '', //月利息
        loandays: '', //放款天数
        address: [], //放款省市
        age: '', //n岁以下
        revenue: '', //月收入
        social: [], //社保情况
        provident: [], //公积金情况
        houses: '', //房屋情况
        car: '', //车辆情况
        policy: '', //保险情况
        sesame: [], //芝麻分
        microcredit: [], //微粒贷
        credit: '', //信用卡
        invoicing: [], //年开票金额
        paying: [], //年缴税金额
        enterprise: [], //法人/股东变更
        ticket: [], //法人/股东占股
        identity: [], //法人/股东
        establishment: [], //企业成立时间
        taxrecord: [], //开票记录
        grade: [], //纳税等级
        tobacco: '', //是否有烟草证
        tobaccotime: [], //烟草证办证时间
        volumesmoke: [], //烟草证月开烟量
        tobaccorank: [], //烟草证等级
        hires: [], //职业要求 数组
        match: [], //匹配条件 数组
        key: '', //条件关键
        othercomponents: [], //其他要求 数组
        demand: [], //所需资料
        otherinformation: '' //其他资料
      }),
        (this.dialogVisible = true)
      this.isAdd = true
    },
    async findTagList() {
      //查询分类图标列表
      await this.$axios.post(this.$api.findProductClass).then(res => {
        if (res.code == 200) {
          let arr = res.data
          this.dynamicTags = this.$common.bubbleSort(arr, 'number')
        }
      })
    },
    async tagClose(tag, imgname) {
      //删除分类图标
      this.$confirm('此操作将永久删除该产品分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$axios
            .post(this.$api.delProductClass, { _id: tag })
            .then(async res => {
              if (res.code == 200) {
                this.$message.success('删除分类成功')
                await this.$axios
                  .post(this.$api.delIconlImg, {
                    imgurl: imgname
                  })
                  .then(res => {
                    if (res.code == 200) {
                      this.$message.success('删除图标成功')
                    }
                  })
                this.findTagList()
              }
            })
        })
        .catch(() => {})
    },
    //产品分类图标上传成功
    async iconFormSuccess(res, file, fileList) {
      if (res.code == 200) {
        if (this.iconForm.imgurl) {
          await this.$axios.post(this.$api.delIconlImg, {
            imgurl: this.iconForm.imgurl
          })
        }
        this.iconForm.imgurl = res.data
        this.fileList = []
        this.$logsImg.createlogsImg(
          this.$api.uploadIconlImg,
          this.iconForm.imgurl
        ) //添加操作日志
        this.$message.success('图片上传成功')
      }
    },
    //上传产品Logo成功钩子
    async logoSuccess(res, file, fileList) {
      if (res.code == 200) {
        if (!this.isAdd) {
          let newArr = {
            _id: this.ruleForm._id,
            productlogo: res.data
          }
          await this.$axios.post(this.$api.updataProduct, {
            data: JSON.stringify(newArr)
          })
        }
        // if(this.ruleForm.productlogo){
        //   await this.$axios.post(this.$api.delProductLogo, this.ruleForm)
        // }
        this.ruleForm.productlogo = res.data
        this.$logsImg.createlogsImg(
          this.$api.uploadProductLogo,
          this.ruleForm.productlogo
        ) //添加操作日志
        this.$message.success('logo上传成功')
      }
    },
    //上传产品图片成功钩子
    async handSuccess(res, file, fileList) {
      console.log(res.data)
      if (res.code == 200) {
        if (!this.isAdd) {
          let newArr = {
            _id: this.ruleForm._id,
            productimg: res.data
          }
          await this.$axios.post(this.$api.updataProduct, {
            data: JSON.stringify(newArr)
          })
        }
        // if(this.ruleForm.productimg){
        //   await this.$axios.post(this.$api.delProductImg, this.ruleForm)
        // }
        this.ruleForm.productimg = res.data
        this.$logsImg.createlogsImg(
          this.$api.uploadProductImg,
          this.ruleForm.productimg
        ) //添加操作日志
        this.$message.success('图片上传成功')
      }
    },
    onError(err, file, fileList) {
      this.$message.error('图片上传失败')
    },
    handleSizeChange(val) {
      this.find.limit = val
      this.getNewsList()
    },
    handleCurrentChange(val) {
      this.find.currentPage = val
      this.getNewsList()
    },
    async findClass() {
      var data = {
        skip: this.find.limit * (this.find.currentPage - 1),
        limit: this.find.limit,
        fuzz: this.classType,
        input: this.selectInput
      }
      await this.$axios.post(this.$api.findProduct, data).then(res => {
        this.tableData = res.data[0].data
        this.find.total = res.data[0].total[0].total
      })
      this.input = ''
    },
    async getNewsList() {
      var data = {
        skip: this.find.limit * (this.find.currentPage - 1),
        limit: this.find.limit,
        fuzz: this.classType,
        input: this.input
      }
      await this.$axios.post(this.$api.findProduct, data).then(res => {
        this.tableData = res.data[0].data
        this.find.total = res.data[0].total[0].total
      })
      this.selectInput = ''
    },
    //编辑按钮
    editRow(index, row) {
      this.isAdd = false
      this.ruleForm = row
      // this.showUE = true
      this.dialogVisible = true
    },
    //删除行
    deleteRow(index, row) {
      this.$confirm('确认删除该产品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios
          .post(this.$api.delateProduct, { _id: row._id })
          .then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功')
              this.getNewsList()
            }
          })
        if (row.productlogo) {
          this.$axios.post(this.$api.delProductLogo, row)
        }
        if (row.productimg) {
          this.$axios.post(this.$api.delProductImg, row)
        }
      })
    },
    handleClose() {
      if (this.isAdd) {
        //新增产品时点了取消，要把图片删除
        if (this.ruleForm.productimg) {
          this.$axios.post(this.$api.delProductImg, this.ruleForm)
        }
        if (this.ruleForm.productlogo) {
          this.$axios.post(this.$api.delProductLogo, this.ruleForm)
        }
      }
      this.dialogVisible = false
      // this.showUE = false;
    },
    //上传信息
    async uploadBtn(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.ruleForm.details = this.$refs.editor.getUEContent()
          if (this.isAdd) {
            //新增
            delete this.ruleForm._id
            var res = await this.$axios.post(this.$api.uploadProduct, {
              data: JSON.stringify(this.ruleForm)
            })
          } else {
            var res = await this.$axios.post(this.$api.updataProduct, {
              data: JSON.stringify(this.ruleForm)
            })
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
    },
    //创建产品分类
    async uploadIconBtn(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          var res = await this.$axios.post(
            this.$api.createProductClass,
            this.iconForm
          )
          if (res.code == 200) {
            this.$message.success('创建分类成功')
            this.findTagList()
            this.iconForm.imgurl = ''
            this.typeClass = false
          }
        } else {
          return false
        }
      })
    },
    //删除分类图标
    async iconClose() {
      if (this.iconForm.imgurl) {
        await this.$axios
          .post(this.$api.delIconlImg, {
            imgurl: this.iconForm.imgurl
          })
          .then(res => {
            if (res.code == 200) {
              this.iconForm.imgurl = ''
              this.$message.success('删除图标成功')
            }
          })
      }
      this.typeClass = false
    }
  }
}
</script>

<style lang='scss' scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.nameText {
  // border-bottom:1px dashed #909399;
  padding: 2px;
  text-align: center;
}
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
/* .el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
} */
</style>
