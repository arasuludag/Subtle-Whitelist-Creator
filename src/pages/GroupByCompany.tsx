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
  Slider,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  groupDataByCompany,
  selectDataGroupedByCompany,
  selectEmailFilteredData,
  setNumOfVotesThreshold,
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

  const handleThresholdChange = (value: number | number[]) => {
    if (typeof value === "number") dispatch(setNumOfVotesThreshold(value))
  }

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
        <>
          <Typography>Threshold:</Typography>
          <Slider
            aria-label="Threshold"
            defaultValue={10}
            valueLabelDisplay="auto"
            onChange={(_, value) => handleThresholdChange(value)}
            sx={{ width: "300px" }}
            step={1}
            marks
            min={1}
            max={25}
          />
          <Typography>
            There are {Object.keys(groupedData).length} companies in total
          </Typography>
        </>
      )}
      {Object.keys(groupedData).length > 0 && (
        <div>
          <TableContainer sx={{ maxWidth: "90vw", maxHeight: "2000px" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Company</TableCell>
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
