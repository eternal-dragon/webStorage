import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { Button } from '@mui/material'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import NoAuth from './network/noauth'
import Forbidden from './network/forbidden'
import { UserDataProvider } from './auth'

const webContents = [
    {
        path: "noauth",
        element:
            <NoAuth />
    },
    {
        path: "forbidden",
        element:
            <Forbidden />
    }
]

function browserRouter () {
    return createBrowserRouter( [
        {
            path: "*",
            element: <App />,
            children: [ ...webContents ],
        }
    ] )
}

const root = ReactDOM.createRoot(
    document.getElementById( 'root' ) as HTMLElement
)
root.render(
    <React.StrictMode>
        <UserDataProvider>
            <RouterProvider router={ browserRouter() } />
        </UserDataProvider>
    </React.StrictMode>
)
