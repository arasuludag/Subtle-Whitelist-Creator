import React, { useState } from "react"
import Button from "@mui/material/Button"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  WhitelistData,
  camelCaseToRegularText,
  selectRawData,
  setData,
} from "../slices/whitelistDataSlice"
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"

export default function Remove10sAnd1s() {
  const [filteredOut, setFilteredOut] = useState<WhitelistData>([])
  const data = useAppSelector(selectRawData)
  const dispatch = useAppDispatch()

  const handleButtonClick = () => {
    const filteredData: WhitelistData = []
    const filteredOutData: WhitelistData = []

    data.forEach((obj: any) => {
      const relevantRatings = Object.entries(obj).filter(
        ([key]) => key !== "timestamp" && key !== "company" && key !== "email",
      )
      const isAll10s = relevantRatings.every(([_, value]) => value === "10")
      const isAll1s = relevantRatings.every(([_, value]) => value === "1")

      if (isAll10s || isAll1s) {
        filteredOutData.push(obj)
      } else {
        filteredData.push(obj)
      }
    })

    console.log("Filtered Data:", filteredData)
    console.log("Filtered Out Data:", filteredOutData)

    dispatch(setData(filteredData))
    setFilteredOut(filteredOutData)
  }

  const keys = Object.keys(filteredOut[0] || {})

  return (
    <Stack
      direction="column"
      justifyContent="space-around"
      alignItems="center"
      spacing={2}
    >
      {data.length > 0 && (
        <Button variant="contained" onClick={handleButtonClick}>
          Remove all 10s and all 1s (Optional)
        </Button>
      )}
      {filteredOut.length > 0 && (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {keys.map((key) => (
                  <TableCell key={key}>{camelCaseToRegularText(key)}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOut.map((item: any, index: number) => (
                <TableRow key={index}>
                  {keys.map((key) => (
                    <TableCell key={key}>{item[key]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  )
}
