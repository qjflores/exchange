pragma solidity ^0.4.6;

import "./Exchange.sol";

contract Order {
  address public deliveryAddress;
  uint256 public amount;
  string public state;

  function Order(uint256 _amount) {
    state = "receivedOrder";
    amount = _amount;
    deliveryAddress = msg.sender;
  }

  function receivedPaymentConfirmation() returns (string) {
    state = "receivedPaymentConfirmation";
    return state;
  }

  function registerOrder(address exchangeCantractAddress, uint256 _amount) {
    Exchange exchangeContract = Exchange(exchangeCantractAddress);
    exchangeContract.registerOrder(deliveryAddress, _amount);
  }

}