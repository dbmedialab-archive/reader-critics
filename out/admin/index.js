"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const TestContainer_1 = require("./testpage/TestContainer");
const apps = {
    'admin': TestContainer_1.default,
};
const rootContainer = document.getElementById('admin');
if (!rootContainer.hasAttribute('name')) {
    throw new Error('Root <div> container must have a "name" attribute');
}
else {
    const name = rootContainer.getAttribute('name');
    if (typeof apps[name] === 'function') {
        ReactDOM.render(React.createElement(apps[name]), rootContainer);
    }
    else {
        throw new Error(`Unknown app type "${name}"`);
    }
}
//# sourceMappingURL=index.js.map