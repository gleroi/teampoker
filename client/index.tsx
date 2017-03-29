import * as React from "react";
import * as Dom from "react-dom";

class Page extends React.Component<any, any> {
    render() {
        return (<h1>Team Poker</h1>);
    }
}

Dom.render(<Page/>, document.getElementById("main-container"));