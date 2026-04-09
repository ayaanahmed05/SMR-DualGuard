import { useState } from 'react'
import SGTRDashboard from './STGRDashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <SGTRDashboard />
  )
}

export default App
