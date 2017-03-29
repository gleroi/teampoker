var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("index", ["require", "exports", "react", "react-dom"], function (require, exports, React, Dom) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Page = (function (_super) {
        __extends(Page, _super);
        function Page() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Page.prototype.render = function () {
            return (React.createElement("h1", null, "Team Poker"));
        };
        return Page;
    }(React.Component));
    Dom.render(React.createElement(Page, null), document.getElementById("main-container"));
});
