package socketio

import (
	"github.com/gopherjs/gopherjs/js"
)

type Socket struct {
	*js.Object

	Id string `js:"id"`
}

func New(url string) *Socket {
	jsSocket := js.Global.Get("io").Invoke(url)
	socket := Socket{jsSocket, ""}
	return &socket
}

func (s *Socket) On(msg string, callback func(v ...interface{})) {
	s.Call("on", msg, callback)
}
