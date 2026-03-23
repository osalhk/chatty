import { Route, Routes } from "react-router"
import Chat from "./pages/Chat/Chat"
import Auth from "./pages/Auth/Auth"


import{ Toaster } from "sonner"

const App: React.FC = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<Chat   />} />
      <Route path="/auth" element={<Auth />} />  
    </Routes>
    <Toaster/>
    </>
  )
}
  

export default App
