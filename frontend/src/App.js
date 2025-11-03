import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Contact from "./components/Contact";
import Report from "./components/Report";
import './styles/newstyle.css';
import './styles/contact.css';
import './styles/report.css';
import PastWorks from "./components/PastWorks";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import Login from "./components/Login";
import AllReports from "./components/AllReports";


function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<Report />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pastworks" element={<PastWorks/>}/>
          <Route path="/reports" element={<AllReports/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;


