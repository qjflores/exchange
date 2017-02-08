var Exchange = artifacts.require("./Exchange.sol");
var Supplier = artifacts.require("./Supplier.sol");
var Order = artifacts.require("./Order.sol");

contract("Supplier", function(accounts){
  var supplier1Address = accounts[4];
  var supplier2Address = accounts[5];
  var supplier1;
  var supplier2;

  it('init-2-supplier-contracts-and-enlist-with-exchange', function(){
    var exchange;
    var _owner = accounts[0];
    var order;
    var _customer = accounts[1];
    return Exchange.new(_owner)
      .then(function(exchangeContract) {
        if(exchangeContract.address) {
          exchange = exchangeContract;
        } else {
          throw new Error('no contract address');
        }
        return true;
        })
      .then(function(value){
      //assert that the latest ticket is 0
        return exchange.currentTicket.call();
      })
      .then(function(currentTicket){
        assert.equal(0, currentTicket);
      })
      .then(function(value){
        Supplier.new(supplier1Address, "supplier 1",
          {from: supplier1Address,value:web3.toWei(10, "ether")})
          .then(function(supplier1Contract){
            if(supplier1Contract.address){
              supplier1 = supplier1Contract;
            } else {
              throw new Error("no contract address");
            }
            return true
        })
      .then(function(value){
        return exchange.enlist(supplier1.address, {from:accounts[0]})
      })
      .then(function(txHash){
        return exchange.supplierQueue(1);
        //return supplier1.address;
      })
      .then(function(supplierAddress){
        assert.equal(supplierAddress,supplier1.address);
      })
      .then(function(value){
        Supplier.new(supplier2Address, "supplier 2", 
        {from: supplier2Address,value:web3.toWei(2, "ether")})
        .then(function(supplier2Contract){
          if(supplier2Contract.address){
            supplier2 = supplier2Contract;
          } else {
            throw new Error("no contract address");
          }
          return true
        })
        .then(function(value){
          return exchange.enlist(supplier2.address, {from:accounts[0]})
        })
        .then(function(txHash){
          return exchange.supplierQueue(2);
          //return supplier1.address;
        })
        .then(function(supplierAddress){
          assert.equal(supplierAddress,supplier2.address);
        })
      })
      return true;
    })
    //test that the new order contract updates the current ticket on the exchange
    .then(function(value){
      console.log("create a new order contract");
      var _amount = web3.toWei(5,"ether");
      return Order.new(_customer,_amount)
      .then(function(orderContract) {
        if(orderContract.address) {
          order = orderContract;
        } else {
          throw new Error('no contract address');
        }
        return true;
      })
      .then(function(value){
        return order.registerOrder(exchange.address);
      })
      .then(function(txHash) {
        return exchange.currentTicket.call()
      })
      .then(function(currentTicket){
        assert.equal(1, currentTicket);
      })
    })
  })
})