import React, { useState } from "react"
import { useEthers } from "@usedapp/core"
import {
  ConnectionRequiredMsg,
} from "../../components"
import {InstanceSubmit} from "./InstanceSubmit"
import {ActivePrediction} from "./ActivePrediction"
import { Tab, Tabs, Paper, Box, makeStyles } from "@material-ui/core"
import PredictionPool from "../../chain-info/contracts/PredictionPool.json"
import { utils, constants } from "ethers"
import { Contract } from "@ethersproject/contracts"
import networkMapping from "../../chain-info/deployments/map.json"
import cover from "../../0x.png"

const useStyles = makeStyles((theme) => ({
  list: {
    marginBottom: 12,
    display: "in-line",
    listStyleType: "none",
  },
  img: {
        width: "52px",
    },
  box:{
    display: 'flex',
    alignItems: "center",
  },
  footer: {
    display: 'flex',
    color: "grey",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    fontSize: 11
  },
  instruction: {
    background: 'linear-gradient(45deg, #FFE9C6 30%, #FFD99F 90%)'
  }
}))

/**
 * @dev this handles the main body
 */

export const PredictionContract = () => {

  const { chainId } = useEthers()
  const predictionPoolContractAddress = chainId ? networkMapping[String(chainId)]["PredictionPool"][0] : constants.AddressZero
  const url = "https://kovan.etherscan.io/address/" + predictionPoolContractAddress
  const classes = useStyles()

  return (
    <Box>
        <div className={classes.box}>
            <img className={classes.img} src={cover} alt="0x"/>
            <h1>Aim for the bonanza? Predict the <u>future</u> price of ETH!</h1>
        </div>
        <div >
            Some of the things you need to know:
                <ul>
                    <li className={classes.list}><span className={classes.instruction}>SUBMIT</span> You can only participate if the lock time has not been reached. You can participate as much as you want but only your last prediction will be considered, and you'll have to pay each time.</li>
                    <li className={classes.list}><span className={classes.instruction}>WAIT</span> Once the lock time has been reached, participants have to wait until the end time to settle the prediction.</li>
                    <li className={classes.list}><span className={classes.instruction}>SETTLE</span> Someone has to settle the instance once the end time has been reached (he'll be compensated for this).</li>
                    <li className={classes.list}><span className={classes.instruction}>CLAIM</span> Each winner can claim its gain if he was the closest prediction among all predictions.</li>
                    <li className={classes.list}><span className={classes.instruction}>CREATE</span> You can create new instances for users to predict on.</li>
              </ul>
        </div>

        <span>Get an overview of the contract on <a href={url}>Etherscan</a> or get some Faucet Kovan ETH on <a href="https://faucets.chain.link/">Chainlink</a> to give it a try!</span>
        <div><ActivePrediction /></div>
        <div className={classes.footer}>
            <footer><p>© 2022 by 0xBonanza, visit <a href="http://0xbonanza.github.io/">our Github</a> for more info!</p></footer>
        </div>
    </Box>
  )
}