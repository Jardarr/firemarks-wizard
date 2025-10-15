import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'

// Проверяем, что DOM полностью загружен и элемент существует
if (typeof window !== 'undefined' && document.readyState !== 'loading') {
  const container = document.getElementById('root');
  if (container) {
    createRoot(container).render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>,
    );
  } else {
    console.error('Не найден элемент с id="root"');
  }
} else {
  // Ждем полной загрузки DOM
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('root');
    if (container) {
      createRoot(container).render(
        <StrictMode>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </StrictMode>,
      );
    } else {
      console.error('Не найден элемент с id="root"');
    }
  });
}
