// Package poker provides structures and a process to manage team poker planning sessions
package poker

import "sync"
import "fmt"

// Session for a poker planning
type Session struct {
	Players    map[int]*Player
	Items      []*Item
	CurrentRun Run
	mutex      sync.Mutex
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

var globalID int

func (poker *Session) NewId() int {
	poker.mutex.Lock()
	defer poker.mutex.Unlock()
	ID := globalID
	globalID++
	return ID
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
func (poker *Session) NewPlayer(id int) *Player {
	poker.mutex.Lock()
	defer poker.mutex.Unlock()

	p := poker.Players[id]
	if p == nil {
		p = &Player{
			Id:   id,
			Name: "default",
		}
		poker.Players[p.Id] = p
		if poker.CurrentRun.Votes[p.Id] == "" {
			poker.CurrentRun.Votes[p.Id] = ""
		}
	}
	return p
}

func (poker *Session) RemovePlayer(p *Player) {
	poker.mutex.Lock()
	defer poker.mutex.Unlock()

	delete(poker.Players, p.Id)
	delete(poker.CurrentRun.Votes, p.Id)
}

func (poker *Session) AddItem(item string) {
	poker.mutex.Lock()
	defer poker.mutex.Unlock()

	poker.Items = append(poker.Items, &Item{
		Name:   item,
		Result: "",
	})
}

func (poker *Session) RunVote(id int) error {
	poker.mutex.Lock()
	defer poker.mutex.Unlock()

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
	poker.mutex.Lock()
	defer poker.mutex.Unlock()

	poker.CurrentRun.Votes[player.Id] = vote
}

func (poker *Session) ResetVote() {
	poker.mutex.Lock()
	defer poker.mutex.Unlock()

	poker.CurrentRun.Votes = make(map[int]string)
	for _, p := range poker.Players {
		poker.CurrentRun.Votes[p.Id] = ""
	}
	poker.CurrentRun.Item.Result = ""
	poker.CurrentRun.Item.Historic = nil
}

func (poker *Session) CloseVote() {
	poker.mutex.Lock()
	defer poker.mutex.Unlock()

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
			selectedCount = count
		}
	}
	poker.CurrentRun.Item.Result = selectedVote
	poker.CurrentRun.Item.Historic = poker.CurrentRun.Votes
}

func (p *Player) ChangeName(name string) {
	p.Name = name
}
