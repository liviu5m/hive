import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./lib/AppContext";
import AuthRequiredRoute from "./components/middleware/AuthRequiredRoute";
import Home from "./components/pages/Home";
import NonAuthRequiredRoute from "./components/middleware/NonAuthRequiredRoute";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import Verify from "./components/pages/Verify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleAuth from "./components/pages/Google";
import Profile from "./components/pages/Profile";
import Discover from "./components/pages/Discover";
import Messages from "./components/pages/Messages";
import Post from "./components/pages/Post";

function App() {
  const queryClient = new QueryClient();
  return (
    <div className="bg-[#F9FAFB]">
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/*"
                element={
                  <AuthRequiredRoute>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/profile/:id" element={<Profile />} />
                      <Route path="/discover" element={<Discover />} />
                      <Route path="/messages" element={<Messages />} />
                      <Route path="/post/:id" element={<Post />} />
                    </Routes>
                  </AuthRequiredRoute>
                }
              />
              <Route
                path="/auth/*"
                element={
                  <NonAuthRequiredRoute>
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/google" element={<GoogleAuth />} />
                      <Route path="/verify/:id" element={<Verify />} />
                    </Routes>
                  </NonAuthRequiredRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </QueryClientProvider>
      <ToastContainer />
    </div>
  );
}

export default App;
