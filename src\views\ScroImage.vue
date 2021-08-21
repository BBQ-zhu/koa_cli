<template>
  <div class="card">
    <div class="flex header">
      <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">新增轮播图</el-button>
      <div class="f12 color3 ml10 mt20">上传的图片请先压缩处理</div>
    </div>
    <el-collapse v-model="activeNames">
      <el-collapse-item
        v-for="(item,index) in scrolLists"
        :key="item.typeId"
        :title="item.type"
        :name="index"
      >
        <div
          v-for="(children,indec) in item.imgList"
          :key="indec+'img'"
          class="ml10 mt10"
          style="position:relative"
        >
          <img :src="children.scroimg" class="scroImg" />
          <i class="el-icon-close colorRed delIcon pointer" @click="delImg(index,indec,children)"></i>
        </div>
      </el-collapse-item>
    </el-collapse>

    <!-- 弹出框 -->
    <el-dialog title="轮播图" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <span>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm flex"
        >
          <el-form-item label="位置:" prop="typeId">
            <el-select v-model="ruleForm.typeId" placeholder="请选择展示位置">
              <el-option
                v-for="item in scrolLists"
                :key="item.typeId"
                :label="item.type"
                :value="item.typeId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图片:" prop="imgurl">
            <el-upload
              class="upload-demo"
              :data="ruleForm"
              :action="this.$api.uploadScrollImg"
              :headers="uploadHeader"
              :before-upload="beforeUpload"
              :on-error="onError"
              :on-success="handSuccess"
              :show-file-list="false"
              :limit="imgLimit"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">请尽量上传压缩后的图片</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      uploadHeader: {
        authorization: JSON.parse(sessionStorage.getItem('userInfo') || {})
          .token
      },
      imgLimit: 100,
      activeNames: ['1'],
      scrollImgData: '',
      scrolLists: [
        {
          type: '移动端首页',
          typeId: 'mobScroll',
          imgList: []
        },
        {
          type: '移动端分类',
          typeId: 'mobClass',
          imgList: []
        },
        {
          type: '我的企业',
          typeId: 'myBusiness',
          imgList: []
        },
        {
          type: '我的金融',
          typeId: 'myFinances',
          imgList: []
        },
        {
          type: '推荐客户',
          typeId: 'referCustomers',
          imgList: []
        },
        {
          type: 'PC端首页',
          typeId: 'pcScroll',
          imgList: []
        },
        {
          type: 'PC端推荐',
          typeId: 'pcPicks',
          imgList: []
        }
      ],
      dialogVisible: false,
      ruleForm: {
        typeId: '',
        imgurl: ''
      },
      rules: {
        typeId: [
          { required: true, message: '请选择展示位置', trigger: 'blur' }
        ],
        imgurl: [{ required: true, message: '请选择图片', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.findScrollImg()
  },
  methods: {
    findScrollImg() {
      this.$axios.get(this.$api.findScrollImg).then(res => {
        if (res.code == 200) {
          var arr = res.data
          for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < this.scrolLists.length; j++) {
              if (arr[i].typeid == this.scrolLists[j].typeId) {
                this.scrolLists[j].imgList.push(arr[i])
                break
              }
            }
          }
        }
      })
    },
    handleClose() {
      this.dialogVisible = false
    },
    onError(err, file, fileList) {
      this.$message.error('上传失败')
    },
    beforeUpload() {
      if (!this.ruleForm.typeId) {
        this.$message.error('请先选择展示位置')
      }
    },
    delImg(index, indec, children) {
      this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var name = children.scroimg.split('/')
          var newName = name[name.length - 1]
          this.$axios
            .post(this.$api.delateScrollImg, {
              _id: children._id,
              fileName: newName
            })
            .then(res => {
              if (res.code == 200) {
                this.scrolLists[index].imgList.splice(indec, 1)
                this.$message.success('删除成功')
              }
            })
        })
        .catch(() => {})
    },
    //上传图片成功钩子
    handSuccess(res, file, fileList) {
      if (res.code == 200) {
        for (let item of this.scrolLists) {
          if (item.typeId == res.data.typeid) {
            item.imgList.push(res.data)
          }
        }
        this.$message.success('上传成功')
        // this.dialogVisible = false
      }
    }
  }
}
</script>

<style scoped>
.scroImg {
  width: 240px;
  height: 120px;
  border: 1px solid #8699ad;
  border-radius: 3px;
  box-sizing: border-box;
}
.scroImg:hover {
  border: none;
  box-shadow: 0 0 10px #8699ad;
}
.delIcon {
  font-size: 20px;
  position: absolute;
  right: 3px;
  top: 3px;
}
::v-deep .el-collapse-item__content {
  display: flex;
}
</style>
