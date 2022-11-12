import { Navigate } from "react-router-dom";
import Login from "../pages/Login";
import NewsNewsSandBox from "../pages/NewsSandBox";
import Home from "../pages/NewsSandBox/Home";
import RoleList from "../pages/NewsSandBox/right-manage/RoleList";
import RightList from "../pages/NewsSandBox/right-manage/RightList";
import UserList from "../pages/NewsSandBox/UserList";
import Nopermission from "../pages/NewsSandBox/Nopermission";
import NewsAdd from '../pages/NewsSandBox/news-manage/NewsAdd'
import NewsDraft from '../pages/NewsSandBox/news-manage/NewsDraft'
import NewsCategory from '../pages/NewsSandBox/news-manage/NewsCategory'
import NewsPreview from '../pages/NewsSandBox/news-manage/NewsPreview'
import NewsUpdate from '../pages/NewsSandBox/news-manage/NewsUpdate'
import Audit from '../pages/NewsSandBox/audit-manage/Audit'
import AuditList from '../pages/NewsSandBox/audit-manage/AuditList'
import Sunset from '../pages/NewsSandBox/publish-manage/Sunset'
import Published from '../pages/NewsSandBox/publish-manage/Published'
import Unpublished from '../pages/NewsSandBox/publish-manage/Unpublished'
import News from "../pages/News";
import Detail from "../pages/News/Detail";
import { useEffect, useState } from "react";
import axios from "axios";
//动态路由
const RightObj = {
  "/home": <Home />,
  '/right-manage/role/list': <RoleList />,
  '/right-manage/right/list': <RightList />,
  '/user-manage/list': <UserList />,
  '/news-manage/add': <NewsAdd />,
  '/news-manage/draft': <NewsDraft />,
  "/news-manage/category": <NewsCategory />,
  "/news-manage/preview/:id": <NewsPreview />,
  "/news-manage/update/:id": <NewsUpdate />,
  "/audit-manage/audit": <Audit />,
  "/audit-manage/list": <AuditList />,
  "/publish-manage/unpublished": <Unpublished />,
  "/publish-manage/published": <Published />,
  "/publish-manage/sunset": <Sunset />
}
const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
export default function IsAuth() {
  const [BackRouteList, setBackRouteList] = useState([])
  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:5000/rights'),
      axios.get('http://localhost:5000/children')
    ]).then(res => {
      setBackRouteList([...res[0].data, ...res[1].data])
    })
  }, [localStorage.getItem('token')])

  // 验证
  const checkRoute = (item) => {
    return RightObj[item.key] && item.pagepermisson
  }
  const checkUserPermission = (item) => {
    return rights.includes(item.key)
  }
  //返回路由
  function getRoutes() {
    const RightsList = []
    BackRouteList.forEach(item => {
      if (checkRoute(item) && checkUserPermission(item)) {
        RightsList.push({
          path:item.key,
          element:RightObj[item.key]
        })
      }
    })
    return RightsList
  }



  return localStorage.getItem('token') ?
    [{
      path: "/login",
      element: <Navigate to="/"/>,
    },
      {
        path: '/news',
        element: <News />
      }
      , {
        path: '/detail/:id',
        element: <Detail />
      },
      {
        path: "/",
        element: <NewsNewsSandBox />,
        children: [
          ...getRoutes(),
          {
            path: "/",
            element: <Navigate to="home" />,
          },
          {
            path: "*",
            element: <Nopermission />,
          },
        ]
      }
    ] : [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: '/news',
        element: <News />
      }
      , {
        path: '/detail/:id',
        element: <Detail />
      },
      {
        path: '*',
        element: <Navigate to="/login" />

      }


    ]
}


