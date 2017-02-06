pragma solidity ^0.4.6;

contract Supplier {
  address public supplierAddress;
  bytes32 public name;

  function Supplier(address _supplierAddress, bytes32 _name) payable {
    supplierAddress = _supplierAddress;
    name = _name;
  }

  function getSupplierNameBytes() constant returns(bytes32 name){
      return name;
  }    
}