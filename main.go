package main

import (
	"log"
	"net/http"

	"github.com/gleroi/teampoker/poker"

	"github.com/googollee/go-socket.io"
)

func sendState(so socketio.Socket, poker *poker.Session) {
	err := so.Emit("state", poker)
	if err != nil {
		log.Printf("sendState failed: %s\n", err)
	}
	err = so.BroadcastTo("team", "state", poker)
	if err != nil {
		log.Printf("sendState failed: %s\n", err)
	}
	log.Printf("state sended")
}

func main() {
	poker := poker.NewSession()

	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatalln(err)
	}

	server.On("connection", func(so socketio.Socket) {
		log.Printf("Connection\n")

		player := poker.NewPlayer()
		so.Join("team")

		so.Emit("join", player.Id)
		sendState(so, poker)

		so.On("run_vote", func(id int) {
			err = poker.RunVote(id)
			log.Printf("run_vote pl: %d, item: %d, err: %s", player.Id, id, err)
			sendState(so, poker)
		})

		so.On("vote", func(vote string) {
			poker.Record(player, vote)
			log.Printf("vote %d %s", player.Id, vote)
			sendState(so, poker)
		})

		so.On("reset_vote", func() {
			poker.ResetVote()
			log.Printf("reset_vote %d", player.Id)
			sendState(so, poker)
		})

		so.On("close_vote", func() {
			poker.CloseVote()
			log.Printf("close_vote %d", player.Id)
			sendState(so, poker)
		})

		so.On("change_name", func(name string) {
			log.Printf("change_name %d %s\n", player.Id, name)
			player.ChangeName(name)
			sendState(so, poker)
		})

		so.On("add_item", func(item string) {
			log.Printf("add_item %d : %s", player.Id, item)
			poker.AddItem(item)
			sendState(so, poker)
		})

		so.On("disconnection", func() {
			poker.RemovePlayer(player)
			err = so.BroadcastTo("team", "state", poker)
			if err != nil {
				log.Printf("sendState failed: %s\n", err)
			}
			log.Printf("state sended")
			log.Printf("Bye %d!\n", player.Id)
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
