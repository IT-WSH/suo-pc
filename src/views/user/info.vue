<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd">
          添加
        </el-button>
        <!-- <el-button icon="el-icon-delete" type="danger" @click="handleDelete">
          删除
        </el-button>
        <el-button type="primary" @click="testMessage">baseMessage</el-button>
        <el-button type="primary" @click="testALert">baseAlert</el-button>
        <el-button type="primary" @click="testConfirm">baseConfirm</el-button>
        <el-button type="primary" @click="testNotify">baseNotify</el-button> -->
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form
          ref="form"
          :model="queryForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input
              v-model="queryForm.keyworld"
              placeholder="手机号码/昵称"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              native-type="submit"
              @click="handleQuery"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <!-- @selection-change="setSelectRows" -->
    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
      :height="height"
      @sort-change="tableSortChange"
    >
      <el-table-column
        show-overflow-tooltip
        prop="id"
        label="用户ID"
        width="300"
        align="center"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="nickname"
        label="用户名"
        align="center"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="头像"
        width="100"
        align="center"
      >
        <template #default="{ row }">
          <el-image
            v-if="imgShow"
            class="user_logo"
            :preview-src-list="imageList"
            :src="row.imgface"
          >
            <i slot="error" class="el-icon-picture-outline"></i>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="phone"
        label="电话号码"
        align="center"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="权限" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.admin" :type="row.admin.name | statusFilter">
            {{ row.admin.name }}
          </el-tag>
          <el-tag v-else>无权限</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="修改时间"
        width="200"
        align="center"
      >
        <template #default="{ row }">
          <el-tag :type="'admin' | statusFilter">
            {{ row.update_time | formatTime('yyyy-MM-dd HH:mm:ss') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="操作"
        width="180px"
        align="center"
      >
        <template #default="{ row }">
          <el-button type="warning" @click="handleEdit(row)">查看</el-button>
          <el-button type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :background="background"
      :current-page="queryForm.pageIndex"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
    <table-edit ref="edit" @fetch-data="fetchData"></table-edit>
  </div>
</template>
<script>
  import { getList, doDelete } from '@/api/userManagement'
  import TableEdit from './components/TableEdit'
  export default {
    name: 'ComprehensiveTable',
    components: {
      TableEdit,
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          admin: 'success',
          editor: 'warning',
          deleted: 'danger',
        }
        return statusMap[status]
      },
    },
    data() {
      return {
        imgShow: true,
        list: [],
        imageList: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        background: true,
        selectRows: '',
        elementLoadingText: '正在加载...',
        queryForm: {
          pageIndex: 1,
          pageSize: 10,
          keyworld: '',
        },
      }
    },
    computed: {
      height() {
        return this.$baseTableHeight()
      },
    },
    created() {
      this.fetchData()
    },
    beforeDestroy() {},
    mounted() {},
    methods: {
      tableSortChange() {
        const imageList = []
        this.$refs.tableSort.tableData.forEach((item, index) => {
          imageList.push(item.img)
        })
        this.imageList = imageList
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      handleAdd() {
        this.$refs['edit'].showEdit()
      },
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg } = await doDelete({ ids: row.id })
            this.$baseMessage(msg, 'success')
            this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.id).join()
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { msg } = await doDelete({ ids: ids })
              this.$baseMessage(msg, 'success')
              this.fetchData()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error')
            return false
          }
        }
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageIndex = val
        this.fetchData()
      },
      handleQuery() {
        this.queryForm.pageIndex = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        const res = await getList(this.queryForm)
        const { list, total } = res.data
        this.list = list
        const imageList = []
        list.forEach((item, index) => {
          imageList.push(item.imgface)
        })
        this.imageList = imageList
        this.total = total
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
      testMessage() {
        this.$baseMessage('test1', 'success')
      },
      testALert() {
        this.$baseAlert('11')
        this.$baseAlert('11', '自定义标题', () => {
          /* 可以写回调; */
        })
        this.$baseAlert('11', null, () => {
          /* 可以写回调; */
        })
      },
      testConfirm() {
        this.$baseConfirm(
          '你确定要执行该操作?',
          null,
          () => {
            /* 可以写回调; */
          },
          () => {
            /* 可以写回调; */
          }
        )
      },
      testNotify() {
        this.$baseNotify('测试消息提示', 'test', 'success', 'top-right')
      },
    },
  }
</script>
<style lang="scss" scoped>
  .user_logo {
    background: #f0f0f0;
    vertical-align: middle;
    position: relative;
    .el-icon-picture-outline {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      left: 50%;
    }
  }
</style>
