<template>
    <div class="createPost-container">
        <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
            <div class="createPost-main-container">
                <el-form-item style="margin-bottom: 40px;" :label-width="labelWidth" label="标题:"  prop="title" >
                    <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="文章标题" v-model="postForm.title">
                    </el-input>
                    <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
                </el-form-item>
                <el-form-item label="类别"  :label-width="labelWidth" prop="FormData">
                    <el-select disabled v-model="postForm.FormData.main" placeholder="请选择" value-key="name" @change="Select(postForm.FormData.main)">
                        <el-option
                                v-for="(item,index)  in postForm.FormData"
                                :key="index"
                                v-if="index>3"
                                :label="item.name"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item style="margin-bottom: 40px;" :label-width="labelWidth" label="图片:">

                    <el-upload
                            class="avatar-uploader"
                            accept="image/png, image/jpeg"
                            action="http://blog.cn/api/v1/article/upload"
                            name="image"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item style="margin-bottom: 40px;" :label-width="labelWidth" label="摘要:" prop="content_short">
                    <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容" v-model="postForm.content_short">
                    </el-input>
                    <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
                </el-form-item>
                <el-form-item style="margin-bottom: 40px;" :label-width="labelWidth" label="排序:" prop="sort">
                    <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容"  v-model.number="postForm.sort">
                    </el-input>
                    <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
                </el-form-item>

                <el-form-item style="margin-bottom: 40px;" :label-width="labelWidth" label="内容:" prop="content">
                    <quill-editor v-model="postForm.content" ref="myQuillEditor"  style="height: 300px" >
                        <!--@blur="onEditorBlur($event)" -->
                        <!--@focus="onEditorFocus($event)"-->
                        <!--@change="onEditorChange($event)"-->
                        <!--&gt;-->
                    </quill-editor>
                    <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
                </el-form-item>

                <el-button v-loading="loading" style="margin-left: 45px;margin-top: 50px;" type="success" @click="submitForm">发布</el-button>

            </div>
        </el-form>

    </div>
</template>

<script>

    import Upload from '@/components/Upload/singleImage3'

    export default {
        name: 'articleDetail',
        components: {Upload},
        props: {
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {

            const validateRequire = (rule, value, callback) => {
                if (value === '') {
                    this.$message({
                        message: rule.field + '为必传项',
                        type: 'error'
                    })
                    callback(null)
                } else {
                    callback()
                }
            }

            return {
                contentShortLength:'',
                postForm:{
                    title: '', // 文章题目
                    content:'',
                    image_uri: '', // 文章图片
                    content_short: '', // 文章摘要
                    sort:'',
                    FormData:'',
                    region:''
                },
                imageUrl: '',
                imgUrl:'',
                selectValue:'',
                labelWidth:'70px',
                loading: false,
                articleID:'',
                update:false,
                rules: {
                    title: { required: true, message: '请输入标题',trigger:'blur' },
                    FormData: { required: true, message: '请选择类别', trigger: 'change' },
                    content_short: { required: true, message: '请输入摘要',trigger:'blur' },
                    sort: [{ required: true, message: '请输入排序',trigger:'blur' },{ type: 'number', message: '必须为数字'}],
                    content: { required: true, message: '请输入内容',trigger:'blur' },
                    region: { required: true, message: '请输入内容',trigger:'change' },
                }
            }
        },
        computed: {

        },
        created() {

            this.ArticleAllData()
            this.Session()
        },

        methods: {
            Select(num){
                this.articleID= num.id;
            },
            Session(){

                let AddPath = this.$router.currentRoute.params.path
                let ParentPath = this.$router.currentRoute.params.parent_path
                let ParentID = this.$router.currentRoute.params.parentID
                console.log(ParentPath)
                if(!ParentPath){
                    AddPath = window.sessionStorage.getItem('AddPath')
                    ParentPath = window.sessionStorage.getItem('ParentPath')
                    ParentID = window.sessionStorage.getItem('ParentID')
                }
                window.sessionStorage.setItem('AddPath',AddPath)
                window.sessionStorage.setItem('ParentID',ParentID)
                window.sessionStorage.setItem('ParentPath',ParentPath)

                this.AddPath = AddPath
                this.ParentID = ParentID
                this.ParentPath = ParentPath
            },
            //            获取数据
            ArticleAllData() {
                this.$api.get('menu/all', null, (success) => {
                        this.listLoading = false
                        this.MenuData = success
                        let arr = this.MenuData
                        let arr1=[]
                        for (let i=0;i<arr.length;i++){
                            arr1[i] = arr[i].name
                        }

                        this.postForm.FormData = success;
                        this.postForm.FormData.main = this.ParentPath


                    },(fail) =>{
                    console.log(fail)
                    }
                )
            },

            submitForm() {
                this.$refs.postForm.validate(valid=>{
                    if(valid){
                        let articleID = this.ParentID
                        let title = this.postForm.title
                        let content_short = this.postForm.content_short
                        let content = this. postForm.content
                        let sort = this.postForm.sort
                        let update = this.update
                        let imgUrl_big = this.imgUrl_big
                        let imgUrl_small = this.imgUrl_small
                        this.$api.post("article/add", {
                                'parent_id':articleID,
                                "title":title,
                                "title_img":imgUrl_big,
                                "title_img_small":imgUrl_small,
                                'title_text':content_short,
                                'title_content':content,
                                "sort":sort,
                                'update':update,
                            }, (success) => {
                                if(success){
                                    let that = this
                                    this.$message({
                                        message:'恭喜你，添加成功',
                                        type: 'success',
                                        center: true,
                                        duration: 1000,
                                        onClose:function () {
                                            console.log(2313)
                                            console.log(that.AddPath)
                                            that.$router.push({ path:'/article/'+ that.ParentPath})
                                            console.log(2313)
                                        }
                                    });

                                }
                            },(fail) => {
                                console(fail)
                            }
                        )



                    }else {
                        this.$message({
                            message: '验证没通过，请检查',
                            type: 'warning'
                        });
                    }
                })
            },




            handleAvatarSuccess(res, file) {
                this.imageUrl = res.image_small

                this.imgUrl_big =   res.image_big
                this.imgUrl_small =   res.image_small
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;


                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }else {
                    if (isJPG || isPNG) {
                      return true
                    }  this.$message.error('上传头像图片只能是 JPG / PNG 格式!');
                }
                return (isJPG && isLt2M) ||  (isJPG && isLt2M)  ;
            }


        }
    }
</script>

<style>


    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }


</style>

