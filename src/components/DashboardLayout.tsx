"use client"
import { KeyboardEvent, MouseEvent, ReactNode, useState } from "react"
import { AccountCircle, Logout, Settings } from "@mui/icons-material"
import DashboardIcon from "@mui/icons-material/Dashboard"
import HistoryIcon from "@mui/icons-material/History"
import MenuIcon from "@mui/icons-material/Menu"
import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { ERoutes } from "@/utils/enums"

interface Props {
  children: ReactNode
}

export function DashboardLayout({ children }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const theme = useTheme()
  const toggleDrawer = (open: boolean) => (event: KeyboardEvent | MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as KeyboardEvent).key === "Tab" || (event as KeyboardEvent).key === "Shift")
    ) {
      return
    }
    setDrawerOpen(open)
  }

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: {
            lg: theme.zIndex.drawer + 1,
          },
          background: {
            xs: theme.palette.background.default,
            lg: `linear-gradient(to right, transparent 250px, ${theme.palette.background.default} 250px)`,
          },
        }}
        enableColorOnDark={true}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { lg: "none" }, zIndex: 1, mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="p"
            textAlign={{ xs: "center", lg: "left" }}
            sx={{
              flexGrow: 1,
            }}
          >
            <Typography component="span" variant="h6" color="primary">
              FUN
            </Typography>
            BAN Status tool
          </Typography>

          <AccountCircle fontSize="large" />
        </Toolbar>
      </AppBar>

      <Drawer
        variant={drawerOpen ? "temporary" : "permanent"}
        anchor="left"
        open={drawerOpen || !drawerOpen} // Always open for lg screens
        onClose={toggleDrawer(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: drawerOpen ? "block" : "none", lg: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250, pt: { lg: 8 } },
        }}
      >
        <List>
          <ListItem sx={{ p: 0 }}>
            <ListItemButton component={Link} href={ERoutes.Board}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Board" />
            </ListItemButton>
          </ListItem>
          <ListItem sx={{ p: 0 }}>
            <ListItemButton component={Link} href={ERoutes.History}>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="History" />
            </ListItemButton>
          </ListItem>
          <ListItem sx={{ p: 0 }}>
            <ListItemButton component={Link} href={ERoutes.Settings}>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          <ListItem sx={{ p: 0 }}>
            <ListItemButton onClick={() => signOut()}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
        <Box
          sx={{
            mt: "auto",
            p: 2,
          }}
        >
          <Typography variant="body2" color="textSecondary">
            © 2024 FinalGrindDown
          </Typography>
        </Box>
      </Drawer>

      <Container maxWidth={false} sx={{ pt: { xs: 8, sm: 10 }, ml: { lg: "250px" }, overflowX: "hidden" }}>
        <Box
          sx={{
            flexGrow: 1,
          }}
        >
          {children}
        </Box>
      </Container>
    </Box>
  )
}
