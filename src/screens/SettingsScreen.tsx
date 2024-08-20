"use client"
import { ReactNode, SyntheticEvent, useState } from "react"
import { Box, Tab, Tabs, Typography, useTheme } from "@mui/material"
import { IUser } from "@/utils/interfaces"

interface Props {
  users: IUser[]
}

export function SettingsScreen({ users }: Props) {
  const theme = useTheme()
  const [value, setValue] = useState(0)

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <>
      <Typography variant="h1">Settings</Typography>
      <Box mt={2} display="flex" flexDirection="column" gap={2} justifyContent="space-between">
        <Box
          sx={{ borderBottom: 1, borderColor: "divider", borderTopRightRadius: 4, borderTopLeftRadius: 4 }}
          bgcolor={theme.palette.background.paper}
        >
          <Tabs value={value} onChange={handleChange} aria-label="settings tabs" variant="fullWidth">
            <Tab label="Account" {...a11yProps("account")} />
            <Tab label="Team Management" {...a11yProps("team-management")} />
            <Tab label="Board Configuration" {...a11yProps("board-configuration")} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {/* Account settings content goes here */}
          <Typography variant="h6">Account Settings</Typography>
          {/* Add your account-specific UI, like name, avatar, theme mode toggle */}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {/* Team management content goes here */}
          <Typography variant="h6">Team Management</Typography>
          {/* Add UI for adding/editing/deleting team members */}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          {/* Board configuration content goes here */}
          <Typography variant="h6">Board Configuration</Typography>
          {/* Add UI for board column settings, like column names and counts */}
        </CustomTabPanel>
      </Box>
    </>
  )
}

interface TabPanelProps {
  children?: ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(name: string) {
  return {
    id: `tab-${name}`,
    "aria-controls": `tabpanel-${name}`,
  }
}
