import React, { useEffect, useState, Component } from "react"
import { useInstanceView } from "../../hooks"
import SingleInstance from "./instanceCard"
import {Box} from "@material-ui/core"
import { Instance } from '../model'

/**
 * @dev this handles the mapping between the different SC instances and the front-end
 */

export const InstanceRead = () => {

    const data = useInstanceView();

    return (
        <Box>
        {data
        ?
            data.map(
                (instance: Instance, index: number) => (<SingleInstance instanceIndex={index} instance={instance} />
            ))
        : 'Loading ...'}
        </Box>
    )

}