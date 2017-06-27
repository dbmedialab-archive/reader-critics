"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
require("../scss/admin.scss");
class TestContainer extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentWillMount() {
    }
    render() {
        return React.createElement("section", { id: 'admin' }, "testSection");
    }
}
exports.default = TestContainer;
//# sourceMappingURL=TestContainer.js.map