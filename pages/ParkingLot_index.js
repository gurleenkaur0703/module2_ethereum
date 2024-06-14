import { useState, useEffect } from "react";
import { ethers } from "ethers";
import parkingLot_abi from "../artifacts/contracts/ParkingLot.sol/ParkingLot.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [parkingLot, setParkingLot] = useState(undefined);
  const [totalCars, setTotalCars] = useState(undefined);
  const [carAddress, setCarAddress] = useState("");
  const [carDetails, setCarDetails] = useState([]);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const parkingLotABI = parkingLot_abi.abi;

  useEffect(() => {
    getWallet();
  }, []);

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected:", accounts[0]);
      setAccount(accounts[0]);
      getParkingLotContract();
    } else {
      console.error("No accounts found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);
  };

  const getParkingLotContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const parkingLotContract = new ethers.Contract(contractAddress, parkingLotABI, signer);
    setParkingLot(parkingLotContract);
  };

  const getTotalCars = async () => {
    if (parkingLot) {
      try {
        const totalCars = await parkingLot.totalCars();
        setTotalCars(totalCars.toNumber());
        getCarDetails();
      } catch (error) {
        console.error("Unable to fetch totalCars", error);
        alert("Unable to fetch total cars");
      }
    }
  };

  const parkCar = async () => {
    if (parkingLot) {
      try {
        let tx = await parkingLot.parkCar(carAddress);
        await tx.wait();
        getTotalCars();
        setCarAddress("");
      } catch (error) {
        console.error("Error parking car:", error);
        alert("Can't park the car, uncaught error!");
      }
    }
  };

  const removeCar = async () => {
    if (parkingLot) {
      try {
        let tx = await parkingLot.removeCar(carAddress);
        await tx.wait();
        getTotalCars();
        setCarAddress("");
      } catch (error) {
        console.error("Error removing car:", error);
        alert("Can't remove the car, uncaught error!");
      }
    }
  };

  const getCarDetails = async () => {
    if (parkingLot) {
      let details = [];
      for (let i = 1; i <= 5; i++) {
        try {
          let carAddr = await parkingLot.carAtSpace(i);
          details.push({ space: i, address: carAddr === ethers.constants.AddressZero ? "N/A" : carAddr });
        } catch (error) {
          console.error("Car details fetching error:", error);
          alert("Can't fetch car details");
        }
      }
      setCarDetails(details);
    }
  };

  return (
    <main className="container">
      <header><h1>Welcome to the Parking Lot Manager!</h1></header>
      <div className="login">
        {!account && (
          <button id="connectButton" onClick={connectAccount}>
            Click Here To Login through Metamask
          </button>
        )}
        {account && (
          <div className="content">
            <div className="upper-panel">
              <p>Admin Account: {account}</p>
              <p>Parking Spaces: 5</p>
              <p>Total Cars Present: {totalCars}</p>
            </div>
            <div className="middle-panel">
              <input
                type="text"
                placeholder="Car Address"
                value={carAddress}
                onChange={(e) => setCarAddress(e.target.value)}
              />
              <button className="actionButton" onClick={parkCar}>Park Car</button>
              <button className="actionButton" onClick={removeCar}>Remove Car</button>
            </div>
            <div className="all-cars">
              <h2>Cars at Parking Lot</h2>
              <table>
                <thead>
                  <tr>
                    <th>Space Number</th>
                    <th>Car Address</th>
                  </tr>
                </thead>
                <tbody>
                  {carDetails.map((car, index) => (
                    <tr key={index}>
                      <td>{car.space}</td>
                      <td>{car.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        body {
          padding: 0;
          margin: 0;
          border: none;
        }
        .container {
          text-align: center;
          color: #333;
        }
        header {
          background-color: #282c34;
          padding: 20px;
          color: white;
          margin-bottom: 20px;
        }
        input {
          margin: 10px;
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }
        .actionButton {
          margin: 10px;
          padding: 10px 20px;
          border-radius: 5px;
          border: none;
          background-color: red;
          color: white;
          cursor: pointer;
          width: 20%;
        }
        .actionButton:hover {
          background-color: #21a1f1;
        }
        #connectButton {
          width: 300px;
          height: 70px;
          background: blue;
          cursor: pointer;
          padding: 10px 20px;
          border-radius: 5px;
          border: none;
          background-color: red;
          color: white;
          cursor: pointer;
        }
        #connectButton:hover {
          background-color: #21a1f1;
        }
        .content {
          width: 100%;
          height: 520px;
        }
        .upper-panel {
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          flex-direction: row;
          border: 1px solid black;
          padding: 10px;
        }
        .upper-panel p {
          font-size: 1.5rem;
          font-weight: bold;
        }
        .middle-panel {
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          flex-direction: row;
          height: 100px;
          margin-bottom: 20px;
        }
        .middle-panel input {
          width: 40%;
        }
        .middle-panel .actionButton {
          width: 100px;
        }
        .all-cars {
          margin-top: 20px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 10px;
          background-color: #f9f9f9;
        }
        .all-cars h2 {
          margin-bottom: 20px;
        }
        .all-cars table {
          width: 100%;
          border-collapse: collapse;
        }
        .all-cars th, .all-cars td {
          border: 1px solid #ccc;
          padding: 10px;
          text-align: left;
        }
        .all-cars th {
          background-color: #f2f2f2;
        }
      `}</style>
    </main>
  );
}
