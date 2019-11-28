import React, {Component} from 'react';
import MyResponsiveLine from "../components/charts/LineChart";
import MyResponsiveBar from "../components/charts/BarChart";
import html2canvas from "html2canvas";
import JsPDF from "jspdf";

const lineChartData = [
    {
        "id": "japan",
        "color": "hsl(284, 70%, 50%)",
        "data": [
            {
                "x": "plane",
                "y": 136
            },
            {
                "x": "helicopter",
                "y": 150
            },
            {
                "x": "boat",
                "y": 223
            },
            {
                "x": "train",
                "y": 263
            },
            {
                "x": "subway",
                "y": 173
            },
            {
                "x": "bus",
                "y": 2
            },
            {
                "x": "car",
                "y": 208
            },
            {
                "x": "moto",
                "y": 112
            },
            {
                "x": "bicycle",
                "y": 168
            },
            {
                "x": "horse",
                "y": 127
            },
            {
                "x": "skateboard",
                "y": 195
            },
            {
                "x": "others",
                "y": 214
            }
        ]
    },
    {
        "id": "france",
        "color": "hsl(169, 70%, 50%)",
        "data": [
            {
                "x": "plane",
                "y": 136
            },
            {
                "x": "helicopter",
                "y": 278
            },
            {
                "x": "boat",
                "y": 234
            },
            {
                "x": "train",
                "y": 46
            },
            {
                "x": "subway",
                "y": 39
            },
            {
                "x": "bus",
                "y": 37
            },
            {
                "x": "car",
                "y": 3
            },
            {
                "x": "moto",
                "y": 94
            },
            {
                "x": "bicycle",
                "y": 164
            },
            {
                "x": "horse",
                "y": 256
            },
            {
                "x": "skateboard",
                "y": 253
            },
            {
                "x": "others",
                "y": 279
            }
        ]
    },
    {
        "id": "us",
        "color": "hsl(237, 70%, 50%)",
        "data": [
            {
                "x": "plane",
                "y": 108
            },
            {
                "x": "helicopter",
                "y": 52
            },
            {
                "x": "boat",
                "y": 44
            },
            {
                "x": "train",
                "y": 199
            },
            {
                "x": "subway",
                "y": 184
            },
            {
                "x": "bus",
                "y": 194
            },
            {
                "x": "car",
                "y": 162
            },
            {
                "x": "moto",
                "y": 125
            },
            {
                "x": "bicycle",
                "y": 162
            },
            {
                "x": "horse",
                "y": 231
            },
            {
                "x": "skateboard",
                "y": 251
            },
            {
                "x": "others",
                "y": 256
            }
        ]
    },
    {
        "id": "germany",
        "color": "hsl(328, 70%, 50%)",
        "data": [
            {
                "x": "plane",
                "y": 123
            },
            {
                "x": "helicopter",
                "y": 86
            },
            {
                "x": "boat",
                "y": 59
            },
            {
                "x": "train",
                "y": 266
            },
            {
                "x": "subway",
                "y": 99
            },
            {
                "x": "bus",
                "y": 288
            },
            {
                "x": "car",
                "y": 211
            },
            {
                "x": "moto",
                "y": 180
            },
            {
                "x": "bicycle",
                "y": 152
            },
            {
                "x": "horse",
                "y": 31
            },
            {
                "x": "skateboard",
                "y": 236
            },
            {
                "x": "others",
                "y": 289
            }
        ]
    },
    {
        "id": "norway",
        "color": "hsl(333, 70%, 50%)",
        "data": [
            {
                "x": "plane",
                "y": 70
            },
            {
                "x": "helicopter",
                "y": 281
            },
            {
                "x": "boat",
                "y": 111
            },
            {
                "x": "train",
                "y": 107
            },
            {
                "x": "subway",
                "y": 210
            },
            {
                "x": "bus",
                "y": 18
            },
            {
                "x": "car",
                "y": 110
            },
            {
                "x": "moto",
                "y": 110
            },
            {
                "x": "bicycle",
                "y": 169
            },
            {
                "x": "horse",
                "y": 5
            },
            {
                "x": "skateboard",
                "y": 114
            },
            {
                "x": "others",
                "y": 152
            }
        ]
    }
];
const barChartData = [
    {
        "country": "AD",
        "hot dog": 16,
        "hot dogColor": "hsl(8, 70%, 50%)",
        "burger": 5,
        "burgerColor": "hsl(202, 70%, 50%)",
        "sandwich": 182,
        "sandwichColor": "hsl(57, 70%, 50%)",
        "kebab": 157,
        "kebabColor": "hsl(37, 70%, 50%)",
        "fries": 132,
        "friesColor": "hsl(239, 70%, 50%)",
        "donut": 174,
        "donutColor": "hsl(242, 70%, 50%)"
    },
    {
        "country": "AE",
        "hot dog": 51,
        "hot dogColor": "hsl(126, 70%, 50%)",
        "burger": 59,
        "burgerColor": "hsl(14, 70%, 50%)",
        "sandwich": 17,
        "sandwichColor": "hsl(12, 70%, 50%)",
        "kebab": 192,
        "kebabColor": "hsl(22, 70%, 50%)",
        "fries": 105,
        "friesColor": "hsl(1, 70%, 50%)",
        "donut": 74,
        "donutColor": "hsl(357, 70%, 50%)"
    },
    {
        "country": "AF",
        "hot dog": 65,
        "hot dogColor": "hsl(217, 70%, 50%)",
        "burger": 3,
        "burgerColor": "hsl(167, 70%, 50%)",
        "sandwich": 185,
        "sandwichColor": "hsl(97, 70%, 50%)",
        "kebab": 73,
        "kebabColor": "hsl(335, 70%, 50%)",
        "fries": 38,
        "friesColor": "hsl(140, 70%, 50%)",
        "donut": 72,
        "donutColor": "hsl(7, 70%, 50%)"
    },
    {
        "country": "AG",
        "hot dog": 80,
        "hot dogColor": "hsl(342, 70%, 50%)",
        "burger": 34,
        "burgerColor": "hsl(147, 70%, 50%)",
        "sandwich": 93,
        "sandwichColor": "hsl(314, 70%, 50%)",
        "kebab": 54,
        "kebabColor": "hsl(240, 70%, 50%)",
        "fries": 92,
        "friesColor": "hsl(148, 70%, 50%)",
        "donut": 2,
        "donutColor": "hsl(88, 70%, 50%)"
    },
    {
        "country": "AI",
        "hot dog": 36,
        "hot dogColor": "hsl(3, 70%, 50%)",
        "burger": 124,
        "burgerColor": "hsl(176, 70%, 50%)",
        "sandwich": 2,
        "sandwichColor": "hsl(120, 70%, 50%)",
        "kebab": 116,
        "kebabColor": "hsl(243, 70%, 50%)",
        "fries": 147,
        "friesColor": "hsl(5, 70%, 50%)",
        "donut": 107,
        "donutColor": "hsl(89, 70%, 50%)"
    },
    {
        "country": "AL",
        "hot dog": 143,
        "hot dogColor": "hsl(177, 70%, 50%)",
        "burger": 45,
        "burgerColor": "hsl(103, 70%, 50%)",
        "sandwich": 59,
        "sandwichColor": "hsl(267, 70%, 50%)",
        "kebab": 87,
        "kebabColor": "hsl(208, 70%, 50%)",
        "fries": 109,
        "friesColor": "hsl(143, 70%, 50%)",
        "donut": 97,
        "donutColor": "hsl(270, 70%, 50%)"
    },
    {
        "country": "AM",
        "hot dog": 105,
        "hot dogColor": "hsl(75, 70%, 50%)",
        "burger": 31,
        "burgerColor": "hsl(133, 70%, 50%)",
        "sandwich": 60,
        "sandwichColor": "hsl(208, 70%, 50%)",
        "kebab": 50,
        "kebabColor": "hsl(329, 70%, 50%)",
        "fries": 89,
        "friesColor": "hsl(23, 70%, 50%)",
        "donut": 174,
        "donutColor": "hsl(245, 70%, 50%)"
    }
];

class Dashboard extends Component {


    downloadPDF = () => {
        html2canvas(document.querySelector("#lineChart")).then(canvas => {
            // document.body.appendChild(canvas);
            const imgData = canvas.toDataURL("image/jpeg", 1.0);
            const pdf = new JsPDF('landscape');
            pdf.setFontSize(20);
            pdf.text(9, 9, "Cool Chart");
            pdf.addImage(imgData, 'JPEG', 10, 10, 280, 160);
            pdf.save('canvas.pdf');
        });
    };

    render() {
        return (
            <div className="br-mainpanel" id="dashboard">
                <div className="pd-30">
                    <h4 className="tx-gray-800 mg-b-5">Dashboard</h4>
                    <p className="mg-b-0">Last updated 26-11-2019 12:30pm.</p>
                </div>

                <div className="br-pagebody mg-t-5 pd-x-30">
                    <div className="row row-sm">
                        <div className="col-sm-6 col-xl-4">
                            <div className="bg-teal rounded overflow-hidden">
                                <div className="pd-25 d-flex align-items-center">
                                    <i className="ion ion-android-people tx-60 lh-0 tx-white op-7"></i>
                                    <div className="mg-l-20">
                                        <p className="tx-10 tx-spacing-1 tx-mont tx-medium tx-uppercase tx-white-8 mg-b-10">Total
                                            Customers</p>
                                        <p className="tx-24 tx-white tx-lato tx-bold mg-b-2 lh-1">5,300</p>
                                        {/*<span className="tx-11 tx-roboto tx-white-6">24% higher yesterday</span>*/}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-4 mg-t-20 mg-sm-t-0">
                            <div className="bg-teal-info rounded overflow-hidden">
                                <div className="pd-25 d-flex align-items-center">
                                    <i className="ion ion-bag tx-60 lh-0 tx-white op-7"></i>
                                    <div className="mg-l-20">
                                        <p className="tx-10 tx-spacing-1 tx-mont tx-medium tx-uppercase tx-white-8 mg-b-10">Total
                                            Stores</p>
                                        <p className="tx-24 tx-white tx-lato tx-bold mg-b-2 lh-1">700</p>
                                        {/*<span className="tx-11 tx-roboto tx-white-6">$390,212 before tax</span>*/}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-4 mg-t-20 mg-xl-t-0">
                            <div className="bg-primary rounded overflow-hidden">
                                <div className="pd-25 d-flex align-items-center">
                                    <i className="ion ion-ios-pie tx-60 lh-0 tx-white op-7"></i>
                                    <div className="mg-l-20">
                                        <p className="tx-10 tx-spacing-1 tx-mont tx-medium tx-uppercase tx-white-8 mg-b-10">Total
                                            Amount in Loyalty</p>
                                        <p className="tx-24 tx-white tx-lato tx-bold mg-b-2 lh-1">5,300</p>
                                        {/*<span className="tx-11 tx-roboto tx-white-6">23% average duration</span>*/}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row row-sm mg-t-20 ">
                        <div className="col-12">
                            <div className="card pd-0 bd-0 shadow-base">
                                <div className="pd-x-30 pd-t-30 pd-b-15">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <h6 className="tx-13 tx-uppercase tx-inverse tx-semibold tx-spacing-1">Reservoir</h6>
                                        </div>
                                        <div style={{cursor: 'pointer'}} onClick={this.downloadPDF}
                                             className="btn btn-sm btn-info btn-with-icon">
                                            <div className="ht-25 justify-content-between">
                                                <span className="pd-x-10 tx-sm-12">Download PDF</span>
                                                <span className="icon wd-25"><i
                                                    className="fa fa-download"></i></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="pd-x-15 pd-b-15">
                                    <div id="lineChart"
                                         className="br-chartist br-chartist-2 ht-450 ht-sm-500">
                                        <MyResponsiveLine data={lineChartData}/>
                                    </div>
                                </div>
                            </div>

                            <div className="card bd-0 shadow-base pd-30 mg-t-20 br-section-wrapper">
                                <h6 className="tx-gray-800 tx-uppercase tx-bold tx-14 mg-b-10">Bar Chart</h6>
                                <p className="mg-b-25 mg-lg-b-50">Below is the basic bar chart example.</p>
                                <div className="row">
                                    <div className="col-xl-4">
                                        <div id="morrisBar1" className="ht-200 ht-sm-300 bd">
                                            <MyResponsiveBar data={barChartData}/>
                                        </div>
                                    </div>

                                    <div className="col-xl-4 mg-t-20 mg-xl-t-0">
                                        <div id="morrisBar2" className="ht-200 ht-sm-300 bd">
                                            <MyResponsiveBar data={barChartData}/>
                                        </div>
                                    </div>

                                    <div className="col-xl-4">
                                        <div id="morrisBar3" className="ht-200 ht-sm-300 bd">
                                            <MyResponsiveBar data={barChartData}/>
                                        </div>
                                    </div>

                                </div>

                            </div>


                        </div>

                    </div>

                </div>
            </div>
        );
    }
}

export default Dashboard;