var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
define("store", ["require", "exports"], function (require, exports) {
    "use strict";
    var State = (function () {
        function State() {
            this.players = [];
        }
        return State;
    }());
    exports.State = State;
    var Store = (function () {
        function Store() {
            this.callbacks = [];
            this.state = new State();
        }
        Store.prototype.subscribe = function (cb) {
            this.callbacks.push(cb);
        };
        Store.prototype.raise = function () {
            for (var _i = 0, _a = this.callbacks; _i < _a.length; _i++) {
                var cb = _a[_i];
                cb();
            }
        };
        Store.prototype.getState = function () {
            return this.state;
        };
        Store.prototype.addPlayer = function (id) {
            console.log("addPlayer", id);
            this.state.players[id] = { id: id, name: "other" };
            this.raise();
        };
        Store.prototype.setId = function (id) {
            console.log("setId", id);
            this.state.id = id;
            this.addPlayer(id);
        };
        Store.prototype.setName = function (id, value) {
            console.log("setName", id, value);
            var player = this.state.players[id];
            if (!player) {
                this.addPlayer(id);
                player = this.state.players[id];
            }
            player.name = value;
            this.raise();
        };
        return Store;
    }());
    exports.Store = Store;
});
define("index", ["require", "exports", "react", "react-dom", "socket.io-client", "store"], function (require, exports, React, Dom, io, st) {
    "use strict";
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
            _this.state = store.getState();
            store.subscribe(function () { return _this.onChange(); });
            return _this;
        }
        Main.prototype.onChange = function () {
            this.setState(store.getState());
        };
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
                        React.createElement("ul", { style: playersListStyle }, this.state.players.map(function (p) { return (React.createElement("li", { key: p.id },
                            React.createElement(Player, { name: p.id + " : " + p.name }))); }))))));
        };
        return Main;
    }(React.Component));
    var socket = io();
    var store = new st.Store();
    Dom.render(React.createElement(Main, null), document.getElementById("main-container"));
    socket.on("join", function (id) {
        store.setId(id);
    });
    socket.on("new_player", function (id) {
        store.addPlayer(id);
    });
    function vote(value) {
        console.log("my vote:", value);
        socket.emit("vote", JSON.stringify(value));
    }
    socket.on("vote", function (value) {
        console.log("vote:", value);
    });
    function setName(value) {
        socket.emit("change_name", value);
    }
    socket.on("name_changed", function (id, value) {
        console.log("name_changed", id, value);
        store.setName(id, value);
    });
    socket.on("message", function (value) {
        console.log("msg:", value);
    });
    socket.on("disconnect", function () {
        console.log("connexion perdue!");
    });
});
