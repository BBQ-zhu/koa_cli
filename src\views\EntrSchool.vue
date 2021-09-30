<template>
  <div class="card">
    <div class="flex header">
      <el-button v-if="meth[0]" type="primary" icon="el-icon-upload" @click="clickDown">上传视频</el-button>
      <div class="el-upload__tip ml10" slot="tip" style="line-height:33px;">视频内容不易过大</div>
      <el-dialog
        title="上传视频"
        :visible.sync="dialogVisible"
        width="400px"
        :before-close="handleClose"
      >
        <span>
          <el-input v-model="videoData.videoName" class="mb20" placeholder="请输入视频名称"></el-input>
          <el-upload
            class="upload-demo mb20"
            :data="videoData"
            :action="this.$api.uploadVideoImg"
            :headers="uploadHeader"
            :on-error="onError"
            :file-list="fileList"
            :on-success="imgSuccess"
            :show-file-list="true"
            :limit="1"
          >
            <el-button size="small" type="primary">视频封面上传</el-button>
            <span slot="tip" class="el-upload__tip">比例为16：9</span>
          </el-upload>
          <el-upload
            class="upload-demo"
            drag
            :data="videoData"
            :action="this.$api.uploadVideo"
            :headers="uploadHeader"
            :before-upload="beforeUploadVideo"
            :on-success="onSuccess"
            :on-error="onError"
            :show-file-list="false"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              视频文件拖到此处，或
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
      <div v-for="(item,index) in videoList" :key="index" class="mt10" style="width:260px">
        <div class="mr10">
          <div v-if="item.show" class="pointer" style="position:relative;" @click="schoolChange(index)">
            <img :src="item.videoimg" width="240" height="135" />
            <i class="el-icon-video-play color3" style="position:absolute;top:60px;left:110px;font-size:30px"></i>
          </div>
          <video v-else width="240" height="135" controls style="border:2px solid #213446">
            <source :src="item.videourl" />您的浏览器不支持Video标签。
          </video>
          <div class="mt10 flowellipsis">
            <i
              v-if="meth[1]"
              slot="reference"
              class="el-icon-delete-solid f20 colorRed mr10"
              @click="delBtn(item._id,item.videourl,item.videoimg)"
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
        authorization: JSON.parse(sessionStorage.getItem('userInfo') || '{}')
          .token
      },
      dialogVisible: false,
      visible: false,
      showViode: true,
      fileList: [],
      number: 0,
      videoData: {
        videoName: '',
        videoImg: ''
      },
      videoList: []
    }
  },
  mounted() {
    this.mixinMethod(this.$route.path)
    console.log(this.meth)

    this.findVideo()
  },
  methods: {
    clickDown(){
      this.dialogVisible=true
      this.videoData.videoName = '';
      this.videoData.videoImg = '';
      this.fileList = []
    },
    //查询视频列表
    async findVideo() {
      await this.$axios.post(this.$api.findVideo).then(res => {
        if (res.code == 200) {
          this.videoList = []
          let arr = res.data
          arr.map(item=>{
            let obj = {}
            obj._id = item._id
            obj.videoimg = item.videoimg
            obj.videourl = item.videourl
            obj.videoname = item.videoname
            obj.show = true
            this.videoList.push(obj)
          })
        }
      })
    },
    schoolChange(index){
      this.videoList.map((item=>{
        item.show = true
      }))
      this.videoList[index].show = false
    },
    //上传前回调
    beforeUploadVideo(file) {
      if (!this.videoData.videoName) {
        this.$message.error('请先输入文件名称')
        return false
      }
      if (!this.videoData.videoImg) {
        this.$message.error('请先上传视频封面')
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
    //封面上传成功
    imgSuccess(res, file, fileList) {
      if (res.code == 200) {

        this.videoData.videoImg = res.data
        this.$logsImg.createlogsImg(this.$api.uploadVideoImg,this.videoData.videoImg) //添加操作日志
        this.$message.success('封面上传成功')
      }
    },
    //视频上传成功
    onSuccess(res, file, fileList) {
      if (res.code == 200) {
        this.number = 100
        this.$logsImg.createlogsImg(this.$api.uploadVideo,this.videoData.videoName) //添加操作日志
        this.$message.success('视频上传成功')
      }
    },
    //出错
    onError(err, file, fileList) {
      this.$message.error('上传失败')
      this.videoData.videoName = ''
      this.videoData.videoImg = ''
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
      } else if (this.videoData.videoImg == '') {
        this.$message.error('请上传封面')
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
    delBtn(_id, videourl,videoImg) {
      this.$confirm('确认删除该视频？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.delVideo(_id, videourl)
        await this.$axios.post(this.$api.delateVideoImg,{videoImg:videoImg})
      })
    },
    //删除
    async delVideo(_id, videourl) {
      console.log(_id, videourl)
      var index = videourl.lastIndexOf('/')
      var fileName = videourl.slice(index + 1)
      await this.$axios
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
