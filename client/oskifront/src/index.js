import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
import 'bootstrap/dist/css/bootstrap.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import PassTest from './components/PassTest.jsx';
import AllTests from './components/AllTests.jsx';
import AllTestForUser from './components/AllTestsForUser.jsx';
import AllUsers from './components/AllUsers.jsx';
import CreateTest from './components/CreateTest.jsx';
import AssignUser from './components/AssignUser.jsx';

const router = createBrowserRouter( 
[
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <AllTestForUser></AllTestForUser>,
      },
      {
        path: "login-page",
        element: <Login></Login>,
      },
      {
        path: "register-page",
        element: <Register></Register>,
      },
      {
        path: "pass-test/:value",
        element: <PassTest></PassTest>,
      },
      {
        path: "all-tests",
        element: <AllTests></AllTests>,
      },
      {
        path: "all-users",
        element: <AllUsers></AllUsers>,
      },
      {
        path: "create-test",
        element: <CreateTest></CreateTest>,
      },
      {
        path: "assign-user",
        element: <AssignUser></AssignUser>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

