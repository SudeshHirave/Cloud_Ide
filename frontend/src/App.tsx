import { BrowserRouter, Route,Routes } from 'react-router-dom'
import './App.css'
import { Landing } from "@/components/Landing"
import { Coading } from './components/Coding'

function App() {


  return (
<BrowserRouter>
<Routes>
<Route path="/coding" element={<Coading />} />
<Route path='/' element={<Landing></Landing>}></Route>
</Routes>
</BrowserRouter>

  )
}

export default App
