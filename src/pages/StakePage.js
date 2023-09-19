import { ethers } from "ethers";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CONTRACTS_REQUEST,
  CONTRACTS_SUCCESSFUL,
} from "../features/slicers/blockainSlicer";
import Staking from "../artifacts/contracts/Stake.sol/Staking.json";
import { FunctionFragment } from "ethers/lib/utils";

export default function StakePage() {
  const dispatch = useDispatch();
  const connectionState = useSelector((state) => state.blockchainReducer);
  const [stakingContractObj, setStakingContractObj] = useState(null);
  const [tokenContractObj, setTokenContractObj] = useState(null);
  const [quantity, setQuantity] = useState(0);

  const [stakes, setStakes] = useState([]);
  const [rewards, setRewards] = useState([]);

  const stake = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    //Pentru instantiere contract avem nevoie de adresa lui,ABI si signer
    const stakeaddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const tokenaddress = "0x2e5E530dC2C6b2A8f214ee929dC4a302575881A9";
    const payload = { stake: stakeaddress, token: tokenaddress };
    dispatch(CONTRACTS_SUCCESSFUL(payload));
    const stakingABI = Staking.abi;
    const tokenABI = Token.abi;

    const stakingContract = await new ethers.Contract(
      stakeaddress,
      stakingABI,
      signer
    );

    setStakingContractObj(stakingContract);

    const tokenContract = new ethers.Contract(tokenaddress, tokenABI, signer);
    setTokenContractObj(tokenContract);
  };

  React.useEffect(function () {
    stake();
  }, []);

  React.useEffect(() => {
    if (stakingContractObj !== null) {
      getStakes();
    }
  }, [stakingContractObj]);

  const getStakes = async () => {
    let res = await stakingContractObj.getAllStakes();
    setStakes(res);

    var _rewards = [];
    await Promise.all(
      res.map(async (element, index) => {
        var reward = await stakingContractObj.computeRewardPerStake(index);
        reward = ethers.utils.formatUnits(reward.toString(), "ether");
        _rewards.push(reward);
      })
    );
    console.log(_rewards);

    setRewards(_rewards);
  };

  const computeRewardPerStake = async (_index) => {
    let res = await stakingContractObj.computeRewardPerStake(_index);
    return res / 10 ** 18;
  };

  const withdrawStake = async (_index) => {
    await stakingContractObj.withdrawStake(_index);
    getStakes();
    alert("withdraw successful");
  };

  const harvestStake = async (_index) => {
    await stakingContractObj.harvestReward(_index);
    getStakes();
    alert("harvest successful");
  };

  const stakeFunction = async () => {
    const amountToWei = ethers.utils.parseUnits(quantity.toString(), "ether");
    const tx = await tokenContractObj.approve(
      stakingContractObj.address,
      amountToWei
    );
    await tx.wait();
    const response = await stakingContractObj._stake(amountToWei);
    await response.wait();
    getStakes();
    alert("Staking Successful");
  };

  return (
    <div className="page">
      <h1>Your stakes</h1>
      <input
        onChange={(e) => setQuantity(e.target.value)}
        type="number"
      ></input>
      <button onClick={() => stakeFunction()}>stake</button>
      <button onClick={() => getStakes()}>Show your stakes</button>
      {stakes.map((stake, index) => {
        if (stake.amount != 0) {
          return (
            <div className="eachStake" key={index}>
              <p>{stake.amount / 10 ** 18} MTK</p>
              <p>Your reward: {rewards[index]}</p>
              <button onClick={() => harvestStake(index)}>Harvest</button>
              <button onClick={() => withdrawStake(index)}>Withdraw</button>
            </div>
          );
        }
      })}
      {}
    </div>
  );
}
