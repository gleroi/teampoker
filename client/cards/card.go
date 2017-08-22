package cards

import (
	"github.com/gopherjs/vecty"
	"github.com/gopherjs/vecty/elem"
	"github.com/gopherjs/vecty/event"
	"github.com/gopherjs/vecty/prop"
)

type CardComponent struct {
	vecty.Core
	label    string
	selected bool
}

func (c *CardComponent) Render() *vecty.HTML {
	selectionClass := ""
	if c.selected {
		selectionClass = "card-selected"
	}
	return elem.Div(prop.Class("card "+selectionClass),
		event.Click(c.OnClick),
		elem.Div(prop.Class("card-text"),
			vecty.Text(c.label)))
}

func (c *CardComponent) OnClick(e *vecty.Event) {
	c.selected = !c.selected
	vecty.Rerender(c)
}

func Card(label string) *CardComponent {
	return &CardComponent{
		label: label,
	}
}

type ContainerComponent struct {
	vecty.Core
}

func (c *ContainerComponent) Render() *vecty.HTML {
	return elem.Div(prop.Class("cards-container"),
		Card("1"), Card("2"), Card("3"), Card("5"), Card("8"), Card("13"), Card("21"),
		Card("\u2615"), Card("\u221e"),
	)
}

func Container() *ContainerComponent {
	return new(ContainerComponent)
}
