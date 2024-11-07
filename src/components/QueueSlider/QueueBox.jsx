import React, { useState, useEffect } from "react";
import { Box, Typography, List, ListItem } from "@mui/material";
import { Timestamp } from "firebase/firestore";

import { useScreenState } from "../../global/useScreenState";
import { QueueItem } from "./QueueItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';

export const QueueBox = ({ queue }) => {
  const [serviceNames, setServiceNames] = useState({});
  const { tickets, subscribeToTickets, services } = useScreenState();
  const ticketsInQueue = tickets.filter(
    (ticket) =>
      ticket.status === "inQueue" &&
      ticket.services.some(
        (service) =>
          service.id === queue.serviceId && service.status !== "finished"
      )
  );
  
  const ticketInProcess = tickets.find(
    (ticket) =>
      ticket.services?.some(
        (service) =>
          service.status === "processing" && service.id === queue.serviceId
      )
  );



  useEffect(() => {
    // Map service IDs to service names
    const servicesMap = services.reduce((acc, service) => {
      acc[service.id] = service.name;
      return acc;
    }, {});
    setServiceNames(servicesMap);
  }, [services]);

  useEffect(() => {
    const unsubscribe = subscribeToTickets();
    return () => unsubscribe();
  }, [subscribeToTickets]);

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
  };
  return (
    <Box>
      <Box sx={styles.headerContainer}>
        <Box sx={styles.lenContainer}>
          <Typography sx={styles.lenText}>
            En cola: {ticketsInQueue.length}
          </Typography>
        </Box>
        <Box sx={styles.qNameContainer}>
          <Typography sx={styles.qName}>
            {serviceName(queue.serviceId)}
          </Typography>
        </Box>
      </Box>

      <Box sx={styles.listContainer}>
        <Box sx={styles.list}>
         

          {ticketInProcess ? (
            <Box sx={styles.inProcessBox}>
              <Box>
                <Typography sx={{
                  fontSize: 12,
                  fontFamily: "inherit",
                  color: "white",
                  fontWeight: "bold",
                  padding: "5px",
                  backgroundColor: "#25398084",
                }}>
                  Atendiendo a
                </Typography>
                  </Box>
              <Box sx={styles.ticketCodeActive}>
                {ticketInProcess.ticketCode}
              </Box>
              <Box>
                <Typography sx={styles.activePatientName}>
                  {ticketInProcess.patientName}
                </Typography>
              </Box>
            </Box>
          ) : 
          (<Box sx={styles.idleBox}>
            <Box>
              <Typography sx={{
                fontSize: 12,
                fontFamily: "inherit",
                color: "white",
                fontWeight: "bold",
                padding: "5px",
                backgroundColor: "#25398084",
              }}>
                Espere a ser llamado
              </Typography>
                </Box>
            <Box sx={styles.ticketCodeActive}>
              Puesto Libre
            </Box>
            <Box>
              <Typography sx={styles.activePatientName}>
                
              </Typography>
            </Box>
          </Box>)}
          <Box sx={styles.sliderContainer}>
          <Swiper
            spaceBetween={0}
            slidesPerView={3}
            direction="horizontal"
            modules={[Pagination, Autoplay]}
            autoplay={{ delay: 3000 }}
            scrollbar={{ draggable: true }}
            style={styles.slider}
          >
            {ticketsInQueue.map((ticket, index) => (
              <SwiperSlide style={styles.slide} key={ticket.id}>
              <QueueItem ticket={ticket} key={index} />
              </SwiperSlide>
            ))}
          </Swiper>
          {ticketsInQueue.length === 0 && (
              <Box sx={styles.emptyBox}>
                <Typography sx={styles.itemText}>
                  Nadie en la cola
                </Typography>
              </Box>
          )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const styles = {
  headerContainer: {
    display: "flex",
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "5px",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #e0e0e0",
  },
  sliderContainer:{
    flex:1,
    overflow:'hidden',
  },
  slide:{
    justifyContent: "center",
    alignItems: "center",
  },
  slider: {
    height:"15vh",
    width:"100%",
  },
  qNameContainer: {
    display: "flex",
    flexDirection: "column",
  },
  activePatientName: {
    fontSize: 12,
    fontFamily: "inherit",
    backgroundColor: "#b2ddf4",
    px:2.5,
  },
  qNameContActive: {
    display: "flex",
    flexDirection: "column",
  },
  qName: {
    fontSize: "27px",
    fontFamily: "inherit",
    fontWeight: "bold",
    color: "#253880",
  },
  qNameActive: {
    fontSize: "1.5rem",
    color: "white",
  },
  listContainer: {
    padding: "5px",
    overflowY: "auto",
    border: "1px solid #e0e0e0",
    backgroundColor: "#f5f5f5",
    maxHeight:"22vh",
    minHeight: "22vh",
    width: "100%",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
  emptyBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  itemText: {
    fontSize: 12,
    color: "#7d7d7d",
    fontFamily: "inherit",
  },
  lenContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0.3rem",
    backgroundColor: "#b2ddf4",
    borderBottom: "1px solid #e0e0e0",
  },
  lenText: {
    fontSize: 16,
  },
  inProcessBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderBottom: "1px solid #e0e0e0",
    backgroundColor: "#8dd2f7",
    border:"#2F9BD6 solid 1px"
  },
  idleBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderBottom: "1px solid #e0e0e0",
    backgroundColor: "#e0eff8",
    border:"#757575 dashed 1px",
    minHeight: "95px",
  },
  ticketCodeActive: {
    fontSize: "2rem",
    color: "#4a4a4a",
    fontWeight: "bold",
  },
  ticketCode: {
    fontSize: 10,
    backgroundColor: "#253880",
    color: "#313131",
    padding: "0.3rem",
    borderRadius: "0.5rem",
    fontFamily: "monospace",
    fontWeight: "bold",
  },
  patientName: {
    fontSize: 12,
    fontFamily: "inherit",
    fontWeight: "bold",
  },
  timeAgo: {
    fontSize: 8,
    backgroundColor: "#b2ddf4",
    padding: "2px",
    borderRadius: "0.1rem",
    border: "1px solid #2F9BD6",
    position: "absolute",
    right: 3,
    top: 3,
  },
};
