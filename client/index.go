package main

import (
	"github.com/gleroi/teampoker/client/cards"
	"github.com/gleroi/teampoker/client/players"
	"github.com/gopherjs/vecty"
	"github.com/gopherjs/vecty/elem"
	"github.com/gopherjs/vecty/prop"
)

type Main struct {
	vecty.Core
}

func (m *Main) Render() *vecty.HTML {
	return elem.Body(
		elem.Div(
			elem.Heading1(vecty.Text("Teampoker")),
		),
		elem.Div(
			elem.Heading3(vecty.Text("No vote running")),
			elem.Div(
				elem.Button(vecty.Text("Reset vote")),
				elem.Button(vecty.Text("Close vote")),
			),
		),
		elem.Div(prop.Class("content"),
			cards.Container(),
			players.List(),
		),
	)
}

func main() {
	vecty.AddStylesheet("font-awesome.css")
	vecty.AddStylesheet("teampoker.css")
	vecty.RenderBody(&Main{})
}
