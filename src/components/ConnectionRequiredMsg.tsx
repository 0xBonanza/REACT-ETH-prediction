import React from "react";
import { Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "grid",
    alignItems: "center",
    justifyItems: "center",
    gridTemplateRows: "50px",
    background: 'linear-gradient(45deg, #E6F1FF 30%, #E6F1FF 35%)',
    marginTop: 50,
  },
}));

/**
 * @dev this handles the connection message asking to connect Metamask
 */

export const ConnectionRequiredMsg = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography variant="h6" component="span">
        Please connect your Metamask account (on Kovan network) to participate!
      </Typography>
    </div>
  );
};