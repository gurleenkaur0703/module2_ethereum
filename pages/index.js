import {useState, useEffect} from "react";
import {ethers} from "ethers";
import seaport_abi from "../artifacts/contracts/seaport.sol/seaport.json";

export default function HomePage(){

  const [ethWallet,setEthWallet] =useState(undefined);
  const [account,setAccount]=useState(undefined);
  const [seaport,setSeaport]=useState(undefined);
  const [totalShips,setTotalShips]=useState(undefined);
  const [shipAddress,setShipAddress]=useState("");
  const [shipDetails,setShipDetails]=useState([]);

  const contractAddress="0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const seaportABI=seaport_abi.abi;

  useEffect(()=>{
    getWallet();
  },[]);

  const getWallet=async()=>{
    if(window.ethereum){
      setEthWallet(window.ethereum);
    }
    if(ethWallet){
      const accounts=await ethWallet.request({method:"eth_accounts"});
      handleAccount(accounts);
    }
  };
  const handleAccount=(accounts)=>{
    if(accounts.length>0){
      console.log("Your Account Connects = ",accounts[0]);
      setAccount(accounts[0]);
      getSeaportContract();
    }
    else{
      console.error("Can't Connect the account");
    }
  };
  const connectAccount=async()=>{
    if(!ethWallet){
      alert("MetaMask Wallet is required to connect");
      return;
    }
    const accounts=await ethWallet.request({method:"eth_requestAccounts"});
    handleAccount(accounts);
  }

  const getSeaportContract=()=>{
    const provider=new ethers.providers.Web3Provider(ethWallet);
    const signer=provider.getSigner();
    const seaportContract=new ethers.Contract(contractAddress,seaportABI,signer);
    setSeaport(seaportContract);
  };
  const getTotalShips=async()=>{
    if(seaport){
      try{
        const totalShips=await seaport.totalShips();
        setTotalShips(totalShips.toNumber());
        getShipDetails();
      }catch(error){
        console.error("Unable to fetch details",error);
        alert("Unable to fetch totalShips");  
      }
    }
  };
  const dockShip=async()=>{
    if(seaport){
      try{
        let tx=await seaport.dockShip(shipAddress);
        await tx.wait();
        getTotalShips();
        setShipAddress("");
      }catch(error){
        console.error("Error Docking ship : ",error);
        alert("Can't Dock the Ship, Uncaught Error!");
      }
    }
  };
  const undockShip=async()=>{
    if(seaport){
      try{
        let tx=await seaport.undockShip(shipAddress);
        await tx.wait();
        getTotalShips();
        setShipAddress("");
      }catch(error){
        console.error("Error while UnDocking : ",error);
        alert("Can't unDock the Ship, Uncaught Error!");
      }
    }
  };
  const getShipDetails=async()=>{
    if(seaport){
      let details=[];
      for(let i=1;i<=3;i++){
         try{
          let shipAddress=await seaport.shipatport(i);
          details.push({port:i,address:shipAddress===ethers.constants.AddressZero?"N/A":shipAddress});
        }catch(error){
          console.error("Ship Details Fetching Error = ",error);
          alert("Can;t fetch Ship Details")
        }
      }
      setShipDetails(details);
    }

  };
  return(
    <main className="container">
    <header><h1>Welcome to Seaport Manager Admin Panel!</h1></header>
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
           <p>Ships Limit : 3</p>
           <p>Total Ships Present: {totalShips}</p> 
        </div>
        <div className="middle-panel">
           <input
             type="text"
             placeholder="Ship Address"
             value={shipAddress}
             onChange={(e) => setShipAddress(e.target.value)}
           />
           <button className="actionButton" onClick={dockShip}>Dock Ship</button>
           <button className="actionButton" onClick={undockShip}>Undock Ship</button>
        </div>
        <div className="all-ships">
          <h2>Ships at Port</h2>
          <table>
            <thead>
              <tr>
                <th>Port Number</th>
                <th>Ship Address</th>
              </tr>
            </thead>
            <tbody>
              {shipDetails.map((ship, index) => (
                <tr key={index}>
                  <td>{ship.port}</td>
                  <td>{ship.address}</td>
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
    .all-ships {
      margin-top: 20px;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 10px;
      background-color: #f9f9f9;
    }
    .all-ships h2 {
      margin-bottom: 20px;
    }
    .all-ships table {
      width: 100%;
      border-collapse: collapse;
    }
    .all-ships th, .all-ships td {
      border: 1px solid #ccc;
      padding: 10px;
      text-align: left;
    }
    .all-ships th {
      background-color: #f2f2f2;
    }
  `}</style>
    </main>    
  );

}
