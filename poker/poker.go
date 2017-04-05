// Package poker provides structures and a process to manage team poker planning sessions
package poker

import "sync"
import "fmt"

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
	Players    map[int]*Player
	Items      []*Item
	CurrentRun Run
}

// Player is a participant in the poker planning session
type Player struct {
	Id   int
	Name string
}

type Item struct {
	Name     string
	Result   string
	Historic map[int]string
}

type Run struct {
	Item  *Item
	Votes map[int]string
}

// NewSession initializes a new poker planning session
func NewSession() *Session {
	poker := Session{
		Players: make(map[int]*Player),
		Items:   make([]*Item, 0, 32),
		CurrentRun: Run{
			Item:  nil,
			Votes: make(map[int]string),
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
	poker.Players[p.Id] = &p
	poker.CurrentRun.Votes[p.Id] = ""
	return &p
}

func (poker *Session) RemovePlayer(p *Player) {
	delete(poker.Players, p.Id)
	delete(poker.CurrentRun.Votes, p.Id)
}

func (poker *Session) AddItem(item string) {
	poker.Items = append(poker.Items, &Item{
		Name:   item,
		Result: "",
	})
}

func (poker *Session) RunVote(id int) error {
	if id >= len(poker.Items) {
		return fmt.Errorf("item %d does not exists", id)
	}
	poker.CurrentRun = Run{
		Item:  poker.Items[id],
		Votes: make(map[int]string),
	}
	return nil
}

func (poker *Session) Record(player *Player, vote string) {
	poker.CurrentRun.Votes[player.Id] = vote
}

func (poker *Session) ResetVote() {
	poker.CurrentRun.Votes = make(map[int]string)
	for _, p := range poker.Players {
		poker.CurrentRun.Votes[p.Id] = ""
	}
	poker.CurrentRun.Item.Result = ""
	poker.CurrentRun.Item.Historic = nil
}

func (poker *Session) CloseVote() {
	if poker.CurrentRun.Item == nil {
		return
	}
	result := make(map[string]int)
	for _, vote := range poker.CurrentRun.Votes {
		result[vote] = result[vote] + 1
	}
	var selectedCount int
	var selectedVote string
	for vote, count := range result {
		if count >= selectedCount {
			selectedVote = vote
		}
	}
	poker.CurrentRun.Item.Result = selectedVote
	poker.CurrentRun.Item.Historic = poker.CurrentRun.Votes
}

func (p *Player) ChangeName(name string) {
	p.Name = name
}
