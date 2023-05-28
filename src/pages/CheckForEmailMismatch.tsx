import React, { useState } from "react"
import Button from "@mui/material/Button"
import axios from "axios"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  filterDataByEmail,
  selectDuplicateFilteredData,
} from "../slices/whitelistDataSlice"
import {
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"

export default function CheckForEmailMismatch() {
  const [flaggedEmails, setFlaggedEmails] = useState([])
  const [loading, setLoading] = useState(false)
  const data = useAppSelector(selectDuplicateFilteredData)
  const dispatch = useAppDispatch()
  const handleButtonClick = () => {
    setLoading(true)
    const emails = data.map((entry: any) => entry.email)

    axios
      .post(
        "https://subtle-subtitlers.org.uk/wp-json/discord-bot-link/v1/check-emails",
        { emails },
      )
      .then((response) => {
        setFlaggedEmails(response.data)
        dispatch(filterDataByEmail(response.data))
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error:", error)
        // Handle any errors that occur during the request
      })
  }

  return (
    <Stack
      direction="column"
      justifyContent="space-around"
      alignItems="center"
      spacing={2}
    >
      {data.length > 0 && (
        <Button variant="contained" onClick={handleButtonClick}>
          Filter out non-subtle emails
        </Button>
      )}
      {loading ? (
        <CircularProgress />
      ) : (
        flaggedEmails.length > 0 && (
          <TableContainer component={Paper}>
            <Table size="small" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Removed entries with these emails:</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {flaggedEmails.map((row) => (
                  <TableRow
                    key={row}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}
    </Stack>
  )
}
