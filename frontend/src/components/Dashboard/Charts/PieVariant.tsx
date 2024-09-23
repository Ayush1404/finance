import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { formatPercentage } from "../../../lib/utils"
import CategoryTooltip from "../category-tooltop"

const Colors =['#0062ff','#12c6ff','#ff647f','#ff9354']

type PieVariantProps ={
    data:{
        name:string,
        value:number
    }[]
}

const PieVariant = ({data}:PieVariantProps) => {
  return (
    <ResponsiveContainer width={'100%'} height={350}>
        <PieChart>
            <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="right"
                iconType="circle"
                content={({payload})=>(
                    <ul className="flex flex-col space-y-2">
                        {payload?.map((entry,index)=>(
                            <li 
                                key={`item-${index}`}
                                className="flex items-center space-x-2"
                            >
                                <span 
                                    className="rounded-full size-2"
                                    style={{backgroundColor:entry.color}}
                                />
                                <div className="spaxe-x-1">
                                    <span className="text-sm text-muted-foreground mr-2">
                                        {
                                            //@ts-ignore
                                            entry.payload?.name
                                        }
                                    </span>
                                    <span className="text-sm">
                                        {
                                            //@ts-ignore
                                            formatPercentage(entry.payload?.percent * 100)
                                        }
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            />
            <Tooltip 
                content={<CategoryTooltip />}
            />
            <Pie 
                data={data}
                cx={'50%'}
                cy='50%'
                outerRadius={90}
                innerRadius={60}
                paddingAngle={2}
                fill="#3884d8"
                dataKey={'value'}
                labelLine={false}
            >
                {data.map((_entry,index)=>(
                    <Cell 
                        key={`cell-${index}`}
                        fill={Colors[index%Colors.length]}
                    />
                ))}
            </Pie>
        </PieChart>
    </ResponsiveContainer>
  )
}

export default PieVariant