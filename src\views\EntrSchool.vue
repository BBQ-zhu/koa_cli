<template>
  <div class="card">
    <div class="flex header">
      <el-button type="primary" icon="el-icon-upload" @click="dialogVisible=true">上传视频</el-button>
      <div class="el-upload__tip ml10" slot="tip" style="line-height:33px;">视频内容不得超过1G</div>
      <el-dialog
        title="上传视频"
        :visible.sync="dialogVisible"
        width="400px"
        :before-close="handleClose"
      >
        <span>
          <el-input v-model="videoData.videoName" class="mb20" placeholder="请输入视频名称"></el-input>
          <el-upload
            class="upload-demo"
            drag
            :data="videoData"
            :action="this.$api.uploadVideo"
            :headers="uploadHeader"
            :before-upload="beforeUploadVideo"
            :on-success="onSuccess"
            :on-error="onError"
            :on-progress="onProgress"
            :limit="1"

          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </el-upload>
          <el-progress class="mt10" :text-inside="true" :stroke-width="26" :percentage="number"></el-progress>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="uploadAdd">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 视频列表 -->
    <div class="videoList">
      <div v-for="(item,index) in videoList" :key="index" class="mt10">
        <div class="mr10">
          <video width="240" height="120" controls style="border:2px solid #213446">
            <source :src="item.videourl" />您的浏览器不支持Video标签。
          </video>
          <div class="mt10">
            <i
              slot="reference"
              class="el-icon-delete-solid f20 colorRed mr10"
              @click="delBtn(item._id,item.videourl)"
            ></i>
            {{item.videoname}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      uploadHeader: {
        authorization: JSON.parse(sessionStorage.getItem('userInfo') || {}).token
      },
      dialogVisible: false,
      visible: false,
      number: 0,
      videoData: {
        videoName: ''
      },
      videoList: []
    }
  },
  mounted() {
    this.findVideo()
  },
  methods: {
    //查询视频列表
    async findVideo() {
      await this.$axios.post(this.$api.findVideo).then(res => {
        if (res.code == 200) {
          this.videoList = res.data
        }
      })
    },
    //上传前回调
    beforeUploadVideo(file) {
      if (!this.videoData.videoName) {
        this.$message.error('请先输入文件名称')
        return false
      }
      if (
        [
          'video/mp4',
          'video/ogg',
          'video/flv',
          'video/avi',
          'video/wmv',
          'video/rmvb',
          'video/mov'
        ].indexOf(file.type) == -1
      ) {
        this.$message.error('请上传正确的视频格式')
        return false
      }
    },

    //成功
    onSuccess(res, file, fileList) {
      if (res.code == 200) {
        this.number = 100
      }
    },
    //出错
    onError(err, file, fileList) {
      this.$message.error('上传失败')
      this.videoData.videoName = ''
      this.number = 0
    },
    //上传中
    onProgress(event, file, fileList) {
      this.number = file.percentage.toFixed(0) * 1
    },
    //确认按钮
    uploadAdd() {
      if (!this.videoData.videoName) {
        this.$message.error('请输入文件名')
      } else if (this.number == 0) {
        this.$message.error('请上传文件')
      } else if (this.number != 0 && this.number != 100) {
        this.$message.error('文件上传中请稍后')
      } else {
        this.dialogVisible = false
        this.$message.success('文件上传成功')
        this.number = 0
        this.findVideo()
      }
    },
    handleClose() {
      this.videoData.videoName = ''
      this.number = 0
      this.dialogVisible = false
    },
    delBtn(_id, videourl) {
      this.$confirm('确认删除该视频？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delVideo(_id, videourl)
      })
    },
    //删除
    delVideo(_id, videourl) {
      var index = videourl.lastIndexOf('/')
      var fileName = videourl.slice(index + 1)
      this.$axios
        .post(this.$api.delateVideo, { _id: _id, fileName: fileName })
        .then(res => {
          if (res.code == 200) {
            this.$message.success('删除成功')
            this.findVideo()
          } else {
            this.$message.error('删除失败')
          }
        })
    }
  }
}
</script>

<style scoped>
.videoList {
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
</style>
