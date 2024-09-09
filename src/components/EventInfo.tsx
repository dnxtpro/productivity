import { Typography } from "@mui/material"
import { IEventInfo } from "./EventCalendar"
import React from "react"

interface IProps {
  event: IEventInfo
}

const EventInfo = ({ event }: IProps) => {
  return (
    <>
      <Typography>{event.description}</Typography>
    </>
  )
}

export default EventInfo
