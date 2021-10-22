<template>
  <div class="card">
    <div class="header flex">
      <el-button
        type="primary"
        icon="el-icon-collection-tag"
        class="mr20"
        @click="typeClass = true"
        >分类管理</el-button
      >
      <el-button
        v-if="meth[0]"
        type="primary"
        icon="el-icon-upload"
        @click="uploadNew"
        >上传产品</el-button
      >
      <el-select
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
        placeholder="请输入内容"
        v-model="input"
        class="input-with-select findInput ml20"
      >
        <el-select
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
      <!-- <el-input placeholder="请输入产品名称" v-model="input" class="input-with-select findInput ml20">
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
          label-width="100px"
          class="demo-ruleForm"
          style="width: 100%"
        >
          <div class="flex">
            <el-form-item label="产品名称:" prop="name">
              <el-input
                v-model="ruleForm.name"
                placeholder="请输入产品名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="产品分类:" prop="type">
              <el-select
                style="width: 100%"
                v-model="ruleForm.type"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in dynamicTags"
                  :key="item._id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产品价格:" prop="newprice">
              <el-input
                v-model="ruleForm.newprice"
                placeholder="请输入产品价格"
              ></el-input>
            </el-form-item>
            <el-form-item label="产品原价:" prop="oldprice">
              <el-input
                v-model="ruleForm.oldprice"
                placeholder="请输入产品原价格"
              ></el-input>
            </el-form-item>
            <el-form-item label="总计咨询:" prop="consulting">
              <el-input
                v-model="ruleForm.consulting"
                placeholder="请输入总计咨询"
              ></el-input>
            </el-form-item>
            <el-form-item label="总计销量:" prop="volume">
              <el-input
                v-model="ruleForm.volume"
                placeholder="请输入总计销量"
              ></el-input>
            </el-form-item>
            <el-form-item label="总浏览量:" prop="totalview">
              <el-input
                v-model="ruleForm.totalview"
                placeholder="请输入总浏览量"
              ></el-input>
            </el-form-item>
            <el-form-item label="产品描述:" prop="description">
              <el-input
                v-model="ruleForm.description"
                placeholder="请输入产品描述"
              ></el-input>
            </el-form-item>
            <el-form-item label="产品推荐:" prop="recommend">
              <el-select
                style="width: 100%"
                v-model="ruleForm.recommend"
                placeholder="请选择"
              >
                <el-option label="推荐" value="推荐"></el-option>
                <el-option label="不推荐" value="不推荐"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="产品Logo:" prop="productlogo">
              <div style="position: relative">
                <el-input
                  placeholder="请上传产品Logo"
                  v-model="ruleForm.productlogo"
                  disabled
                ></el-input>
                <el-upload
                  style="position: absolute; top: 0; right: 4px"
                  class="upload-demo f20"
                  :data="ruleForm"
                  :action="this.$api.uploadProductLogo"
                  :headers="uploadHeader"
                  :on-error="onError"
                  :on-success="logoSuccess"
                  :show-file-list="false"
                >
                  <i class="el-icon-upload2" v-if="meth[0] || meth[2]"></i>
                </el-upload>
              </div>
            </el-form-item>

            <el-form-item label="产品图片:" prop="productimg">
              <div style="position: relative">
                <el-input
                  placeholder="请上传产品图片"
                  v-model="ruleForm.productimg"
                  disabled
                ></el-input>
                <el-upload
                  style="position: absolute; top: 0; right: -110px"
                  class="upload-demo f20"
                  :data="ruleForm"
                  :action="this.$api.uploadProductImg"
                  :headers="uploadHeader"
                  :on-error="onError"
                  :on-success="handSuccess"
                  :show-file-list="false"
                >
                  <!-- <i class="el-icon-upload2"></i> -->
                  <el-button type="primary" v-if="meth[0] || meth[2]"
                    >点击上传</el-button
                  >
                </el-upload>
              </div>
            </el-form-item>
          </div>
        </el-form>
        <UE
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
          v-if="meth[2] || meth[0]"
          @click="uploadBtn('ruleForm')"
          >确 定</el-button
        >
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
    <!-- 分类管理 -->
    <el-dialog
      title="产品分类"
      :visible.sync="typeClass"
      width="50%"
      :before-close="iconClose"
    >
      <span>
        <el-form
          :model="iconForm"
          :rules="iconrules"
          ref="iconForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="分类名称:" prop="name">
            <el-input
              v-model="iconForm.name"
              placeholder="请输入分类名称"
              class="new-input"
            ></el-input>
          </el-form-item>
          <el-form-item label="分类描述:" prop="remaks">
            <el-input
              v-model="iconForm.remaks"
              placeholder="请输入分类描述"
              class="new-input"
            ></el-input>
          </el-form-item>
          <el-form-item label="展示顺序:" prop="number">
            <el-input
              v-model="iconForm.number"
              type="number"
              placeholder="展示顺序:数值越小越靠前"
              class="new-input"
            ></el-input>
          </el-form-item>
          <el-form-item label="首页导航:" prop="super">
            <el-select
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
              <el-button size="small" type="primary" v-if="meth[0] || meth[2]"
                >点击上传</el-button
              >
              <span slot="tip" class="el-upload__tip" v-if="meth[0] || meth[2]"
                >图标为1:1方形</span
              >
            </el-upload>
          </el-form-item>
        </el-form>
        <div class="flex">
          <div
            class="mr10 mb20 "
            style="width: 120px;position:relative;"
            v-for="(item, index) in dynamicTags"
            :key="index + 'img'"
          >
            <i
              v-if="meth[1]"
              class="el-icon-circle-close colorRed pointer"
              style="font-size: 20px;position:absolute;top:2px;left:2px;"
              @click="tagClose(item._id, item.imgurl)"
            ></i>
            <img
              :src="item.imgurl"
              style="width: 120px; height: 120px; margin: 0 auto"
            />
            <div class="nameText">
              <div style="text-align: center">{{ item.name }}</div>
            <div class="color2" style="margin-top:2px;">{{ item.remaks }}</div>
            </div>
          </div>
        </div>
      </span>
      <div class="flex mt10 windBtn">
        <el-button @click="iconClose">取 消</el-button>
        <el-button
          type="primary"
          v-if="meth[0] || meth[2]"
          @click="uploadIconBtn('iconForm')"
          >确 定</el-button
        >
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
import UE from "@/components/common/UE";
export default {
  components: {
    UE,
  },
  data() {
    return {
      uploadHeader: {
        authorization: JSON.parse(sessionStorage.getItem("userInfo") || "{}")
          .token,
      },
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 220,
      },
      iconForm: {
        name: "", //导航名称
        number: "", //导航顺序
        super: "", //是否推荐至首页
        imgurl: "", //导航图标
        remaks:"" //分类描述
      },
      iconrules: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
        number: [
          {
            required: true,
            message: "请输入分类排序：数值越小越靠前",
            trigger: "blur",
          },
        ],
        super: [
          { required: true, message: "请输入是否展示到首页", trigger: "blur" },
        ],
        imgurl: [
          { required: true, message: "请上传图标图片", trigger: "blur" },
        ],
      },
      fileList: [],
      classType: "name",
      dynamicTags: [], //团队标签
      inputVisible: false,
      inputValue: "",
      selectInput: "",
      input: "", //查询框
      ueId: "editor5", //多实例情况下使用
      dialogVisible: false,
      isAdd: true,
      typeClass: false,
      ruleForm: {
        name: "",
        description: "", //产品描述
        recommend: "", //不推荐 推荐
        type: "",
        newprice: "",
        oldprice: "",
        productlogo: "",
        productimg: "",
        consulting: "", // 总计咨询
        volume: "", // 总计销量
        totalview: "", // 总计浏览
        details: "",
        time: "",
      },
      rules: {
        name: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
        type: [{ required: true, message: "请选择产品分类", trigger: "blur" }],
        newprice: [
          { required: true, message: "请输入产品价格", trigger: "blur" },
        ],
        productlogo: [
          { required: true, message: "请上传产品Logo", trigger: "blur" },
        ],
        productimg: [
          { required: true, message: "请上传产品图片", trigger: "blur" },
        ],
      },
      tableData: [],
      tableHeader: [
        { name: "产品名称", prop: "name" },
        { name: "产品描述", prop: "description" },
        { name: "产品类型", prop: "type" },
        { name: "产品现价", prop: "newprice" },
        { name: "产品推荐", prop: "recommend" },
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
    this.findTagList();
  },
  methods: {
    //上传按钮重置
    uploadNew() {
      this.dialogVisible = true;
      this.isAdd = true;
      this.ruleForm = {
        name: "",
        description: "", //产品描述
        recommend: "", //不推荐 推荐
        type: "",
        newprice: "",
        oldprice: "",
        productlogo: "",
        productimg: "",
        consulting: "", // 总计咨询
        volume: "", // 总计销量
        totalview: "", // 总计浏览
        details: "",
        time: "",
      };
    },
    async findTagList() {
      //查询分类图标列表
      await this.$axios.post(this.$api.findProductClass).then((res) => {
        if (res.code == 200) {
          let arr = res.data;
          this.dynamicTags = this.$common.bubbleSort(arr,'number')
        }
      });
    },
    async tagClose(tag, imgname) {
      //删除分类图标
      this.$confirm("此操作将永久删除该产品分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await this.$axios
            .post(this.$api.delProductClass, { _id: tag })
            .then(async (res) => {
              if (res.code == 200) {
                this.$message.success("删除分类成功");
                await this.$axios
                  .post(this.$api.delIconlImg, {
                    imgurl: imgname,
                  })
                  .then((res) => {
                    if (res.code == 200) {
                      this.$message.success("删除图标成功");
                    }
                  });
                this.findTagList();
              }
            });
        })
        .catch(() => {});
    },
    //产品分类图标上传成功
    async iconFormSuccess(res, file, fileList) {
      if (res.code == 200) {
        if (this.iconForm.imgurl) {
          await this.$axios.post(this.$api.delIconlImg, {
            imgurl: this.iconForm.imgurl,
          });
        }
        this.iconForm.imgurl = res.data;
        this.fileList = [];
        this.$logsImg.createlogsImg(
          this.$api.uploadIconlImg,
          this.iconForm.imgurl
        ); //添加操作日志
        this.$message.success("图片上传成功");
      }
    },
    //上传产品Logo成功钩子
    async logoSuccess(res, file, fileList) {
      if (res.code == 200) {
        if (!this.isAdd) {
          await this.$axios.post(this.$api.updataProduct, {
            _id: this.ruleForm._id,
            productlogo: res.data,
          });
        }
        // if(this.ruleForm.productlogo){
        //   await this.$axios.post(this.$api.delProductLogo, this.ruleForm)
        // }
        this.ruleForm.productlogo = res.data;
        this.$logsImg.createlogsImg(
          this.$api.uploadProductLogo,
          this.ruleForm.productlogo
        ); //添加操作日志
        this.$message.success("logo上传成功");
      }
    },
    //上传产品图片成功钩子
    async handSuccess(res, file, fileList) {
      console.log(res.data);
      if (res.code == 200) {
        if (!this.isAdd) {
          await this.$axios.post(this.$api.updataProduct, {
            _id: this.ruleForm._id,
            productimg: res.data,
          });
        }
        // if(this.ruleForm.productimg){
        //   await this.$axios.post(this.$api.delProductImg, this.ruleForm)
        // }
        this.ruleForm.productimg = res.data;
        this.$logsImg.createlogsImg(
          this.$api.uploadProductImg,
          this.ruleForm.productimg
        ); //添加操作日志
        this.$message.success("图片上传成功");
      }
    },
    onError(err, file, fileList) {
      this.$message.error("图片上传失败");
    },
    handleSizeChange(val) {
      this.find.limit = val;
      this.getNewsList();
    },
    handleCurrentChange(val) {
      this.find.currentPage = val;
      this.getNewsList();
    },
    async findClass() {
      var data = {
        skip: this.find.limit * (this.find.currentPage - 1),
        limit: this.find.limit,
        fuzz: this.classType,
        input: this.selectInput,
      };
      await this.$axios.post(this.$api.findProduct, data).then((res) => {
        this.tableData = res.data[0].data;
        this.find.total = res.data[0].total[0].total;
      });
      this.input = "";
    },
    async getNewsList() {
      var data = {
        skip: this.find.limit * (this.find.currentPage - 1),
        limit: this.find.limit,
        fuzz: this.classType,
        input: this.input,
      };
      await this.$axios.post(this.$api.findProduct, data).then((res) => {
        this.tableData = res.data[0].data;
        this.find.total = res.data[0].total[0].total;
      });
      this.selectInput = "";
    },
    //编辑按钮
    editRow(index, row) {
      this.dialogVisible = true;
      this.isAdd = false;
      this.ruleForm = row;
    },
    //删除行
    deleteRow(index, row) {
      this.$confirm("确认删除该产品吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$axios
          .post(this.$api.delateProduct, { _id: row._id })
          .then((res) => {
            if (res.code == 200) {
              this.$message.success("删除成功");
              this.getNewsList();
            }
          });
        if (row.productlogo) {
          this.$axios.post(this.$api.delProductLogo, row);
        }
        if (row.productimg) {
          this.$axios.post(this.$api.delProductImg, row);
        }
      });
    },
    handleClose() {
      if (this.isAdd) {
        //新增产品时点了取消，要把图片删除
        if (this.ruleForm.productimg) {
          this.$axios.post(this.$api.delProductImg, this.ruleForm);
        }
        if (this.ruleForm.productlogo) {
          this.$axios.post(this.$api.delProductLogo, this.ruleForm);
        }
      }
      this.dialogVisible = false;
    },
    //上传信息
    async uploadBtn(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.ruleForm.details = this.$refs.editor.getUEContent();
          if (this.isAdd) {
            //新增
            delete this.ruleForm._id;
            var res = await this.$axios.post(
              this.$api.uploadProduct,
              this.ruleForm
            );
          } else {
            var res = await this.$axios.post(
              this.$api.updataProduct,
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
    //创建产品分类
    async uploadIconBtn(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          var res = await this.$axios.post(
            this.$api.createProductClass,
            this.iconForm
          );
          if (res.code == 200) {
            this.$message.success("创建分类成功");
            this.findTagList();
            this.iconForm.imgurl = "";
            this.typeClass = false;
          }
        } else {
          return false;
        }
      });
    },
    //删除分类图标
    async iconClose() {
      if (this.iconForm.imgurl) {
        await this.$axios
          .post(this.$api.delIconlImg, {
            imgurl: this.iconForm.imgurl,
          })
          .then((res) => {
            if (res.code == 200) {
              this.iconForm.imgurl = "";
              this.$message.success("删除图标成功");
            }
          });
      }
      this.typeClass = false;
    },
  },
};
</script>

<style lang='scss' scoped>
.nameText{
  // border-bottom:1px dashed #909399;
  padding:2px;
  text-align: center
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
