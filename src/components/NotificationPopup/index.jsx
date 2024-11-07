/* eslint-disable react/prop-types */
import {Drawer} from '@mui/material';

export const NotificationPopup = ({open, setOpen, children}) => {

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "100%",
          backgroundColor: "#dfdfdf",
          color: "white",
          padding: 0,
          minHeight: 350,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
      }}
    >
      <div style={{padding: 20}}>
{children}
      </div>
    </Drawer>
  );
};