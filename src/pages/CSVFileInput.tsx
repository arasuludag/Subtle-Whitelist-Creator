import { ChangeEvent, useState } from "react"
import { FeedbackData, setData } from "../slices/whitelistDataSlice"
import csvtojson from "csvtojson"
import Input from "@mui/material/Input"
import { useAppDispatch } from "../app/hooks"
import { Stack, Typography } from "@mui/material"

export default function CSVFileInput() {
  const dispatch = useAppDispatch()
  const [jsonData, setJSONData] = useState<FeedbackData[]>([])

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async () => {
      const csvString = reader.result
      if (typeof csvString === "string") {
        const customHeaders = [
          "timestamp",
          "email",
          "company",
          "hiresQualified",
          "providesOnboarding",
          "providesSourceMaterials",
          "hasSubtitlingGuidelines",
          "reasonableDeadlines",
          "suppliesTools",
          "fostersCollaborativeEnvironment",
          "actsInGoodFaith",
          "maintainsJobCommunication",
          "maintainsTransparency",
          "keepsPrivateInformation",
          "creditsTranslator",
          "authorFinalSay",
          "paysOnTime",
          "paysWithinReasonablePeriod",
          "paysFairRates",
          "paysForRushJobs",
          "paysForLateHours",
          "paysForAdditionalWork",
          "offersPartialCompensation",
          "coversBankTransferFee",
        ]
        const json: FeedbackData[] = await csvtojson({
          noheader: false,
          headers: customHeaders,
        }).fromString(csvString)

        dispatch(setData(json))
        setJSONData(json)
      }
    }
    reader.readAsText(file)
  }

  return (
    <Stack
      direction="column"
      justifyContent="space-around"
      alignItems="center"
      spacing={2}
    >
      <Input
        type="file"
        onChange={handleFileChange}
        disableUnderline
        sx={{
          backgroundColor: "transparent",
          padding: (theme) => theme.spacing(1),
          height: "150px",
          borderRadius: (theme) => theme.shape.borderRadius,
          borderStyle: "dashed",
          borderColor: (theme) => theme.palette.primary.main,
        }}
      />
      {jsonData.length > 0 && (
        <Typography>Fetched {jsonData.length} feedback</Typography>
      )}
    </Stack>
  )
}
