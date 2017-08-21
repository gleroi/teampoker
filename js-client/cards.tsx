import * as React from "react";

export class Card extends React.Component<any, any> {
    render() {
        var { children, voted, ...others } = this.props;
        return (
            <div className={"card " + (voted ? "voted" : "")} {...others}>
                <div className={"card-text " + (voted ? "voted" : "")}>{children}</div>
            </div>
        );
    }
}

interface ListProps {
    vote: (value: string) => void,
    myvote: string;
}

export class List extends React.Component<ListProps, any> {
    render() {
        var allCards = [
            { value: "1", text: "1" },
            { value: "2", text: "2" },
            { value: "3", text: "3" },
            { value: "5", text: "5" },
            { value: "8", text: "8" },
            { value: "13", text: "13" },
            { value: "21", text: "21" },
            { value: "coffee", text: <span className="fa fa-coffee" /> },
            { value: "?", text: "?" }];

        var cardsStyle: React.CSSProperties = {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap"
        }
        
        return (
            <div style={cardsStyle}>
                {
                    allCards.map(vote => (
                        <Card key={"card-" + vote.value} onClick={(e) => this.props.vote(vote.value)} voted={this.props.myvote == vote.value}>{vote.text}</Card>
                    ))
                }
            </div>
        );
    }
}