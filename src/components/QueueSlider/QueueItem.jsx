import React from "react";
import { Box, Typography } from "@mui/material";

export const QueueItem = ({ticket, index}) => {
  return (
    <Box sx={styles.listItem} key={index}>
      <Box sx={{ display: "flex", flexDirection: "row"}}>
        <Typography sx={styles.ticketCode}>{ticket.ticketCode}</Typography>
      </Box>
    </Box>
  );
};

const styles = {
    listItem: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "5px",
        minWidth: "80px",
    },
    ticketCode: {
        fontSize: 18,
        fontFamily: "inherit",
        fontWeight: "bold",
        backgroundColor: "#253880",
        color:"white",
        borderRadius: "0.5rem",
        padding: "6px 9px",
    },
    patientName: {
        fontSize: 14,
        fontWeight: "bold",
    },
    };
