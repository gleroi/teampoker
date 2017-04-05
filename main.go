package main

import (
	"log"
	"net/http"

	"github.com/gleroi/teampoker/poker"

	"time"

	"strconv"

	"fmt"

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
	server.SetPingInterval(5 * time.Second)
	server.SetPingTimeout(10 * time.Second)

	server.On("connection", func(so socketio.Socket) {
		cookie, err := so.Request().Cookie("poker")
		if err != nil {
			log.Printf("error: %s", err)
			return
		}
		id, err := strconv.Atoi(cookie.Value)
		if err != nil {
			log.Printf("error: %s", err)
		}

		player := poker.NewPlayer(id)
		log.Printf("Connection %s %d\n", so.Id(), player.Id)

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
			defer func() {
				if err := recover(); err != nil {
					log.Printf("Recovering ! %s", err)
				}
			}()
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
			log.Printf("Bye %s %d!\n", so.Id(), player.Id)
		})
	})
	server.On("error", func(so socketio.Socket, err error) {
		log.Println("error:", err)
	})

	dir := http.FileServer(http.Dir("public"))
	handler := func(w http.ResponseWriter, r *http.Request) {
		_, err := r.Cookie("poker")
		if err != nil {
			log.Printf("error /: %s", err)
			http.SetCookie(w, &http.Cookie{
				Name:    "poker",
				Expires: time.Now().Add(24 * time.Hour),
				Value:   fmt.Sprintf("%d", poker.NewId()),
			})
		}
		dir.ServeHTTP(w, r)
	}

	http.Handle("/socket.io/", server)
	http.HandleFunc("/", handler)
	log.Println("Listening on localhost:8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
