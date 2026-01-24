import '@/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import ErrorBoundary from '@/components/ErrorBoundary';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <ErrorBoundary>
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
    </ErrorBoundary>
  );
}

export default App;
