// Package poker provides structures and a process to manage team poker planning sessions
package poker

import "sync"

var globalIDMutex = sync.Mutex{}
var globalID int

func nextID() int {
	globalIDMutex.Lock()
	defer globalIDMutex.Unlock()
	ID := globalID
	globalID++
	return ID
}

// Session for a poker planning
type Session struct {
	Players    []*Player
	CurrentRun Run
}

// Player is a participant in the poker planning session
type Player struct {
	Id   int
	Name string
}

type Run struct {
	Name  string
	Votes []string
}

// NewSession initializes a new poker planning session
func NewSession() *Session {
	poker := Session{
		Players: make([]*Player, 0, 8),
		CurrentRun: Run{
			Name:  "OSAK-96",
			Votes: make([]string, 0, 8),
		},
	}
	return &poker
}

// NewPlayer creates a player and add it to the poker planning session
func (poker *Session) NewPlayer() *Player {
	p := Player{
		Id:   nextID(),
		Name: "default",
	}
	poker.Players = append(poker.Players, &p)
	poker.CurrentRun.Votes = append(poker.CurrentRun.Votes, "")
	return &p
}

func (poker *Session) Record(player *Player, vote string) error {
	poker.CurrentRun.Votes[player.Id] = vote
	return nil
}

func (p *Player) ChangeName(name string) {
	p.Name = name
}
