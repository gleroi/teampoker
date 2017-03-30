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
define("index", ["require", "exports", "react", "react-dom", "socket.io-client"], function (require, exports, React, Dom, io) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var name = "Joueur 1";
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
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Player.prototype.render = function () {
            var nameStyle = {
                marginLeft: 7
            };
            var iconStyle = {
                fontSize: "16pt",
                color: "#83b55e"
            };
            var _a = this.props, name = _a.name, others = __rest(_a, ["name"]);
            return (React.createElement("div", __assign({}, others),
                React.createElement("span", { className: "fa fa-user-circle", style: iconStyle }),
                React.createElement("span", { style: nameStyle }, name)));
        };
        return Player;
    }(React.Component));
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main(props, context) {
            var _this = _super.call(this, props, context) || this;
            _this.state = {
                name: name
            };
            register(_this);
            return _this;
        }
        Main.prototype.onClick = function (val) {
            return function (e) {
                vote({ vote: val, player: "name" });
            };
        };
        Main.prototype.changeName = function () {
            return function (e) {
                setName(e.currentTarget.value);
            };
        };
        Main.prototype.onUpdate = function () {
            console.log("updated");
            this.setState({
                name: name
            });
        };
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
            var playersListStyle = {
                listStyleType: "none"
            };
            return (React.createElement("div", null,
                React.createElement("h1", null, "Team Poker"),
                React.createElement("div", { style: columnsStyle },
                    React.createElement("div", { style: cardsStyle },
                        React.createElement(Card, { onClick: this.onClick("1") }, "1"),
                        React.createElement(Card, { onClick: this.onClick("2") }, "2"),
                        React.createElement(Card, { onClick: this.onClick("3") }, "3"),
                        React.createElement(Card, { onClick: this.onClick("5") }, "5"),
                        React.createElement(Card, { onClick: this.onClick("8") }, "8"),
                        React.createElement(Card, { onClick: this.onClick("13") }, "13"),
                        React.createElement(Card, { onClick: this.onClick("21") }, "21"),
                        React.createElement(Card, { onClick: this.onClick("coffee") },
                            React.createElement("span", { className: "fa fa-coffee" })),
                        React.createElement(Card, { onClick: this.onClick("?") }, "?")),
                    React.createElement("div", { style: playersStyle },
                        React.createElement("div", null,
                            React.createElement("label", null, "Changer de nom :"),
                            React.createElement("input", { type: "text", onChange: this.changeName() })),
                        React.createElement("ul", { style: playersListStyle },
                            React.createElement("li", null,
                                React.createElement(Player, { name: this.state.name })),
                            React.createElement("li", null,
                                React.createElement(Player, { name: "Joueur 2" })))))));
        };
        return Main;
    }(React.Component));
    var ui = [];
    Dom.render(React.createElement(Main, null), document.getElementById("main-container"));
    var socket = io();
    function register(obj) {
        ui.push(obj);
    }
    function update() {
        for (var _i = 0, ui_1 = ui; _i < ui_1.length; _i++) {
            var obj = ui_1[_i];
            obj.onUpdate();
        }
    }
    function vote(value) {
        console.log("my vote:", value);
        socket.emit("vote", JSON.stringify(value));
    }
    socket.on("vote", function (value) {
        console.log("vote:", value);
    });
    function setName(value) {
        name = value;
        socket.emit("change_name", value);
    }
    socket.on("change_name", function (value) {
        name = value;
        update();
    });
    socket.on("message", function (value) {
        console.log("msg:", value);
    });
    socket.on("disconnect", function () {
        console.log("connexion perdue!");
    });
});
