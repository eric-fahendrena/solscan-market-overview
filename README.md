# Solscan Market Overview API

API to get the Daily Market Overview at Solscan.

## Installation
```bash
git clone https://github.com/eric-fahendrena/solscan-market-overview.git
cd solscan-market-overview
# install deps
npm install
```

## Run the API
Here is the route to get the data : `GET`: `localhost:3000/api`

The expected response should have the following structure :
```json
{
  "Market Overview": {
    "Price":"$1.554784",
    "Market Cap":"$1,552,989,041.04",
    "Current Supply":"998,845,525.19",
    "Holders":"179,573",
    "Price 24h Percent Change":"-5.19%"
  }
}
```
