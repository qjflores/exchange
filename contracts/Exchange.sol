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
    address recipientAddress;
    uint256 amount;
  }

  struct supplier {
    uint ticket;
    address contractAddress;
  }

  mapping (address => Order) orders;
  mapping (uint => address) public supplierQueue;
  mapping (uint => address) public orderQueue;

  function Exchange(address _owner){
    owner = _owner;
    currentTicket = 0;
    recentTicket = 0;
  }

  function enlist(address supplierContractAddress) {
    // TODO if already enlisted throw
    Supplier supplierContract = Supplier(supplierContractAddress);
    bytes32 supplierNameBytes = supplierContract.getSupplierNameBytes();
    supplierListed[supplierNameBytes] = supplierContractAddress;
    recentTicket = recentTicket + 1;
    supplierQueue[recentTicket] = supplierContractAddress;
    Enlisted(supplierContractAddress);
  }

  function registerOrder(address _recipientAddress, uint256 _amount) {
    orders[msg.sender].state = "received";
    orders[msg.sender].contractAddress = msg.sender;
    //TODO checkt that the _recipientAddress address is not 0x0
    orders[msg.sender].recipientAddress = _recipientAddress;
    orders[msg.sender].amount = _amount;
    currentTicket = currentTicket + 1;
    orderQueue[currentTicket] = msg.sender;
  }

  function getNextSupplier() constant returns (address supplierAddress) {
    return supplierQueue[currentTicket];
  }

  function fulfillOrder() returns (bool result) {
    // TODO only the owner can call this function
    address supplierContractAddress = getNextSupplier();
    address _orderAddress;
    Supplier supplierContract = Supplier(supplierContractAddress);
    _orderAddress = orderQueue[currentTicket];
    // TODO update state and check if the transaction goes through
    // if the transaction does not go through revert the state
    supplierContract.sendToOrder(orders[_orderAddress].recipientAddress, orders[_orderAddress].amount);
    currentTicket = currentTicket + 1;
    /* if(!supplierContract.sendToOrder(_orderAddress, orders[_orderAddress].recipientAddress)){
      currentTicket = currentTicket - 1;
      return false;
    } else {
      return true;
    } */
    //_supplierAddress = supplierQueue[currentTicket];
    //if(!_supplierAddresssendWithGas
/*     if(!_orderAddress.send({from:_supplierAddress, value:orderContract.amount}))
      throw;
    else{
      return true;
    } */
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

  function sendWithGas(address destination, uint256 value, uint256 extraGasAmt) internal returns (bool){
      return destination.call.value(value).gas(extraGasAmt)();
    }

  event Enlisted(address indexed supplierContract);
}