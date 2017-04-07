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
define("cards", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    var Card = (function (_super) {
        __extends(Card, _super);
        function Card() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Card.prototype.render = function () {
            var _a = this.props, children = _a.children, voted = _a.voted, others = __rest(_a, ["children", "voted"]);
            return (React.createElement("div", __assign({ className: "card " + (voted ? "voted" : "") }, others),
                React.createElement("div", { className: "card-text " + (voted ? "voted" : "") }, children)));
        };
        return Card;
    }(React.Component));
    exports.Card = Card;
    var List = (function (_super) {
        __extends(List, _super);
        function List() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        List.prototype.render = function () {
            var _this = this;
            var allCards = [
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
            var cardsStyle = {
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap"
            };
            return (React.createElement("div", { style: cardsStyle }, allCards.map(function (vote) { return (React.createElement(Card, { key: "card-" + vote.value, onClick: function (e) { return _this.props.vote(vote.value); }, voted: _this.props.myvote == vote.value }, vote.text)); })));
        };
        return List;
    }(React.Component));
    exports.List = List;
});
define("store", ["require", "exports"], function (require, exports) {
    "use strict";
    var RunStatus;
    (function (RunStatus) {
        RunStatus[RunStatus["None"] = 0] = "None";
        RunStatus[RunStatus["Open"] = 1] = "Open";
        RunStatus[RunStatus["Closed"] = 2] = "Closed";
    })(RunStatus = exports.RunStatus || (exports.RunStatus = {}));
    var Run = (function () {
        function Run() {
            this.Votes = new Array();
        }
        return Run;
    }());
    exports.Run = Run;
    var Item = (function () {
        function Item() {
        }
        return Item;
    }());
    exports.Item = Item;
    var State = (function () {
        function State() {
            this.Players = new Array();
            this.Items = new Array();
            this.CurrentRun = new Run();
        }
        State.prototype.runStatus = function () {
            if (this.CurrentRun.Item == null) {
                return RunStatus.None;
            }
            if (this.CurrentRun.Item.Historic != null) {
                return RunStatus.Closed;
            }
            return RunStatus.Open;
        };
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
            this.state.Items = state.Items;
            this.raise();
        };
        Store.prototype.setId = function (id) {
            console.log("setId", id);
            this.state.id = id;
        };
        Store.prototype.setNotification = function (content) {
            this.state.notification = content;
            this.raise();
        };
        Store.prototype.unsetNotification = function () {
            this.state.notification = null;
            this.raise();
        };
        return Store;
    }());
    exports.Store = Store;
});
define("players", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    var colorPalette = [
        "#F44336",
        "#673AB7",
        "#3F51B5",
        "#E91E63",
        "#9C27B0",
        "#2196F3",
        "#4CAF50",
        "#FFEB3B",
        "#00BCD4",
        "#009688",
        "#FF5722"
    ];
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
                color: colorPalette[this.props.player.Id % colorPalette.length]
            };
            var voteStyle = {
                fontSize: "16pt",
                color: "#cddc39",
                float: "right"
            };
            var _a = this.props, player = _a.player, voted = _a.voted, others = __rest(_a, ["player", "voted"]);
            var vote = null;
            if (voted === true) {
                vote = React.createElement("span", { className: "fa fa-thumbs-up", style: voteStyle });
            }
            if (typeof (voted) == "string") {
                vote = React.createElement("span", { style: voteStyle }, voted);
            }
            return (React.createElement("div", __assign({}, others),
                React.createElement("span", { className: "fa fa-odnoklassniki-square", style: iconStyle }),
                React.createElement("span", { style: nameStyle }, player.Name),
                vote));
        };
        return Player;
    }(React.Component));
    var List = (function (_super) {
        __extends(List, _super);
        function List() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Display if the player has voted (while vote is running) or the vote of the
         * player (when the vote is closed).
         * @param id player id
         * @param run current voting run
         */
        List.prototype.Vote = function (id, run) {
            if (run.Item) {
                if (run.Item.Historic) {
                    return run.Item.Historic[id];
                }
                var myVote = run.Votes[id];
                return myVote != undefined && myVote != null && myVote != "";
            }
            return false;
        };
        List.prototype.render = function () {
            var playerStyle = {
                margin: "5px 0"
            };
            var playersListStyle = {
                listStyleType: "none",
                width: 200,
                padding: 0,
                margin: "10px 0 0 0 "
            };
            var players = [];
            for (var id in this.props.players) {
                var p = this.props.players[id];
                players.push(React.createElement("li", { key: "player" + p.Id, style: playerStyle },
                    React.createElement(Player, { player: p, voted: this.Vote(p.Id, this.props.run) })));
            }
            return (React.createElement("ul", { style: playersListStyle }, players));
        };
        return List;
    }(React.Component));
    exports.List = List;
});
define("votes", ["require", "exports", "react", "store"], function (require, exports, React, st) {
    "use strict";
    var VoteRun = (function (_super) {
        __extends(VoteRun, _super);
        function VoteRun() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        VoteRun.prototype.render = function () {
            var _this = this;
            var content = null;
            if (this.props.status == st.RunStatus.None) {
                content = (React.createElement("h3", null, "Waiting for a vote to open..."));
            }
            if (this.props.status == st.RunStatus.Closed) {
                content = (React.createElement("div", null,
                    React.createElement("h3", null, "Vote is closed"),
                    React.createElement("h5", null, this.props.run.Item.Name),
                    React.createElement("p", null,
                        "The result is ",
                        React.createElement("strong", null, this.props.run.Item.Result)),
                    React.createElement("div", null,
                        React.createElement("button", { onClick: function (e) { return _this.props.resetVote(); } }, "Reset vote"))));
            }
            if (this.props.status == st.RunStatus.Open) {
                content = (React.createElement("div", null,
                    React.createElement("h3", null, "Vote is open"),
                    React.createElement("h5", null, this.props.run.Item.Name),
                    React.createElement("div", null,
                        React.createElement("button", { onClick: function (e) { return _this.props.closeVote(); } }, "Close vote"),
                        React.createElement("button", { onClick: function (e) { return _this.props.resetVote(); } }, "Reset vote"))));
            }
            return (React.createElement("div", { className: "vote-run" }, content));
        };
        return VoteRun;
    }(React.Component));
    exports.VoteRun = VoteRun;
});
define("tasks", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    var List = (function (_super) {
        __extends(List, _super);
        function List() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        List.prototype.render = function () {
            var _this = this;
            var items = [];
            for (var key in this.props.items) {
                var index = parseInt(key);
                var item = this.props.items[key];
                items.push(React.createElement("tr", { key: "table-item-" + index },
                    React.createElement("td", { className: "task-name" }, item.Name),
                    React.createElement("td", null, item.Result ? item.Result : "To do"),
                    React.createElement("td", null,
                        React.createElement("button", { onClick: function (e) { return _this.props.runVote(index); } },
                            React.createElement("span", { className: "fa fa-envelope-open-o" })),
                        React.createElement("button", { onClick: function (e) { return _this.props.deleteItem(index); } },
                            React.createElement("span", { className: "fa fa-trash-o" })))));
            }
            return (React.createElement("div", { className: "tasks" },
                React.createElement("table", { className: "tasks-list" },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Task"),
                            React.createElement("th", null, "Status"),
                            React.createElement("th", null, "Action"))),
                    React.createElement("tbody", null, items))));
        };
        return List;
    }(React.Component));
    exports.List = List;
});
define("index", ["require", "exports", "react", "react-dom", "players", "votes", "cards", "tasks", "socket.io-client", "store"], function (require, exports, React, Dom, players, votes, cards, tasks, io, st) {
    "use strict";
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main(props, context) {
            var _this = _super.call(this, props, context) || this;
            _this.state = { game: store.getState(), itemName: "" };
            store.subscribe(function () { return _this.onChange(); });
            return _this;
        }
        Main.prototype.onChange = function () {
            this.setState(function (prev, props) {
                return {
                    state: store.getState(),
                    itemName: prev.itemName,
                };
            });
        };
        Main.prototype.itemName = function (val) {
            this.setState(function (prev, props) {
                return {
                    state: prev.game,
                    itemName: val
                };
            });
        };
        Main.prototype.onItemNameChange = function (e) {
            var val = e.target.value;
            this.itemName(val);
        };
        Main.prototype.onVote = function (val) {
            vote(val);
        };
        Main.prototype.onClickAddItem = function (itemName) {
            addItem(itemName);
            this.itemName("");
        };
        Main.prototype.changeName = function () {
            return function (e) {
                setName(e.currentTarget.value);
            };
        };
        Main.prototype.myVote = function () {
            if (this.state.game.runStatus() == st.RunStatus.Closed) {
                return this.state.game.CurrentRun.Item.Result;
            }
            return this.state.game.CurrentRun.Votes[this.state.game.id];
        };
        Main.prototype.runVote = function (index) {
            runVote(index);
        };
        Main.prototype.closeVote = function () {
            closeVote();
        };
        Main.prototype.resetVote = function () {
            resetVote();
        };
        Main.prototype.deleteItem = function (index) {
            deleteItem(index);
        };
        Main.prototype.render = function () {
            var _this = this;
            var columnsStyle = {
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap"
            };
            var voteOpened = this.state.game.runStatus() == st.RunStatus.Open;
            return (React.createElement("div", null,
                React.createElement("h1", null,
                    React.createElement("img", { src: "favicon.png", alt: "logo", className: "logo" }),
                    "Team Poker"),
                this.state.game.notification && (React.createElement("div", { className: "notification" },
                    React.createElement("div", null,
                        React.createElement("img", { src: "favicon.png", alt: "logo" }),
                        React.createElement("span", { className: "notification-title" }, "Team Poker")),
                    React.createElement("div", { className: "notification-content" }, this.state.game.notification))),
                React.createElement("section", null,
                    React.createElement(votes.VoteRun, { run: this.state.game.CurrentRun, status: this.state.game.runStatus(), closeVote: this.closeVote, resetVote: this.resetVote })),
                React.createElement("section", { style: columnsStyle },
                    React.createElement("div", null,
                        React.createElement("section", null,
                            React.createElement(cards.List, { vote: this.onVote, myvote: this.myVote() }))),
                    React.createElement("div", null,
                        React.createElement("div", null,
                            React.createElement("label", null, "Changer de nom :"),
                            React.createElement("input", { type: "text", onChange: this.changeName() })),
                        React.createElement(players.List, { players: this.state.game.Players, run: this.state.game.CurrentRun }))),
                React.createElement("section", null,
                    React.createElement("h2", null, "Tasks"),
                    React.createElement("div", null,
                        React.createElement("label", null, "Task \u00A0"),
                        React.createElement("input", { type: "text", className: "task", value: this.state.itemName, onChange: function (e) { return _this.onItemNameChange(e); } }),
                        React.createElement("button", { onClick: function (e) { return _this.onClickAddItem(_this.state.itemName); }, disabled: !this.state.itemName || this.state.itemName == "" }, "Add")),
                    React.createElement(tasks.List, { items: this.state.game.Items, runVote: function (index) { return _this.runVote(index); }, deleteItem: function (index) { return _this.deleteItem(index); } }))));
        };
        return Main;
    }(React.Component));
    var socket = io({
        reconnection: true
    });
    var store = new st.Store();
    Dom.render(React.createElement(Main, null), document.getElementById("main-container"));
    socket.on("join", function (id) {
        store.setId(id);
        var oldName = localStorage.getItem("poker_name");
        if (oldName) {
            setName(oldName);
        }
    });
    socket.on("state", function (state) {
        console.log("state", state);
        store.setState(state);
    });
    function notify(content) {
        console.log("notify", content);
        store.setNotification(content);
        setTimeout(function () {
            console.log("notify", "remove notification", content);
            store.unsetNotification();
        }, 5000);
    }
    socket.on("connect", function () {
        console.log("connection ready!");
        notify("connection ready \\o/");
    });
    socket.on("disconnect", function () {
        console.log("connection lost!");
        notify("connection lost :'(");
    });
    socket.on('error', function (err) {
        console.log("error:", err);
        notify(err);
    });
    socket.on('connect_error', function (err) {
        console.log("error:", err);
        notify(err);
    });
    socket.on('connect_timeout', function (err) {
        console.log("timeout:", err);
        notify(err);
    });
    function runVote(index) {
        console.log("run_vote", index);
        socket.emit("run_vote", index);
    }
    function vote(value) {
        var state = store.getState();
        var vote = state.CurrentRun.Votes[state.id];
        if (vote && value == vote) {
            console.log("vote", "");
            socket.emit("vote", "");
        }
        else {
            console.log("vote", value);
            socket.emit("vote", value);
        }
    }
    function closeVote() {
        console.log("close_vote");
        socket.emit("close_vote");
    }
    function resetVote() {
        console.log("reset_vote");
        socket.emit("reset_vote");
    }
    function setName(value) {
        socket.emit("change_name", value);
        localStorage.setItem("poker_name", value);
    }
    function addItem(item) {
        console.log("add_item", item);
        socket.emit("add_item", item);
    }
    function deleteItem(index) {
        console.log("delete_item", index);
        socket.emit("delete_item", index);
    }
});
//# sourceMappingURL=index.js.map