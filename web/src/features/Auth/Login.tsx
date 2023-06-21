import { useState } from "react";
import { useAppContext } from "../../AppContext";
import { useNavigate } from "react-router-dom";
import { Box, Button, Paper, Stack, TextField } from "@mui/material";

export function Login() {
  const navigate = useNavigate();

  const { magic, setIsLoggedIn } = useAppContext();

  const [email, setEmail] = useState("");

  const login = async () => {
    await magic.auth.loginWithMagicLink({ email, showUI: true });
    // const res2 = await magic.auth.loginWithCredential(res);

    navigate("/dashboard", { replace: true });
    setIsLoggedIn(true);
  };

  return (
    <Box
      sx={{
        paddingTop: 24,
        marginLeft: "auto",
        marginRight: "auto",
        width: "100%",
        maxWidth: 600,
        alignContent: "center",
      }}
    >
      <Paper
        sx={{
          borderRadius: 1,
          p: 4,
          height: "max-content",
        }}
      >
        <img src="/poweramp-logo-small.png" style={{ width: 260, objectFit: "cover" }} />
        <h3>Please sign up or login</h3>
        <Stack spacing={2}>
          <TextField
            fullWidth={true}
            id="outlined-basic"
            label="Email"
            variant="outlined"
            type="email"
            name="email"
            required={true}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <Button variant="contained" onClick={login}>
            Continue
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
