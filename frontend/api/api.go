package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strings"
	"time"

	"github.com/icrowley/fake"
	"github.com/julienschmidt/sse"
	"github.com/rs/cors"
	"github.com/segmentio/ksuid"
)

var (
	version = "dev"
	commit  = "none"
)

type Event struct {
	ID           string  `json:"id"`
	CreateTime   string  `json:"create_time"`
	Organization string  `json:"organization"`
	Type         string  `json:"type"`
	Payload      Payload `json:"payload"`
}

type Payload struct {
	Reference   string `json:"reference"`
	Operator    string `json:"operator"`
	SubType     string `json:"subtype"`
	Short       string `json:"short"`
	Description string `json:"description"`
}

func main() {
	s := sse.New()
	g := NewGenerator(s)

	log.Println("bigblue frontend challenge - mock API")
	log.Println(fmt.Sprintf("%s - revision %s", version, commit))
	log.Println("starting api server at localhost:8080")

	go func() {
		g.Start("BBCG")
	}()

	if err := http.ListenAndServe(":8080", cors.Default().Handler(s)); err != nil {
		panic(err)
	}
}

type Generator struct {
	s *sse.Streamer
	o []*order

	maxOrders int
}

func NewGenerator(s *sse.Streamer) *Generator {
	return &Generator{
		s:         s,
		o:         make([]*order, 0),
		maxOrders: 20,
	}
}

func (g *Generator) Start(tenant string) {

	burst := false

	for {
		if rand.Intn(10) == 1 {
			burst = !burst
		}

		r := rand.Intn(g.maxOrders)
		if r >= len(g.o) {

			o := newOrder(tenant)
			evt := o.StatusEvent()

			if err := g.s.SendJSON(evt.ID, evt.Type, evt); err != nil {
				panic(err)
			}

			g.o = append(g.o, o)

		} else {

			o := g.o[r]

			var evt *Event
			if r%5 == 0 && o.Status < statusPrepared {
				evt = o.DataEvent()
			} else {
				o.Status = o.Status.Next()
				evt = o.StatusEvent()

				if o.Status == statusDelivered {
					g.o = append(g.o[:r], g.o[r+1:]...)
				}
			}

			if err := g.s.SendJSON(evt.ID, evt.Type, evt); err != nil {
				panic(err)
			}
		}

		if burst {
			time.Sleep(time.Duration(rand.Intn(900)+100) * time.Millisecond)
		} else {
			time.Sleep(time.Duration((rand.Intn(10) + 2)) * time.Second)
		}
	}
}

type order struct {
	ID     string
	Status orderStatus
}

func newOrder(tenant string) *order {
	return &order{
		ID:     tenant + strings.ToUpper(fake.CharactersN(8)),
		Status: statusCreated,
	}
}

const (
	OrderEvent        = "order_event"
	OrderDataUpdate   = "data_update"
	OrderStatusUpdate = "status_update"
)

func (o *order) DataEvent() *Event {

	short := "destination"
	desc := fake.StreetAddress()

	if rand.Intn(2) == 1 {
		short = "customer"
		desc = fake.Phone()
	}

	return &Event{
		ID:           ksuid.New().String(),
		CreateTime:   time.Now().Format(time.RFC3339),
		Organization: o.ID[:4],
		Type:         OrderEvent,
		Payload: Payload{
			Reference:   o.ID,
			Operator:    fake.FullName(),
			SubType:     OrderDataUpdate,
			Short:       short,
			Description: desc,
		},
	}
}

func (o *order) StatusEvent() *Event {

	return &Event{
		ID:           ksuid.New().String(),
		CreateTime:   time.Now().Format(time.RFC3339),
		Organization: o.ID[:4],
		Type:         OrderEvent,
		Payload: Payload{
			Reference:   o.ID,
			Operator:    "Bigblue System",
			SubType:     OrderStatusUpdate,
			Short:       o.Status.String(),
			Description: o.Status.Description(),
		},
	}
}

type orderStatus int

const (
	statusCreated           = 0
	statusTransmitted       = 1
	statusInPreparation     = 2
	statusPrepared          = 3
	statusShipped           = 4
	statusDeliveryException = 5
	statusDelivered         = 6
)

func (s orderStatus) String() string {
	switch s {
	case statusCreated:
		return "CREATED"
	case statusTransmitted:
		return "TRANSMITTED"
	case statusInPreparation:
		return "IN_PREPARATION"
	case statusPrepared:
		return "PREPARED"
	case statusShipped:
		return "SHIPPED"
	case statusDeliveryException:
		return "DELIVERY_EXCEPTION"
	case statusDelivered:
		return "DELIVERED"
	}
	return "UNKNOWN"
}

func (s orderStatus) Description() string {

	switch s {
	case statusCreated:
		return "Synced from e-shop"
	case statusTransmitted:
		return "Transmitted to the warehouse"
	case statusInPreparation:
		return "Preparation has started"
	case statusPrepared:
		return "Package(s) ready"
	case statusShipped:
		return "Package(s) aknownledged by carrier"
	case statusDeliveryException:
		if rand.Intn(2) == 1 {
			return "Failed Delivery Attempty"
		}
		return "Invalid destination address"
	case statusDelivered:
		if rand.Intn(2) == 1 {
			return "Delivered in customer's mailbox"
		}
		return "Delivered"
	}
	return ""
}

func (s orderStatus) Next() orderStatus {
	if s == statusShipped {
		if rand.Intn(20) != 1 {
			return statusDelivered
		}
	}
	return s + 1
}
