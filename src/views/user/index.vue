<template>

  <div class="app-container">
      {{UserID}}
    <div style="margin-top: 20px">
      <el-button @click="UserOneAdd()">添加</el-button>
      <el-button :disabled="disab" @click="UserDeleteAll()">删除</el-button>
      <!--<el-button @click="toggleSelection(UserData,true)">全选</el-button>-->
      <el-button @click="toggleSelection(UserData,false)">反选</el-button>
    </div>
    <el-table
            ref="table"
            :data="UserData"
            style="width: 100%"
            @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection">全选</el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="user" label="用户"></el-table-column>
        <el-table-column prop="admin.admin_name" label="权限"></el-table-column>





      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="UserOneData(scope.row.id)">编辑</el-button>
          <el-button
                  size="mini"
                  type="danger"
                  @click="UserDeleteOne(scope.row.id)">{{scope.row.id}}删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>




      <el-dialog

              title="修改"
              :visible.sync="dialogVisible"
              width="30%"
              :before-close="Close">
          <el-form ref="form" :model="form" :rules="rules">
              <el-form-item label="姓名" :label-width="formLabelWidth" prop="user">
                  <el-input v-model="form.user" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码" :label-width="formLabelWidth" prop="user">
                  <el-input v-model="form.password" auto-complete="off"></el-input>
              </el-form-item>

              <el-form-item label="权限"  :label-width="formLabelWidth">
                  <el-select v-model="FormData.main" placeholder="请选择" value-key="admin_name" @change="Select(FormData.main)">
                      <el-option
                              v-for="(item,index)  in form.region"
                              :key="index"
                              :label="item.admin_name"
                              :value="item">
                      </el-option>
                  </el-select>
              </el-form-item>

          </el-form>
          <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="UserOneUpdate()" >确 定</el-button>
      </span>
      </el-dialog>
  </div>
</template>

<script>
    export default {
        data() {
            return {

                FormData:{
                    main:'hah'
                },
                UserMain:'',
                UserData: null,
                listLoading: true,
                dialogVisible: false,
                UserID: '',
                adminID:'',
                form:{},
                MenuID:'',
                formLabelWidth: '120px',
                multipleSelection:[],
                disab: '',
                update:0,
                rules: {
                    user: { required: true, message: '请输姓名',trigger:'blur' },


                }
            }
        },
        filters: {
            statusFilter(status) {
                const statusMap = {
                    published: 'success',
                    draft: 'gray',
                    deleted: 'danger'
                }
                return statusMap[status]
            }
        },
        created() {
            this.UserAllData()

        },
        watch: {
            multipleSelection:function(){
                if(this.multipleSelection.length>0){
                    this.disab = false
                }else {
                    this.disab = true
                }
            }
        },
        computed:{
//            newRender:function(){
//                this.categoryID = this.$route.params.id
//                this.$route.matched[this.$route.matched.length-1].meta.title=this.$route.params.name
//                return this.categoryID
//            }

        },

        methods: {
            Select(num){
                this.adminID = num.id
                console.log(this.adminID)

            },
//            获取数据
            UserAllData() {
                this.$api.post('user/all', null, (success) => {
                        this.listLoading = false
                        this.UserData = success
                        this.FormSelect()

                    }
                )
            },

            FormSelect(){
                this.$api.post("user/admin", null, (success) => {
                       this.FormData = success
                    }
                )
            },
//            弹框数据获取
            UserOneData(scope) {
                this.dialogVisible=true
                this.UserID = scope
                this.update=1
                this.$api.get("User/"+scope, null, (success) => {
                        this.listLoading = false
                        this.form=success

                        this.form.region = this.FormData



                    }
                )
            },
//          更新数据
            UserOneUpdate() {

                this.$refs.form.validate(valid=>{
                    let user = this.form.user
                    let update = this.update
                    let id = this.UserID
                    let admin_id = this.adminID
                    if(!admin_id){
                        this.$message({
                            message: '警告，请选择类别',
                            type: 'error',
                            center: true,
                            duration: 1000
                        });
                        return false
                    }
                    let msg
                    update ? msg='恭喜，修改成功' : msg='恭喜添加成功'


                    this.$api.post("user/update", {"id":id,"user":user,"admin_id":admin_id,'update':update}, (success) => {
                            if(success){
                                this.dialogVisible=false;
                                this.message(msg)
                                this.UserAllData()
                            }
                        },(fail) => {
                            console(fail)
                        }
                    )

                })









            },


//            添加数据
            UserOneAdd() {
                this.update=0
                this.UserID = null
                this.FormSelect()
                this.dialogVisible=true
                this.form={}
                this.form.region = this.FormData



            },


//            删除数据
            UserDeleteAll() {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.$api.post("User/delete", {"id": this.multipleSelection}, (success) => {
                                if(success){
                                    this.dialogVisible=false;
                                    this.message('恭喜，删除成功')
                                    this.UserAllData()
                                }
                            },(fail) => {
                                console(fail)
                            }
                        )

                    })
                    .catch(_ => {
                    });

            },
//            删除数据
            UserDeleteOne(id) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.$api.post("User/delete", {"id": id}, (success) => {
                                if(success){
                                    this.dialogVisible=false;
                                    this.message('恭喜，删除成功')
                                    this.UserAllData()
                                }
                            },(fail) => {
                                console(fail)
                            }
                        )
                    })
                    .catch(_ => {
                    });





            },

//            选择删除
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.table.toggleRowSelection(row);

                    });
                } else {
                    this.$refs.table.clearSelection();

                }
            },

            handleSelectionChange(val) {
                let arr=[]
                for (let i=0;i<val.length;i++){
                    arr[i] = val[i].id
                }
                this.multipleSelection = arr

                return this.multipleSelection
            },


            Close(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {
                    });
            },
            message(msg){
                let that  = this
                that.$message({
                    message:msg,
                    type: 'success',
                    center: true,
                    duration: 1000
                });
            },
            Edit(index, row) {
                console.log(index, row);
            },

        }
    }
</script>
