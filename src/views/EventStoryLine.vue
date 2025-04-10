<template>
  <el-container class="main">
    <el-main>
      <div style="display: flex; flex-direction: column; align-items: center">
        <!-- 菜单 -->
        <el-card style="width: 98%; height: 25vh">
          <div
            style="
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
            "
          >
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              "
            >
              <div
                style="
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: center;
                "
              >
                <span>请输入id：</span>
                <el-input
                  v-model="id"
                  style="width: 180px"
                  placeholder="请输入id"
                  clearable
                />
                <span style="margin-left: 35px">请输入主题事件名称：</span>
                <el-input
                  v-model="topic"
                  style="width: 180px"
                  placeholder="请输入主题事件名称"
                  clearable
                />
              </div>
              <el-input
                v-model="summary"
                type="textarea"
                style="width: 110vh; margin-top: 10px"
                :autosize="{ minRows: 3, maxRows: 5 }"
                placeholder="请输入主题事件摘要"
                clearable
              />
            </div>
            <el-divider
              direction="vertical"
              style="height: 20vh; margin-left: 5vh; margin-right: 5vh"
            />
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 240px;
              "
            >
              <el-upload
                class="upload-demo"
                ref="upload"
                :auto-upload="false"
                :file-list="uploadFiles"
                :on-change="loadJsonFromFile"
                style="width: 240px"
                accept=".jsonl"
              >
                <el-button
                  style="width: 240px; height: 40px; background-color: #bfe4fd"
                  slot="trigger"
                  round
                  >上传文件
                  <svg
                    t="1743506667903"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="4591"
                    width="18"
                    height="18"
                  >
                    <path
                      d="M925.4 640.45a34.61 34.61 0 0 0-34.6 34.6v195.4a20.63 20.63 0 0 1-20.6 20.6H153.7a20.63 20.63 0 0 1-20.6-20.6V675a34.55 34.55 0 1 0-69.1 0v222.9a62.16 62.16 0 0 0 
                      62.1 62.1h771.8a62.16 62.16 0 0 0 62.1-62.1V675a34.59 34.59 0 0 0-34.6-34.55zM488.5 74.15a34.77 34.77 0 0 1 49 0l155.8 155.9A34.54 34.54 0 1 1 644.5 
                      279l-96.9-96.9v577.8a34.6 34.6 0 1 1-69.2 0V182.05L381.5 279a34.58 34.58 0 0 1-48.9-48.9z"
                      p-id="4592"
                      fill="#515151"
                    ></path>
                  </svg>
                </el-button>
              </el-upload>

              <el-button
                style="width: 240px; height: 40px; border-radius: 15px"
                type="primary"
                @click="submitUpload"
                >开始分析
              </el-button>
            </div>
          </div>
        </el-card>

        <!-- 结果表格 -->
        <el-card style="width: 98%; margin-top: 10px;height:55vh;">
          <el-tabs v-model="activeName" class="demo-tabs">
            <!-- 多角度事件发展脉络 -->
            <el-tab-pane label="多角度事件发展脉络" name="first">
              <el-table :data="classifiedTableData" style="height: 44vh;">
                <el-table-column
                  v-for="(value, key) in classifiedTableData[0]"
                  :key="key"
                  :prop="key"
                  :label="key"
                  width="240"
                >
                  <template #default="{ row }">
                    <span>
                      <template
                        v-for="(item, index) in row[key].split(',')"
                        :key="index"
                      >
                        <span
                          v-if="index === 0"
                          :style="{ display: 'block' }"
                          >{{ item }}</span
                        >
                        <span
                          v-if="index === 1"
                          :style="{ display: 'block' }"
                          >{{ item }}</span
                        >
                        <!-- <span v-else-if="item.includes(']')">
                          <template
                            v-for="(num, numIndex) in item
                              .replace(']', '')
                              .split(',')"
                            :key="numIndex"
                          >
                            <el-button
                              @click="handleClick(num.trim())"
                              text
                              size="small"
                              >{{ num.trim() }}</el-button
                            >
                            <span
                              v-if="
                                numIndex !==
                                item.replace(']', '').split(',').length - 1
                              "
                              >,</span
                            >
                          </template>
                        </span>
                        <span v-else> ,{{ item }} </span> -->
                      </template>
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <!-- 总事件发展脉络 -->
            <el-tab-pane label="总事件发展脉络" name="second">
              <el-scrollbar height="44vh">
                <div
                  style="display: flex; flex-direction: row; margin-left: 20px"
                >
                  <div
                    v-for="(stage, index) in stageColors"
                    :key="index"
                    style="display: flex; flex-direction: row"
                  >
                    <div
                      class="stage-name"
                      :style="{
                        color: stage.color,
                        width: `245px`,
                      }"
                    >
                      {{ stage.name }}
                    </div>
                    <div
                      v-if="
                        index !==
                        Object.keys(stageColors)[
                          Object.keys(stageColors).length - 1
                        ]
                      "
                      style="width: 78px; height: 19.2px"
                    ></div>
                  </div>
                </div>
                <div
                  class="line-chart"
                  style="
                    display: flex;
                    flex-direction: row;
                    align-items: flex-start;
                  "
                >
                  <div
                    v-for="(stage, index) in lineData"
                    :key="index"
                    style="
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                      align-items: flex-start;
                    "
                  >
                    <div
                      class="stage"
                      :style="{ color: stageColors[index].color }"
                    >
                      <div class="events">
                        <div
                          v-for="(event, eventIndex) in stage.events"
                          :key="eventIndex"
                          :class="
                            eventIndex === 0 ? 'root-event' : 'branch-event'
                          "
                        >
                          <div v-if="eventIndex === 0">
                            <div style="height: 35px"></div>
                            <el-scrollbar
                              height="90px"
                              style="
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                height: 90px;
                              "
                            >
                              <span>{{ event.content }}</span>
                              <br />
                              <span>{{ event.time }}</span>
                            </el-scrollbar>
                            <div style="height: 5px"></div>
                          </div>
                          <div v-else>
                            <div
                              style="
                                border: 2px solid #666666;
                                border-radius: 5px;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                              "
                            >
                              <span>{{ event.content }}</span>
                              <span>{{ event.time }}</span>
                            </div>
                          </div>
                          <div
                            class="arrowDown"
                            v-if="eventIndex < stage['events'].length - 1"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div class="arrow" v-if="index < lineData.length - 1"></div>
                  </div>
                </div>
              </el-scrollbar>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import axios from "axios";
import { getstoryline } from "../utils/api";
export default {
  data() {
    return {
      id: null, //唯一id
      topic: null, //主题事件名称
      summary: null, //主题事件摘要
      uploadFiles: [], //上传文件列表
      activeName: "first", //选中标签页
      classifiedData: [], //多角度事件发展脉络的后端返回数据
      classifiedTableData: [], //多角度事件发展脉络的表格展示数据
      lineData: [], //总事件发展脉络的后端返回数据
      stageColors: {}, //阶段名称相同的节点字体颜色
    };
  },
  methods: {
    //上传文件onChange钩子函数
    loadJsonFromFile(file, fileList) {
      this.uploadFiles = [file];
    },
    submitUpload() {
      let file = null;
      if (this.uploadFiles[0] == null) {
        this.$message.error("请上传文件");
      } else {
        file = this.uploadFiles[0].raw; //这里获取上传的文件对象
      }

      //上传文件的需要formdata类型;所以要转
      let formData = new FormData();
      formData.append("id", this.id);
      formData.append("topic", this.topic);
      formData.append("summary", this.summary);
      formData.append("file", file);
      if (this.id == null || this.topic == null || this.summary == null) {
        this.$message.error("请输入相关内容");
      } else {
        getstoryline(formData)
          .then((res) => {
            this.$message("文件分析中........");
            console.log(res);
            if (res.resultinfo == "SUCCESS!") {
              //多角度事件发展脉络的数据处理
              this.classifiedData = res.classified;
              console.log(this.classifiedData);
              let max = 0;
              let maxIndex = -1;
              for (let i = 0; i < this.classifiedData.length; i++) {
                let value = this.classifiedData[i];
                if (value["events"] && value["events"].length > max) {
                  max = value["events"].length;
                  maxIndex = i;
                }
              }

              this.classifiedTableData = [];

              if (maxIndex >= 0) {
                // 确保有有效的 maxIndex
                const keys = this.classifiedData.map((item) => item.classname); // 获取所有 classname 作为键

                // 根据最大 events 数量构建表格数据
                for (let index = 0; index < max; index++) {
                  let rowData = {};
                  keys.forEach((key, keyIndex) => {
                    const currentCategoryEvents =
                      this.classifiedData[keyIndex].events;
                    rowData[key] = currentCategoryEvents[index]
                      ? `${currentCategoryEvents[index].content}, ${currentCategoryEvents[index].time}`
                      : ""; // 如果当前 index 没有对应的 event，则设为空字符串
                  });
                  this.classifiedTableData.push(rowData);
                }
              }

              //总事件发展脉络的数据处理
              this.lineData = res.line;

              this.stageColors = {};
              let index = 0; // 引入计数器变量

              this.lineData.forEach((stage) => {
                const randomColor = this.getRandomColor();
                this.stageColors = Object.assign({}, this.stageColors, {
                  [index]: {
                    // 使用计数器作为键
                    color: randomColor,
                    count: stage.events.length,
                    name: stage.phasename,
                  },
                });
                index++; // 计数器递增
              });
              console.log(this.lineData);
              console.log(this.stageColors);
            } else {
              this.$message({
                showClose: true,
                message: "失败",
                type: "error",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    //随机生成颜色
    getRandomColor() {
      const minBrightness = 20; // 最小亮度值
      const maxBrightness = 150; // 最大亮度值
      const randomChannel = () =>
        Math.floor(Math.random() * (maxBrightness - minBrightness + 1)) +
        minBrightness;
      const r = randomChannel();
      const g = randomChannel();
      const b = randomChannel();

      return `rgb(${r}, ${g}, ${b})`;
    },
  },
};
</script>

<style>
.main {
  width: 100%;
}

/* 头部布局*/
.el-header {
  color: #0b0435;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  margin: 0 auto;
  position: absolute;
}

/* 标题 */
.title {
  color: #01040c;
  display: flex;
  height: 50px;
  justify-content: space-between;
  margin: 0 auto;
  font-size: 35px;
}

.stage {
    display: flex;
    align-items: center;
    margin-left: 20px;
}

.stage-name {
    font-weight: bold;
    text-align: center;

}

/* 根节点 */
.root-event {
    border: 2px solid #666666;
    border-radius: 45%;
    padding: 5px;
    margin-top: 10px;
    margin-bottom:60px;
    width: 230px;
    height: 120px;
    text-align: center;
    font-size: 14px;

}

/* 子节点 */
.branch-event {
    padding: 5px;
    margin-top: 5px;
    width: 230px;
    height: auto;
    text-align: center;
    font-size: 14px;
}

/* 向右箭头 */
.arrow {
    position: relative;
    width: 50px;
    height: 20px;
    background-color: #666666;
    margin-left: 10px;
    margin-top: 70px;
}

.arrow::after {
    content: "";
    position: absolute;
    top: -10px;
    right: -10px;
    width: 0;
    height: 0;
    border-top: 20px solid transparent;
    border-bottom: 20px solid transparent;
    border-left: 20px solid #666666;
}

/* 向下箭头 */
.arrowDown {
    position: relative;
    width: 15px;
    height: 35px;
    background-color: #666666;
    margin-left: 110px;
    margin-top: 5px;
}

.arrowDown::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: -13px;
    width: 0;
    height: 0;
    border-top: 20px solid #666666;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
}
</style>
