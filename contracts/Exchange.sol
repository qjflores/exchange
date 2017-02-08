pragma solidity ^0.4.6;

import "./Supplier.sol";

contract Exchange {
  address public owner;
  uint public currentTicket; // the next ticket to be served once an order has come in
  uint public recentTicket; // the ticket most in the future to serve the order

  mapping (bytes32 => address) supplierListed; // NOTE: This mapping might not be necessary


  struct Order {
    // the state can also be expressed as an
    // enum instead of a string
    bytes32 state;
    address contractAddress;
  }

  struct supplier {
    uint ticket;
    address contractAddress;
  }

  mapping (address => Order) orders;
  mapping (uint => address) public supplierQueue;

  function Exchange(address _owner){
    owner = _owner;
    currentTicket = 0;
    recentTicket = 0;
  }

  function enlist(address supplierContractAddress) {
    Supplier supplierContract = Supplier(supplierContractAddress);
    bytes32 supplierNameBytes = supplierContract.getSupplierNameBytes();
    supplierListed[supplierNameBytes] = supplierContractAddress;
    recentTicket = recentTicket + 1;
    supplierQueue[recentTicket] = supplierContractAddress;
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