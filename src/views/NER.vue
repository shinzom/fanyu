<template>
    <div class="main_container">
        <el-card style="margin-left: 20px; width: 98%; height: auto;">
            <div style="margin-top: 1vh;">
                <el-button type="success" style="width: 110px; margin-left: 60%; border-radius: 10px"
                    @click="handleNER">
                    实体识别
                </el-button>
                <el-button type="info" style="width: 110px; margin-left: 20px; border-radius: 12px" @click="resetpage">
                    重<span v-html="'\u00a0\u00a0\u00a0\u00a0'" />置
                </el-button>
            </div>

            <div id="textarea" style="margin-top: 2vh">
                <el-input v-model="input" placeholder="请输入文本进行命名实体识别..." type="textarea"
                    style="outline: none; border-style: none; width: 100%;" :rows="6" />
            </div>
        </el-card>

        <el-card v-if="highlightedText" style="margin-left: 20px; width: 97%; margin-top: 2vh;">
            <div>
                <span style="font-weight: bold">命名实体识别结果：</span>
                <p v-html="highlightedText" style="margin-top: 1vh; line-height: 1.8;"></p>
            </div>
        </el-card>
    </div>
    <el-card v-if="Object.keys(typeColorMap).length > 0" style="margin-left: 20px; width: 97%; margin-top: 2vh;">
        <div>
            <span style="font-weight: bold">实体类型图例：</span>
            <div style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 10px;">
                <div v-for="(color, type) in typeColorMap" :key="type" :style="{
                    backgroundColor: color,
                    padding: '4px 8px',
                    borderRadius: '4px',
                    color: '#000',
                }">
                    {{ type }}
                </div>
            </div>
        </div>
    </el-card>
</template>

<script>
import { nerextract } from "@/utils/api";
export default {
    name: "NER",
    data() {
        return {
            input: "",
            nerResult: [],
            highlightedText: "",
            typeColorMap: {}, // 存储每种类型对应的颜色
        };
    },
    methods: {
        getRandomColor() {
            const getBrightComponent = () => {
                // 生成一个高于 128 的分量，范围大约在 128 - 255 之间
                return Math.floor(Math.random() * 128) + 128;
            };

            const r = getBrightComponent();
            const g = getBrightComponent();
            const b = getBrightComponent();

            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        },
        handleBeforeUpload(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.input = e.target.result;
            };
            reader.readAsText(file, "UTF-8");
            return false;
        },
        handleNER() {
            if (!this.input.trim()) {
                this.$message.warning("请输入文本！");
                return;
            }

            const requestBody = {
                sentences: [this.input],
            };
            nerextract(requestBody)
                .then((res) => {
                    console.log('NER识别结果:', res);
                    res = res.data
                    const entities = Array.isArray(res) && Array.isArray(res[0]) ? res[0] : [];
                    this.nerResult = entities;
                    this.highlightEntities(this.input, entities);
                })
                .catch((err) => {
                    console.error('NER接口调用失败:', err);
                    this.$message.error("识别失败！");
                });
        },
        highlightEntities(text, entities) {
            const chars = text.split('');
            entities.sort((a, b) => b.start - a.start);

            entities.forEach((entity) => {
                const { start, end, type, text: entityText } = entity;

                // 如果该类型没颜色，生成并保存一个
                if (!this.typeColorMap[type]) {
                    this.typeColorMap[type] = this.getRandomColor();
                }

                const color = this.typeColorMap[type];

                const span = `<span 
      title="${type}" 
      style="background-color: ${color}; padding: 2px 4px; border-radius: 4px; cursor: pointer;"
    >${entityText}</span>`;

                chars.splice(start, end - start, span);
            });

            this.highlightedText = chars.join('');
        },
        resetpage() {
            this.input = "";
            this.highlightedText = "";
            this.nerResult = [];
        },
    },
};
</script>

<style scoped>
.main_container {
    height: 100%;
    width: 98%;
    margin-top: 20px;
    position: relative;
}

td {
    padding: 12px;
}

p {
    word-break: break-word;
    white-space: pre-wrap;
}
</style>