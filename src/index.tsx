import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from "./stores/store";
import {Provider} from "react-redux";
import 'katex/dist/katex.min.css';
import {BrowserRouter} from "react-router-dom";


declare global {
    interface Window {
        tempInputValue: string;
        lastActiveTextArea: HTMLTextAreaElement | null;
        lastTextSelection: string | null
    }
}

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <BrowserRouter>
        <Provider store={store}>
            <App/>
        </Provider>
    </BrowserRouter>
)


reportWebVitals();
