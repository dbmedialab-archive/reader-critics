import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './scss/admin.scss';

import TestContainer from './testpage/TestContainer';

const rootContainer : HTMLElement = document.getElementById('admin');
ReactDOM.render(React.createElement(TestContainer), rootContainer);
