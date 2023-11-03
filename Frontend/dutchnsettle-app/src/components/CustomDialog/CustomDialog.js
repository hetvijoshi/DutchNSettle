import * as React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Button, DialogActions, Typography } from "@mui/material";

export default function CustomDialog({ open, handleClose }) {


    return (
        <React.Fragment>
            <Dialog open={open} onClose={handleClose} maxWidth={"sm"} sx={{ minWidth: "1000px" }} fullWidth>
                <DialogTitle>Add Friend</DialogTitle>
                <DialogContent>
                    <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                        <Typography><b>To: </b></Typography>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Email Address or Name"
                            fullWidth
                            variant="outlined"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Submit</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}