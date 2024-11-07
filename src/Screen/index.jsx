import { VideoPlayer } from "../components/VideoPlayer";
import { QueueSlider } from "../components/QueueSlider";
import { Box, Grid2 } from "@mui/material";
import { BillingList } from "../components/BillingList";

export const Screen = () => {
  return (
    <Grid2
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#323232",
      }}
      container
    >
      <Grid2 size={{ xs: 2, xl:2 }}>
        <Box
          sx={{
            height: "100vh",
          }}
        >
          <BillingList />
        </Box>
      </Grid2>
      <Grid2 size={{ xs: 10, xl:10 }}>
        <VideoPlayer />
        <Box sx={{ px: 3, pt: 1, pb: 1 }}>
          <QueueSlider />
        </Box>
      </Grid2>
    </Grid2>
  );
};
