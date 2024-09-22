import { useRecoilValue } from "recoil"
import summaryAtom from "../../store/summaryAtom"
import Chart from "./Chart"

type DataChartProps = {
  loading:boolean
}
const DataCharts = ({
  loading
}:DataChartProps) => {
  const data = useRecoilValue(summaryAtom)

  if(loading)
    return(
      <div>
        ...loading
      </div>
    )
  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
        <div className="col-span-1 lg:col-span-3 xl:col-span-4">
          <Chart data={data.days}/>
        </div>
    </div>
  )
}

export default DataCharts