<template>

  <div class="app-container" v-loading.fullscreen.lock="loading" element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
      {{url}}
      <div style="margin-top: 20px">
          <el-button>
                <span>
                    <router-link tag="a" :to="{name:'articleAdd',params:{parent_path:search,path:url,parentID:parent_id}}" > 添加{{parent_id}}</router-link>
              </span>
          </el-button>
          <el-button :disabled="disab" @click="ArticleDeleteAll()">删除</el-button>
          <!--<el-button @click="toggleSelection(MenuData,true)">全选</el-button>-->
          <el-button @click="toggleSelection(ArticleData,false)">反选</el-button>
      </div>
    <el-table
            ref="table"
            :data="ArticleData"
            style="width: 100%"
            @selection-change="handleSelectionChange"
    >
        <el-table-column type="selection">全选</el-table-column>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>

        <el-table-column  prop="title_img" label="缩略图">
        <template slot-scope="scope">

                <img v-if="scope.row.title_img"  :src="scope.row.title_img" width="40" height="40" class="head_pic"/>
                <img v-else   src="./icon7.png" width="40" height="40" class="head_pic"/>



        </template>

        </el-table-column>
        <el-table-column prop="title_text" label="描述"></el-table-column>
        <el-table-column prop="sort" label="排序"></el-table-column>




      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini">
              <span>
                    <router-link tag="a" :to="{name:'articleUpdate',params:{id:scope.row.id,path:url,add:search}}" > 编辑</router-link>
              </span>



          </el-button>
          <el-button
                  size="mini"
                  type="danger"
                  @click="ArticleDeleteOne(scope.row.id)">{{scope.row.id}}删除
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
        <el-button type="primary" @click="ArticleOneUpdate(ArticleID)">确 定{{ArticleID}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                url:'',
                classifyID:'',
                FormData:'顶级导航',
                ArticleMain:'',
                ArticleData: null,
                listLoading: true,
                dialogVisible: false,
                ArticleID: '',
                id: '',
                form:{},
                formLabelWidth: '120px',
                multipleSelection:[],
                disab: '',
                update:0,
                search:'',
                parent_id:'',
                loading: true
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
            this.url = this.$router.currentRoute.path
            this.search = this.$router.currentRoute.meta.title_name

            this.ArticleAllData()

        },
        watch: {

            $route(){
                this.loading=true
                this.url = this.$router.currentRoute.path
                this.search = this.$router.currentRoute.meta.title_name

                this.ArticleAllData()
            },


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
            ArticleAllData() {
                let name = this.search

                this.$api.post('article/all', {'name':name}, (success) => {
                         this.loading=false
                        this.listLoading = false
                        this.parent_id = success.parent_id
                        this.ArticleData = success.data
                        let arr = this.ArticleData
                        let arr1=[]
                        for (let i=0;i<arr.length;i++){
                            arr1[i] = arr[i].name
                        }
                        this.FormData = arr1;
                    }
                )
            },
//            弹框数据获取
            ArticleOneData(scope) {
                this.dialogVisible=true
                this.update=1
                this.$api.get("article/"+scope, null, (success) => {
                        this.listLoading = false
                        this.form=success
                        this.form.region = this.ArticleData
                        this.ArticleID=this.form.id
                    }
                )
            },
//          更新数据




//            删除数据
            ArticleDeleteAll() {
                this.$confirm('确认删除?')
                    .then(_ => {
                        this.$api.post("article/delete", {"id": this.multipleSelection}, (success) => {
                                if(success){
                                    this.dialogVisible=false;
                                    this.message('恭喜，删除成功')
                                    this.ArticleAllData()
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
            ArticleDeleteOne(id) {
                this.$confirm('确认删除?')
                .then(_ => {
                    this.$api.post("article/delete", {"id": id}, (success) => {
                            if(success){
                                this.dialogVisible=false;
                                this.message('恭喜，删除成功')
                                this.ArticleAllData()
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
