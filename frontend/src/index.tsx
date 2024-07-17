import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/layout/App';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/Routes.tsx'
import { Provider } from 'react-redux';
import { store } from './store/configureStore.ts';
import './i18n.ts';
import { LanguageProvider } from './app/context/LanguageContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      < Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </LanguageProvider>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

