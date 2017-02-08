var Exchange = artifacts.require("./Exchange.sol");
var Supplier = artifacts.require("./Supplier.sol");
var Order = artifacts.require("./Order.sol");

contract('Exchange', function(accounts){
  var exchange;
  it('should-init-with-owner', function(){
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

  it('create-new-supplier-contract-and-enlist', function(){
    var supplier;
    var supplierAddress = accounts[1];
    var supplierName = "Supplier1";
    return Supplier.new(supplierAddress, supplierName, {supplierAddress, value:web3.toWei(10,"ether")})
      .then(function(supplierContract) {
        if(supplierContract.address) {
          supplier = supplierContract;
        } else {
          throw new Error('no contract address')
        }
        return true
      })
      .then(function(value){
        return supplier.getSupplierNameBytes();
      })
      .then(function(supplierName){
        return exchange.isExistByBytes(supplierName);
      })
      .then(function(exists){
        assert.equal(false, exists);
        return true
      })
      .then(function(value) {
        return exchange.enlist(supplier.address, {from:accounts[0]})
          .then(function(txHash){
            return supplier.getSupplierNameBytes();
          })
          .then(function(supplierName){
            return exchange.isExistByBytes(supplierName);
          })
          .then(function(exists){
            assert.equal(true, exists);
          })
      })
  })

  it('should-enlist-with-the-exchange',function(){
    return false;
  })
})