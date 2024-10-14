import { Box, Typography } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { useScreenState } from "../../global/useScreenState";

export const BillingTicket = ({ ticket }) => {
    const {services} = useScreenState();
    const date = new Date(ticket.createdAt);

    const timeSince = (date) => {
        let parsedDate;
        if (date instanceof Timestamp) {
          parsedDate = date.toDate();
        } else if (typeof date === "string" || date instanceof String) {
          parsedDate = new Date(date);
        } else if (date instanceof Date) {
          parsedDate = date;
        } else {
          return "Invalid date";
        }
    
        if (isNaN(parsedDate.getTime())) {
          return "Invalid date";
        }
    
        const now = new Date();
        const seconds = Math.floor((now - parsedDate) / 1000);
    
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) return interval + " años";
    
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return interval + " meses";
    
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return interval + " días";
    
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return interval + " hrs";
    
        interval = Math.floor(seconds / 60);
        if (interval >= 1) return interval + " min";
    
        return Math.floor(seconds) + " segs";
      };

      const serviceName = (serviceId) => {
        const service = services.find((service) => service.id === serviceId);
        return service ? service.name : "Unknown service";
      }

  return (
    <Box sx={ticket.status === 'billing' ? styles.ticketContainerBilling : styles.ticketContainer}>
      {ticket.status === 'billing' && (
        <Box sx={styles.facturando}>
          <Typography sx={styles.facturandoText}>
            Facturando
          </Typography>
        </Box>
      )}
      {ticket.status === 'billing' && (
        <Box sx={styles.billingPosition}>
          <Typography sx={styles.billingPositionText}>
            {ticket.billingPosition.name}
          </Typography>
        </Box>
      )}
        <Box sx={styles.codeContainer}>
        <Typography sx={styles.ticketCode}>{ticket.ticketCode}</Typography>
        </Box>
        <Box>
        <Typography sx={styles.patientName}>{ticket.patientName}</Typography>
        <Typography sx={styles.service}>{serviceName(ticket.service)}</Typography>
        </Box>
        <Box sx={styles.timeBox}>
      <Typography sx={styles.timeAgo}>hace {timeSince(ticket.createdAt)}</Typography>
        </Box>
    </Box>
  );
};

const styles = {
    ticketContainer: {
        display: "flex",
        width: "100%",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: "0.5rem",
        border: "1px dashed #7d7d7d",
        position: "relative",
        backgroundColor: "white",
        borderRadius: "0.5rem",
        boxShadow: "0 0 5px 0 rgba(0,0,0,0.1)",
    },
    ticketContainerBilling: {
        display: "flex",
        width: "100%",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: "0.5rem",
        border: "1px dashed #7d7d7d",
        position: "relative",
        backgroundColor: "#aadaf4",
        borderRadius: "0.5rem",
        boxShadow: "0 0 5px 0 rgba(0,0,0,0.1)",
    },
    codeContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#253880",
        borderRadius: "0.5rem",
        px: 1,
    },
    ticketCode: {
        fontSize: "2rem",
        fontWeight: "bold",
        color: "white",
        fontFamily:"inherit"
    },
    patientName: {
        fontSize: 20,
        fontWeight: "bold",
        fontFamily:'inherit',
    },
    date: {
        fontSize: "1rem",
    },
    timeBox:{
        display: "flex",
        position: "absolute",
        right:6,
        bottom:8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2F9BD6",
        px: 0.5,
        borderRadius: "0.5rem",    
    },
    service:{
        fontSize: 18,
        fontWeight: "bold",
        fontStyle: "italic",
        color: "#7d7d7d",
    },
    timeAgo:{
        fontSize:15,
        color: "white",
    },
    facturando:{
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#048817",
        color: "white",
        padding: "0.25rem",
        borderTopRightRadius: "0.5rem",
        borderBottomLeftRadius: "0.5rem",
    },
    billingPosition:{
      position: "absolute",
      top: 25,
      right: 0,
      backgroundColor: "#78dd87",
      border: "1px solid #048817",
      padding: "0.25rem",
  },
  billingPositionText:{
    fontSize:12,
    fontWeight: "bold",
    
  },
    facturandoText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "white",
    }
    };