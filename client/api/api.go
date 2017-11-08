package api

import (
	"github.com/gleroi/teampoker/socketio"
	"github.com/go-humble/locstor"
)

var Socket *socketio.Socket

func Rename(name string) {
	locstor.SetItem("poker_name", name)
	if Socket == nil {
		return
	}
	Socket.Emit("change_name", name)
}

func GetName() (string, bool) {
	name, err := locstor.GetItem("poker_name")
	return name, err == nil
}

func Vote(vote string, selected bool) {
	if Socket == nil {
		return
	}
	if selected {
		Socket.Emit("vote", "")
	} else {
		Socket.Emit("vote", vote)
	}
}
