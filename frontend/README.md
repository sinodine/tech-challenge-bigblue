# **Software Engineer Challenge (Frontend)**

## **Introduction**

At Bigblue, we are processing e-commerce orders day and night. As a software engineer, you have to provide an efficient interface for our clients to track their operations. Your task here is to build a real-time fulfillment monitoring page.

## **Requirements**

1. We value a **clean**, **simple**, but still **visually pleasing** solution. You don’t have to be a designer but you must put some effort into making this look good.
2. The application must include the build tooling (gulp, npm, webpack, etc) to bundle your files.
3. We prefer Typescript, but the solution can also be written in Javascript.
4. Candidates must submit the project as a git repository (github.com, bitbucket.com, gitlab.com). Repository must avoid containing the words `bigblue` and `challenge`.
5. Having unit/end-to-end tests is a strong bonus.
6. Support for modern browsers only is enough.

## **Problem Statement**

1. Listen to events from the mock API at `localhost:8080/`. Refer to the [Event Schema](#event-schema) section.
2. Display those real-time fulfillment events on a single page. Feel free to group and reduce them for your solution to bring the most value to the end-user.
3. Your solution must handle network issues and auto-reconnect.

## **Event Schema**

Events coming from the mock API have a generic top-level schema, and an underlying payload specific to its type. For simplicity's sake, this challenge will only deal with events of type `order_event`.

```json
{
  "id": "1KEj2cQsQhEyQYUvMIcuEUCUBgV", // uuid
  "create_time": "2019-04-22T22:04:04+02:00", // iso8601 create time
  "organization": "BBCG", // owner organization
  "type": "order_event",
  "payload": <type-specific object>
}
```

_Top-level event schema_

```json
{
    "reference": "BBCG6801MU96", // order id
    "operator": "Bigblue System", // event triggerer
    "subtype": "status_update",
    "short": "CREATED",
    "description": "Synced from e-shop"
}
```

_`order_event` payload_

-   `subtype` can be `data_update` (order data changed) or `status_update` (order status changed)
-   when `subtype` is `status_update`, `short` is the order's new `status` code, which can be:
    -   `CREATED`
    -   `TRANSMITTED`
    -   `IN_PREPARATION`
    -   `PREPARED`
    -   `SHIPPED`
    -   `DELIVERY_EXCEPTION`
    -   `DELIVERED`

## **Running the mock API**

The mock API is available as a compiled binary you can run your preferred platform from the [Latest Release page](/../../releases/latest). You can also run the mock API from the source available in the [`api`](/api) directory by running the following command from the repo's root:

```sh
$(cd frontend/api && go run api.go)
```
