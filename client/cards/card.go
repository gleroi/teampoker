package cards

import (
	"github.com/gopherjs/vecty"
	"github.com/gopherjs/vecty/elem"
	"github.com/gopherjs/vecty/prop"
)

type CardComponent struct {
	vecty.Core
}

func (c *CardComponent) Render() *vecty.HTML {
	return elem.Div(prop.Class("card"),
		elem.Div(prop.Class("card-text"),
			vecty.Text("3")))
}

func Card() *CardComponent {
	return new(CardComponent)
}
