import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'

import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import RoomChatPage from './pages/RoomChatPage'
import HubPage from './pages/HubPage'
import RoomCreationPage from './pages/RoomCreationPage'
import Home from './pages/Home'
import Me from './pages/MePage'

function App() { return (
  <Router>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/signup" element={<SignupPage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/hub" element={<HubPage/>}/>
      <Route path="/me" element={<Me/>}/>
      <Route path="/createroom" element={<RoomCreationPage/>}/>
      <Route path="/chat/:roomId/:channelId" element={<RoomChatPage/>}/>
    </Routes>
  </Router>
) } 

export default App