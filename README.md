# Solscan Market Overview API

API to get the Daily Market Overview at Solscan.

## Installation
```bash
git clone https://github.com/eric-fahendrena/solscan-market-overview.git
cd solscan-market-overview
# install deps
npm install
node index.js
```

## How to Get Datas

### Market Overview 
**URL** : `GET` `http://localhost:3000/api/market-overview`

**Expected Response**
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

### Holders Last Qualified Percentage
**URL**: `GET` `http://localhost:3000/api/holders/last-qualified`

**Expected Response** :
```json
{
  "ID":"255",
  "Account":"9UtFmsqUVZQ3usiaqDJLeMSzjLsMbLjqpeZdR2wvHoSx",
  "Token Account":"HtgF1SQMd8tQPkpb4QYZYZfHjzWW2zx9YNMTD29g3wg1",
  "Percentage":"0.10%"
}
```

*The script should load every page until it gets the last qualified holder. So, loading could be long according to the number of the qualified holders.*

