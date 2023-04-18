<template>
  <!-- 表头设置和表的边框-->
  <div>
    <div style="margin-left: 5px;margin-bottom: 20px">
      <!--    回车设置-->
<!--      //此处需改-->
      <el-input v-model="studentId" placeholder="请输入学生学号" style="width: 200px;"
                @keyup.enter.native="loadPost">

      </el-input>

      <el-button type="primary" style="margin-left: 5px;" @click="loadPost">查询</el-button>
      <el-button type="success " @click="resetForm">重置</el-button>
      <el-button type="success " @click="add" v-if="user.roleId===0">新增</el-button>
    </div>
    <el-table :data="tableData.filter(v => v.teacherId == (user.userTeaId == null ? v.teacherId : user.userTeaId))"
              :header-cell-style="{background: '#f2f5fc',color:'#555555'}"

    >

      <el-table-column prop="studentId" label="学生" width="180">


        <template v-slot="scope">
            <span v-if="scope.row.studentId">
              {{studentData.find(v =>v.studentNumber==scope.row.studentId).studentName}}

            </span>

        </template>
      </el-table-column>

      <el-table-column prop="teacherId" label="课程" width="180">

        <template v-slot="scope">
            <span v-if="scope.row.teacherId">
              {{courseData.find(v =>v.courseTeacherId==scope.row.teacherId).courseName}}

            </span>
        </template>
      </el-table-column>
      <el-table-column prop="classId" label="班级" width="180">

        <template v-slot="scope">
            <span v-if="scope.row.classId">
              {{classData.find(v =>v.classId==scope.row.classId).className}}

            </span>

        </template>
      </el-table-column>
      <el-table-column prop="teacherId" label="教师" width="180">

        <template v-slot="scope">
            <span v-if="scope.row.teacherId">
              {{teacherData.find(v =>v.teacherId==scope.row.teacherId).teacherName}}
            </span>
        </template>
      </el-table-column>

      <el-table-column prop="usualScore" label="平时成绩" width="180" v-if="user.roleId===1">
      </el-table-column>
      <el-table-column prop="finalScore" label="期末成绩" width="180" v-if="user.roleId===1">
      </el-table-column>


      <el-table-column prop="allScore" label="总成绩" width="180"  v-if="user.roleId===1">
      </el-table-column>




      <el-table-column prop="operate" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="success" @click="mod(scope.row)" v-if="user.roleId===1"> 打分</el-button>

          <el-popconfirm
              confirm-button-text='好的'
              cancel-button-text='不用了'
              icon="el-icon-info"
              icon-color="red"
              title="确定删除吗？"
              @confirm="del(scope.row.id)"
              style="margin-left: 15px"
          >
            <el-button slot="reference" type="danger" v-if="user.roleId===0">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[7, 14, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
    <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
      <el-form ref="form" :model="form" label-width="180px">


        <el-form-item label="课程"   label-width="180px"  v-if="user.roleId===0">
          <el-col :span="20">
            <el-select v-model="form.teacherId" placeholder="请选择课程" style="margin-left: 5px">
              <el-option
                  v-for="item in courseData"
                  :key="item.courseTeacherId"
                  :label="item.courseName"
                  :value="item.courseTeacherId">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="班级"   label-width="180px"  v-if="user.roleId===0">
          <el-col :span="20">
            <el-select v-model="form.classId" placeholder="请选择班级" style="margin-left: 5px">
              <el-option
                  v-for="item in classData"
                  :key="item.classId"
                  :label="item.className"
                  :value="item.classId">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="学生"   label-width="180px"   v-if="user.roleId===0">
          <el-col :span="20">
            <el-select v-model="form.studentId" placeholder="请选择学生" style="margin-left: 5px">
              <el-option
                  v-for="item in studentData" v-show="item.classId === form.classId"
                  :key="item.studentNumber"
                  :label="item.studentName"
                  :value="item.studentNumber">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="平时成绩"   label-width="180px"  v-if="user.roleId===1">
          <el-col :span="20">
            <el-input v-model="form.usualScore"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="期末成绩"  label-width="180px"   v-if="user.roleId===1">
          <el-col :span="20">
            <el-input v-model="form.finalScore"></el-input>
          </el-col>
        </el-form-item>


        <el-form-item label="总成绩"  label-width="180px"  v-if="user.roleId===1" >
          <el-col :span="20">
            <el-input v-model="form.allScore"></el-input>
          </el-col>



        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="save">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "TeacherCourseManage",
  data() {
    return {
      user: JSON.parse(sessionStorage.getItem('CurUser')),
      classData: [],
      teaClassData:[],
      courseData:[],
      tableData: [],
      studentData:[],
      teacherData:[],
      pageSize: 7,
      pageNum: 1,
      total: '',
     studentId:'',
      centerDialogVisible: false,
      form: {
        id:'',
        teacherId: '',
        courseId:'',
        classId: '',
        studentId:'',
        usualScore:'',
        finalScore:'',
        allScore:'',
        scoreId:''



      },



    }
  },
  methods: {

    loadGet() {
      this.$axios.get(this.$httpUrl + '/doScore/list').then(res => res.data).then(res => {

        // this.tableData=res

      })

    },
    del(id){
      this.$axios.get(this.$httpUrl + '/doScore/del?id='+id,
      ).then(res => res.data).then(res => {

        if (res.code === 200) {
          this.$message({
                message: '操作成功',
                type: 'success'
              }
          )
          this.loadPost()
        } else {
          this.$message.error('操作失败');

        }
      })


    },
    mod(row){
      console.log(row)
      this.form.id=row.id
      this.form.teacherId=row.teacherId
      this.form.courseId=row.courseId
      this.form.classId=row.classId
      this.form.studentId=row.studentId
      this.form.usualScore=row.usualScore
      this.form.finalScore=row.finalScore
      this.form.allScore=row.allScore
      this.form.scoreId=row.scoreId
      this.centerDialogVisible = true

    },
    save() {
      console.log(this.form)
      if (this.form.id){
        this.$axios.post(this.$httpUrl + '/doScore/update', this.form
        ).then(res => res.data).then(res => {
          if (this.form.id) {
            this.$message({
                  message: '修改成功',
                  type: 'success'
                }
            )
            this.centerDialogVisible = false
            this.loadPost()
          } else {
            this.$message.error('修改失败');

          }
        })
      }
      else {
        this.$axios.post(this.$httpUrl + '/doScore/save', this.form
        ).then(res => res.data).then(res => {
          console.log(res)
          if (res.code == 200) {
            this.$message({
                  message: '操作成功',
                  type: 'success'
                }
            )
            this.centerDialogVisible = false
            this.loadPost()
          } else {
            this.$message.error('操作失败');

          }
        })
      }

    },
    loadCourse(){
      this.$axios.get(this.$httpUrl + '/course/list').then(res => res.data).then(res => {
        if (res.code ==200) {
          this.courseData = res.data
        } else {
          // alert("获取数据失败")
        }
      })

    },
    loadTeacher(){
      this.$axios.get(this.$httpUrl + '/teacher/list').then(res => res.data).then(res => {
        if (res.code ==200) {
          this.teacherData = res.data
        } else {
          // alert("获取数据失败")
        }
      })

    },
    loadTeaClass(){
      this.$axios.get(this.$httpUrl + '/tea-class/list').then(res => res.data).then(res => {
        if (res.code ==200) {
          this.teaClassData = res.data
        } else {
          // alert("获取数据失败")
        }
      })

    },
    loadClass(){
      this.$axios.get(this.$httpUrl + '/class/list').then(res => res.data).then(res => {
        if (res.code ==200) {
          this.classData = res.data

        } else {
          // alert("获取数据失败")
        }
      })

    },
    loadStudent(){
      this.$axios.get(this.$httpUrl + '/student/list').then(res => res.data).then(res => {
        if (res.code ==200) {
          this.studentData = res.data

        } else {
          // alert("获取数据失败")
        }
      })

    },


    loadPost() {
      this.$axios.post(this.$httpUrl + '/doScore/listPage', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          studentId:this.studentId+''



        }

      }).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {
          sessionStorage.setItem('CurStudent',JSON.stringify(res.data))
          this.tableData = res.data
          this.total = res.total
        } else {
          alert("获取数据失败")
        }
      })

    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageNum = 1
      this.pageSize = val
      this.loadPost()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val
      this.loadPost()
    },
    resetForm() {
       this.studentId=''

    },
    add() {
      this.centerDialogVisible = true
      this.$nextTick(() => {
        this.resetForm();
      })
    }
  },
  beforeMount() {
    this.loadTeaClass()
    this.loadTeacher();
    this.loadStudent();
    this.loadCourse();
    this.loadClass();
    this.loadPost()
  }
}

</script>

<style scoped>

</style>