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
define("store", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Run = (function () {
        function Run() {
            this.Name = "def";
            this.Votes = new Array();
        }
        return Run;
    }());
    exports.Run = Run;
    var State = (function () {
        function State() {
            this.Players = new Array();
            this.CurrentRun = new Run();
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
        Store.prototype.setState = function (state) {
            this.state.Players = state.Players;
            this.state.CurrentRun = state.CurrentRun;
            this.raise();
        };
        Store.prototype.setId = function (id) {
            console.log("setId", id);
            this.state.id = id;
        };
        return Store;
    }());
    exports.Store = Store;
});
define("index", ["require", "exports", "react", "react-dom", "socket.io-client", "store"], function (require, exports, React, Dom, io, st) {
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
            if (this.props.voted) {
                cardStyle.backgroundColor = "#CDDC39";
                cardTextStyle.color = "white";
            }
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
                color: "#8BC34A"
            };
            var voteStyle = {
                fontSize: "16pt",
                color: "#cddc39",
                float: "right"
            };
            var _a = this.props, player = _a.player, others = __rest(_a, ["player"]);
            return (React.createElement("div", __assign({}, others),
                React.createElement("span", { className: "fa fa-odnoklassniki-square", style: iconStyle }),
                React.createElement("span", { style: nameStyle }, player.Name),
                this.props.voted && (React.createElement("span", { className: "fa fa-thumbs-up", style: voteStyle }))));
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
                vote(val);
            };
        };
        Main.prototype.changeName = function () {
            return function (e) {
                setName(e.currentTarget.value);
            };
        };
        Main.prototype.isMyVote = function (vote) {
            var myVote = this.state.CurrentRun.Votes[this.state.id];
            if (myVote) {
                return myVote == vote;
            }
            return false;
        };
        Main.prototype.hasVoted = function (id) {
            var myVote = this.state.CurrentRun.Votes[id];
            return myVote != undefined && myVote != null && myVote != "";
        };
        Main.prototype.render = function () {
            var _this = this;
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
            var votes = [
                { value: "1", text: "1" },
                { value: "2", text: "2" },
                { value: "3", text: "3" },
                { value: "5", text: "5" },
                { value: "8", text: "8" },
                { value: "13", text: "13" },
                { value: "21", text: "21" },
                { value: "coffee", text: React.createElement("span", { className: "fa fa-coffee" }) },
                { value: "?", text: "?" }
            ];
            return (React.createElement("div", null,
                React.createElement("h1", null, "Team Poker"),
                React.createElement("h3", null,
                    "Voting for ",
                    this.state.CurrentRun.Name),
                React.createElement("div", { style: columnsStyle },
                    React.createElement("div", { style: cardsStyle }, votes.map(function (vote) { return (React.createElement(Card, { onClick: _this.onClick(vote.value), voted: _this.isMyVote(vote.value) }, vote.text)); })),
                    React.createElement("div", { style: playersStyle },
                        React.createElement("div", null,
                            React.createElement("label", null, "Changer de nom :"),
                            React.createElement("input", { type: "text", onChange: this.changeName() })),
                        React.createElement("ul", { style: playersListStyle }, this.state.Players.map(function (p) { return (React.createElement("li", { key: p.Id },
                            React.createElement(Player, { player: p, voted: _this.hasVoted(p.Id) }))); }))))));
        };
        return Main;
    }(React.Component));
    var socket = io();
    var store = new st.Store();
    Dom.render(React.createElement(Main, null), document.getElementById("main-container"));
    socket.on("join", function (id) {
        store.setId(id);
    });
    socket.on("state", function (state) {
        console.log("state", state);
        store.setState(state);
    });
    socket.on("disconnect", function () {
        console.log("connexion perdue!");
    });

    function vote(value) {
        var state = store.getState();
        var previousVote = state.CurrentRun.Votes[state.id]
        if (previousVote != value) {
            socket.emit("vote", value);
        }
        else {
            socket.emit("vote", "")
        }
    }
    function setName(value) {
        socket.emit("change_name", value);
    }
});
