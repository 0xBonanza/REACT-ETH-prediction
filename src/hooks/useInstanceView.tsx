import { useContractFunction, useEthers, useContractCall } from "@usedapp/core"
import PredictionPool from "../chain-info/contracts/PredictionPool.json"
import { utils, constants } from "ethers"
import { Contract } from "@ethersproject/contracts"
import networkMapping from "../chain-info/deployments/map.json"

/**
 * Expose { send, state } object to facilitate unstaking the user's tokens from the TokenFarm contract
 */
export const useInstanceView = () => {
  const { chainId } = useEthers()

  const { abi } = PredictionPool
  const predictionPoolContractAddress = chainId ? networkMapping[String(chainId)]["PredictionPool"][0] : constants.AddressZero
  const predictionPoolInterface = new utils.Interface(abi)

  const predictionPoolContract = new Contract(
    predictionPoolContractAddress,
    predictionPoolInterface
  )

  const [data]: any = useContractCall({
    abi: predictionPoolInterface,
    address: predictionPoolContractAddress,
    method: "instanceViewAll",
    args: [],
  }) ?? [];
  return data;

}

