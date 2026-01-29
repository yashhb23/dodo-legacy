import '@/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import LandingPage from '@/pages/LandingPage';
import AdminComments from '@/pages/AdminComments';
import ErrorBoundary from '@/components/ErrorBoundary';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin/comments" element={<AdminComments />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </div>
    </ErrorBoundary>
  );
}

export default App;
