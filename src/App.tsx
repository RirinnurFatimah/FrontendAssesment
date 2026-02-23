import { Routes, Route } from 'react-router-dom';
import FilterPage from './pages/FilterPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<FilterPage />} />
    </Routes>
  );
}

export default App;
