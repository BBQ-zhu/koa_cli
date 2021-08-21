<template>
  <div class="UE">
    <script :id="id" type="text/plain"></script>
  </div>
</template>

<script>
//主体文件引入
// import '../../../ueditor/ueditor.config.js'
// import '../../../ueditor/ueditor.all.min.js'
// import '../../../ueditor/lang/zh-cn/zh-cn.js'
export default {
  name: 'UE',
  data() {
    return {
      editor: null
    }
  },
  props: {
    defaultMsg: {
      //默认输入内容
      type: String
    },
    config: {
      //富文本默认信息
      type: Object
    },
    id: {
      type: String,
      default: 'editor'
    }
  },
  mounted() {
    const _this = this
    _this.editor = UE.getEditor(_this.id, _this.config) // 初始化UE
    _this.editor.addListener('ready', function() {
      _this.editor.setContent(_this.defaultMsg) // 确保UE加载完成后，放入内容。
    })
  },
  methods: {
    getUEContent() {
      // 获取内容方法
      return this.editor.getContent()
    }
  },
  destroyed() {
    this.editor.destroy()
  }
}
</script>

