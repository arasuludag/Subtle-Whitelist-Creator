import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../app/store"

export interface FeedbackData {
  timestamp: string
  email: string
  company: string
  hiresQualified: string
  providesOnboarding: string
  providesSourceMaterials: string
  hasSubtitlingGuidelines: string
  reasonableDeadlines: string
  suppliesTools: string
  fostersCollaborativeEnvironment: string
  actsInGoodFaith: string
  maintainsJobCommunication: string
  maintainsTransparency: string
  keepsPrivateInformation: string
  creditsTranslator: string
  authorFinalSay: string
  paysOnTime: string
  paysWithinReasonablePeriod: string
  paysFairRates: string
  paysForRushJobs: string
  paysForLateHours: string
  paysForAdditionalWork: string
  offersPartialCompensation: string
  coversBankTransferFee: string
  [key: string]: string
}

interface CompanyFeedback {
  overall?: string
  hiresQualified: string
  providesOnboarding: string
  providesSourceMaterials: string
  hasSubtitlingGuidelines: string
  reasonableDeadlines: string
  suppliesTools: string
  fostersCollaborativeEnvironment: string
  actsInGoodFaith: string
  maintainsJobCommunication: string
  maintainsTransparency: string
  keepsPrivateInformation: string
  creditsTranslator: string
  authorFinalSay: string
  paysOnTime: string
  paysWithinReasonablePeriod: string
  paysFairRates: string
  paysForRushJobs: string
  paysForLateHours: string
  paysForAdditionalWork: string
  offersPartialCompensation: string
  coversBankTransferFee: string
}

export interface CompanyFeedbackData {
  [companyName: string]: CompanyFeedback
}

function groupArrayBy(array: FeedbackData[], key: string): CompanyFeedbackData {
  return array.reduce((grouped: any, obj: any) => {
    const groupKey = obj[key]
    if (!grouped[groupKey]) {
      grouped[groupKey] = []
    }
    const { [key]: _, ...rest } = obj
    grouped[groupKey].push(rest)
    return grouped
  }, {})
}

function calculateMean(groupedData: CompanyFeedbackData): CompanyFeedbackData {
  const result: CompanyFeedbackData = {}
  for (const groupName in groupedData) {
    if (groupedData.hasOwnProperty(groupName)) {
      const group = groupedData[groupName]
      const ratingsCount = Object.keys(group).length
      const sum: any = {}
      for (const feedback of Object.values(group)) {
        for (const prop in feedback) {
          if (
            feedback.hasOwnProperty(prop) &&
            prop !== "overall" && // Exclude the "overall" property from calculations
            !isNaN(parseFloat(feedback[prop]))
          ) {
            if (!sum[prop]) {
              sum[prop] = 0
            }
            sum[prop] += parseFloat(feedback[prop])
          }
        }
      }

      const mean: any = {}
      for (const prop in sum) {
        if (sum.hasOwnProperty(prop)) {
          mean[prop] = (sum[prop] / ratingsCount).toFixed(1)
        }
      }
      result[groupName] = mean
    }
  }
  return result
}

function removeKeyFromArray(array: FeedbackData[], key: string) {
  return array.map(function (obj: any) {
    var newObj = Object.assign({}, obj)
    delete newObj[key]
    return newObj
  })
}

export function camelCaseToRegularText(camelCaseString: string) {
  // Use regular expression to split the camel case string into words
  const words = camelCaseString.split(/(?=[A-Z])/)

  // Convert each word to lowercase and join them with spaces
  const regularText = words.map((word) => word.toLowerCase()).join(" ")

  return regularText
}

// Function to calculate the combined mean for a company
function calculateCombinedMean(ratings: CompanyFeedback): string {
  const ratingValues = Object.values(ratings).map((value) => parseFloat(value))
  const sum = ratingValues.reduce((acc, val) => acc + val, 0)
  const mean = sum / ratingValues.length

  return mean.toFixed(2)
}

// Function to add the "overall" key without modifying the original object
function addOverallRating(
  companyData: CompanyFeedbackData,
): CompanyFeedbackData {
  const updatedData: CompanyFeedbackData = {}

  for (const [company, ratings] of Object.entries(companyData)) {
    const overall = calculateCombinedMean(ratings)
    updatedData[company] = { overall, ...ratings }
  }

  return updatedData
}

const initialState: {
  rawData: FeedbackData[]
  filteredDuplicatesData: FeedbackData[]
  filteredEmailData: FeedbackData[]
  dataGroupedByCompany: CompanyFeedbackData
} = {
  rawData: [],
  filteredDuplicatesData: [],
  filteredEmailData: [],
  dataGroupedByCompany: {},
}

const whitelistDataSlice = createSlice({
  name: "whitelistData",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<FeedbackData[]>) => {
      state.rawData = action.payload
    },
    setDuplicateFreeData: (state, action: PayloadAction<FeedbackData[]>) => {
      state.filteredDuplicatesData = action.payload
    },
    groupDataByCompany: (state) => {
      const groupedByCompany = groupArrayBy(
        removeKeyFromArray(state.filteredEmailData, "timestamp"),
        "company",
      )

      const meanByCompany = calculateMean(groupedByCompany)

      state.dataGroupedByCompany = addOverallRating(meanByCompany)
    },
    filterDataByEmail: (state, action: PayloadAction<string[]>) => {
      state.filteredEmailData = state.filteredDuplicatesData.filter(
        (obj: any) => !action.payload.includes(obj.email),
      )
    },
  },
})

export const {
  setData,
  groupDataByCompany,
  filterDataByEmail,
  setDuplicateFreeData,
} = whitelistDataSlice.actions

export const selectDataGroupedByCompany = (state: RootState) =>
  state.whitelistData.dataGroupedByCompany
export const selectRawData = (state: RootState) => state.whitelistData.rawData
export const selectDuplicateFilteredData = (state: RootState) =>
  state.whitelistData.filteredDuplicatesData
export const selectEmailFilteredData = (state: RootState) =>
  state.whitelistData.filteredEmailData

export default whitelistDataSlice.reducer
