package players

import (
	"github.com/gleroi/teampoker/poker"
	"github.com/gopherjs/vecty"
	"github.com/gopherjs/vecty/elem"
	"github.com/gopherjs/vecty/prop"
)

// PlayerComponent displays a player/voter informations and state
type PlayerComponent struct {
	vecty.Core
	name string
}

func (p *PlayerComponent) Render() *vecty.HTML {
	return elem.Div(
		prop.Class("player"),
		elem.Span(prop.Class("fa fa-fire player-icon")),
		elem.Span(
			prop.Class("player-name"),
			vecty.Text(p.name)),
	)
}

func Player(name string) *PlayerComponent {
	return &PlayerComponent{
		name: name,
	}
}

type ListComponent struct {
	vecty.Core

	players map[int]poker.Player
}

func (l *ListComponent) Render() *vecty.HTML {
	players := make([]vecty.MarkupOrComponentOrHTML, 1)
	players = append(players, prop.Class("players-list-players"))
	for _, p := range l.players {
		players = append(players, Player(p.Name))
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
			vecty.Text("footer 2017"),
		),
	)
}

func List(players map[int]poker.Player) *ListComponent {
	return &ListComponent{
		players: players,
	}
}
