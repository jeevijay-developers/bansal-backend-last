
// import './App.css'
import { memo, Suspense } from 'react';
import Layout from './layout/layout';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './helper/routes';
import { useModal } from './components/ModalContext';
import LoginModal from './components/login';
import OTPModal from './components/otp';
import Register from './components/register';
import EditProfile from './components/edit-profile';
import AddAddress from './components/add-address';
import EditAddress from './components/edit-address';
import Cart from './components/cart';
import { useAuthStore } from './store/auth/authStore';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import LoaderWithBackground from './components/LoaderWithBackground';

function App() {
  const { showLogin, closeLogin, showOTP, closeOTP, phone, openOTP } = useModal();

  const handleRequestOTP = (phone: string) => {
    openOTP(phone);
  };

  const { isLogin } = useAuthStore();
  const queryClient = new QueryClient();
  const PublicRoutes = memo(() => {
    return (
      <Layout>
        <Routes>
          {publicRoutes.map((route) => {
            return (
              <Route
                key={route?.path}
                path={route?.path}
                Component={route?.element}
              />
            );
          })}
          <Route path="*" element={<Navigate to={`/`} />} />
        </Routes>
      </Layout>
    );
  });

  const PrivateRoutes = memo(() => {
    return (
      <Layout>
        <Routes>
          {privateRoutes.map((route) => (
            <Route
              key={route?.path}
              path={route?.path}
              Component={route?.element}
            />
          ))}
          <Route path="*" element={<Navigate to={`/home`} />} />
        </Routes>
      </Layout>
    );
  });
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer autoClose={1000} limit={1} />
      <Suspense fallback={<LoaderWithBackground visible={true} />}>
        
        <Router>
          <Cart />
          <EditProfile />
          <AddAddress />
          <EditAddress />
          {showLogin && (
            <LoginModal
              show={showLogin}
              onClose={closeLogin}
              onRequestOTP={handleRequestOTP}
            />
          )}

          {showOTP && (
            <OTPModal
              show={showOTP}
              onClose={closeOTP}
              phone={phone}
            />
          )}
          <Register onRequestOTP={handleRequestOTP} />
          {!isLogin ? <PublicRoutes /> : <PrivateRoutes />}
        </Router>
      </Suspense>
    </QueryClientProvider>
  )
}

export default App
