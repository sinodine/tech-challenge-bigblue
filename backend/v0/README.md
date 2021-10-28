# **Software Engineer Challenge (Backend)**

## **Introduction**

At Bigblue, we are receiving e-commerce orders day and night. As a software engineer, you have to provide a reliable backend that never loses track of anything. Your task here is to implement four endpoints to create and manage inventory reservations.

## **Requirements**

1. We value a **clean**, **simple** working solution.
2. The application must be run in Docker, candidate must provide `docker-compose.yml` and `start.sh` bash script at the root of the project, which should setup all relevant services/applications.
3. We prefer Golang, but the solution can also be written in one of the following languages/platforms: Java, Node.js, Ruby.
4. Candidates must submit the project as a private git repository (github.com, bitbucket.com, gitlab.com) or a zip file.
5. Having unit/integration tests is a strong bonus.
6. As we run automated tests on your project, you must comply to the API requirement as stipulated below. You can assume Docker is already installed in the test machine.
7. The solution must be production ready.

## **Problem Statement**

As customers order goods on our brands' e-commerce stores, we have to make sure that inventory is correctly reserved to ensure they don't sell more products than what they have in stock. An "inventory reservation" corresponds to one or several order lines (product + quantity) and a status: `RESERVED` or `BACKORDER` depending on whether the reservation was succesful. Last, inventory reservations must follow a first-come-first-served scheme.

1. Must be a RESTful HTTP API listening to port `8080` (or you can use another port instead and describe in the README)
2. The API must implement 4 endpoints with path, method, request and response body as specified
   - One endpoint to create a reservation (see sample)
     - To create a reservation, the API client must provide lines which are product + quantity pairs (see sample)
     - The API responds an object containing the generated reservation ID (see sample)
   - One endpoint to list reservations (see sample)
     - Reservations have a `status` field that is either `RESERVED` or `BACKORDER` (can also use `PENDING`) based on the success of their reservation process
   - One endpoint to set total inventory (count) for a product
   - One endpoint to list inventory counts for all products (see sample)
3. Products should be validated: a list of existing products is available at this url: [https://bigblue-challenge.vercel.app/api/backend/v0/products](https://bigblue-challenge.vercel.app/api/backend/v0/products)
4. The request input should be validated before processing. The server should return proper error response in case validation fails.
5. A Database must be used (SQL or NoSQL, at Bigblue we use both). The DB installation & initialisation must be done in `start.sh`.
6. All responses must be in json format no matter in success or failure situations.

## **Api Interface**

You are expected to follow the API specification as follows. Your implementation should not have any deviations on the method, URI path, request and response body. Such alterations may cause our automated tests to fail.

### Create reservation

- Method: `POST`
- URL path: `/reservations`
- Request body:

      {
        "lines": [
          {
            "product": <product_id>,
            "quantity": <product_qty>
          }
        ]
      }

- Response:

  Header: `HTTP 201` Body:

      {
        "id": <reservation_id>,
        "created_at": <iso_8601_date>,
        "lines": [
          {
            "product": <product_id>,
            "quantity": <product_qty>
          }
        ],
        "status": <status>
      }

  or

  Header: `HTTP <HTTP_CODE>` Body:

      {
        "error": "ERROR_DESCRIPTION"
      }

- Tips:
  - Reservation id in response should be unique. It can be an auto-incremental integer or any kind of unique string id.
  - `created_at` date must be a ISO 8601 date string
  - Clients should still be able to create reservations when a product is out of stock
  - `status` can be set synchronously or asynchronously. If asynchronous, this endpoint first returns a `PENDING` status.
  - Inventory reservations must follow a first-come-first-served scheme.
  - Since a product can only be reserved once, you must be mindful of race condition.

### **List reservations**

- Method: `GET`
- Url path: `/orders?cursor=:cursor&limit=:limit`
- Response: Header: `HTTP 200` Body:

      {
        "reservations": [
          {
            "id": <reservation_id>,
            "created_at": <iso_8601_date>,
            "lines": [
                {
                    "product": <product_id>,
                    "quantity": <product_qty>
                }
            ],
            "status": <status>
          },
            ...
        ],
         "cursor": <cursor>
      }

  or

  Header: `HTTP <HTTP_CODE>` Body:

      {
        "error": "ERROR_DESCRIPTION"
      }

- Tips:
  - If limit is not valid integer then you should return error response
  - The cursor is an optional way of iterating results by giving the next page's cursor in the response
  - If there is no result, then you should return an empty array json in response body, and and empty cursor

### Set inventory quantity

- Method: `POST`
- Url path: `/inventory`
- Request Body:

      {
        "product": <product_id>,
        "quantity": <qty>
      }

- Response: Header: `HTTP 200` Body:

      {
        "product": <product_id>,
        "quantity": <qty>
      }

  or

  Header: `HTTP <HTTP_CODE>` Body:

      {
        "error": "ERROR_DESCRIPTION"
      }

- Tips:
  - The product must exist (see above)

### List inventory

- Method: `GET`
- Url path: `/inventory?cursor=:cursor&limit=:limit`
- Response: Header: `HTTP 200` Body:

      {
        "inventory": [
            {
              "product": <product_id>,
              "quantity": <qty>,
              "available": <available>
            }
            ...
        ],
        "cursor": <cursor>
      }

  or

  Header: `HTTP <HTTP_CODE>` Body:

      {
        "error": "ERROR_DESCRIPTION"
      }

- Tips:
  - Available inventory means not reserved: `quantity = available + reserved`
