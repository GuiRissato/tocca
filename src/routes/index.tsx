import React from 'react';
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Login from '../pages/Login';
import Main from '../pages/Main';
import KanbanPage from '../pages/Kanban';


const PageRoutes: React.FC = () => {
  return (
        <Router>
            <Routes>
                <Route path="/" index element={<Login/>} />
                <Route path="/main" element={<Main/>} />
                <Route path="/projects/:projectId/kanban" element={<KanbanPage/>} />
            </Routes>
        </Router>

  );
};

export default PageRoutes