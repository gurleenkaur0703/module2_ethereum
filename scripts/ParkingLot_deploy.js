const hre = require("hardhat");

async function main() {
  const ParkingLot = await hre.ethers.getContractFactory("ParkingLot");
  const parkingLot = await ParkingLot.deploy();
  await parkingLot.deployed();

  console.log(`ParkingLot contract deployed to: ${parkingLot.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
