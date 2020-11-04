var Web3 = require("web3");
var express = require("express");
var app = express();
var Personal = require("web3-eth-personal");
const Tx = require("ethereumjs-tx").Transaction;
//io모드
var http = require("http").Server(app);
var io = require("socket.io")(http);
//파일 로딩
//var abi = require("./abi/abi.js");
var abi = require("./abi/human_standard_token_abi.js");
//전역변수
var port = 3000;
var address,
  contractAddress,
  contractABI,
  tokenContract,
  decimals,
  balance,
  tokenBalance,
  name,
  symbol,
  adjustedBalance;
//web3 객체
var web3 = new Web3(
  new Web3.providers.HttpProvider(
    // "https://mainnet.infura.io/v3/_API_TOKEN_"
    "https://mainnet.infura.io/v3/~~~~~~~~~~~~~~~"
  )
);
//personal 객체
var personal = new Personal(Personal.givenProvider);

//정적경로 설정
app.use(express.static("css"));

//라우팅
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

//서버 실행
http.listen(port, function() {
  console.log("Server On!");
});

const promisify = inner =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(res);
      }
    }).then(function(result) {
      return result;
    })
  );

//io모드 접속 시작
io.on("connection", function(socket) {
  console.log("User Connected : ", socket.id);

  //접속이 종료 되었을 때
  socket.on("disconnect", function() {
    console.log("User Disconnected : ", socket.id);
  });

  //클라이언트에서 newAccount를 클릭했을 때
  socket.on("get transaction data", function(txtHash) {
    try {
      web3.eth.getTransaction(txtHash).then(function(result) {
        console.log(result);
        socket.emit("got transaction", result);
      });
    } catch (e) {
      console.log(e);
      socket.emit("Exception Occured : ", e);
    }
  });

  //클라이언트에서 보내기를 눌렀을 때
  socket.on("send transaction", function(
    fromAddress,
    toAddress,
    ToCoin,
    Password,
    TokenAddress
  ) {
    try {
      console.log(fromAddress, toAddress, ToCoin, Password, TokenAddress);
      var contract = new web3.eth.Contract(abi, TokenAddress);
      var privateKey = new Buffer("지갑privatekey", "hex");
      //var count = Web3.eth.getTransactionCount(fromAddress, 'latest');
      web3.eth.getTransactionCount(fromAddress, function(error, txCount) {
        if (error) console.log("Error - getTransactionCount", error);
        else {
          console.log("nonce: " + txCount);
          var rawTransaction = {
            nonce: txCount,
            from: fromAddress,
            to: TokenAddress,
            value: 0,
            // data: contract.transfer.getData(toAddress, ToCoin),
            data: contract.methods
              .transfer(toAddress, ToCoin * 1000)
              .encodeABI(),
            gas: web3.utils.toHex("42000"),
            gasPrice: web3.utils.toHex("45000000000"),
            gasLimit: web3.utils.toHex("18000"),
            chainId: 1
          };

          console.log(rawTransaction.data);
          console.log(rawTransaction.nonce);
          z;
          var tx = new Tx(rawTransaction);
          tx.sign(privateKey);
          var serializedTx = tx.serialize();

          web3.eth.sendSignedTransaction(
            "0x" + serializedTx.toString("hex"),
            function(error, result) {
              if (error) {
                console.log("DEBUG - error in _sendToken ", error);
              }
              console.log(result);
            }
          );
        }
      });
    } catch (e) {
      console.log(e);
      socket.emit("Exception Occured : ", e);
    }
  });

  //클라이언트에서 tokenAddress가 넘어올 때
  socket.on("getTokenAddress", function(contractAddress, address) {
    try {
      // var contract = new web3.eth.Contract(abi, contractAddress);
      // contract.methods.totalSupply().call(function(err, result){
      //   console.log(result)
      // })
      tokenContract = new web3.eth.Contract(abi, contractAddress);
      var promise1 = new Promise((resolve, reject) =>
        tokenContract.methods.balanceOf(address).call((err, res) => {
          if (err) {
            reject("Getting TokenBalance failed : " + err);
          } else {
            resolve(res);
          }
        })
      );
      var promise2 = new Promise((resolve, reject) =>
        tokenContract.methods.symbol().call((err, res) => {
          if (err) {
            reject("Getting TokenSymbol failed : " + err);
          } else {
            resolve(res);
          }
        })
      );
      var promise3 = new Promise((resolve, reject) =>
        tokenContract.methods.name().call((err, res) => {
          if (err) {
            reject("Getting TokenName failed : " + err);
          } else {
            resolve(res);
          }
        })
      );
      var promise4 = new Promise((resolve, reject) =>
        tokenContract.methods.decimals().call((err, res) => {
          if (err) {
            reject("Getting TokenDecimals failed : " + err);
          } else {
            resolve(res);
          }
        })
      );

      Promise.all([promise1, promise2, promise3, promise4]).then(function(
        result
      ) {
        console.log(result);
        socket.emit("getTokenBalance", result);
      });

      // new Promise((resolve, reject) => {
      //   contract.methods.balanceOf(address).call((err, arg) => {
      //     if (err) {
      //       reject(err);
      //     } else {
      //       resolve('성공');
      //     }
      //   }).then(arg => {
      //     tokenBalance = arg
      //     console.log(tokenBalance)
      //     socket.emit("getTokenBalance", tokenBalance);
      //   });
      // });
    } catch (e) {
      console.log(e);
      socket.emit("Exception Occured : ", e);
    }
  });

  //클라이언트에서 address가 넘어올 때
  socket.on("getAddress", function(address) {
    console.log(address);
    try {
      web3.eth.getBalance(address).then(function(result) {
        console.log(result);
        balance = result;
        socket.emit("getBalance", balance);
      });
    } catch (e) {
      console.log(e);
      socket.emit("invalid address", e);
    }
  });
});
