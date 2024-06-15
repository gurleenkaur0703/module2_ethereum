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
        require(totalCars < totalSpaces, "No parking space available");
        for (uint i = 1; i <= totalSpaces; i++) {
            if (!spaceAvailability[i]) {
                spaceAvailability[i] = true;
                carAtSpace[i] = _carAddress;
                totalCars++;
                break;
            }
        }
    }

    function removeCar(address _carAddress) public onlyOwner {
        require(totalCars > 0, "No car to remove");
        bool carFound = false;
        uint spaceOfCar;

        for (uint i = 1; i <= totalSpaces; i++) {
            if (carAtSpace[i] == _carAddress) {
                spaceOfCar = i;
                carFound = true;
                break;
            }
        }

        require(carFound, "No car found!");

        carAtSpace[spaceOfCar] = address(0);
        spaceAvailability[spaceOfCar] = false;
        totalCars--;
    }

    function assertAvailability() public view {
        assert(totalCars >= 0 && totalCars <= totalSpaces);
    }
}

