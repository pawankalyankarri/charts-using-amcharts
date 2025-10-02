import { Route, Routes } from 'react-router-dom'
import './App.css'
import BarChartCom from './mycomponents/BarChartCom'
import Charts from './mycomponents/Charts'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Charts/>}/>
        <Route path='/chart' element={<BarChartCom/>}/>
      </Routes>
    </>
  )
}

export default App
