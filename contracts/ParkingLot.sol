// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract ParkingLot {
    address public owner;
    uint public totalSpaces = 5;  
    uint public totalCars = 0;

    constructor() {
        owner = msg.sender;
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "Only Owner Can Access");
        _;
    }
    mapping(uint => bool) public spaceAvailability;    
    mapping(uint => address) public carAtSpace;

    function parkCar(address _carAddress) public onlyOwner {
        require(totalCars < 5, "no parking space available");
       
        for (uint i = 1; i <= 5; i++) {
            if (spaceAvailability[i] == false) {
                spaceAvailability[i] = true;
                carAtSpace[i] = _carAddress;
                totalCars++;
                break;
            }
        }
    }
    function removeCar(address _carAddress) public onlyOwner {
        require(totalCars > 0, "no car to remove");
        uint spaceOfCar = 1;
        bool carFound = false;

        for (uint i = 1; i <= 5; i++) {
            if (carAtSpace[i] == _carAddress) {
                spaceOfCar = i;
                carFound = true;
            }
        }
        carAtSpace[spaceOfCar] = address(0);
        spaceAvailability[spaceOfCar] = false;
        totalCars--;

        if (!carFound) {
            revert("No car Found!");
        }
    }
    function assertAvailabilty() public view {
        assert(totalCars >= 0 && totalCars <= 5);
    }
}
