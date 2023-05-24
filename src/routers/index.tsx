import { lazy } from 'react';

import { type White } from '@/typings';

const List = lazy(async () => import(/* chunkName: List */ '@/pages/List'));
const Camera = lazy(async () => import('@/pages/Camera'));
const Home = lazy(async () => import(/* chunkName: Home */ '@/pages/Home'));
const Detail = lazy(
  async () => import(/* chunkName: Detail */ '@/pages/Detail'),
);
const ScanResult = lazy(
  async () => import(/* chunkName: ScanResult */ '@/pages/ScanResult'),
);
const Index = lazy(async () => import(/* chunkName: Index */ '@/pages/Index'));
const Other = lazy(async () => import(/* chunkName: Other */ '@/pages/Other'));
const Other1 = lazy(
  async () => import(/* chunkName: Other1 */ '@/pages/Other1'),
);
const NoFound = lazy(
  async () => import(/* chunkName: NoFound */ '../components/NoFound'),
);
export const TabBarList: White.RouteTabBar[] = [
  {
    path: '/',
    component: Home,
    icon: 'white-order',
    sceneMode: 'scroll',
    title: 'Contact List',
  },

  // {
  //   path: '/list',
  //   component: List,
  //   icon: 'white-order',
  //   sceneMode: 'scroll',
  //   title: '统计',
  // },
  {
    path: '/setting',
    component: Other,
    icon: 'white-account',
    sceneMode: 'scroll',
    title: 'setting',
  },
];

const routes: White.RouteConfig[] = [
  {
    path: '/',
    component: Index,
    tabBars: TabBarList,
  },
  {
    path: '/camera',
    component: Camera,
  },
  {
    path: '/result',
    component: ScanResult,
  },
  {
    path: '/detail/:bizCardId',
    component: Detail,
  },
  {
    path: '/other1',
    sceneMode: 'bottom',
    component: Other1,
  },
  {
    path: '/dcotorDetail',
    component: Detail,
  },
  {
    path: '*',
    component: NoFound,
  },
];

export default [...routes];
