<template>


  <div>
<!--    <div style="font-size: 24px;margin: 10px 0">班级:{{classData.className}}</div>-->
    <div style="margin-left: 5px;margin-bottom: 20px">
      <!--    回车设置-->
      <el-select v-model="classId" placeholder="请选择班级" style="margin-left: 5px">
        <el-option
            v-for="item in class1Data"
            :key="item.classId"
            :label="item.className"
            :value="item.classId">
        </el-option>
      </el-select>

      <el-button type="primary" style="margin-left: 5px;" @click="loadClassTable">查询</el-button>
    </div>



    <el-table border stripe :data="tableData" :header-cell-class-name="'headerBy'">
      <el-table-column label="时间/课程">
        <template v-slot="scope">
          <div v-if="scope.row.section">
            <div style="margin: 10px 0;color: brown" >{{scope.row.section.num}}</div>
            <div style="margin: 10px 0;color: brown">{{scope.row.section.time}}</div>
          </div>

        </template>
      </el-table-column>
      <el-table-column label="周一">
        <template v-slot="scope">
          <div v-if="scope.row.mon">
            <div style="margin: 10px 0">{{scope.row.mon.courseName}}</div>
            <div style="margin: 10px 0">{{scope.row.mon.room}}</div>
            <div style="margin: 10px 0">

            <span v-if="scope.row.mon.courseTeacherId">
              {{teacherData.find(v =>v.teacherId==scope.row.mon.courseTeacherId).teacherName}}

            </span>


            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="周二">
        <template v-slot="scope">
          <div v-if="scope.row.tue">
            <div style="margin: 10px 0">{{scope.row.tue.courseName}}</div>
            <div style="margin: 10px 0">{{scope.row.tue.room}}</div>
            <div style="margin: 10px 0">
             <span v-if="scope.row.tue.courseTeacherId">
              {{teacherData.find(v =>v.teacherId==scope.row.tue.courseTeacherId).teacherName}}

            </span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="周三">
        <template v-slot="scope">
          <div v-if="scope.row.wes">
            <div style="margin: 10px 0">{{scope.row.wes.courseName}}</div>
            <div style="margin: 10px 0">{{scope.row.wes.room}}</div>
            <div style="margin: 10px 0">
               <span v-if="scope.row.wes.courseTeacherId">
              {{teacherData.find(v =>v.teacherId==scope.row.wes.courseTeacherId).teacherName}}

            </span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="周四">
        <template v-slot="scope">
          <div v-if="scope.row.thu">
            <div style="margin: 10px 0">{{scope.row.thu.courseName}}</div>
            <div style="margin: 10px 0">{{scope.row.thu.room}}</div>
            <div style="margin: 10px 0">
               <span v-if="scope.row.thu.courseTeacherId">
              {{teacherData.find(v =>v.teacherId==scope.row.thu.courseTeacherId).teacherName}}

            </span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="周五">
        <template v-slot="scope">
          <div v-if="scope.row.fri">
            <div style="margin: 10px 0">{{scope.row.fri.courseName}}</div>
            <div style="margin: 10px 0">{{scope.row.fri.room}}</div>
            <div style="margin: 10px 0">
               <span v-if="scope.row.fri.courseTeacherId">
              {{teacherData.find(v =>v.teacherId==scope.row.fri.courseTeacherId).teacherName}}

            </span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="周六">
        <template v-slot="scope">
          <div v-if="scope.row.sat">
            <div style="margin: 10px 0">{{scope.row.sat.courseName}}</div>
            <div style="margin: 10px 0">{{scope.row.sat.room}}</div>
            <div style="margin: 10px 0">
               <span v-if="scope.row.sat.courseTeacherId">
              {{teacherData.find(v =>v.teacherId==scope.row.sat.courseTeacherId).teacherName}}

            </span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="日">
        <template v-slot="scope">
          <div v-if="scope.row.sun">
            <div style="margin: 10px 0">{{scope.row.sun.courseName}}</div>
            <div style="margin: 10px 0">{{scope.row.sun.room}}</div>
            <div style="margin: 10px 0">
               <span v-if="scope.row.sun.courseTeacherId">
              {{teacherData.find(v =>v.teacherId==scope.row.sun.courseTeacherId).teacherName}}

            </span>
            </div>
          </div>
        </template>
      </el-table-column>

    </el-table>
  </div>

</template>

<script>
export default {
  name: "CourseTable",
  data(){
    return{
      teacherData:[],
      classId:'',
      className:'',
      tableData:[],
      classData: [],
      class1Data:[]

    }
  },
  methods: {
    loadClassTable(){
      this.$axios.post(this.$httpUrl + '/class/listPage', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          className: this.className,
          classId: this.classId+''


        }

      }).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {
          sessionStorage.setItem('CurClass',JSON.stringify(res.data.class))
          // this.tableData = res.data
          this.total = res.total
        } else {
          alert("获取数据失败")
        }
      })


      this.$axios.get(this.$httpUrl + '/class/list?classId='+this.classId).then(res => res.data).then(res => {
        this.classData=res.data

      })
      this.$axios.get(this.$httpUrl + '/class-course/courseTable/'+this.classId).then(res => res.data).then(res => {
        this.tableData=res.data
      })


    },
    loadClass() {
      this.$axios.get(this.$httpUrl + '/class/list').then(res => res.data).then(res => {
        this.class1Data=res.data
        // this.student.studentClass=res.data.className

      })

    },
    loadTeacher() {
      this.$axios.get(this.$httpUrl + '/teacher/list').then(res => res.data).then(res => {
        this.teacherData=res.data

      })

    },



  },
  beforeMount() {
    this.loadTeacher()

    this.loadClass();
  },
  created() {
  }
}
// this.student.classId


</script>

<style>
.headerBy{
  background: #eee!important;
  color: blue;
  font-size: 10px;
}

</style>