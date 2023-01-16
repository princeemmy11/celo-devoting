
import './App.css';
import Home from './components/home';
import { Candidates } from './components/candidates';
import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import devote from "./contracts/devote.abi.json";
import IERC from "./contracts/IERC.abi.json";
import { Voters } from './components/voters';
import Spinner from 'react-bootstrap/Spinner';


const ERC20_DECIMALS = 18;
const contractAddress = "0x9b36359638CceF7e2867Cf4b2F680EB609B4dc47";
// "0x3456A620e67891a333F934584F332E4460F4E043";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";



function App() {
  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [candidates, setCandidates] = useState([]);
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(false);
  


  const connectToWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];
        kit.defaultAccount = user_address;

        await setAddress(user_address);
        await setKit(kit);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Error Occurred");
    }
  };

  const getBalance = useCallback(async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);

      const contract = new kit.web3.eth.Contract(devote, contractAddress);
      setcontract(contract);
      setcUSDBalance(USDBalance);
    } catch (error) {
      console.log(error);
    }
  }, [address, kit]);



  const getCandidates = useCallback(async () => {
    const candidatesLength = await contract.methods.noOfcandidate().call();
    const candidates = [];
    for (let index = 0; index < candidatesLength; index++) {
      let _candidates = new Promise(async (resolve, reject) => {
      let candidate = await contract.methods.getCandidate(index).call();

        resolve({
          index: index,
          candidateAddress: candidate[0],
          name: candidate[1],
          age: candidate[2],
          image: candidate[3],
          description: candidate[4],
          voteCount: candidate[5],
         
        });
      });
      candidates.push(_candidates);
    }


    const _candidates = await Promise.all(candidates);
    setCandidates(_candidates);
  }, [contract]);

  const getVotersList = useCallback( async () => {
    try {
      const votersList =  await contract.methods.getVotersList().call();

      setVoters(votersList);

    } catch (e) {
        console.log({e});
    }
}, [contract]);


  const addCandidate = async (
    _address,
    _name,
    _age,
    _image,
    _description,
 
  ) => {  
    try {
      setLoading(true);
      await contract.methods
        .addCandidate(_address, _name, _age, _image, _description)
        .send({ from: address });
      getCandidates();
      getVotersList();
      setLoading(false);
    } catch (error) {
      alert(error);
    }
  };


  const giveVotingRight = async (voterAddress) => { 
    try {
      const voter = await contract.methods.voters(address).call();
      if(!voter.allowed) {
        setLoading(true);
        await contract.methods.giveVotingRight(voterAddress).send({ from: address });
        getCandidates();
        getVotersList();
        setLoading(false);
        alert("you have successfully given right to vote");
      } else {
        alert("Voter already has voting right");
      }
    } catch (error) {
      alert(error);
    }};

    

  const vote = async (index) => {
    try {
      const cUSDContract = new kit.web3.eth.Contract(IERC, cUSDContractAddress);
      let ammount = new BigNumber(1).shiftedBy(ERC20_DECIMALS).toString();
      const voter = await contract.methods.voters(address).call();
      console.log(voter);
      const candidates = await contract.methods.candidates(index).call();
      console.log(candidates);

      // const votes = await contract.methods.votes(address, candidates.candidateAddress).call();
      // console.log(votes);
      // check if voter has already voted for this candidate
      // else if(votes) {
      //   alert("Voter has already voted");
      // }
      
      // check if voter has voting right
      if(!voter.allowed) {
        alert("Voter has no voting right");
      }
      // check if voter has already voted
      else if(voter.voted) {
        alert("Voter has already voted");
      }
      // check if candidate is the voter
      else if (candidates.candidateAddress === address) {
        alert("Candidate can't vote for themselves");
      }
      // else vote a candidate
      else {
        setLoading(true);
        await cUSDContract.methods
          .approve(contractAddress, ammount)
          .send({ from: address });
        await contract.methods.vote(index, ammount).send({ from: address });
        getCandidates();
        getVotersList();
        getBalance();
        setLoading(false);
        alert("you have successfully voted for this candidate");
      }
    } catch (error) {
      alert(error);
    }};


  useEffect(() => {
    connectToWallet();
  }, []);

  useEffect(() => {
    if (kit && address) {
      getBalance();
    }
  }, [kit, address, getBalance]);

  useEffect(() => {
    if (contract) {
      getCandidates();
      getVotersList();
    }
  }, [contract, getCandidates, getVotersList]);
  
  return (
    <div className="App">
      <Home cUSDBalance={cUSDBalance} addCandidate={addCandidate} giveVotingRight={giveVotingRight} />
      <Voters voters={voters} />
      <Candidates 
      candidates={candidates}
      vote={vote} 
      walletAddress={address} 
      />
      {loading && (
        <div className='d-flex flex-column justify-content-center align-items-center position-absolute top-0 start-0 w-100 h-100 bg-white opacity-75 zindex-1'>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <h1>Loading, please wait...</h1>
        </div>
        )
      }
      
    </div>
  );
}

export default App;