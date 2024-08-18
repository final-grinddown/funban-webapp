import { Suspense } from "react"
import { Backdrop, CircularProgress } from "@mui/material"
import { SignInScreen } from "@/screens/SignInScreen"

export default function SignIn() {
  return (
    <Suspense
      fallback={
        <Backdrop sx={{ color: "#fff", zIndex: 1000 }} open={true}>
          <CircularProgress color="primary" />
        </Backdrop>
      }
    >
      <SignInScreen />
    </Suspense>
  )
}
