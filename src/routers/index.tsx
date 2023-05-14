
import { White } from '@/typings';
import { lazy } from 'react';
const Search = lazy(() => import(/* chunkName: "Search" */ '@/pages/Search'));
const List = lazy(() => import(/* chunkName: List */ '@/pages/List'));
const Camera = lazy(() => import('@/pages/Camera'));
const Home = lazy(() => import(/* chunkName: Home */ '@/pages/Home'));
const Detail = lazy(() => import(/* chunkName: Detail */ '@/pages/Detail'));
const ScanResult = lazy(() => import(/* chunkName: ScanResult */ '@/pages/ScanResult'));
const Index = lazy(() => import(/* chunkName: Index */ '@/pages/Index'));
const Other = lazy(() => import(/* chunkName: Other */ '@/pages/Other'));
const Other1 = lazy(() => import(/* chunkName: Other1 */ '@/pages/Other1'));
const NoFound = lazy(
  () => import(/* chunkName: NoFound */ '../components/NoFound'),
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
    path: '/search',
    component: Search,
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
    path: '/detail/:userId',
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
