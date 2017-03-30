package main

import (
	"log"
	"net/http"

	"github.com/googollee/go-socket.io"
)

var id int

func main() {

	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatalln(err)
	}

	server.On("connection", func(so socketio.Socket) {
		log.Printf("Connection\n")
		so.Join("team")
		id++
		var myID = id

		so.Emit("message", myID)

		so.On("vote", func(vote string) {
			log.Printf("vote %s", vote)
			so.BroadcastTo("team", "vote", vote)
		})

		so.On("change_name", func(name string) {
			log.Printf("setName %s\n", name)
			so.BroadcastTo("team", "change_name", name)
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
