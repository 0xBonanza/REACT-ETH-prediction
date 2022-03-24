import { useContractFunction, useEthers, useContractCall } from "@usedapp/core"
import PredictionPool from "../chain-info/contracts/PredictionPool.json"
import { utils, constants } from "ethers"
import { Contract } from "@ethersproject/contracts"
import networkMapping from "../chain-info/deployments/map.json"

interface winnerProps {
    instance: number,
    account: any
}

/**
 * @dev use the contract the view the instance winners (args: instance / account)
 */

export const useWinnerView = ({instance, account}: winnerProps) => {

    const { chainId } = useEthers()
    const { abi } = PredictionPool
    const predictionPoolContractAddress = chainId ? networkMapping[String(chainId)]["PredictionPool"][0] : constants.AddressZero
    const predictionPoolInterface = new utils.Interface(abi)

    const predictionPoolContract = new Contract(
        predictionPoolContractAddress,
        predictionPoolInterface
    )

    // @dev calls the instanceWinnerView function
    const [data]: any = useContractCall({
    abi: predictionPoolInterface,
    address: predictionPoolContractAddress,
    method: "instanceWinnerView",
    args: [instance, account],
    }) ?? [];

    return data;

}

