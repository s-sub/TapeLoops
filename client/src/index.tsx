import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {reducer, StateProvider} from "./state";
// import { createRoot } from 'react-dom/client';
// import * as ReactDOMClient from 'react-dom/client';

// const root = ReactDOMClient.createRoot(
//   document.getElementById('root') as HTMLElement
// );
// root.render(
//     <StateProvider reducer={reducer}>
//       <App />
//     </StateProvider>,
// );

ReactDOM.render(
  <StateProvider reducer={reducer}>
    <App />
  </StateProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
