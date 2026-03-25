import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Trocs } from './pages/Trocs';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import './App.css';
import { CategoriesProduct } from './pages/CategoriesProduct';
import { Create } from './pages/Create';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/trocs" element={<Trocs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/categories/:id" element={<CategoriesProduct />} />
              <Route path="/create" element={<Create />} />
            </Routes>
          </main>
          <footer className="footer">
            <p>© 2025 La Petite Maison de l'Épouvante - Architecture Microservices</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
