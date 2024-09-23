import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { useState } from "react"
import { Select, SelectTrigger, SelectValue , SelectContent, SelectItem } from "../ui/select"
import { FileSearch, PieChart, Radar, Target } from "lucide-react"
import PieVariant from "./Charts/PieVariant"
import RadarVariant from "./Charts/RadarVariant"
import RadialVariant from "./Charts/RadialVariant"


type SpendingPieProps ={
    data:{
        name:string,
        value:number
    }[]
}
const SpendingPie = ({
    data
}:SpendingPieProps) => {
    const [pieType,setPieType] = useState('pie')

    
    return (
        <Card className="border-none box-shadow-sm">
            <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
                <CardTitle className="text-xl line-clamp-1">
                    Categories
                </CardTitle>
                <Select
                    defaultValue={pieType}
                    onValueChange={(value)=>setPieType(value)}

                >
                    <SelectTrigger
                        className="lg:w-auto h-9 rounded-md px-3"
                    >
                        <SelectValue placeholder='Pie type' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pie">
                            <div className="flex items-center">
                                <PieChart className="size-4 mr-2 shrink-0" />
                                <p className="line-clamp-1">
                                    Pie Chart
                                </p>
                            </div>
                        </SelectItem>
                        <SelectItem value="radar">
                            <div className="flex items-center">
                                <Radar className="size-4 mr-2 shrink-0" />
                                <p className="line-clamp-1">
                                    Radar Chart
                                </p>
                            </div>
                        </SelectItem>
                        <SelectItem value="radial">
                            <div className="flex items-center">
                                <Target className="size-4 mr-2 shrink-0" />
                                <p className="line-clamp-1">
                                    Radial Chart
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
                        { pieType==='pie' && <PieVariant data={data}/> }
                        { pieType==='radar' && <RadarVariant data={data} /> }
                        { pieType==='radial' && <RadialVariant data={data}/> }
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default SpendingPie