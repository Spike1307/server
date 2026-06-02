# Dashboard setup

### Grafana:

1. Add prometheus as a data source. 
    http://prometheus:9090

2. Create new dashboard

Select type
Give title
change to code
put in PromQL query


# List of queries:


## Moves


Moves per minute:

sum(rate(game_requests_total{endpoint="/move", status="200"}[1m])) * 60

total (rate of ( move requests that are successful)[ average rate in the last minute]) * every minute



## Logins

can be done together, just need numbers, not time

Total successful logins:

sum(game_requests_total{endpoint="/login", status="200"})

total invalid credentials:

sum(game_requests_total{endpoint="/login", status="401"})

Total bad request logins:

sum(game_requests_total{endpoint="/login", status="400"})


## Info

Total info requests

sum(game_requests_total{endpoint="/info"})


## Game actions

can group the following

Total use requests

sum(game_requests_total{endpoint="/use"})

total place requests

sum(game_requests_total{endpoint="/place"})

total take requests

sum(game_requests_total{endpoint="/take"})

