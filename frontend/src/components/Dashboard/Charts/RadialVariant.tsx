import { Legend, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip } from "recharts"
import { formatCurrency } from "../../../lib/utils"
import CategoryTooltip from "../category-tooltop"

const Colors =['#0062ff','#12c6ff','#ff647f','#ff9354']

type RadialVariantProps ={
    data:{
        name:string,
        value:number
    }[]
}

const RadialVariant = ({data}:RadialVariantProps) => {
  return (
    <ResponsiveContainer width={'100%'} height={350}>
        <RadialBarChart
            cx={'50%'}
            cy='30%'
            barSize={10}
            innerRadius={'90%'}
            outerRadius={'40%'}
            data={data.map((item,index)=>({
                ...item,
                fill: Colors[index % Colors.length]
            }))}
        >
            <RadialBar 
                label={{
                    position:'insideStart',
                    fill:'#fff',
                    fontSize:'12px'
                }}            
                background
                dataKey='value'
            />
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
                                            formatCurrency(entry.payload?.value)
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
        </RadialBarChart>
    </ResponsiveContainer>
  )
}

export default RadialVariant