# Storage billing challenge

## Requirements

1. We value a **clean**, **simple** working solution.
2. The application must be runnable by starting a `start.sh` bash script at the root of the project, which should setup all relevant services and start.
3. You can choose whatever technology you'd like as long as you're able to justify it.
4. Candidates must submit the project as a private git repository (github.com, bitbucket.com, gitlab.com) or a zip file.
5. Having unit/integration tests is a strong bonus.
6. As we run automated tests on your project, you must comply to the API requirement as stipulated below. You can assume Docker is already installed in the test machine.

## Problem statement

We (Bigblue) have released a new storage pricing for our customers. As part of our engineering team, you're in charge of implementing the micro-service endpoint that does storage billing computation in our backend.

## Pricing description

When merchants store goods inside a Bigblue location, they're charged a daily per-item fee that depends on two parameters:

- Product size: larger items are more expensive to store
- Product age: storage is free during the 15 first days after a product arrives at the Bigblue location (as part of an "inbound shipment"), then price evolves with the time it's been sitting in the warehouse for.

Product age is computed per-item, so even if two products that are exactly similar are stored, they each are billed independently based on their "age" inside a Bigblue warehouse. The age of a product is computed using the date at which the inbound shipment that brought this product to the warehouse was offloaded. If it was offloaded on December 12th at 14:33, December 12th is day #0, 13th is day #1, etc.

Please note that not all products of a same type are brought into the warehouse at the same time: there can be multiple inbound shipments for the same product. In that case, products from the first inbound shipment will be "older" than products from the second one. In order to give an age to all products, we consider the inventory to be consumed in a perfect FIFO (First-In-First-Out) manner: older items are shipped first.

### Pricing per item per day

```
!! The prices below are not real Bigblue prices, they're random numbers for the sake of this challenge.
```

| Product size | First 15 days | 16th-> 183th day | 184th -> 366th day | over 12 months |
| ------------ | ------------- | ---------------- | ------------------ | -------------- |
| XS           | Free          | € 0.2            | € 0.3              | € 0.5          |
| S            | Free          | € 0.7            | € 0.11             | € 0.13         |
| M            | Free          | € 0.17           | € 0.19             | € 0.23         |
| L            | Free          | € 0.29           | € 0.31             | € 0.37         |

## API Specifications

In order to cut straight to the point, we've decided that this endpoint will handle JSON over HTTP, and have fixed the input and output formats.

While the technology choices are entirely yours, you are expected to follow the API specification as follows. Your implementation should not have any deviations on the method, URI path, request and response body. Such alterations may cause our automated tests to fail.

```
POST /storage-billing

{
	"billing_period": {
		"from_date": "2020-12-15",
		"to_date": "2020-12-31"
	},
	"daily_inventory": [
		"2020-12-30": [
			{
				"product": "BGBL-TSHIRT-BLUS",
				"quantity": 32
			},
			{
				"product": "BGBL-TSHIRT-BLUM",
				"quantity": 3
			},
			{
				"product": "BGBL-TSHIRT-BLUL",
				"quantity": 3
			},
		],
		"2020-12-31": [
			{
				"product": "BGBL-TSHIRT-BLUS",
				"quantity": 3
			},
			{
				"product": "BGBL-TSHIRT-BLUM",
				"quantity": 13
			},
			{
				"product": "BGBL-TSHIRT-BLUL",
				"quantity": 33
			}
		]
	],
	"inbound_shipments": [
		{
			"id": "BGBLINEU00001",
			"lines": [
				{
					"product": "BGBL-TSHIRT-BLUS",
					"quantity": 3
				},
				{
					"product": "BGBL-TSHIRT-BLUL",
					"quantity": 30
				}
			],
			"offload_complete_time": "2020-12-01T13:00:00Z"
		}
	],
	"products": [
		{
			"id": "BGBL-TSHIRT-BLUS",
			"size": "S", // overall object size, can be XS,S,M,L
			"create_time": "2020-11-01T13:22:33Z"
		},
		{
			"id": "BGBL-TSHIRT-BLUM",
			"size": "S",
			"create_time": "2020-10-01T13:11:31Z"
		}
	]
}

// OK RESPONSE
200 OK
Content-Type: application/json

{
	"2020-12-15": 32.5, // total storage price for this day
	"2020-12-16": 23.21,
	"2020-12-17": 90,
	...
}

// ERROR RESPONSE
400 Bad Request
Content-Type: application/json
{
    "error": "ERROR_DESCRIPTION"
}

```
