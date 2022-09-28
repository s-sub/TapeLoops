import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {reducer, StateProvider} from "./state";
// import { createRoot } from 'react-dom/client';
// import * as ReactDOMClient from 'react-dom/client';

// const container = document.getElementById('root');
// // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
// const root = createRoot(container!)
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

reportWebVitals();
