import { ChangeEvent } from "react"
import { setData } from "../slices/whitelistDataSlice"
import csvtojson from "csvtojson"
import Input from "@mui/material/Input"
import { useAppDispatch } from "../app/hooks"

export default function CSVFileInput() {
  const dispatch = useAppDispatch()

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
        const json: { [key: string]: any } = await csvtojson({
          noheader: false, // To skip the default header detection
          headers: customHeaders, // Specify your own keys
        }).fromString(csvString)

        dispatch(setData(json))
      }
    }
    reader.readAsText(file)
  }

  return (
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
  )
}
