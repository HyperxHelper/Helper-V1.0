import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

async function bootstrap() {
  try {
    const res = await fetch('/api/config/firebase', { signal: AbortSignal.timeout(1500) });
    if (!res.ok) throw new Error('no backend');
  } catch {
    const { installMockFetch } = await import('./mockApi.ts');
    installMockFetch();
    console.log('[Helper] Running in demo mode (no backend detected)');
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();
