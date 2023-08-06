import React, { useState } from "react"
import Button from "@mui/material/Button"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  FeedbackData,
  selectRawData,
  setDuplicateFreeData,
  snakeCaseToRegularText,
} from "../slices/whitelistDataSlice"
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"

export default function RemoveDuplicates() {
  const [duplicates, setDuplicates] = useState<FeedbackData[]>([])
  const [pressed, setPressed] = useState<Boolean>(false)
  const data = useAppSelector(selectRawData)
  const dispatch = useAppDispatch()

  const handleButtonClick = () => {
    const uniquePairs: any = {}
    const filteredArray: FeedbackData[] = []
    const filteredOutArray: FeedbackData[] = []

    data.forEach((obj: any) => {
      const key = `${obj.email}-${obj.company}`
      if (!uniquePairs[key]) {
        uniquePairs[key] = true
        filteredArray.push(obj)
      } else {
        filteredOutArray.push(obj)
      }
    })

    dispatch(setDuplicateFreeData(filteredArray))
    setDuplicates(filteredOutArray)
    setPressed(true)
  }

  const keys = Object.keys(duplicates[0] || {})

  return (
    <Stack
      direction="column"
      justifyContent="space-around"
      alignItems="center"
      spacing={2}
    >
      {data.length > 0 && (
        <Button variant="contained" onClick={handleButtonClick}>
          Remove email-company pair duplicates {pressed && "✅"}
        </Button>
      )}
      {duplicates.length > 0 && (
        <Typography>Removed {duplicates.length} feedback</Typography>
      )}
      {duplicates.length > 0 && (
        <TableContainer sx={{ maxWidth: "90vw", maxHeight: "2000px" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {keys.map((key) => (
                  <TableCell key={key}>{snakeCaseToRegularText(key)}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {duplicates.map((item: any, index: number) => (
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
