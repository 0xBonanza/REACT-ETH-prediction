import {useEthers} from "@usedapp/core"
import {Button, makeStyles} from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(4),
        display: "flex",
        justifyContent: "flex-end",
        gap: theme.spacing(2),
        alignItems: "center",
    },
    redSpan: {
        color: "red"
    }
}))

// header is a function () and here is what it does => {}
export const Header = () => {
    const {account, activateBrowserWallet, deactivate} = useEthers()
    const classes = useStyles()
    const isConnected = account !== undefined
    console.log(isConnected)
    return(
    <>

        <div className={classes.container}>
            <div className={classes.redSpan}><b>This is an un-audited test contract for Kovan Test network, use at your own risks!</b></div>
            <div>
                {isConnected ? (
                    <Button color="primary" variant="contained"
                        onClick={deactivate}>
                        Disconnect
                    </Button>
                ) : (
                    <Button color="primary" variant="contained"
                        onClick={() => activateBrowserWallet()}>
                        Connect
                    </Button>
                )
                }
            </div>
        </div>
    </>
    )
}
