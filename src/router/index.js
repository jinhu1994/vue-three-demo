import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "Dashboard", icon: "dashboard" }
      }
    ]
  },

  {
    path: "/rotateBox",
    component: Layout,
    children: [
      {
        path: "rotateBox",
        name: "RotateBox",
        component: () => import("@/views/rotateBox/index"),
        meta: { title: "rotateBox", icon: "dashboard" }
      }
    ]
  },

  {
    path: "/texture",
    component: Layout,
    redirect: "/texture",
    children: [
      {
        path: "texture",
        name: "Texture",
        component: () => import("@/views/texture/index"),
        meta: { title: "texture", icon: "dashboard" }
      }
    ]
  },

  {
    path: "/vtkLoader",
    component: Layout,
    redirect: "/vtkLoader",
    children: [
      {
        path: "vtkLoader",
        name: "VtkLoader",
        component: () => import("@/views/vtkLoader/index"),
        meta: { title: "vtkLoader", icon: "dashboard" }
      }
    ]
  },

  {
    path: "/bufferGeometry",
    component: Layout,
    redirect: "/bufferGeometry",
    children: [
      {
        path: "bufferGeometry",
        name: "BufferGeometry",
        component: () => import("@/views/bufferGeometry/index"),
        meta: { title: "bufferGeometry", icon: "nested" }
      }
    ]
  },

  {
    path: "/css3Renderer",
    component: Layout,
    redirect: "/css3Renderer",
    children: [
      {
        path: "css3Renderer",
        name: "Css3Renderer",
        component: () => import("@/views/css3Renderer/index"),
        meta: { title: "css3Renderer", icon: "nested" }
      }
    ]
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
