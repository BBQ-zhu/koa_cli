<template>
  <div class="card">
    <div class="header">
      <el-button type="primary" icon="el-icon-upload" @click="dialogVisible=true,isAdd=true">上传新闻</el-button>
    </div>
    <div v-if="dialogVisible" class="window">
      <span>
        <el-input v-model="newsName" placeholder="请输入新闻标题" class="mb20"></el-input>
        <UE :defaultMsg="content" :config="config" :id="ueId" ref="editor"></UE>
      </span>
      <div class="flex mt10 windBtn">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="uploadAdd">确 定</el-button>
      </div>
    </div>
    <el-table v-if="!dialogVisible" :data="tableData" stripe>
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
    <!-- 页码条 -->
    <el-pagination
      v-if="!dialogVisible"
      class="mt20"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="find.currentPage"
      :page-sizes="[find.limit, 20, 50, 100,200]"
      :page-size="find.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="find.total"
    ></el-pagination>
  </div>
</template>

<script>
import UE from '@/components/common/UE'
export default {
  components: {
    UE
  },
  data() {
    return {
      content: '',
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 220
      },
      ueId: 'editor1', //多实例情况下使用
      dialogVisible: false,
      isAdd: true,
      newsName: '',
      row: '',
      tableData: [],
      tableHeader: [
        { name: '新闻标题', prop: 'newsname' },
        { name: '发布者', prop: 'creators' },
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
    this.getNewsList()
  },
  methods: {
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
        limit: this.find.limit
      }
      this.$axios.post(this.$api.findNews, data).then(res => {
        this.tableData = res.data[0].data
        this.find.total = res.data[0].total[0].total
      })
      // let res = await this.$axios.post(this.$api.findNews)
      // if (res.code == 200) {
      //   this.tableData = res.data
      // }
    },
    //编辑按钮
    editRow(index, row) {
      this.dialogVisible = true
      this.isAdd = false
      this.newsName = row.newsname
      this.content = row.content
      this.row = row
      console.log(this.row)
    },
    //删除行
    deleteRow(index, row) {
      this.$confirm('确认删除该新闻吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(this.$api.deleteNews, { _id: row._id }).then(res => {
          if (res.code == 200) {
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
      this.content = this.$refs.editor.getUEContent()
      console.log(this.content)
      if (this.isAdd) {
        //新增
        var data = {
          newsname: this.newsName,
          content: this.content,
          creators: JSON.parse(sessionStorage.getItem('userInfo') || {}).username
        }
        var res = await this.$axios.post(this.$api.createNews, data)

      } else {
        var data = {
          _id: this.row._id,
          newsname: this.newsName,
          content: this.content
        }
       var res = await this.$axios.post(this.$api.updateNews, data)
      }

      if (res.code == 200) {
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.getNewsList()
      }
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
</style>
