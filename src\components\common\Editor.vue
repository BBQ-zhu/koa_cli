<template>
  <quill-editor
    class="editor"
    v-model="content"
    ref="myQuillEditor"
    :options="editorOption"
    @blur="onEditorBlur($event)"
    @focus="onEditorFocus($event)"
    @ready="onEditorReady($event)"
    @change="onEditorChange($event)"
  ></quill-editor>
</template>
<script>
import { quillEditor,Quill } from 'vue-quill-editor'
import { container, ImageExtend } from 'quill-image-extend-module'
Quill.register('modules/ImageExtend', ImageExtend)
export default {
  props :['content'],
  data() {
    return {
      editorOption: {
        //  富文本编辑器配置
        modules: {
          ImageExtend: {
              loading: true,  // 可选参数 是否显示上传进度和提示语
              name: 'img',  // 图片参数名
              size: 3,  // 可选参数 图片大小，单位为M，1M = 1024kb
              action: this.$api.uploadImg,  // 服务器地址, 如果action为空，则采用base64插入图片
              response: (res) => {
                console.log(res);
                return res.data.url
              },
              headers: (xhr) => {xhr.setRequestHeader("Authorization", sessionStorage.getItem('token'))},  // 可选参数 设置请求头部
              start: () => {},  // 可选参数 自定义开始上传触发事件
              end: () => {},  // 可选参数 自定义上传结束触发的事件，无论成功或者失败
              error: () => {},  // 可选参数 自定义网络错误触发的事件
              change: (xhr, formData) => {} // 可选参数 选择图片触发，也可用来设置头部，但比headers多了一个参数，可设置formData
          },
          toolbar: {//工具栏汉化
            container: [
              ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
              ['blockquote', 'code-block'], // 引用  代码块-----['blockquote', 'code-block']
              [{ header: 1 }, { header: 2 }], // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
              [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
              [{ script: 'sub' }, { script: 'super' }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
              [{ indent: '-1' }, { indent: '+1' }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
              [{ direction: 'rtl' }], // 文本方向-----[{'direction': 'rtl'}]
              [{ size: ['small', false, 'large', 'huge'] }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
              [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
              [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
              [{ font: [] }], // 字体种类-----[{ font: [] }]
              [{ align: [] }], // 对齐方式-----[{ align: [] }]
              ['clean'], // 清除文本格式-----['clean']
              ['image', 'video'] // 链接、图片、视频-----['link', 'image', 'video']
            ]
          }
        },
        //主题
        theme: 'snow',
        placeholder: '请输入正文'
      }
    }
  },
  methods: {
    //失去焦点事件
    onEditorBlur(quill) {},
    //获得焦点事件
    onEditorFocus(quill) {},
    // 准备富文本编辑器
    onEditorReady(quill) {
      console.log('editor ready!', quill)
    },
    //内容改变事件
    onEditorChange({ quill, html, text }) {
      this.$emit("update:content", html);
    }
  }
}
</script>
 
<style>
.editor {
  line-height: normal !important;
  min-height: 200px;
}
.ql-snow .ql-tooltip[data-mode='link']::before {
  content: '请输入链接地址:';
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: '保存';
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode='video']::before {
  content: '请输入视频地址:';
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: '14px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='small']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='small']::before {
  content: '10px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='large']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='large']::before {
  content: '18px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='huge']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='huge']::before {
  content: '32px';
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '文本';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
  content: '标题1';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
  content: '标题2';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
  content: '标题3';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='4']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
  content: '标题4';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='5']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
  content: '标题5';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='6']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
  content: '标题6';
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: '标准字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='serif']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='serif']::before {
  content: '衬线字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='monospace']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='monospace']::before {
  content: '等宽字体';
}
</style>
