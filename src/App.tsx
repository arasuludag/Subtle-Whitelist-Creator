import { Stack } from "@mui/material"
import "./App.css"
import CSVFileInput from "./pages/CSVFileInput"
import GroupByCompany from "./pages/GroupByCompany"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CheckForEmailMismatch from "./pages/CheckForEmailMismatch"
import RemoveDuplicates from "./pages/RemoveDuplicates"
import DownloadButton from "./pages/DownloadAsCSV"
import Remove10sAnd1s from "./pages/Remove10sAnd1s"

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FFFFFF",
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline enableColorScheme />
      <Stack
        direction="column"
        justifyContent="space-around"
        alignItems="center"
        spacing={2}
      >
        <CSVFileInput />

        <Remove10sAnd1s />

        <RemoveDuplicates />

        <CheckForEmailMismatch />

        <GroupByCompany />

        <DownloadButton />
      </Stack>
    </ThemeProvider>
  )
}

export default App
