package main

import (
	"log"

	"github.com/gleroi/teampoker/client/cards"
	"github.com/gleroi/teampoker/client/players"
	"github.com/gleroi/teampoker/socketio_client"
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
	opts := &socketio_client.Options{
		//Transport:"polling",
		Transport: "websocket",
		Query:     make(map[string]string),
	}
	uri := "http://localhost:8081"
	client, err := socketio_client.NewClient(uri, opts)
	if err != nil {
		log.Printf("NewClient error:%v\n", err)
		return
	}

	client.On("error", func() {
		log.Printf("on error\n")
	})

	client.On("connection", func() {
		log.Printf("on connect\n")
	})

	client.On("message", func(msg string) {
		log.Printf("on message:%v\n", msg)
	})

	client.On("disconnection", func() {
		log.Printf("on disconnect\n")
	})

	vecty.AddStylesheet("font-awesome.css")
	vecty.AddStylesheet("teampoker.css")
	vecty.RenderBody(&Main{})
}
