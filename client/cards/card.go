package cards

import (
	"github.com/gleroi/teampoker/client/api"
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
	api.Vote(c.label)
	vecty.Rerender(c)
}

func Card(label string, selected bool) *CardComponent {
	return &CardComponent{
		label:    label,
		selected: selected,
	}
}

type ContainerComponent struct {
	vecty.Core

	myVote string
}

func (c *ContainerComponent) Render() *vecty.HTML {
	votes := []string{"1", "2", "3", "5", "8", "13", "21", "\u2615", "\u221e"}
	cards := make([]vecty.MarkupOrComponentOrHTML, len(votes))
	for i, vote := range votes {
		cards[i] = Card(vote, vote == c.myVote)
	}
	return elem.Div(prop.Class("cards-container"),
		elem.Div(cards...),
	)
}

func Container(vote string) *ContainerComponent {
	return &ContainerComponent{
		myVote: vote,
	}
}
