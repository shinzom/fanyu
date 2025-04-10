<template>
  <div style="height: 100%">
    <el-container class="container">
      <!-- 菜单栏 -->
      <el-aside class="aside" :style="{ width: isCollapse ? '63px' : '250px' }">
        <Menu :isCollapse="isCollapse" />
      </el-aside>

      <el-container
        style="
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          width: 100%;
          height: 100%;
        "
      >
        <div
          style="
            height: 7vh;
            display: flex;
            flex-direction: row;
            justify-content: start;
            align-items: center;
            border-bottom: 1px solid Gainsboro;
            margin-top: 4vh;
          "
        >
          <!-- 菜单折叠按钮 -->
          <div>
            <el-button
              v-if="!isCollapse"
              type="text"
              @click="toggle"
              style="margin-left: 20px; margin-right: 5px"
            >
              <el-icon :size="23">
                <svg
                  t="1727684743343"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="6028"
                  width="128"
                  height="128"
                >
                  <path
                    d="M0 51.2m38.4 0l947.2 0q38.4 0 38.4 38.4l0 0q0 38.4-38.4 38.4l-947.2 0q-38.4 0-38.4-38.4l0 0q0-38.4 38.4-38.4Z"
                    fill="#2c2c2c"
                    p-id="6029"
                  ></path>
                  <path
                    d="M460.8 332.8m38.4 0l486.4 0q38.4 0 38.4 38.4l0 0q0 38.4-38.4 38.4l-486.4 0q-38.4 0-38.4-38.4l0 0q0-38.4 38.4-38.4Z"
                    fill="#2c2c2c"
                    p-id="6030"
                  ></path>
                  <path
                    d="M460.8 614.4m38.4 0l486.4 0q38.4 0 38.4 38.4l0 0q0 38.4-38.4 38.4l-486.4 0q-38.4 0-38.4-38.4l0 0q0-38.4 38.4-38.4Z"
                    fill="#2c2c2c"
                    p-id="6031"
                  ></path>
                  <path
                    d="M0 896m38.4 0l947.2 0q38.4 0 38.4 38.4l0 0q0 38.4-38.4 38.4l-947.2 0q-38.4 0-38.4-38.4l0 0q0-38.4 38.4-38.4Z"
                    fill="#2c2c2c"
                    p-id="6032"
                  ></path>
                  <path
                    d="M20.1984 489.1136l275.5584-137.7792a25.6 25.6 0 0 1 37.0432 22.8864v275.5584a25.6 25.6 0 0 1-37.0432 22.8864L20.1984 534.8864a25.6 25.6 0 0 1 0-45.7728z"
                    fill="#2c2c2c"
                    p-id="6033"
                  ></path>
                </svg>
              </el-icon>
            </el-button>
            <el-button
              v-else
              type="text"
              @click="toggle"
              style="margin-left: 20px; margin-right: 5px"
            >
              <el-icon :size="23">
                <svg
                  t="1727684771653"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="6250"
                  width="128"
                  height="128"
                >
                  <path
                    d="M985.6 51.2h-947.2a38.4 38.4 0 0 0 0 76.8h947.2a38.4 38.4 0 0 0 0-76.8z m-460.8 281.6h-486.4a38.4 38.4 0 0 0 0 76.8h486.4a38.4 38.4 0 0 0 0-76.8z m0 281.6h-486.4a38.4 38.4 0 0 0 0 76.8h486.4a38.4 38.4 0 0 0 0-76.8z m460.8 281.6h-947.2a38.4 38.4 0 0 0 0 76.8h947.2a38.4 38.4 0 0 0 0-76.8z m18.2016-406.8864l-275.5584-137.7792a25.6 25.6 0 0 0-37.0432 22.8864v275.5584a25.6 25.6 0 0 0 37.0432 22.8864l275.5584-137.7792a25.6 25.6 0 0 0 0-45.7728z"
                    fill="#2c2c2c"
                    p-id="6251"
                  ></path>
                </svg>
              </el-icon>
            </el-button>
          </div>
          <!-- 动态面包屑 -->
          <div>
            <el-breadcrumb
              separator-class="el-icon-arrow-right"
              style="font-size: 20px"
            >
              <el-breadcrumb-item
                v-for="(item, index) in breadcrumbItems"
                :key="index"
                :to="item.path"
              >
                {{ item.text }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>

        <div :class="['operation', { background: showBackground }]">
          <router-view />
        </div>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="ts" setup>
import Menu from "./Menu.vue";
import axios from "axios";
import { ref, watch, onMounted } from "vue";
import { Fold } from "@element-plus/icons-vue";
let isCollapse = ref(false);
const toggle = (): void => {
  isCollapse.value = !isCollapse.value;
};
import { useRoute } from "vue-router";
interface BreadcrumbItem {
  path: string;
  text: string;
}

let breadcrumbItems = ref([] as BreadcrumbItem[]);
const route = useRoute();
let showBackground = ref(false);

watch(route, (to) => {
  getBreadcrumbs(to);
});

onMounted(() => {
  getBreadcrumbs(route);
});

const getBreadcrumbs = (route) => {
  const matched = route.matched;
  breadcrumbItems.value = matched.map((route) => ({
    path: route.path,
    text: route.meta.breadcrumb || route.name,
  }));
  showBackground.value = route.path === "/";
};
</script>

<style scoped lang="scss">
.container {
  height: 100%;

  .aside {
    overflow: hidden;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }

  .operation {
    height: 85vh;
  }

  .background {
    background-image: url("../img/background.png");
    background-size: cover;
    border-radius: 5px;
    margin-left: 20px;
    margin-top: 1vh;
  }
}
</style>
