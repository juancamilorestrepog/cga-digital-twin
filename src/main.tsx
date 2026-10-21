import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import DemoAuth from './DemoAuth';
import '@xyflow/react/dist/style.css';
import './styles.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode><DemoAuth><App/></DemoAuth></React.StrictMode>);
