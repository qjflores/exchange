pragma solidity ^0.4.6;

import "./Exchange.sol";

contract Order {
  address public deliveryAddress;
  address public supplierAddress;
  uint public amount;
  string public state;

  function Order(address _deliveryAddress, uint _amount) {
    state = "receivedOrder";
    amount = _amount;
    deliveryAddress = _deliveryAddress;
  }

  function receivedPaymentConfirmation() returns (string) {
    state = "receivedPaymentConfirmation";
    return state;
  }

  function registerOrder(address exchangeCantractAddress) {
    Exchange exchangeContract = Exchange(exchangeCantractAddress);
    exchangeContract.registerOrder(this);
  }

  function getSupplierAddressFromExchange() returns (address) {
    //TODO figure out a way to mask this
    return supplierAddress;
  }
}