<template>
    <div class="main_container">
        <el-card style="margin-left: 20px; width: 98%;">
            <div style="margin-top: 10px; display: flex; gap: 20px;">
                <el-upload action="" :before-upload="handlePdfUpload" accept=".pdf" :limit="1">
                    <el-button>上传 PDF</el-button>
                </el-upload>

                <el-upload action="" :before-upload="handleTexUpload" accept=".tex" :limit="1">
                    <el-button>上传 TeX</el-button>
                </el-upload>

                <el-input v-model="arxivid" placeholder="请输入 Arxiv ID" style="width: 200px;" />

                <el-button type="primary" @click="submitParse">抽取作者-机构</el-button>
            </div>

            <div style="margin-top: 20px;">
                <el-tag v-for="(author, index) in authors" :key="index" closable @close="removeAuthor(index)">
                    {{ author }}
                </el-tag>
                <el-input v-model="newAuthor" placeholder="输入作者名后回车添加" @keyup.enter="addAuthor"
                    style="margin-top: 10px; width: 300px;" />
            </div>
        </el-card>

        <el-card v-if="parsed.length > 0" style="margin: 20px;">
            <span style="font-weight: bold;">作者与机构映射：</span>
            <el-table :data="parsed" style="margin-top: 10px;">
                <el-table-column prop="name" label="作者" />
                <el-table-column prop="orgName" label="机构" />
                <el-table-column prop="country" label="国家" />
            </el-table>
        </el-card>
    </div>
</template>

<script>
import { parseauthororg } from "@/utils/api";

export default {
    name: "AuthorOrgExtraction",
    data() {
        return {
            arxivid: "",
            authors: [],
            newAuthor: "",
            pdfFile: null,
            texFile: null,
            parsed: [],
        };
    },
    methods: {
        handlePdfUpload(file) {
            this.pdfFile = file;
            return false;
        },
        handleTexUpload(file) {
            this.texFile = file;
            return false;
        },
        addAuthor() {
            if (this.newAuthor.trim()) {
                this.authors.push(this.newAuthor.trim());
                this.newAuthor = "";
            }
        },
        removeAuthor(index) {
            this.authors.splice(index, 1);
        },
        submitParse() {
            // if (!this.arxivid || !this.pdfFile || !this.texFile || this.authors.length === 0) {
            //     this.$message.warning("请填写完整信息并上传文件");
            //     return;
            // }

            const formData = new FormData();
            formData.append("arxivid", this.arxivid);
            formData.append("pdf", this.pdfFile);
            formData.append("tex", this.texFile);
            this.authors.forEach(author => formData.append("arxiv_authors", author));

            parseauthororg(formData).then((res) => {
                console.log("解析结果：", res.data);
                this.parsed = res.data.rules.IEEEtran_journal || [];
            }).catch(() => {
                this.$message.error("接口请求失败");
            });
        },
    },
};
</script>
<style scoped>
.main_container {
    margin: 20px;
}
</style>
