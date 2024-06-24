import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {App} from '@vzhyhunou/vzh-cms'

import config from './config';

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter basename={config.basename}>
        <App {...{config}}/>
    </BrowserRouter>
);
