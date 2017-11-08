package players

import (
	"log"

	"github.com/gleroi/teampoker/client/api"
	"github.com/gleroi/teampoker/poker"
	"github.com/gopherjs/vecty"
	"github.com/gopherjs/vecty/elem"
	"github.com/gopherjs/vecty/event"
	"github.com/gopherjs/vecty/prop"
)

// PlayerComponent displays a player/voter informations and state
type PlayerComponent struct {
	vecty.Core
	name  string
	voted bool
}

func (p *PlayerComponent) Render() *vecty.HTML {
	votedClass := "player-vote"
	if p.voted {
		votedClass = "player-vote voted fa fa-thumbs-o-up"
	}

	return elem.Div(
		prop.Class("player"),
		elem.Span(prop.Class("fa fa-fire player-icon")),
		elem.Span(
			prop.Class("player-name"),
			vecty.Text(p.name)),
		elem.Span(
			prop.Class(votedClass),
		),
	)
}

func Player(name string, voted bool) *PlayerComponent {
	return &PlayerComponent{
		name:  name,
		voted: voted,
	}
}

type ListComponent struct {
	vecty.Core

	players map[poker.PlayerId]poker.Player
	run     poker.Run
	name    string
}

func (l *ListComponent) OnNameChange(e *vecty.Event) {
	l.name = e.Target.Get("value").String()
	vecty.Rerender(l)
}

func (l *ListComponent) OnRename(e *vecty.Event) {
	log.Printf("onrename: %v", l.name)
	api.Rename(l.name)
	l.name = ""
	vecty.Rerender(l)
}

func (l *ListComponent) Render() *vecty.HTML {
	players := make([]vecty.MarkupOrComponentOrHTML, 1)
	players = append(players, prop.Class("players-list-players"))
	for id, p := range l.players {
		vote, ok := l.run.Votes[id]
		players = append(players, Player(p.Name, ok && vote != ""))
	}

	return elem.Div(
		prop.Class("players-list"),
		elem.Div(
			prop.Class("players-header"),
			vecty.Text("Participants"),
		),
		elem.Div(
			players...,
		),
		elem.Div(
			elem.Input(prop.Type("text"),
				event.Change(l.OnNameChange),
				prop.Value(l.name)),
			elem.Button(
				vecty.Text("Renommer"),
				event.Click(l.OnRename),
			),
		),
	)
}

func List(s *poker.SessionSate) *ListComponent {
	return &ListComponent{
		players: s.Players,
		run:     s.CurrentRun,
	}
}
