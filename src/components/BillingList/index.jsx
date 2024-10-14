// Que define la Lista de facturacion?
// Los tickets en estado pending.

import { Box, Typography } from "@mui/material";
import { useScreenState } from "../../global/useScreenState";
import { BillingTicket } from "./BillingTicket";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination, Autoplay } from "swiper/modules";

export const BillingList = () => {
  const { tickets } = useScreenState();

  const pendingTickets = tickets.filter(
    (ticket) => ticket.status === "pending" || ticket.status === "billing"
  );
  const sortedTickets = pendingTickets.sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  return (
    <Box
      sx={{
        backgroundColor: "#ececec",
        height: "100%",
        padding: "10px",
      }}
    >
      <Typography sx={styles.header}>Esperan por facturar</Typography>
      <Box sx={styles.container}>
      <Swiper
        slidesPerView={6}
        direction="vertical"
        modules={[Pagination, Autoplay]}
        autoplay={{ delay: 3000 }}
        scrollbar={{ draggable: true }}
        style={styles.slider}
      >
        {sortedTickets.map((ticket) => (
          <SwiperSlide style={styles.slide} key={ticket.id}>
            <BillingTicket key={ticket.id} ticket={ticket} />
          </SwiperSlide>
        ))}
      </Swiper>
      </Box>
    </Box>
  );
};

const styles = {
  slide: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "auto",
  },
  slider: {
    height: "100%",
  },
  container:{
    width:"100%",
    height:"100%",
    flexDirection:"column",
  },
  header: {
    textAlign: "center",
    fontSize: 20,
    color:'white',
    fontWeight: "bold",
    py:2,
    mb:2,
    backgroundColor: "#253880",
  },
};
