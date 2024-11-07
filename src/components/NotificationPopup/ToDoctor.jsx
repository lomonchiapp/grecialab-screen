/* eslint-disable react/prop-types */
import {Box, Typography} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { CaretRight } from '@phosphor-icons/react'
import { useScreenState } from '../../global/useScreenState'

export const ToDoctor = ({notification}) => {

    const {tickets } = useScreenState()


    const ticket = tickets.find((ticket) => ticket.id === notification.ticketId);


  return (
    <Grid sx={styles.notification}>
        <Box sx={styles.ticketBox}>
            <Typography sx={styles.ticketLabel}>
                Ticket #:
            </Typography>
            <Typography sx={styles.ticketCode}>
                {ticket.ticketCode}
            </Typography>
            <Typography sx={styles.patientName}>
                {ticket.patientName}
            </Typography>
        </Box>
        <Box>
            <img style={styles.walkingIcon} src='walking.png' alt='walking' />
        </Box>
        <Box sx={styles.arrows}>
            <CaretRight size={140} style={styles.caret1} />
            <CaretRight size={130} style={styles.caret2} />
        </Box>
        <Box sx={styles.billingBox}>
            <Typography sx={styles.billingLabel}>
                a Puesto de Servicio
            </Typography>
            <Typography sx={styles.billingPosition}>   
            </Typography>
        </Box>
    </Grid>
  )
}

const styles = {
    notification: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: "5px",
        minWidth: "80px",
    },
    ticketLabel: {
        fontSize: 34,
        color:"white",
    },
    arrows: {
        display: "flex",
        position:"relative",
        flexDirection: "row",
        alignItems: "center",
        width: "140px",
    },
    caret1: {
        position:"absolute",
        right:20,
        color: "#253880",
    },
    caret2: {
        position:"absolute",
        color:"#2F9BD6",
        left:20,
    },
    ticketBox: {
        display: "flex",
        flexDirection: "column",
        backgroundColor:"#253880",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px",
        minWidth: "80px",
        borderRadius: "1rem",
        mr:5,
    },
    ticketCode: {
        fontSize: 65,
        fontFamily: "inherit",
        fontWeight: "bold",
        color:"white",
        borderRadius: "0.5rem",
        backgroundColor: "#2F9BD6",
        padding: "6px 9px",
    },
    billingBox:{
        display: "flex",
        flexDirection: "column",
        backgroundColor:"#2F9BD6",
        borderRadius: "1rem",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px",
        minWidth: "80px",
    },
    patientName: {
        fontSize: 24,
        color:"white",
    },
    billingLabel: {
        fontSize: 34,
        color:"white",
    },
    billingPosition: {
        fontSize: 65,
        color:"white",
        backgroundColor: "#253880",
        borderRadius: "0.5rem",
        padding: "6px 9px",
        fontWeight: "bold",
    },
}