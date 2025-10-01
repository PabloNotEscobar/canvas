import React, {FC} from 'react';
import './styles/app.scss'
import Canvas from "./components/Canvas";
import SettingBar from "./components/SettingBar";
import Toolbar from "./components/Toolbar";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";

const App: FC = () => {
  return (
      <BrowserRouter>
          <div className="app">
              <Routes>
                  <Route path="/:id" element={
                          <>
                              <Toolbar />
                              <SettingBar />
                              <Canvas />
                          </>
                      } />
                  <Route path="*" element={<Navigate to={`f${(+new Date).toString(16)}`}/>} />
              </Routes>
          </div>
      </BrowserRouter>

  );
}

export default App;
