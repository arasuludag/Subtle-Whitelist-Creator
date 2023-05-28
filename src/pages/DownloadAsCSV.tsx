import React from "react"
import { saveAs } from "file-saver"
import { useAppSelector } from "../app/hooks"
import { selectDataGroupedByCompany } from "../slices/whitelistDataSlice"
import { Button } from "@mui/material"

export default function DownloadButton() {
  const data = useAppSelector(selectDataGroupedByCompany)

  const handleDownload = () => {
    const csvContent = convertToCSV(data)
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" })
    saveAs(blob, "data.csv")
  }

  const convertToCSV = (data: any) => {
    const companies = Object.keys(data)
    const keys = Object.keys(data[companies[0]] || {})

    // Generate the header row
    const header = `Company,${keys.join(",")}`

    // Generate the data rows for each company
    const rows = companies.map((company) => {
      const values = keys.map((key) => data[company][key])
      return `${company},${values.join(",")}`
    })

    return [header, ...rows].join("\n")
  }

  return (
    <div>
      {Object.keys(data).length > 0 && (
        <Button onClick={handleDownload}>Download CSV</Button>
      )}
    </div>
  )
}
