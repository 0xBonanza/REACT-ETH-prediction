import React, {useState, useEffect} from 'react'
import { Instance } from '../model'
import {
  Button,
  CircularProgress,
  Snackbar,
  makeStyles,
  Input,
  Box
} from "@material-ui/core"
import {formatUnits} from "@ethersproject/units"
import { List, ListItem } from '@mui/material';
import {PredictionSubmit} from "./PredictionSubmit"
import { useSettleInstance, useClaimReward, useWinnerView } from "../../hooks"
import {utils} from "ethers"
import Alert from "@material-ui/lab/Alert"
import {useNotifications, useEthers} from "@usedapp/core"

type Props = {
    instance: Instance,
    instanceIndex: number,
}

/**
 * @dev this handles a single instance and format it
 */

const SingleInstance = ({instance, instanceIndex}: Props) => {

    const useStyles = makeStyles((theme) => ({
      container: {
        gap: theme.spacing(1),
        width: "auto",
        alignItems: "center",
        justifyContent: "center",
      },
      card: {
        display: "flex",
        background: 'linear-gradient(35deg, #FFFFFF 30%, #EEEEEE 85%)',
        boxShadow: '0 3px 5px 1px rgba(150, 250, 170, .3)',
        border: 0,
        borderRadius: 3,
        flexFlow: "column wrap",
        overflow: "auto",
        width: "auto"
      },
      listItem: {
        display: "flex",
        marginBottom: '3px',
        columns: 2,
        fontSize: 14
      },
      instruction: {
        background: 'linear-gradient(45deg, #E6FFF0 30%, #91FFBA 90%)',
        marginRight: '10px',
        fontWeight: "lighter"
      }
    }))

    // @dev some general info
    const {notifications} = useNotifications()
    const { account } = useEthers()
    const classes = useStyles()

    // @dev define current time and get info about the instance
    const currentTime = Number(Date.now() / 1000)
    const isSettled = instance.settlement
    const settlement = isSettled ? "Settled": "Not settled"
    const creator = instance.creator.toString()
    const weiCommitment = instance.commitment
    const commitment = formatUnits(weiCommitment, 18).toString()
    const startTime = Intl.DateTimeFormat('en-UK', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(instance.startStamp * 1000)
    const endTime = Intl.DateTimeFormat('en-UK', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(instance.endStamp * 1000)
    const lockTime = Intl.DateTimeFormat('en-UK', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(instance.lockStamp * 1000)

    // @dev handles the submission of prediction for the instance (shows it if clicked)
    const [showSubmission, setShowSubmission] = useState(false)

    const handleSubmission = () => {
        setShowSubmission(true)
    }

    // @dev handles the settlement of the instance
    const { send: settleInstanceSend, state: settleInstanceState } = useSettleInstance()

    const handleSettlement = () => {
        return settleInstanceSend(instanceIndex)
    }

    // @dev handles the claim of the reward
    const { send: claimRewardSend, state: claimRewardState } = useClaimReward()

    const handleClaim = () => {
        return claimRewardSend(instanceIndex)
    }

    // @dev update the status of the winner (true if winner, false if looser or already claimed gains)
    const winningStatus = useWinnerView({instance: 0, account: account});

    // @dev handles settlement success/failure or claim success
    const [showSettlementSuccess, setShowSettlementSuccess] = useState(false)
    const [showSettlementFailure, setShowSettlementFailure] = useState(false)
    const [showClaimSuccess, setShowClaimSuccess] = useState(false)

    useEffect(() => {
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Settle instance").length > 0) {
                    setShowSettlementSuccess(true)
                    setShowClaimSuccess(false)
                }
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Claim reward").length > 0) {
                    setShowSettlementSuccess(false)
                    setShowClaimSuccess(true)
                }
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionFailed" &&
                notification.transactionName === "Settle instance").length > 0) {
                    setShowSettlementFailure(true)
                }
    }, [notifications, showSettlementSuccess, showClaimSuccess, showSettlementFailure])

    const handleCloseSnack = () => {
        setShowSettlementSuccess(false)
        setShowClaimSuccess(false)
    }

    // @dev front end
    return (
        <Box>
            { showSubmission
            ? (
            <Box>
                <PredictionSubmit predictionInstance={instanceIndex} submissionCost={Number(commitment)} />
                <hr />
            </Box>
            )
            :
            <div className={classes.container}>
                <div className={classes.card}>

                    <List>
                        <ListItem className={classes.listItem}><i>This is instance <b>{instanceIndex}</b></i></ListItem >
                        <ListItem className={classes.listItem}><span className={classes.instruction}>Creator</span>{creator}</ListItem >
                        <ListItem className={classes.listItem}><span className={classes.instruction}>Commitment</span> {commitment}ETH</ListItem >
                        <ListItem className={classes.listItem}><span className={classes.instruction}>Start time</span> {startTime}</ListItem >
                        <ListItem className={classes.listItem}><span className={classes.instruction}>Lock time</span> {lockTime}</ListItem >
                        <ListItem className={classes.listItem}><span className={classes.instruction}>End time</span> {endTime}</ListItem >
                        <ListItem className={classes.listItem}><span className={classes.instruction}>Instance status</span> {settlement.toString()}</ListItem >
                        <ListItem className={classes.listItem}><span className={classes.instruction}>Your status</span>{winningStatus ? "Congrats! You are a winner of this instance" : "Looks you are not a winner of this instance ..."}</ListItem >
                    </List>
                </div>
                <Button color="primary" size="large" disabled={instance.lockStamp < currentTime ? true: false} onClick={handleSubmission}>Submit Prediction</Button>
                <Button color="primary" size="large" disabled={instance.settlement || instance.endStamp > currentTime} onClick={handleSettlement}>Settle instance</Button>
                <Button color="primary" size="large" disabled={!winningStatus} onClick={handleClaim}>Claim Reward</Button>
                <hr />
            </div>
            }
            <div>
                <Snackbar
                open={showSettlementSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack}>
                    <Alert onClose={handleCloseSnack} severity="success">
                        Instance has been settled correctly! You have been rewarded for that!
                    </Alert>
                </Snackbar>
                <Snackbar
                open={showSettlementFailure}
                autoHideDuration={5000}
                onClose={handleCloseSnack}>
                    <Alert onClose={handleCloseSnack} severity="success">
                        Instance cannot be settled ...
                    </Alert>
                </Snackbar>
                <Snackbar
                open={showClaimSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack}>
                    <Alert onClose={handleCloseSnack} severity="success">
                        You have successfully claimed your gains, congrats!
                    </Alert>
                </Snackbar>
            </div>
        </Box>
    )
}

export default SingleInstance