<template>
    <div class="main_container">
        <el-card style="margin-left: 20px; width: 98%;">
            <div style="margin-top: 10px; display: flex; gap: 20px;">
                <el-upload action="" :before-upload="handlePdfUpload" accept=".pdf" :limit="1" :show-file-list="false">
                    <el-button type="primary">上传 PDF</el-button>
                </el-upload>

                <!-- 显示已选择的文件名 -->
                <div v-if="pdfFile" class="uploaded-file-info">
                    📄 {{ pdfFile.name }}
                </div>
                <el-upload action="" :before-upload="handleTexUpload" accept=".tex" :limit="1" :show-file-list="false">
                    <el-button type="success">上传 TeX</el-button>
                </el-upload>

                <div v-if="texFile" class="uploaded-file-info">
                    📄 {{ texFile.name }}
                </div>


                <el-input v-model="arxivid" placeholder="请输入 Arxiv ID" style="width: 200px;" />

                <el-button type="primary" @click="submitParse">抽取作者-机构</el-button>
            </div>

            <!-- <div style="margin-top: 20px;">
                <el-tag v-for="(author, index) in authors" :key="index" closable @close="removeAuthor(index)">
                    {{ author }}
                </el-tag>

                <el-input v-model="newAuthor" placeholder="输入作者名" @keyup.enter="addAuthor"
                    style="margin-top: 10px; width: 300px;" clearable>
                    <template #append>
                        <el-button icon="Plus" @click="addAuthor" />
                    </template>
</el-input>
</div> -->
            <div class="author-input-block">
                <div class="author-tags">
                    <el-tag v-for="(author, index) in authors" :key="index" closable @close="removeAuthor(index)">
                        {{ author }}
                    </el-tag>
                </div>

                <el-input v-model="newAuthor" placeholder="输入作者（支持多个作者用分号隔开）" @keyup.enter="addAuthor" clearable>
                    <template #append>
                        <el-button icon="Plus" @click="addAuthor" />
                    </template>
                </el-input>
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
            if (!this.newAuthor.trim()) return;

            const input = this.newAuthor.trim();

            // 使用分号分隔，支持中英文分号
            const authorList = input
                .split(/；|;/) // 正则：匹配中英文分号
                .map(name => name.trim()) // 去空格
                .filter(name => name);    // 去除空项

            // 可选：去重（只添加新作者）
            const uniqueAuthors = authorList.filter(
                name => !this.authors.includes(name)
            );

            this.authors.push(...uniqueAuthors);
            this.newAuthor = "";
        },
        removeAuthor(index) {
            this.authors.splice(index, 1);
        },
        submitParse() {
            if (!this.arxivid || !this.pdfFile || !this.texFile || this.authors.length === 0) {
                this.$message.warning("请填写完整信息并上传文件");
                return;
            }

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

.author-input-block {
    width: 300px;
    /* 可根据需要调节，也可以使用百分比 */
    margin-top: 10px;
}

.author-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 10px;
    /* 横向和纵向间距 */
    margin-bottom: 10px;
}

.el-tag {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.uploaded-file-info {
    margin-top: 8px;
    font-size: 14px;
    color: #555;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 300px;
    /* 和按钮对齐 */
}
</style>
