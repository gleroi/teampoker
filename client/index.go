package main

import (
	"log"

	"github.com/gleroi/teampoker/poker"

	"github.com/gleroi/teampoker/client/cards"
	"github.com/gleroi/teampoker/client/players"
	"github.com/gleroi/teampoker/socketio"
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

	uri := "http://localhost:8081"
	c := socketio.New(uri)
	c.On("connect", func(v ...interface{}) {
		println("connected", c.Id)
	})

	c.On("join", func(v ...interface{}) {
		if len(v) > 0 {
			if id, ok := v[0].(float64); ok {
				log.Printf("join id: %v (%T)", id, id)
			}
		}
	})

	c.On("state", func(v ...interface{}) {
		log.Printf("%T", v[0])
		s, _ := v[0].(poker.Session)
		log.Printf("%+v %T", s, s)
		for k, v := range s.Players {
			log.Printf("pl: %v %+v", k, v)
		}
		log.Printf("%+v", s.CurrentRun)
	})

	vecty.AddStylesheet("font-awesome.css")
	vecty.AddStylesheet("teampoker.css")
	vecty.RenderBody(&Main{})
}
