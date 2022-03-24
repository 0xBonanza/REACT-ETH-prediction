import React, { useEffect, useState, Component } from "react"
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import { useCreatePrediction } from "../../hooks"
import {InstanceSubmit} from "./InstanceSubmit"
import {InstanceRead} from "./InstanceRead"
import eth from "../../eth.png"
import {ConnectionRequiredMsg} from "../../components"
import {
  Button,
  CircularProgress,
  Snackbar,
  makeStyles,
  Input,
  Box
} from "@material-ui/core"

/**
 * @dev this is the landing page asking to connect if user is not connected, or shows app if user is connected
 */

export const ActivePrediction = () => {

    const useStyles = makeStyles((theme) => ({
      container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(2),
        width: "100%",
      },
    }))

    const classes = useStyles()
    const { account } = useEthers()
    const isConnected = account !== undefined
    const [value, setValue] = React.useState(2);
    const [isExpanded, setExpanded] = useState(false);

    function handleOnClick() {
        setExpanded(!isExpanded);
    }

    return (
        <Box>
        {
        isConnected ? (
        <Box>
            <h1>All prediction instances</h1>
            <div>
                <InstanceRead />
            </div>
            <div>
                <InstanceSubmit />
            </div>
        </Box>
        )
        : <ConnectionRequiredMsg />
        }
        </Box>
    )
}