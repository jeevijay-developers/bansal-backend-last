import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.tsx'
import { ModalProvider } from './components/ModalContext.tsx'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ModalProvider>
    <App />
    </ModalProvider>
  </StrictMode>,
)
