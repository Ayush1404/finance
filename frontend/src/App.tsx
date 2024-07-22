import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RecoilRoot } from 'recoil';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/general/ProtectedRoute';
import Layout from './Layouts/Layout';
import Accounts from './pages/Accounts';
import Categories from './pages/Categories';


function App() {
  return (
    <>
      <RecoilRoot>
        <BrowserRouter>
          <ToastContainer />
          <Routes>
            <Route path="/signin" element={<SignIn/>}></Route>
            <Route path="/signup" element={<SignUp/>}></Route>
            <Route 
              path="/dashboard" 
              element={<ProtectedRoute>
                          <Layout>
                            <Dashboard/>
                          </Layout>
                        </ProtectedRoute>}
              >
            </Route>
            <Route 
              path="/accounts" 
              element={<ProtectedRoute>
                          <Layout>
                            <Accounts/>
                          </Layout>
                        </ProtectedRoute>}
              >
            </Route>
            <Route 
              path="/categories" 
              element={<ProtectedRoute>
                          <Layout>
                            <Categories />
                          </Layout>
                        </ProtectedRoute>}
              >
            </Route>
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </>
    
  );
}


export default App