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

func (s *Socket) Emit(msg string, args ...interface{}) {
	v := make([]interface{}, 0, len(args)+1)
	v = append(v, msg)
	v = append(v, args...)
	s.Call("emit", v...)
}
