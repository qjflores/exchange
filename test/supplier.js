var Exchange = artifacts.require("./Exchange.sol");
var Supplier = artifacts.require("./Supplier.sol");
var Order = artifacts.require("./Order.sol");

contract("Supplier", function(accounts){
  var supplier1Address = accounts[4];
  var supplier2Address = accounts[5];
  var supplier1;
  var supplier2;
  var balance = (acct) => {return web3.fromWei(web3.eth.getBalance(acct), 'ether').toNumber() }
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
          {from: supplier1Address,value:web3.toWei(11)})
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
        {from: supplier2Address,value:web3.toWei(2)})
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
      var _amount = web3.toWei(5);
      return Order.new(_customer,_amount, {from:_customer})
      .then(function(orderContract) {
        if(orderContract.address) {
          order = orderContract;
        } else {
          throw new Error('no contract address');
        }
        return true;
      })
      .then(function(value){
        return order.registerOrder(exchange.address, _amount, {from:_customer});
      })
      .then(function(txHash) {
        return exchange.currentTicket.call();
      })
      .then(function(currentTicket){
        assert.equal(1, currentTicket);
        return exchange.orderQueue(currentTicket);
      })
      .then(function(orderAddress){
        assert.equal(orderAddress, order.address);
        return exchange.getNextSupplier();
      })
      .then(function(supplierAddress) {
        assert.equal(supplierAddress, supplier1.address);
        return exchange.fulfillOrder({from: accounts[1]});
      })

      .then(function(txHash){
        assert.equal(6, balance(supplier1.address))
        assert.isAtLeast(balance(_customer), 104)
        return exchange.currentTicket.call();
      })
      .then(function(currentTicket){
        assert.equal(currentTicket.c[0], 2);
        return exchange.orderQueue(currentTicket);
      })
      .then(function(orderAddress){
        assert.equal(orderAddress, 0);
        return exchange.getNextSupplier();
      })
      .then(function(supplierAddress){
        assert.equal(supplierAddress, supplier2.address);
      })
    })
  })
})