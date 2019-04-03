package main

import (
	"encoding/json"
	"net/http"
)

type Product struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type ProductsResponse struct {
	Products []*Product `json:"products"`
}

var products = []*Product{
	&Product{
		ID:   "PIPR-JACKET-SIZM",
		Name: "Pied Piper Jacket - Size M",
	},
	&Product{
		ID:   "PIPR-JACKET-SIZL",
		Name: "Pied Piper Jacket - Size L",
	},
	&Product{
		ID:   "PIPR-JACKET-SIXL",
		Name: "Pied Piper Jacket - Size XL",
	},
	&Product{
		ID:   "PIPR-SVLMUG-GREN",
		Name: "Silicon Valley Mug - Green",
	},
	&Product{
		ID:   "PIPR-SVLMUG-YLOW",
		Name: "Silicon Valley Mug - Yellow",
	},
	&Product{
		ID:   "PIPR-MOSPAD-0000",
		Name: "Silicon Valley Mousepad",
	},
	&Product{
		ID:   "PIPR-SMFRDG-0000",
		Name: "Smart Fridge",
	},
}

// Handler replies with the products response to any request
func Handler(w http.ResponseWriter, r *http.Request) {

	b, err := json.Marshal(&ProductsResponse{
		Products: products,
	})

	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	_, err = w.Write(b)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}
