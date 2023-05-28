import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../app/store"

export interface WhitelistData {
  [key: string]: any
}

interface Ratings {
  [key: string]: string
}

interface Company {
  [key: string]: Ratings & { overall?: string }
}

function groupArrayBy(array: WhitelistData, key: string): any {
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

function calculateMean(groupedData: any): any {
  const result: any = {}
  for (const groupKey in groupedData) {
    if (groupedData.hasOwnProperty(groupKey)) {
      const group = groupedData[groupKey]
      const ratingsCount = group.length
      const sum: any = group.reduce((acc: any, obj: any) => {
        for (const prop in obj) {
          if (obj.hasOwnProperty(prop) && !isNaN(parseFloat(obj[prop]))) {
            if (!acc[prop]) {
              acc[prop] = 0
            }
            acc[prop] += parseFloat(obj[prop])
          }
        }
        return acc
      }, {})

      const mean: any = {}
      for (const prop in sum) {
        if (sum.hasOwnProperty(prop)) {
          mean[prop] = (sum[prop] / ratingsCount).toFixed(1)
        }
      }
      result[groupKey] = mean
    }
  }
  return result
}

function removeKeyFromArray(array: WhitelistData, key: string) {
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
function calculateCombinedMean(ratings: Ratings): string {
  const ratingValues = Object.values(ratings).map((value) => parseFloat(value))
  const sum = ratingValues.reduce((acc, val) => acc + val, 0)
  const mean = sum / ratingValues.length

  return mean.toFixed(2)
}

// Function to add the "overall" key without modifying the original object
function addOverallRating(companyData: Company): Company {
  const updatedData: Company = {}

  for (const [company, ratings] of Object.entries(companyData)) {
    const overall = calculateCombinedMean(ratings)
    updatedData[company] = { overall, ...ratings }
  }

  return updatedData
}

const initialState: {
  rawData: WhitelistData
  filteredDuplicatesData: WhitelistData
  filteredEmailData: WhitelistData
  dataGroupedByCompany: WhitelistData
} = {
  rawData: [],
  filteredDuplicatesData: [],
  filteredEmailData: [],
  dataGroupedByCompany: [],
}

const whitelistDataSlice = createSlice({
  name: "whitelistData",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<WhitelistData>) => {
      state.rawData = action.payload
    },
    setDuplicateFreeData: (state, action: PayloadAction<WhitelistData>) => {
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
