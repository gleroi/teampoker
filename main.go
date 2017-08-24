package main

import (
	"log"
	"net/http"

	"github.com/gleroi/teampoker/poker"

	"time"

	"strconv"

	"fmt"

	socketio "github.com/googollee/go-socket.io"
)

const DbFile string = "poker_session.db"

func sendState(so socketio.Socket, poker *poker.Session) {
	err := poker.Save(DbFile)
	if err != nil {
		log.Printf("saves state failed: %s\n", err)
	}

	err = so.Emit("state", poker)
	if err != nil {
		log.Printf("sendState failed: %s\n", err)
	}
	err = so.BroadcastTo("team", "state", poker)
	if err != nil {
		log.Printf("sendState failed: %s\n", err)
	}
	log.Printf("state sended")

	if r := recover(); r != nil {
		log.Printf("recover on sendState: %v", r)
	}
}

func getCookieId(request *http.Request) (int, error) {
	cookie, err := request.Cookie("poker")
	if err != nil {
		return -1, err
	}
	id, err := strconv.Atoi(cookie.Value)
	if err != nil {
		return -1, err
	}
	return id, nil
}

func main() {
	session, err := poker.LoadSession(DbFile)
	if err != nil {
		log.Printf("error: LoadSession: %s", err)
		log.Printf("error: creating a new session")
		session = poker.NewSession()
	}

	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatalln(err)
	}
	server.SetPingInterval(5 * time.Second)
	server.SetPingTimeout(10 * time.Second)

	server.On("connection", func(so socketio.Socket) {
		id, err := getCookieId(so.Request())
		if err != nil {
			log.Printf("error: %s", err)
			return
		}

		player := session.NewPlayer(id)
		log.Printf("Connection %s %d\n", so.Id(), player.Id)

		so.Join("team")
		so.Emit("join", player.Id)
		sendState(so, session)

		so.On("run_vote", func(id int) {
			err = session.RunVote(id)
			log.Printf("run_vote pl: %d, item: %d, err: %s", player.Id, id, err)
			sendState(so, session)
		})

		so.On("vote", func(vote string) {
			session.Record(player, vote)
			log.Printf("vote %d %s", player.Id, vote)
			sendState(so, session)
		})

		so.On("reset_vote", func() {
			defer func() {
				if err := recover(); err != nil {
					log.Printf("Recovering ! %s", err)
				}
			}()
			session.ResetVote()
			log.Printf("reset_vote %d", player.Id)
			sendState(so, session)
		})

		so.On("close_vote", func() {
			session.CloseVote()
			log.Printf("close_vote %d", player.Id)
			sendState(so, session)
		})

		so.On("change_name", func(name string) {
			log.Printf("change_name %d %s\n", player.Id, name)
			player.ChangeName(name)
			so.Request().AddCookie(&http.Cookie{
				Name:    "poker_name",
				Expires: time.Now().Add(24 * time.Hour),
				Value:   name,
			})
			sendState(so, session)
		})

		so.On("add_item", func(item string) {
			log.Printf("add_item %d : %s", player.Id, item)
			session.AddItem(item)
			sendState(so, session)
		})

		so.On("delete_item", func(itemID int) {
			log.Printf("delete_item %d : %d", player.Id, itemID)
			session.DeleteItem(itemID)
			sendState(so, session)
		})

		so.On("disconnection", func() {
			session.RemovePlayer(player)
			err = so.BroadcastTo("team", "state", session)
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
				Value:   fmt.Sprintf("%d", session.NewId()),
			})
		}
		_, err = r.Cookie("poker_name")
		if err != nil {
			log.Printf("error /: %s", err)
			http.SetCookie(w, &http.Cookie{
				Name:    "poker_name",
				Expires: time.Now().Add(24 * time.Hour),
				Value:   "default",
			})
		}
		dir.ServeHTTP(w, r)
	}

	http.HandleFunc("/socket.io/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Access-Control-Allow-Origin", "*")
		server.ServeHTTP(w, r)
	})
	http.HandleFunc("/", handler)
	log.Println("Listening on localhost:8081...")
	log.Fatal(http.ListenAndServe(":8081", nil))
}
