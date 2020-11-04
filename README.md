# Nodejs_get_ETH_balance

[![made-with-nodejs](https://img.shields.io/badge/Made%20with-Nodejs-1f425f.svg)](https://nodejs.org/)
[![made-with-socketio](https://img.shields.io/badge/Made%20with-SocketIO-1f425f.svg)](https://socket.io/)
[![made-with-infura](https://img.shields.io/badge/Made%20with-Infura-1f425f.svg)](https://infura.io/)
[![made-with-web3js](https://img.shields.io/badge/Made%20with-web3js-1f425f.svg)](https://web3js.readthedocs.io/en/v1.3.0/)

---

<br/>

## [문일주](https://github.com/mooniljoo)

### [ [LinkedIn](https://www.linkedin.com/in/oneweek/) ] [ [Blog](https://mooniljoo.github.io/) ]

---

### Usage
1. You need to INFURA Api Token
```javascript
//index.js
var web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://mainnet.infura.io/v3/_API_TOKEN_"
  )
);
```

2. Enter Token Address of ETH COIN
```javascript
//index.html
function selectElem(el) {
      var CoinTokenAddress = '_TOKEN_ADDRESS_VALUE_'
```

3. Execute
```cmd
node index.js
```
