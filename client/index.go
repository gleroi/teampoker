package main

import (
	"encoding/base64"
	"encoding/json"
	"log"

	"github.com/gleroi/teampoker/poker"

	"github.com/gleroi/teampoker/client/api"
	"github.com/gleroi/teampoker/client/cards"
	"github.com/gleroi/teampoker/client/players"
	"github.com/gleroi/teampoker/socketio"
	"github.com/gopherjs/vecty"
	"github.com/gopherjs/vecty/elem"
	"github.com/gopherjs/vecty/prop"
)

type Main struct {
	vecty.Core

	state    *poker.SessionSate
	playerId poker.PlayerId
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
			cards.Container(m.state.CurrentRun.Votes[m.playerId]),
			players.List(m.state),
		),
	)
}

func main() {
	root := &Main{
		state: &poker.SessionSate{
			Players: make(map[poker.PlayerId]poker.Player),
			Items:   make(map[poker.ItemId]poker.Item),
			CurrentRun: poker.Run{
				Votes: make(map[poker.PlayerId]string),
			},
		},
	}
	vecty.AddStylesheet("font-awesome.css")
	vecty.AddStylesheet("teampoker.css")
	vecty.RenderBody(root)

	c := socketio.New()
	api.Socket = c
	c.On("connect", func(v ...interface{}) {
		println("connected", c.Id)
	})

	c.On("join", func(v ...interface{}) {
		if len(v) > 0 {
			if id, ok := v[0].(float64); ok {
				log.Printf("join id: %v (%T)", id, id)
				root.playerId = poker.PlayerId(id)
				if name, ok := api.GetName(); ok {
					log.Printf("poker_name: %s", name)
					api.Rename(name)
				}
				vecty.Rerender(root)
			}
		}
	})

	c.On("state", func(v ...interface{}) {
		log.Printf("state args: %+v", v)
		stateB64, _ := v[0].(string)
		stateJson, err := base64.StdEncoding.DecodeString(stateB64)
		if err != nil {
			log.Printf("state: b64 deserialization failed: %s", err)
		}
		state := &poker.SessionSate{}
		log.Printf("state: %s", string(stateJson))
		err = json.Unmarshal(stateJson, &state)
		if err != nil {
			log.Printf("state: json deserialization failed: %s", err)
		}
		log.Printf("state: %+v", state)
		root.state = state
		vecty.Rerender(root)
	})

}
