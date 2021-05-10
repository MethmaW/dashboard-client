import React, { useEffect, useState } from "react";
import * as internalAPIs from "../../utils/api/internalAPIs";
import { Header } from "../../rootImports";
import Chart from "react-apexcharts";
import { InputNumber, Button, Radio } from "antd";
import "./home.css";

const Home = () => {
	//----------variables----------
	const eData = [];
	let filteredEData = {};
	const categories = [];
	const categoryCount = [];
	let eType = {};
	let eTypeArr = [];

	//----------state----------
	const [equipments, setEquipments] = useState([]);
	const [chartType, setChartType] = useState("bar");
	const [min, setMin] = useState(0);
	const [max, setMax] = useState(100);

	//----------use effect calls----------
	useEffect(() => {
		getEData(100, 0);
	}, []);

	//----------methods----------
	//calling the api to fetch equipment data
	const getEData = async (max, last) => {
		await internalAPIs
			.getEquipmentData(max, last)
			.then((res) => setEquipments(res.data));
	};

	//pushing fetched data to eData array
	if (equipments.length !== 0) {
		equipments.forEach((e) => {
			eData.push({
				AssetID: e.AssetID,
				AssetCategoryID: e.AssetCategoryID,
				OperationalStatus: e.OperationalStatus,
				__rowid__: e.__rowid__,
			});
		});
	}

	//sorting the eData array to get categories and their counts
	if (eData.length !== 0) {
		eData.reduce(function (acc, curr) {
			if (typeof acc[curr.AssetCategoryID] == "undefined") {
				acc[curr.AssetCategoryID] = 1;
			} else {
				acc[curr.AssetCategoryID] += 1;
			}

			//console.log("AssetCategoryID-acc", acc);

			filteredEData = acc;

			return acc;
		}, {});
	}

	//sorting the eData array to get quipment type
	if (eData.length !== 0) {
		eData.reduce(function (acc, curr) {
			if (typeof acc[curr.OperationalStatus] == "undefined") {
				acc[curr.OperationalStatus] = 1;
			} else {
				acc[curr.OperationalStatus] += 1;
			}
			//console.log("eType-acc", acc);
			eType = acc;

			return acc;
		}, {});
	}

	//setting categories
	for (const [key] of Object.entries(filteredEData)) {
		//console.log(`${key}: ${value}`);
		categories.push(key);
	}

	//settting category count
	for (const [key, value] of Object.entries(filteredEData)) {
		//console.log(`${key}: ${value}`);
		categoryCount.push(value);
	}

	for (const [key, value] of Object.entries(eType)) {
		//console.log(`${key}: ${value}`);
		eTypeArr.push({
			type: key,
			count: value,
		});
	}

	//equipment range button submit
	const hanldeRangeSubmit = () => {
		let tot = max - min;
		getEData(tot, min);
	};

	//global logs
	// console.log("equipments", equipments);
	// console.log("eData", eData);
	// console.log("filteredEData", filteredEData);
	// console.log("categories", categories);
	// console.log("categoryCount", categoryCount);

	//options for the chart
	let options = {
		chart: {
			id: "Equipment Data",
			background: "white",
			foreColor: "#F08B33",
		},
		xaxis: {
			categories: categories,
		},
		dataLabels: {
			style: {
				colors: ["#000000", "#605AFC"],
			},
			offsetY: 0,
		},
		plotOptions: {
			bar: {
				dataLabels: {
					orientation: "vertical",
					position: "center",
				},
			},
		},
		yaxis: {
			title: {
				text: "Category Count",
				rotate: -90,
				offsetX: 0,
				offsetY: 0,
			},
		},
		fill: {
			colors: ["#605AFC"],
		},
	};

	//data for the chart
	let series = [
		{
			name: "",
			data: categoryCount,
		},
	];

	console.log(eTypeArr);

	return (
		<div>
			<Header />

			<div className='filternType'>
				<div className='eTypeDiv'>
					<p className='eTypeTitle'>Equipment Types</p>
					<p>
						Operational:{" "}
						{eTypeArr.map((t, i) => {
							return t.type === "Operational" ? t.count : 0;
						})}
					</p>

					<p>
						Non - Operational:{" "}
						{eTypeArr.map((t, i) => {
							return t.type !== "Operational" ? t.count : 0;
						})}
					</p>
				</div>

				<div className='filterE'>
					<div className='filterTitle'>
						<p>Filter equipments</p>
					</div>
					<div>
						From: &nbsp;
						<InputNumber
							min={0}
							max={100}
							defaultValue={0}
							onChange={(value) => setMin(value)}
						/>
						&nbsp; To: &nbsp;
						<InputNumber
							min={0}
							max={100}
							defaultValue={100}
							onChange={(value) => setMax(value)}
						/>
						&nbsp; &nbsp; &nbsp;
						<Button
							type='primary'
							shape='round'
							size='large'
							htmlType='button'
							onClick={hanldeRangeSubmit}
							className='filterBtn'
						>
							Filter
						</Button>
					</div>
				</div>

				<div className='rBtns'>
					<p>Select Graph type</p>
					<div>
						<Radio.Group
							onChange={(e) => setChartType(e.target.value)}
							defaultValue='bar'
						>
							<Radio value='bar'>Bar</Radio>
							<Radio value='line'>Line</Radio>
							<Radio value='area'>Area</Radio>
							<Radio value='histogram'>Histogram</Radio>
							<Radio value='scatter'>Scatter</Radio>
							<Radio value='heatmap'>heatmap</Radio>
						</Radio.Group>
					</div>
				</div>
			</div>

			<div className='chartDiv'>
				{chartType === "bar" && (
					<Chart
						options={options}
						series={series}
						type='bar'
						width={"100%"}
						height={"100%"}
						className='chart'
					/>
				)}

				{chartType === "line" && (
					<Chart
						options={options}
						series={series}
						type='line'
						width={"100%"}
						height={"100%"}
						className='chart'
					/>
				)}

				{chartType === "area" && (
					<Chart
						options={options}
						series={series}
						type='area'
						width={"100%"}
						height={"100%"}
						className='chart'
					/>
				)}

				{chartType === "histogram" && (
					<Chart
						options={options}
						series={series}
						type='histogram'
						width={"100%"}
						height={"100%"}
						className='chart'
					/>
				)}

				{chartType === "scatter" && (
					<Chart
						options={options}
						series={series}
						type='scatter'
						width={"100%"}
						height={"100%"}
						className='chart'
					/>
				)}

				{chartType === "heatmap" && (
					<Chart
						options={options}
						series={series}
						type='heatmap'
						width={"100%"}
						height={"100%"}
						className='chart'
					/>
				)}
			</div>
		</div>
	);
};

export default Home;
