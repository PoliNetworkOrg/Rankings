import { createContext, useEffect, useState } from "react"
import { Data } from "../utils/data/data"

export interface IDataContext {
  data?: Data
  isLoading: boolean
}

const DataContext = createContext<IDataContext>({
  data: new Data(),
  isLoading: true
})

type Props = React.HTMLAttributes<React.ProviderProps<IDataContext>>
export function DataProvider({ ...p }: Props) {
  const [data, setData] = useState<Data | undefined>()
  const [isLoading, setIsLoading] = useState(true)

  async function init() {
    const data = await Data.init()
    if (data) setData(data)
    setIsLoading(false)
  }

  useEffect(() => {
    if (!data) init()
  }, [data])

  return <DataContext.Provider value={{ data, isLoading }} {...p} />
}

export default DataContext
