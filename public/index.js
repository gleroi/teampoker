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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
define("index", ["require", "exports", "react", "react-dom"], function (require, exports, React, Dom) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Card = (function (_super) {
        __extends(Card, _super);
        function Card() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Card.prototype.render = function () {
            var cardStyle = {
                width: 100,
                height: 150,
                textAlign: "center",
                verticalAlign: "middle",
                border: "1px solid #AAAAAA",
                borderRadius: 5,
                margin: 5
            };
            var cardTextStyle = {
                verticalAlign: "middle",
                marginTop: 60,
                fontSize: "24pt",
                fontWeight: "bold",
                fontFamily: "sans-serif",
                color: "#333333"
            };
            var _a = this.props, children = _a.children, others = __rest(_a, ["children"]);
            return (React.createElement("div", __assign({ style: cardStyle }, others),
                React.createElement("div", { style: cardTextStyle }, children)));
        };
        return Card;
    }(React.Component));
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Main.prototype.render = function () {
            var columnsStyle = {
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap"
            };
            var cardsStyle = {
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap"
            };
            var playersStyle = {
                width: 200
            };
            return (React.createElement("div", null,
                React.createElement("h1", null, "Team Poker"),
                React.createElement("div", { style: columnsStyle },
                    React.createElement("div", { style: cardsStyle },
                        React.createElement(Card, null, "1"),
                        React.createElement(Card, null, "2"),
                        React.createElement(Card, null, "3"),
                        React.createElement(Card, null, "5"),
                        React.createElement(Card, null, "8"),
                        React.createElement(Card, null, "13"),
                        React.createElement(Card, null, "21"),
                        React.createElement(Card, null,
                            React.createElement("span", { className: "fa fa-coffee" })),
                        React.createElement(Card, null, "?")),
                    React.createElement("div", { style: playersStyle },
                        React.createElement("ul", null,
                            React.createElement("li", null, "Joueur 1"),
                            React.createElement("li", null, "Joueur 2"))))));
        };
        return Main;
    }(React.Component));
    Dom.render(React.createElement(Main, null), document.getElementById("main-container"));
});
