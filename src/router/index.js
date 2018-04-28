import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
    { path: '/login', component: () => import('@/views/login/index'), hidden: true },
    { path: '/404', component: () => import('@/views/404'), hidden: true },
    {
        path: '/user',
        component: Layout,
        children: [
            {
                path: 'index',
                name: 'user',
                component: () => import('@/views/user/index'),
                meta: { title_name: '用户管理', icon: 'form' }
            }
        ]
    },
    {
        path: '/',
        component: Layout,
        redirect: '/navigation/index',
        name: 'navigation',
        hidden:true,
        children: [
            {
            path: 'index',
            component: () => import('@/views/navigation/index'),
            meta: {
                title_name: '主导航',
                icon: 'form' ,

            }
        }]
    },

    {
        path: '/navigation',
        component: Layout,
        name:'navigation',
        meta: { title_name:'导航分类', icon: 'example' },
        children: [
            {
                path: 'index',
                name: 'navigation',
                component: () => import('@/views/navigation/index'),
                meta: { title_name: '导航分类', icon: 'form' }
            }

        ]
    },


    {
        path: '/article',
        component: Layout,
        redirect: '/article/html',
        name: 'menu',
        meta: { title_name:'文章分类', icon: 'example' },
        children: [
            {
                path: 'html',
                name: 'html',
                component: () => import('@/views/article/index'),
                meta: {
                    title: 'HTML',
                    icon: 'table',
                    title_name: 'HTML',

                },
            },
            {
                path: 'css',
                name: 'css',
                component: () => import('@/views/article/index'),
                meta: { title_name: 'CSS', icon: 'tree' }
            },
            {
                path: 'Javascript',
                name: 'Javascript',
                component: () => import('@/views/article/index'),
                meta: { title_name: 'Javascript', icon: 'tree' }
            },

            {
                path: 'articleUpdate',
                name:'articleUpdate',
                component: () => import('@/views/article/article-update'),
                meta: { title_name: '文章修改', icon: 'tree' },
                hidden:true

            },
            {
                path: 'articleAdd',
                name:'articleAdd',
                component: () => import('@/views/article/article-add'),
                meta: { title_name: '文章添加', icon: 'tree' },
                hidden:true

            },
        ]
    },






    {
        path: '/about',
        component: Layout,
        children: [
            {
                path: 'index',
                name: 'about',
                component: () => import('@/views/about/index'),
                meta: { title_name: '关于', icon: 'form' }
            }
        ]
    },

    {
        path: '/form',
        component: Layout,
        children: [
            {
                path: 'index',
                name: 'form',
                component: () => import('@/views/form/create'),
                meta: { title_name: '表单', icon: 'form' }
            }
        ]
    },

    { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
    mode:'history',
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})

