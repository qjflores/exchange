var Order = artifacts.require("./Order.sol");
var Exchange = artifacts.require("./Exchange.sol");

contract('Order', function(accounts){
  var order;
  var exchange;
  var _owner = accounts[0];
  it('init-exchange-with-owner', function(){
    var _owner = accounts[0];
    //TODO change this to msg.sender, otherwise anyone
    // can be deploy the contract with someone else as the owner
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
        return exchange.owner.call();
      })
      .then(function(owner) {
        assert.equal(owner, _owner);
      })  
  })
  it('init order contract with the deliveryAddress and amount', function(){
    var _deliveryAddress = accounts[3];
    var _amount = web3.toWei(1);
    return Order.new(_amount,{from:_deliveryAddress})
      .then(function(orderContract) {
        if(orderContract.address) {
          order = orderContract;
        } else {
          throw new Error('no contract address');
        }
        return true;
    }).then(function(value) {
      return order.deliveryAddress.call()
    }).then(function(dAddress){
      assert.equal(_deliveryAddress,dAddress)
      return order.amount.call()
    }).then(function(amount){
      assert.equal(1000000000000000000, amount.toNumber())
    });
  })

  it('registers-with-the-exchange', function(){
    //first ensure the order is not reistered with the exchange
    return exchange.isOrderExistByAddress(order.address)
      .then(function(exists){
        assert.equal(false, exists);
      })
    //then register the order with the exchange
      .then(function(){
        return order.registerOrder(exchange.address, web3.toWei(0.05));
      }).then(function(txHash){
        return exchange.isOrderExistByAddress(order.address)
      })
    //then ensure the order is registered with the exchange)
      .then(function(exists){
        assert.equal(true, exists);    
      })

    return true;
  })
})