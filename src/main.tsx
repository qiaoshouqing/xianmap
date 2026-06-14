import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  RouterProvider, createRouter, createRootRoute, createRoute, Outlet,
} from '@tanstack/react-router'
import MapPage from './pages/MapPage'
import KaoPage from './pages/KaoPage'
import { LocaleProvider } from './i18n'
import './index.css'

const rootRoute = createRootRoute({ component: () => <Outlet /> })
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: MapPage })
const kaoRoute = createRoute({ getParentRoute: () => rootRoute, path: '/kao', component: KaoPage })

const routeTree = rootRoute.addChildren([indexRoute, kaoRoute])
const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocaleProvider>
      <RouterProvider router={router} />
    </LocaleProvider>
  </StrictMode>,
)
