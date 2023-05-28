import React, { useState } from "react"
import Button from "@mui/material/Button"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  WhitelistData,
  camelCaseToRegularText,
  selectRawData,
  setDuplicateFreeData,
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

export default function RemoveDuplicates() {
  const [duplicates, setDuplicates] = useState<WhitelistData>([])
  const data = useAppSelector(selectRawData)
  const dispatch = useAppDispatch()

  const handleButtonClick = () => {
    const uniquePairs: any = {}
    const filteredArray: WhitelistData = []
    const filteredOutArray: WhitelistData = []

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
          Remove email-company pair duplicates
        </Button>
      )}
      {duplicates.length > 0 && (
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
