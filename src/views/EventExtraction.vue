<template>
  <div class="main_container">
    <el-card style="margin-left: 20px; width: 98%;height: 25vh;">
      <div style="margin-top: 1vh;">
      <el-button
        type="primary"
        style="width: 110px; margin-left: 60%; border-radius: 10px"
        @click="handleresult"
      >
        抽<span v-html="'\u00a0\u00a0\u00a0\u00a0'" />取
      </el-button>
      <el-button
        type="primary"
        style="width: 110px; margin-left: 20px; border-radius: 12px"
        @click="resetpage"
      >
        重<span v-html="'\u00a0\u00a0\u00a0\u00a0'" />置
      </el-button>
      <div style="float: right">
        <el-upload
          class="upload-demo"
          action=""
          :limit="1"
          :before-upload="handleBeforeUpload"
          style="width: 170px"
          accept=".txt"
        >
          <el-button round style="width: 150px">文件读取</el-button>
        </el-upload>
      </div>
    </div>

      <div id="textarea" style="margin-top: 2vh">
        <el-input
          v-model="input"
          placeholder="请输入抽取文本内容..."
          type="textarea"
          style="outline: none; border-style: none; width: 100%;"
          :rows="4"
        />
      </div>
    </el-card>

    <el-card
      style="
        margin-left: 20px;
        width: 150px;
        margin-top: 2vh;
        text-align: center;
        height:5vh;
        display: flex;
        flex-direction: column;
        align-items:center;
        justify-content:center;
      "
    >
    <span>抽取结果</span>
      </el-card>
    <div
      id="reslutcontainer"
      style="width: 97%; margin-left: 20px;"
    >
      <div v-for="(i, index) in data" :key="index">
        <el-card class="box-card">
          <el-carousel :interval="5000" v-show="resultkey" style="height: 44vh;" indicator-position="none">
            <!-- 使用 el-carousel-item 来包裹每一个 data 数组中的元素 -->
            <el-carousel-item v-for="(item, aindex) in i.analyse" :key="aindex" style="height: auto;">
              <span style="margin-left: 1%"><b>句子成分分析</b></span
              ><br />
              <table
                border="1"
                width="97%"
                height="5%"
                style="
                  border-collapse: collapse;
                  table-layout: fixed;
                  margin: 0.5%;
                "
                cellspacing="2"
              >
                <tr>
                  <td colspan="1" style="background-color: rgb(244, 244, 244)">
                    提取句子
                  </td>
                  <td colspan="8">{{ item.extract }}</td>
                </tr>
                <tr>
                  <td colspan="1" style="background-color: rgb(244, 244, 244)">
                    主语
                  </td>
                  <td colspan="2">{{ item.zhu }}</td>
                  <td style="background-color: rgb(244, 244, 244)">谓语</td>
                  <td colspan="2">{{ item.wei }}</td>
                  <td style="background-color: rgb(244, 244, 244)">宾语</td>
                  <td colspan="2">{{ item.bing }}</td>
                </tr>
                <tr>
                  <td colspan="1" style="background-color: rgb(244, 244, 244)">
                    时间
                  </td>
                  <td colspan="2">{{ item.time }}</td>
                  <td style="background-color: rgb(244, 244, 244)">地点</td>
                  <td colspan="2">{{ item.address }}</td>
                  <td style="background-color: rgb(244, 244, 244)">事件序号</td>
                  <td colspan="2">{{ item.index }}</td>
                </tr>
              </table>

              <span style="margin-left: 1%"><b>事件</b></span
              ><br />
              <table
                border="1"
                width="90%"
                height="5%"
                style="
                  border-collapse: collapse;
                  table-layout: fixed;
                  margin: 0.5%;
                "
                cellspacing="2"
              >
                <tr>
                  <td colspan="2" style="background-color: rgb(244, 244, 244)">
                    事件类型
                  </td>
                  <td colspan="3">{{ i.trigger[aindex].type }}</td>
                  <td style="background-color: rgb(244, 244, 244)">触发词</td>
                  <td colspan="2">{{ i.trigger[aindex].word }}</td>
                </tr>
                <tr />
              </table>
              <span style="margin-left: 1%"><b>论元</b></span
              ><br />
              <table
                v-if="i.lunyuan[aindex]"
                border="1"
                width="90%"
                height="5%"
                style="
                  border-collapse: collapse;
                  table-layout: fixed;
                  margin: 0.5%;
                "
                cellspacing="2"
              >
                <tr
                  v-for="(lunyuanItem, lunyuanIndex) in Object.keys(
                    i.lunyuan[aindex]
                  )"
                  :key="lunyuanIndex"
                >
                  <td colspan="2" style="background-color: rgb(244, 244, 244)">
                    {{ lunyuanItem }}
                  </td>
                  <td colspan="3">{{ i.lunyuan[aindex][lunyuanItem] }}</td>
                </tr>
                <tr />
              </table>
            </el-carousel-item>
          </el-carousel>
        </el-card>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import Add from "../components/Add/index.vue";
import SwitchRoles from "@/views/permission/components/SwitchRoles.vue";
// import * as Driver from "driver.js";
import { eventextract} from "../utils/api";

export default {
  name: "Guide",
  components: { Add, SwitchRoles },
  data() {
    return {
      input: "",
      searchmethod: "",
      iplanguage: "",
      dialogVisible: false,
      keywordinput: "",
      keyword: "",
      searchtime: {
        starttime: "",
        endtime: "",
      },
      urls: [],
      value: "",
      currentpage: 1,
      offset: 5,
      totalNum: 0,
      driver: null,
      tableSavePreview: false,
      multipleSelection: [],
      historyData: [],
      tableData: [
        {
          date: "2016-05-02",
          text: "第一页",
          sentence: "上海市普陀区金沙江路 1518 弄",
        },
      ],
      sentencetabledata: [],
      eventtabledata: [],
      tablekey: true,
      resultkey: false,
      checkContentData: [], //,
      dialogData: [], // 弹窗数据
      data: [],
      json_fields: {
        时间: "check_time",
        内容: "content",
      },
      exportJson: [],
    };
  },
  computed: {},
  created() {},
  // mounted() {
  //   this.driver = new Driver.driver();
  // },

  methods: {
    handleBeforeUpload(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.input = e.target.result;
      };
      reader.readAsText(file, "UTF-8");
      return false;
    },
    getRowKeys(row) {
      return row.id;
    },
    // guide() {
    //   this.driver.defineSteps(steps);
    //   this.driver.start();
    // },
    handleClick(row) {},
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    handleSizeChange(val) {
      this.currentpage = 1;
      this.offset = val;
    },
    handleCurrentChange(val) {
      this.currentpage = val;
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    exportExcelSelect() {
      if (this.multipleSelection.length < 1) {
        this.$message.error("请选择要导出的内容！");
        return false;
      } else {
        this.$message({
          message: "导出成功！",
          type: "success",
        });
      }
      // this.tableSavePreview = true
    },

    exportExcel() {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleresult() {
      this.tablekey = false;
      this.resultkey = true;
      const requstbody = {
        event_article: this.input, // 用户输入需要请求的文章
        user_id: "234", // 用户id根据登录需要调整
      };
      console.log(requstbody);
      eventextract(requstbody).then(
        // 文章抽取请求，这个检索的接口
        // 能进到这里说明检索成功了
        (response) => {
          console.log(response);
          const responsedata = response;
          if (responsedata.length === 0) {
            this.$message({
              message: "没有抽取到信息",
              type: "warning",
            });
          }
          const a = [];
          responsedata.forEach((item) => {
            if (
              item["sentence_component"].length > 0 ||
              item["event_trigger"].length > 0
            ) {
              a.push(item);
            }
          });
          const a2 = [];
          a.forEach((item) => {
            const obj = {
              analyse: item["sentence_component"],
              trigger: item["event_trigger"],
            };
            a2.push(obj);
          });
          const a3 = [];
          a2.forEach((item) => {
            const arr = {
              analyse: [],
              trigger: [],
              lunyuan: [],
            };
            item.analyse.forEach((i) => {
              const data = {};
              data.extract = i["sentence"];
              data.zhu = i["subject"];
              data.wei = i["verb"];
              data.bing = i["object"];
              data.time = i["time"];
              data.address = i["place"];
              data.index = i["index"];
              arr.analyse.push(data);
            });
            item.trigger.forEach((i) => {
              const data2 = {};
              data2.type = i["event_type"];
              data2.word = i["trigger"];
              data2.index = i["index"];
              arr.trigger.push(data2);
              if (JSON.parse(i["lunyuan"] != "{}")) {
                arr.lunyuan.push(i["items"]);
              }
            });
            a3.push(arr);
          });

          this.data = a3;
          console.log(this.data);
        }
      );
      this.input = "";
    },
    resetpage() {
      this.input = "";
      this.tablekey = true;
      this.resultkey = false;
    },
    tabledataload() {
      const body = {
        // 历史记录请求 根据需要调整请求体
        user_id: "234", //
      };
    },
    GMTToStr(time) {
      const date = new Date(time);
      const Str =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds();
      return Str;
    },
  },
};
</script>

<style lang="less" scoped>
td {
  padding: 12px;
}

#texttitle {
  height: 4%;
  width: 9%;
  margin-left: 1%;
  border: 0.0625rem solid;
  padding: 1%;
}

.main_container {
  height: 100%;
  width: 98%;
  margin-top: 20px;
  position: relative;
}

.top_card {
  height: 140px;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 20px;
  position: center;
}

.bottom_card {
  height: 800px;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 20px;
}
</style>
