import React, { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  Typography,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  groupDataByCompany,
  selectDataGroupedByCompany,
  selectEmailFilteredData,
  snakeCaseToRegularText,
} from "../slices/whitelistDataSlice"

export default function MeanDataDisplay() {
  const dispatch = useAppDispatch()
  const [pressed, setPressed] = useState<Boolean>(false)
  const groupedData = useAppSelector(selectDataGroupedByCompany)
  const emailFilteredData = useAppSelector(selectEmailFilteredData)

  const handleButtonClick = () => {
    dispatch(groupDataByCompany())
    setPressed(true)
  }

  const ratings = Object.values(groupedData)
    .map((group) => Object.keys(group))
    .flat()
  const uniqueRatings = Array.from(new Set(ratings))

  return (
    <Stack
      direction="column"
      justifyContent="space-around"
      alignItems="center"
      spacing={2}
    >
      {emailFilteredData.length > 0 && (
        <Button variant="contained" onClick={handleButtonClick}>
          Group by company {pressed && "✅"}
        </Button>
      )}
      {Object.keys(groupedData).length > 0 && (
        <Typography>
          There are {Object.keys(groupedData).length} companies in total
        </Typography>
      )}
      {Object.keys(groupedData).length > 0 && (
        <div>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>company</TableCell>
                  {uniqueRatings.map((rating) => (
                    <TableCell key={rating}>
                      {snakeCaseToRegularText(rating)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(groupedData).map(([group, ratings]) => (
                  <TableRow key={group}>
                    <TableCell>{group}</TableCell>
                    {uniqueRatings.map((rating) => (
                      <TableCell key={rating}>
                        {
                          // @ts-ignore
                          ratings[rating] || "-"
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </Stack>
  )
}
