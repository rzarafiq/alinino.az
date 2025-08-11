import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

function LandingLayout() {
  return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
  )
}

export default LandingLayout