import { AreaChart, BarChart3, FileSearch, LineChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import AreaVariant from "./Charts/AreaVariant"
import BarVariant from "./Charts/BarVariant"
import LineVariant from "./Charts/LineVariant"
import { useState } from "react"
import { Select, SelectTrigger, SelectValue , SelectContent, SelectItem } from "../ui/select"


type ChartProps ={
    data:{
        date:Date,
        income:number,
        expenses:number
    }[]
}
const Chart = ({
    data
}:ChartProps) => {
    const [chartType,setChartType] = useState('area')

    
    return (
        <Card className="border-none box-shadow-sm">
            <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
                <CardTitle className="text-xl line-clamp-1">
                    Transactions
                </CardTitle>
                <Select
                    defaultValue={chartType}
                    onValueChange={(value)=>setChartType(value)}

                >
                    <SelectTrigger
                        className="lg:w-auto h-9 rounded-md px-3"
                    >
                        <SelectValue placeholder='Chart type' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="area">
                            <div className="flex items-center">
                                <AreaChart className="size-4 mr-2 shrink-0" />
                                <p className="line-clamp-1">
                                    Area Chart
                                </p>
                            </div>
                        </SelectItem>
                        <SelectItem value="bar">
                            <div className="flex items-center">
                                <BarChart3 className="size-4 mr-2 shrink-0" />
                                <p className="line-clamp-1">
                                    Bar Chart
                                </p>
                            </div>
                        </SelectItem>
                        <SelectItem value="line">
                            <div className="flex items-center">
                                <LineChart className="size-4 mr-2 shrink-0" />
                                <p className="line-clamp-1">
                                    Line Chart
                                </p>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>


            </CardHeader>
            <CardContent>
                {data.length === 0 ?(
                    <div className="flex flex-col gap-y-4 items-center justify-center h-[350px] w-full">
                        <FileSearch 
                            className="size-6 text-muted-foreground" 
                        />
                        <p className="text-muted-foreground text-sm">
                            No data for this period
                        </p>
                    </div>
                ):(
                    <div>
                        { chartType==='area' && <AreaVariant data={data}/> }
                        { chartType==='bar' && <BarVariant data={data} /> }
                        { chartType==='line' && <LineVariant data={data}/> }
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default Chart