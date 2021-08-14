<template>
  <div class="card">
    <div class="flex header">
      <el-button type="primary" icon="el-icon-upload" @click="dialogVisible=true,isAdd=true">上传新闻</el-button>
      <el-dialog title="上传新闻" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
        <span>
          <el-input v-model="newsName" placeholder="请输入新闻标题" class="mb20"></el-input>
          <Editor ref="editor" :content.sync="content"></Editor>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="uploadAdd">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <el-table :data="tableData" stripe>
      <el-table-column
        v-for="(item,index) in tableHeader"
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
            @click.native.prevent="deleteRow(scope.$index, scope.row)"
            type="text"
            size="small"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Editor from '@/components/common/Editor'
export default {
  components: {
    Editor
  },
  data() {
    return {
      dialogVisible: false,
      isAdd: true,
      newsName: '',
      content: '',
      row: '',
      tableData: [],
      tableHeader: [{ name: '新闻标题', prop: 'newsname' }]
    }
  },
  mounted() {
    this.getNewsList()
  },
  methods: {
    async getNewsList() {
      let res = await this.$axios.post(this.$api.findNews)
      if (res.code == 200) {
        this.tableData = res.data
      }
    },
    //编辑按钮
    editRow(index, row) {
      this.dialogVisible = true
      this.isAdd = false
      this.newsName = row.newsname
      this.content = row.content
      this.row = row
    },
    //删除行
    deleteRow(index, row) {
      this.$confirm('确认删除该新闻吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(this.$api.deleteNews,{_id:row._id}).then(res=>{
          if(res.code == 200){
            this.$message.success('删除成功')
            this.getNewsList()
          }
        })
      })
    },
    handleClose() {
      this.newsName = ''
      this.content = ''
      this.dialogVisible = false
    },
    async uploadAdd() {
      if (!this.newsName) {
        this.$message.error('请先输入标题')
        return
      }
      
      if (this.isAdd) {
        //新增
        var data = {
          newsname: this.newsName,
          content: this.content
        }
        var data = await this.$axios.post(this.$api.createNews, data)
      } else {
        var data = {
          _id: this.row._id,
          newsname: this.newsName,
          content: this.content
        }
        var data = await this.$axios.post(this.$api.updateNews, data)
      }

      if (data.code == 200) {
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.getNewsList()
      }
    }
  }
}
</script>

<style scoped>
</style>
