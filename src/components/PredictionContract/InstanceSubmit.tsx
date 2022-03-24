import React, { useEffect, useState, Component } from "react"
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import { useCreatePrediction } from "../../hooks"
import {
  Button,
  CircularProgress,
  Snackbar,
  makeStyles,
  Input
} from "@material-ui/core"
import eth from "../../eth.png"
import {utils} from "ethers"
import Alert from "@material-ui/lab/Alert"

/**
 * @dev this handles the submission of a new instance
 */

export const InstanceSubmit = () => {

    const useStyles = makeStyles((theme) => ({
      container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(2),
        width: "100%",
        columns: 2
      },
      slider: {
        width: "100%",
        maxWidth: "400px",
      },
      submitBox: {
        display: "grid-line",
        gridTemplateColumns: "auto 55px auto",
        gap: theme.spacing(1),
        alignItems: "center",
        marginBottom: '20px',
      },
      submitText: {
        background: 'linear-gradient(45deg, #FFE9C6 30%, #FFD99F 90%)',
        boxShadow: '0 3px 5px 1px rgba(156, 210, 255, .3)',
        border: 0,
        borderRadius: 3,
        color: 'black',
        height: 48,
        padding: '5px 15px',
        marginRight: '50px',
        alignItems: "center",
      },
      submitNumber: {
        marginRight: '5px',
        alignItems: "center",
      },
      tokenImg: {
        width: "16px",
        alignItems: "center",
      },
      footNote: {
        marginTop: '5px',
        fontSize: 12,
        color: 'rgba(200, 200, 200)',
      },
      explanation: {
        marginBottom: '15px',
      }
    }))

    const {notifications} = useNotifications()
    const { account } = useEthers()
    const classes = useStyles()

    // @dev this handles the change in instance value submitted by the creator
    const [instanceValue, setInstanceValue] = useState<any>(0)
    const handleInstanceValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInstanceValue(event.target.value === "" ? 0 : Number(utils.parseEther(event.target.value)))
    }

    // @dev this handles the communication with the Smart contract
    const { send: submitInstanceSend, state: submitInstanceState } = useCreatePrediction()
    const handleInstanceSubmit = () => {
        return submitInstanceSend(instanceValue.toString(), instanceStart.toString(), instanceLock.toString(), instanceEnd.toString(), {value: 5000000000000000})
    }
    const isMining = submitInstanceState.status === "Mining"

    // @dev this handles the input and compute the new timestamps for start/lock/end
    const [instanceStart, setInstanceStart] = useState<any>(0)
    const [instanceLock, setInstanceLock] = useState<any>(0)
    const [instanceEnd, setInstanceEnd] = useState<any>(0)
    const [state, setState] = useState({ dayTime: 0, hourTime: 0 });

    const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newInstanceStart = Math.round(Number(Date.now() / 1000))
        setInstanceStart(newInstanceStart)
        const instanceDuration = event.target.value === "" ? 0 : Number(event.target.value)
        const newInstanceLock = Number(newInstanceStart + instanceDuration)
        setInstanceLock(newInstanceLock)
        const newInstanceEnd = Number(newInstanceLock + instanceDuration)
        setInstanceEnd(newInstanceEnd)

        if (instanceDuration / 3600 <= 24) {
            const dayDuration = 0
            const hourDuration = Math.round(instanceDuration / 3600)
            setState({ dayTime: dayDuration, hourTime: hourDuration });
        } else {
            const dayDuration = Math.floor((instanceDuration / 3600) / 24)
            const hourDuration = Math.round(((instanceDuration / 3600) - (dayDuration * 24)))
            setState({ dayTime: dayDuration, hourTime: hourDuration });
        }
    }

    // @dev this handles the submission of a new instance
    const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false)
    const handleCloseSnack = () => {
        setShowSubmissionSuccess(false)
    }

    useEffect(() => {
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Create instance").length > 0) {
                    setShowSubmissionSuccess(true)
                }
    }, [notifications, showSubmissionSuccess])

    // @dev this returns the front-end view
    return (
    <>
        <h1>Submit a new instance?</h1>
        <div className={classes.explanation}>1/ Select the amount each user will have to commit!</div>
        <div className={classes.submitBox}>
            <span className={classes.submitText}>Instance value</span>
            <Input
            className={classes.submitNumber}
            onChange={handleInstanceValueChange}
            inputProps={{
              min: 0,
              max: 2,
              step: 0.00125,
              type: "number"
            }}/>
            <img className={classes.tokenImg} src={eth} alt="token logo"/> ETH
        </div>
        <div className={classes.explanation}>2/ Select the time during which users will be able to make prediction for your instance!</div>
        <div className={classes.submitBox}>
            <span className={classes.submitText}>Instance duration</span>
            <Input className={classes.submitNumber} onChange={handleDurationChange}/>
            <span className={classes.footNote}>(in seconds = approx. ~ {state?.dayTime} days and {state?.hourTime} hours)</span>
        </div>
        <div className={classes.explanation}>3/ Now submit!</div>
        <Button
          color="secondary"
          variant="contained"
          size="large"
          onClick={handleInstanceSubmit}
          disabled={isMining}
        >
            {isMining ? <CircularProgress size={26} /> : "Submit"}
        </Button>
        <div className={classes.footNote}>
            (This costs 0.005ETH)
        </div>

        <div>
            <Snackbar
            open={showSubmissionSuccess}
            autoHideDuration={5000}
            onClose={handleCloseSnack}>
                <Alert onClose={handleCloseSnack} severity="success">
                    New prediction instance successfully added to the contract. You'll be able to predict on it soon.
                </Alert>
            </Snackbar>
        </div>
    </>
    )
}