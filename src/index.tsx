import React from 'react';
import ReactDOM from 'react-dom';
import { cssRule } from 'typestyle';

import { App } from './App';

cssRule('body', { margin: 0, background: '#222', color: 'white', fontFamily: 'sans-serif' });

ReactDOM.render(<App />, document.getElementById('root'));
