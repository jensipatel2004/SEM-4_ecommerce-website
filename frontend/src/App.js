
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Profile from "./pages/Profile/Profile";
import ContactUs from "./pages/ContactUs/ContactUs";
import Home from "./components/Home";
import Admin from "./pages/Admin/Admin";
import About from "./pages/About/About";
import NotFoundPage from './pages/404Page/404Page';
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import Productlist from "./pages/product/productlist";
import ProductDetails from "./pages/product/ProductDetails";
import Cart from "./pages/cart/Cart"
import PaymentMethod from "./pages/payment/PaymentMethod";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


function App() {
  
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/Admin' element={<Admin/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/Profile' element={<Profile/>}/>
      <Route path='/ContactUs' element={<ContactUs/>}/>
      <Route path='/About' element={<About/>}/>
      <Route path='/productlist' element={<Productlist/>}/>
      <Route path='/products/:productId' element={<ProductDetails />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/payment' element={<PaymentMethod />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
