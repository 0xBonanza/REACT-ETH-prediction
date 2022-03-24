import React, { useEffect, useState, Component } from "react"
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import { useSubmitPrediction } from "../../hooks"
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

interface predictionProps {
    predictionInstance: number,
    submissionCost: number
}

/**
 * @dev this handles the submission of a prediction on an instance
 */

export const PredictionSubmit = ({predictionInstance, submissionCost}: predictionProps) => {

    const useStyles = makeStyles((theme) => ({
      container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(2),
        width: "100%",
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
        background: 'linear-gradient(45deg, #FEF9C6 30%, #FFF8B0 90%)',
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

    // @dev some basic info
    const {notifications} = useNotifications()
    const { account } = useEthers()
    const classes = useStyles()
    const [predictionValue, setPredictionValue] = useState<any>(0)

    // @dev handles the submission of a prediction
    const { send: submitPredictionSend, state: submitPredictionState } = useSubmitPrediction()

    const handlePredictionSubmit = () => {
        return submitPredictionSend(predictionInstance, predictionValue.toString(), {value: utils.parseEther(submissionCost.toString()).toString()})
    }

    // @dev handles the mining button
    const isMining = submitPredictionState.status === "Mining"

    // @dev handles the change in prediction made by the user
    const handlePredictionValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPredictionValue(event.target.value === "" ? 0 : event.target.value)
    }


    // @dev handles the submission success
    const [showSubmitSuccess, setShowSubmitSuccess] = useState(false)

    const handleCloseSnack = () => {
        setShowSubmitSuccess(false)
    }

    // @dev handles the snack showing success
    useEffect(() => {
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Submit prediction").length > 0) {
                    setShowSubmitSuccess(true)
                }
    }, [notifications, showSubmitSuccess])

    // @dev handles front-end
    return (
    <>
        <h2>Submit your prediction!</h2>
        <div className={classes.explanation}>You have selected instance {predictionInstance} with submission cost of {submissionCost}</div>
        <div className={classes.explanation}>1/ Give your prediction for ETH!</div>
        <div className={classes.submitBox}>
            <span className={classes.submitText}>Your prediction</span>
            <Input
            className={classes.submitNumber}
            onChange={handlePredictionValueChange}
            inputProps={{
              min: 0,
              max: 10e10,
              type: "number"
            }}/>
            $USD per ETH
        </div>
        <div className={classes.explanation}>2/ Now submit!</div>
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={handlePredictionSubmit}
          disabled={isMining}
        >
            {isMining ? <CircularProgress size={26} /> : "Submit"}
        </Button>
        <div className={classes.footNote}>(This costs {submissionCost}ETH)</div>
        <div>
        <Snackbar
        open={showSubmitSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnack}>
            <Alert onClose={handleCloseSnack} severity="success">
                You have submitted your prediction for ETH/USDT! Please come back when settlement has been done!
            </Alert>
        </Snackbar>
        </div>

    </>
    )
}