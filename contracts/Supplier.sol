pragma solidity ^0.4.6;

contract Supplier {
  address public supplierAddress;
  bytes32 public name;
  uint256 public supply;

  function Supplier(address _supplierAddress, bytes32 _name) payable {
    supplierAddress = _supplierAddress;
    name = _name;
    supply = msg.value;
  }

  function getSupplierNameBytes() constant returns(bytes32 name){
      return name;
  }

  function sendToOrder(address _recipientAddress, uint256 _amount) payable returns (bool result) {
    //if(!_recipientAddress.send()
    if(!_recipientAddress.send(_amount))
      throw;
    return true;
  }
}