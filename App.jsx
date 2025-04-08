// App.jsx

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Home from "./pages/Home";
import TimePage from "./pages/TimePage";
import Contato from "./pages/Contato";
import Sobre from "./pages/Sobre";

const App = () => {
  const [selectedTime, setSelectedTime] = useState(null);

  return (
    <Router>
      <div className="flex flex-col min-h-screen justify-between">
        <Header selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
        <Routes>
          <Route
            path="/ondevaipassar-teste"
            element={<Home setSelectedTime={setSelectedTime} />}
          />
          <Route
            path="/ondevaipassar-teste/time/:nome"
            element={
              <TimePage
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
              />
            }
          />
          <Route
            path="/ondevaipassar-teste/contato"
            element={<Contato />}
          ></Route>
          <Route path="/ondevaipassar-teste/sobre" element={<Sobre />}></Route>
        </Routes>
        <Footer selectedTime={selectedTime} />
      </div>
    </Router>
  );
};

export default App;
