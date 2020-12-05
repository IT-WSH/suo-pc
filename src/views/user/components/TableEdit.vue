<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" @close="close">
    <el-form
      v-if="!form.id"
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="手机号码" prop="phone">
        <el-input
          v-model.trim="form.phone"
          placeholder="请输入手机号码"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model.trim="form.password"
          placeholder="请输入密码"
          show-password
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="昵称" placeholder="请输入昵称" prop="nickname">
        <el-input v-model.trim="form.nickname" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { register } from '@/api/user'

  export default {
    name: 'TableEdit',
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          callback()
        }
      }
      return {
        form: {
          phone: '',
          password: '',
          nickname: '',
        },
        rules: {
          phone: [{ required: true, trigger: 'blur', message: '请输入手机号' }],
          password: [
            {
              required: true,
              validator: validatePass,
              trigger: 'blur',
              message: '请输入密码',
            },
          ],
          nickname: [
            { required: true, trigger: 'blur', message: '请输入昵称' },
          ],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {},
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '新增用户'
        } else {
          this.title = '用户信息'
          this.form = Object.assign({}, row)
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
        this.$emit('fetch-data')
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            if (this.form.id) {
              // const { msg } = await doEdit(this.form)
              // this.$baseMessage(msg, 'success')
              // this.$refs['form'].resetFields()
              // this.dialogFormVisible = false
              // this.$emit('fetch-data')
              // this.form = this.$options.data().form
            } else {
              let params = {
                ...this.form,
                passwordReset: this.form.password,
              }
              const { message } = await register(params)
              this.$baseMessage('创建成功', 'success')
              this.$refs['form'].resetFields()
              this.dialogFormVisible = false
              this.$emit('fetch-data')
              this.form = this.$options.data().form
            }
          } else {
            return false
          }
        })
      },
    },
  }
</script>
