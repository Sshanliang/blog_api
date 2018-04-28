<template>
    <div class="createPost-container">
        <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
            <div class="createPost-main-container">
                <el-form-item style="margin-bottom: 40px;" :label-width="labelWidth" label="标题:" prop="title">
                    <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容" v-model="postForm.title">
                    </el-input>
                    <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
                </el-form-item>
                <el-form-item label="类别"  :label-width="labelWidth" prop="FormData">
                    <el-select v-model="postForm.FormData.main" placeholder="请选择" value-key="name" @change="Select(postForm.FormData.main)">
                        <el-option
                                v-for="(item,index)  in postForm.FormData"
                                v-if="index>3"
                                :key="index"
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
                    <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容" v-model.number="postForm.sort">
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





                <div style="margin-bottom: 20px;">
                    <!--<Upload v-model="postForm.image_uri"></Upload>-->
                </div>

                <el-button v-loading="loading" style="margin-left: 45px;margin-top: 50px;" type="success" @click="submitForm()">发布</el-button>

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
            const validateSourceUri = (rule, value, callback) => {
                if (value) {
                    if (validateURL(value)) {
                        callback()
                    } else {
                        this.$message({
                            message: '外链url填写不正确',
                            type: 'error'
                        })
                        callback(null)
                    }
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
                imageUrl:'',
                imgUrl:'',
                imgUrl_big:'',
                imgUrl_small :'',
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


                }
            }
        },
        computed: {

        },
        created() {

            this.ArticleAllData()
            this.Session()
            this.MenuOneData()

        },
        methods: {
            Select(num){
                console.log(num.id)
                this.articleID= num.id;
            },

            Session(){
                let UpdateID = this.$router.currentRoute.params.id
                let UpdatePath = this.$router.currentRoute.params.path
                let Path = this.$router.currentRoute.params.add
                if(!UpdateID){
                    UpdateID = window.sessionStorage.getItem('UpdateID')
                    UpdatePath = window.sessionStorage.getItem('UpdatePath')
                    Path = window.sessionStorage.getItem('Path')
                }
                window.sessionStorage.setItem('UpdateID',UpdateID)
                window.sessionStorage.setItem('UpdatePath',UpdatePath)
                window.sessionStorage.setItem('Path',Path)
                this.UpdateID = UpdateID
                this.UpdatePath = UpdatePath
                this.Path = Path
            },

//            数据获取
            MenuOneData() {

                let scope = this.UpdateID
                this.$api.get("article/"+scope, null, (success) => {
                        this.postForm.title= success.title
                        this.postForm.content=success.title_content
                        this.postForm.title_img=success.title_img
                        this.postForm.content_short=success.title_text
                        this.postForm.sort= success.sort
                        this.imageUrl = success.title_img_small
                    }
                )
            },
            //     获取数下拉框
            ArticleAllData() {
                this.$api.get('menu/all', null, (success) => {
                    console.log(typeof success)
                        this.listLoading = false
                        this.MenuData = success
                        let arr = this.MenuData
                        let arr1=[]
                        for (let i=0;i<arr.length;i++){
                            arr1[i] = arr[i].name
                        }
                        this.postForm.FormData = success;
                    }
                )
            },
            submitForm() {
                    console.log(this.postForm.sort)
                this.$refs.postForm.validate(valid=>{
                    if (valid){
                        let imgURl_big = this.imgUrl_big

                         let imgUrl_small = this.imgUrl_small
                        let articleID = this.articleID
                        let title = this.postForm.title
                        let content_short = this.postForm.content_short
                        let content = this.postForm.content
                        let sort = this.postForm.sort
                        let id = this.UpdateID


                        if(!articleID){
                            this.$message({
                                message: '警告，请选择类别',
                                type: 'error',
                                center: true,
                                duration: 1000

                            });
                            return false
                        }
                       if(!imgUrl_small){
                           imgUrl_small =  this.imageUrl
                           imgURl_big = this.postForm.title_img

                       }

                        this.$api.post("article/update", {
                                'parent_id':articleID,
                                "title":title,
                                "title_img":imgURl_big,
                                "title_img_small":imgUrl_small,
                                'title_text':content_short,
                                'title_content':content,
                                "sort":sort,
                                'id':id,
                            }, (success) => {
                                if(success){
                                    let that = this
                                    this.$message({
                                        message:'恭喜你，修改成功',
                                        type: 'success',
                                        center: true,
                                        duration: 1000,
                                        onClose:function () {

                                            that.$router.push({ path:that.UpdatePath })

                                        }
                                    });




                                }
                            },(fail) => {
                                console(fail)
                            }
                        )

                    }else {
                        this.$message({
                            message:'验证失败',
                            type: 'success',
                            center: true,
                            duration: 1000,

                        });
                    }
                })








//                this.$refs.postForm.validate(valid => {
//                    if (valid) {
//                        this.loading = true
//                        this.$notify({
//                            title: '成功',
//                            message: '发布文章成功',
//                            type: 'success',
//                            duration: 2000
//                        })
//                        this.postForm.status = 'published'
//                        this.loading = false
//                    } else {
//                        console.log('error submit!!')
//                        return false
//                    }
//                })
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
            draftForm() {
                if (this.contentShortLength === 0 || this.contentShortLength === 0) {
                    this.$message({
                        message: '请填写必要的标题和内容',
                        type: 'warning'
                    })
                    return
                }
                this.$message({
                    message: '保存成功',
                    type: 'success',
                    showClose: true,
                    duration: 1000
                })

            },
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw)
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

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/mixin.scss";
    .title-prompt{
        position: absolute;
        right: 0px;
        font-size: 12px;
        top:10px;
        color:#ff4949;
    }
    .createPost-container {
        position: relative;
    .createPost-main-container {
        padding: 40px 45px 20px 50px;
    .postInfo-container {
        position: relative;
    @include clearfix;
        margin-bottom: 10px;
    .postInfo-container-item {
        float: left;
    }
    }
    .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
    .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
    .editor-upload-btn {
        display: inline-block;
    }
    }
    }
    }
    .word-counter {
        width: 40px;
        position: absolute;
        right: -10px;
        top: 0px;
    }
    }
</style>

