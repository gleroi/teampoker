package websocketjs

import (
	"errors"
	"io"
	"net"
	"net/http"

	"github.com/gopherjs/websocket"
	"github.com/zhouhui8915/engine.io-go/message"
	"github.com/zhouhui8915/engine.io-go/parser"
	"github.com/zhouhui8915/engine.io-go/transport"
)

var Creater = transport.Creater{
	Name:      "websocketjs",
	Upgrading: true,
	Server:    NewServer,
	Client:    NewClient,
}

func NewServer(w http.ResponseWriter, r *http.Request, callback transport.Callback) (transport.Server, error) {
	return nil, errors.New("not implemented")
}

type client struct {
	conn net.Conn
	resp *http.Response
}

func NewClient(r *http.Request) (transport.Client, error) {
	conn, err := websocket.Dial(r.URL.String())
	if err != nil {
		return nil, err
	}

	clt := &client{
		conn: conn,
	}
	return clt, nil
}

func (c *client) Response() *http.Response {
	return c.resp
}

func (c *client) NextReader() (*parser.PacketDecoder, error) {
	return parser.NewDecoder(c.conn)
}

func (c *client) NextWriter(msgType message.MessageType, packetType parser.PacketType) (io.WriteCloser, error) {
	return parser.NewBinaryEncoder(c.conn, packetType)
}

func (c *client) Close() error {
	return c.conn.Close()
}
