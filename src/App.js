import React, { useEffect } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

import * as actions from './utils/store/actions';
import { NotFound } from './components/Error';

// admin
import adminRoutes from './components/admin/routes';
import AdminLayout from './components/admin/Layout';
import AdminAuthRoute from './components/admin/Auth/authRoute';
import AdminProtectedRoute from './components/admin/Auth/protectedRoute';

// site
import siteRoutes from './components/site/routes';
import SiteLayout from './components/site/Layout';
import SiteProtectedRoute from './components/site/Auth/protectedRoute';
import SiteGuestRoute from './components/site/Auth/guestRoute';

const App = () => {
  const dispatch = useDispatch();
  
  // save token to redux store
  dispatch(actions.authOnLoad());
  // save location to redux store
  dispatch(actions.locationOnLoad());
  // save cart to redux store
  dispatch(actions.cartItemsOnLoad());
  
  return (
    <>
    <div className="App">
      <Routes>
        {/* Admin */}
        <Route element={<AdminLayout> <Outlet /> </AdminLayout>}>
          {adminRoutes.length > 0 && adminRoutes.map((route, i) => (
            <Route 
              key={ i }
              path={ route.path }
              element={
                <>
                {route.auth ? (
                  <AdminProtectedRoute roles={ route.roles }>
                    <route.element breadcrumbName={ route.breadcrumbName } />
                  </AdminProtectedRoute>
                ) : (
                  <AdminAuthRoute>
                    <route.element />
                  </AdminAuthRoute>
                )}
                </>
              }
            />
          ))}
        </Route>
        
        {/* Site */}
        <Route element={<SiteLayout> <Outlet /> </SiteLayout>}>
          {siteRoutes.length > 0 && siteRoutes.map((route, i) => (
            <Route 
              key={ i }
              path={ route.path }
              element={
                <>
                {route.auth ? (
                  <SiteProtectedRoute roles={ route.roles }>
                    <route.element />
                  </SiteProtectedRoute>
                ) : (
                  <SiteGuestRoute>
                    <route.element />
                  </SiteGuestRoute>
                )}
                </>
              }
            />
          ))}
        </Route>
        
        {/* 404 */}
        <Route path="*" element={ <NotFound /> } />
      </Routes>
    </div>
    </>
  );
}

export default App;