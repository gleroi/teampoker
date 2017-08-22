package players

import (
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
}

func (l *ListComponent) Render() *vecty.HTML {
	return elem.Div(
		prop.Class("players-list"),
		elem.Div(
			prop.Class("players-header"),
			vecty.Text("Participants"),
		),
		elem.Div(
			prop.Class("players-list-players"),
			Player("Guillaume"),
			Player("Paul"),
			Player("Célia"),
			Player("Vladimir"),
			Player("Ramatioenzseo"),
		),
		elem.Div(
			vecty.Text("footer 2017"),
		),
	)
}

func List() *ListComponent {
	return &ListComponent{}
}
