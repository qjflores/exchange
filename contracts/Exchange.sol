pragma solidity ^0.4.6;

import "./Supplier.sol";

contract Exchange {
  address public owner;
  mapping (bytes32 => address) supplierListed;


  struct Order {
    // the state can also be expressed as an
    // enum instead of a string
    bytes32 state;
    address contractAddress;
  }

  mapping (address => Order) orders;

  function Exchange(address _owner){
    owner = _owner;
  }

  function enlist(address supplierContractAddress) {
    Supplier supplierContract = Supplier(supplierContractAddress);
    bytes32 supplierNameBytes = supplierContract.getSupplierNameBytes();
    supplierListed[supplierNameBytes] = supplierContractAddress;
    Enlisted(supplierContractAddress);
  }

  function registerOrder(address _orderContractAddress) {
    orders[_orderContractAddress].state = "received";
    orders[_orderContractAddress].contractAddress = _orderContractAddress;
  }

  function isExistByBytes(bytes32 supplierNameBytes) constant returns (bool result) {
      //supplier
      if (supplierListed[supplierNameBytes] == 0x0) 
          return false;
      else 
          return true;                  
  }

  function isOrderExistByAddress(address _orderAddress) constant returns (bool result) {
    if(orders[_orderAddress].contractAddress != 0x0)
      return true;
    else
      return false;
  }

  event Enlisted(address indexed supplierContract);
}