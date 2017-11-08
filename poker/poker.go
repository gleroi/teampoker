// Package poker provides structures and a process to manage team poker planning sessions
package poker

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"sync"
)

type SessionSate struct {
	Players    map[PlayerId]Player
	Items      map[ItemId]Item
	CurrentRun Run
}

// Session for a poker planning
type Session struct {
	SessionSate
	mutex sync.Mutex
}

type PlayerId int

// Player is a participant in the poker planning session
type Player struct {
	Id   PlayerId
	Name string
}

type ItemId int

type Item struct {
	Name     string
	Result   string
	Historic map[PlayerId]string
}

type Run struct {
	Item  ItemId
	Votes map[PlayerId]string
}

var globalID int

func (poker *Session) NewId() int {
	poker.mutex.Lock()
	defer poker.mutex.Unlock()
	return nextId()
}

func nextId() int {
	ID := globalID
	globalID++
	return ID
}

// NewSession initializes a new poker planning session
func NewSession() *Session {
	poker := Session{
		SessionSate: SessionSate{
			Players: make(map[PlayerId]Player),
			Items:   make(map[ItemId]Item),
			CurrentRun: Run{
				Votes: make(map[PlayerId]string),
			},
		},
	}
	return &poker
}

func LoadSession(path string) (*Session, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()
	decoder := json.NewDecoder(file)
	session := Session{}
	err = decoder.Decode(&session)
	if err != nil {
		return nil, err
	}

	return &session, nil
}

func (poker *Session) Save(path string) error {
	poker.mutex.Lock()
	defer poker.mutex.Unlock()

	file, err := os.Create(path)
	if err != nil {
		return err
	}
	defer file.Close()
	encoder := json.NewEncoder(file)
	err = encoder.Encode(poker)
	if err != nil {
		return err
	}
	return nil
}

// NewPlayer creates a player and add it to the poker planning session
func (poker *Session) NewPlayer(id PlayerId) Player {
	poker.mutex.Lock()
	defer poker.mutex.Unlock()

	p, ok := poker.Players[id]
	if !ok {
		log.Printf("NewPlayer: player %d does not exist", id)
		p = Player{
			Id:   id,
			Name: "default",
		}
		poker.Players[p.Id] = p
		if poker.CurrentRun.Votes[p.Id] == "" {
			poker.CurrentRun.Votes[p.Id] = ""
		}
	}
	return poker.Players[p.Id]
}

func (poker *Session) ChangeName(id PlayerId, name string) {
	poker.mutex.Lock()
	defer poker.mutex.Unlock()

	p, ok := poker.Players[id]
	if !ok {
		return
	}
	p.Name = name
	poker.Players[id] = p
}

func (poker *Session) RemovePlayer(p Player) {
	poker.mutex.Lock()
	defer poker.mutex.Unlock()

	delete(poker.Players, p.Id)
	delete(poker.CurrentRun.Votes, p.Id)
}

func (poker *Session) AddItem(item string) {
	poker.mutex.Lock()
	defer poker.mutex.Unlock()

	itemId := ItemId(nextId())
	poker.Items[itemId] = Item{
		Name:   item,
		Result: "",
	}
}

func (poker *Session) DeleteItem(itemID ItemId) {
	poker.mutex.Lock()
	defer poker.mutex.Unlock()

	delete(poker.Items, itemID)
}

func (poker *Session) RunVote(id ItemId) error {
	poker.mutex.Lock()
	defer poker.mutex.Unlock()

	_, ok := poker.Items[id]
	if !ok {
		return fmt.Errorf("item %d does not exists", id)
	}
	poker.CurrentRun = Run{
		Item:  id,
		Votes: make(map[PlayerId]string),
	}
	for _, p := range poker.Players {
		poker.CurrentRun.Votes[p.Id] = ""
	}
	return nil
}

func (poker *Session) Record(player Player, vote string) {
	poker.mutex.Lock()
	defer poker.mutex.Unlock()

	poker.CurrentRun.Votes[player.Id] = vote
}

func (poker *Session) ResetVote() {
	poker.mutex.Lock()
	defer poker.mutex.Unlock()

	poker.CurrentRun.Votes = make(map[PlayerId]string)
	for _, p := range poker.Players {
		poker.CurrentRun.Votes[p.Id] = ""
	}
	item := poker.Items[poker.CurrentRun.Item]
	item.Result = ""
	item.Historic = nil
	poker.Items[poker.CurrentRun.Item] = item
}

func (poker *Session) CloseVote() {
	poker.mutex.Lock()
	defer poker.mutex.Unlock()

	item, ok := poker.Items[poker.CurrentRun.Item]
	if !ok {
		return
	}

	vote := findBestVote(poker.CurrentRun.Votes)
	item.Result = vote
	item.Historic = poker.CurrentRun.Votes
	poker.Items[poker.CurrentRun.Item] = item
}

func findBestVote(votes map[PlayerId]string) string {
	result := make(map[string]int)
	for _, vote := range votes {
		result[vote] = result[vote] + 1
	}
	var selectedCount int
	var tieCount int
	var selectedVote string
	for vote, count := range result {
		if count == selectedCount && selectedVote != "" {
			tieCount++
		}
		if count > selectedCount {
			selectedCount = count
			selectedVote = vote
			tieCount = 0
		}
	}
	if tieCount > 0 {
		return "tie"
	}
	return selectedVote
}
