package api

import "github.com/gleroi/teampoker/socketio"

var Socket *socketio.Socket

func Rename(name string) {
	if Socket == nil {
		return
	}
	Socket.Emit("change_name", name)
}

func Vote(vote string) {
	if Socket == nil {
		return
	}
	Socket.Emit("vote", vote)
}
