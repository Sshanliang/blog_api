<template>

  <div class="app-container">
      menu
      <div style="margin-top: 20px">
          <el-button @click="MenuOneAdd()">添加</el-button>
          <el-button :disabled="disab" @click="MenuDeleteAll()">删除</el-button>
          <!--<el-button @click="toggleSelection(MenuData,true)">全选</el-button>-->
          <el-button @click="toggleSelection(MenuData,false)">反选</el-button>
      </div>
    <el-table
            ref="table"
            :data="MenuData"
            style="width: 100%"
            @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection">全选</el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="sort" label="排序"></el-table-column>




      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="MenuOneData(scope.row.id)">编辑</el-button>
          <el-button
                  size="mini"
                  type="danger"
                  @click="MenuDeleteOne(scope.row.id)">{{scope.row.id}}删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>




    <el-dialog

            title="修改"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="Close">
        <el-form ref="form" :model="form">
            <el-form-item label="导航名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item label="导航分类"  :label-width="formLabelWidth">
                <el-select v-model="FormData.main" placeholder="请选择" value-key="name" @change="Select(FormData.main)">
                    <el-option
                            v-for="(item,index)  in form.region"
                            v-if = "index>0"
                            :key="index"
                            :label="item.name"
                            :value="item">
                    </el-option>
                </el-select>
            </el-form-item>


            <el-form-item label="导航排序" :label-width="formLabelWidth">
                <el-input v-model="form.sort" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="MenuOneUpdate(MenuID)" >确 定{{MenuID}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                classifyID:'',
                FormData:'顶级导航',
                MenuMain:'',
                MenuData: null,
                listLoading: true,
                dialogVisible: false,
                MenuID: '',
                id: '',
                form:{},
                formLabelWidth: '120px',
                multipleSelection:[],
                disab: '',
                update:0

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
            this.MenuAllData()

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
              this.classifyID = num
            },
//            获取数据
            MenuAllData() {
                this.$api.get('menu/all', null, (success) => {
                        this.listLoading = false
                        this.MenuData = success
                        let arr = this.MenuData
                        let arr1=[]
                        for (let i=0;i<arr.length;i++){
                            arr1[i] = arr[i].name
                        }
                        this.FormData = arr1;
                    }
                )
            },
//            弹框数据获取
            MenuOneData(scope) {
                this.dialogVisible=true
                this.update=1
                console.log(1)
                console.log(this.FormData)
                console.log(1)
                this.$api.get("menu/"+scope, null, (success) => {
                        this.listLoading = false
                        this.form=success
                        this.form.region = this.MenuData
                        this.MenuID=this.form.id

                    }
                )
            },
//          更新数据
            MenuOneUpdate() {
                let name = this.form.name
                let sort = this.form.sort
                let update = this.update
                let id = this.MenuID
                let main = this.classifyID.id
                let msg
                update ? msg='恭喜，修改成功' : msg='恭喜添加成功'
                this.$api.post("menu/update", {"id":id,"name":name,"sort":sort,"main":main,'update':update}, (success) => {
                        if(success){
                            this.dialogVisible=false;
                            this.message(msg)
                            this.MenuAllData()
                        }
                    },(fail) => {
                    console(fail)
                }
                )
            },


//            添加数据
            MenuOneAdd() {
                console.log(123)
                this.dialogVisible=true
                this.update=0

                this.form.region = this.MenuData
            },


//            删除数据
            MenuDeleteAll() {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.$api.post("menu/delete", {"id": this.multipleSelection}, (success) => {
                                if(success){
                                    this.dialogVisible=false;
                                    this.message('恭喜，删除成功')
                                    this.MenuAllData()
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
            MenuDeleteOne(id) {
                this.$confirm('确认关闭？')
                .then(_ => {
                    this.$api.post("menu/delete", {"id": id}, (success) => {
                            if(success){
                                this.dialogVisible=false;
                                this.message('恭喜，删除成功')
                                this.MenuAllData()
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
            dialogVisible(){
                this.dialogVisible = false,
            }
        }
    }
</script>
