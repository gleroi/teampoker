package main

import (
	"encoding/base64"
	"encoding/json"
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

	state *poker.SessionSate
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
			players.List(m.state.Players),
		),
	)
}

func main() {
	root := &Main{
		state: &poker.SessionSate{
			Players: make(map[int]poker.Player),
			Items:   make(map[int]poker.Item),
			CurrentRun: poker.Run{
				Item:  nil,
				Votes: make(map[int]string),
			},
		},
	}
	vecty.AddStylesheet("font-awesome.css")
	vecty.AddStylesheet("teampoker.css")
	vecty.RenderBody(root)

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
		stateB64, _ := v[0].(string)
		stateJson, err := base64.StdEncoding.DecodeString(stateB64)
		if err != nil {
			log.Printf("state: b64 deserialization failed: %s", err)
		}
		state := &poker.SessionSate{}
		err = json.Unmarshal(stateJson, &state)
		if err != nil {
			log.Printf("state: json deserialization failed: %s", err)
		}
		log.Printf("state: %+v", state)
		root.state = state
		vecty.Rerender(root)
	})

}
