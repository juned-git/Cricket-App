import { Outlet } from "react-router-dom";
import Header from "./src/components/Header";
import Footer from "./src/components/Footer";
const App = () => {
  
  return (
    <>
      <Header />
      <Outlet/>
      <Footer />
    </>
  );
};

export default App;
