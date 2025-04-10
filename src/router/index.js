import { createRouter } from 'vue-router'
import { createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import EventExtraction from '../views/EventExtraction.vue'
import EventStoryLine from '../views/EventStoryLine.vue'

const routes = [
  {
    path: "/",
    name: "/",
    component: Home,
    meta: { breadcrumb: "首页" },
    children:[
      {
        path: "/eventextraction",
        name: "/eventextraction",
        component: EventExtraction,
        meta: { breadcrumb: "事件抽取" },
      },
      {
        path: "/eventstoryline",
        name: "/eventstoryline",
        component: EventStoryLine,
        meta: { breadcrumb: "事件脉络分析" },
      }
    ]
  }

]
const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

export default router