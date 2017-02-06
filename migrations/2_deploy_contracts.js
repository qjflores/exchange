var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var Exchange = artifacts.require("./Exchange.sol");
var Order = artifacts.require("./Order.sol");
var Supplier = artifacts.require("./Supplier.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.deploy(Exchange);
  deployer.link(Exchange, Order);
  deployer.deploy(Order);
  deployer.link(Exchange, Supplier);
  deployer.deploy(Supplier);
};
