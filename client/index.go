package main

import (
	"github.com/gleroi/teampoker/client/cards"
	"github.com/gopherjs/vecty"
	"github.com/gopherjs/vecty/elem"
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
			cards.Card(),
		))
}

func main() {
	vecty.AddStylesheet("font-awesome.css")
	vecty.AddStylesheet("teampoker.css")
	vecty.RenderBody(&Main{})
}
