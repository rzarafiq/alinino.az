import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

function UserLayout() {
  return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
  )
}

export default UserLayout