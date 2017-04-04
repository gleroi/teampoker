package main

import (
	"log"
	"net/http"

	"github.com/googollee/go-socket.io"
)

var id int

type Player struct {
	id   int
	name string
}

var players []Player

func addPlayer(id int) {
	players = append(players, Player{id: id})
}

func main() {
	players = make([]Player, 0, 16)

	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatalln(err)
	}

	server.On("connection", func(so socketio.Socket) {
		log.Printf("Connection\n")
		so.Join("team")
		var myID = id
		id++

		so.Emit("join", myID)
		for _, player := range players {
			so.Emit("new_player", player.id)
		}
		addPlayer(myID)
		so.BroadcastTo("team", "new_player", myID)

		so.On("vote", func(vote string) {
			log.Printf("vote %d %s", myID, vote)
			so.Emit("voted", myID, vote)
			so.BroadcastTo("team", "voted", myID, vote)
		})

		so.On("change_name", func(name string) {
			log.Printf("setName %d %s\n", myID, name)
			so.Emit("name_changed", myID, name)
			so.BroadcastTo("team", "name_changed", myID, name)
		})

		so.On("disconnection", func() {
			log.Printf("Bye!\n")
		})
	})
	server.On("error", func(so socketio.Socket, err error) {
		log.Println("error:", err)
	})

	http.Handle("/socket.io/", server)
	http.Handle("/", http.FileServer(http.Dir("public")))

	log.Println("Listening on localhost:8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
