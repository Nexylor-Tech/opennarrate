import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { BlogDetail } from "./pages/BlogDetail";
import { Profile } from "./pages/Profile";
import { Login } from "./pages/Login";
import { AddBlog } from "./pages/AddBlog";

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="open-narrate-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="blog/:id" element={<BlogDetail />} />
            <Route path="profile" element={<Profile />} />
            <Route path="login" element={<Login />} />
            <Route path="add-blog" element={<AddBlog />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

