import { useContractFunction, useEthers } from "@usedapp/core"
import PredictionPool from "../chain-info/contracts/PredictionPool.json"
import { utils, constants } from "ethers"
import { Contract } from "@ethersproject/contracts"
import networkMapping from "../chain-info/deployments/map.json"

export const useSettleInstance = () => {
  const { chainId } = useEthers()

  const { abi } = PredictionPool
  const predictionPoolContractAddress = chainId ? networkMapping[String(chainId)]["PredictionPool"][0] : constants.AddressZero
  const predictionPoolInterface = new utils.Interface(abi)

  const predictionPoolContract = new Contract(
    predictionPoolContractAddress,
    predictionPoolInterface
  )

  return useContractFunction(predictionPoolContract, "settleInstance", {transactionName: "Settle instance"})

}

