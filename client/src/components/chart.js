import React, { PureComponent } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const data = [
    {
        name: "Page A",
        "points-earned": 2400,
        amt: 2400
    },
    {
        name: "Page B",
        "points-earned": 1398,
        amt: 2210
    },
    {
        name: "Page C",
        "points-earned": 9800,
        amt: 2290
    },
    {
        name: "Page D",
        "points-earned": 3908,
        amt: 2000
    },
    {
        name: "Page E",
        "points-earned": 4800,
        amt: 2181
    },
    {
        name: "Page F",
        "points-earned": 3800,
        amt: 2500
    },
    {
        name: "Page G",
        "points-earned": 4300,
        amt: 2100
    }
];

export default class Chart extends PureComponent {

    render() {
        return (
            <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="points-earned" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
        );
    }
}
