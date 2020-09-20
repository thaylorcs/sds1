import React, { useEffect, useState } from 'react';
import Filters from '../../components/Filters';
import './styles.css';
import {barOptions, pieOptions} from './chart-options'
import Chart from 'react-apexcharts';
import axios from 'axios';
import { buildBarSeries, getGenderChartData, getPlatformChartData} from './helpers';

type PieChartData = {
    label: string[];
    series: number[];
}

type BarChartData = {
    x: string;
    y: number;

}

const initialPieData = {
    labels: [],
    series: []
}

// const BASE_URL = 'http://localhost:8080';
const BASE_URL = 'https://sds1-thaylor.herokuapp.com';

const Charts = () => {
    
    //React hook que pega a variável e a atualiza com o set
    const [barChartData, setBarChartData] = useState<BarChartData[]>([]);
    const [platformData, setPlatformData] = useState<PieChartData>(initialPieData);
    const [genderData, setGenderData] = useState<PieChartData>(initialPieData);

    useEffect(() => {
        async function getData(){
            const recordsResponse = await axios.get(`${BASE_URL}/records`);
            const gamesResponse = await axios.get(`${BASE_URL}/games`);
            
            const barData = buildBarSeries(gamesResponse.data, recordsResponse.data.content);
            setBarChartData(barData);

            const platformData = getPlatformChartData(recordsResponse.data.content);
            setPlatformData(platformData);

            const genderChartData = getGenderChartData(recordsResponse.data.content);
            setGenderData(genderChartData);
        }
        getData();
    }, [])
    return (
        <div className="page-container">
            <Filters link="/records" linkText="Ver tabela" />
            <div className="chart-container">
                <div className="top-related">
                    <h1 className="top-related-title">Jogos mais votados</h1>
                    <div className="games-container">
                        <Chart 
                            options={barOptions}
                            type="bar"
                            width="680"
                            height="670"
                            series={[{ data: barChartData}]}
                        />
                    </div>
                </div>
                <div className="charts">
                    <div className="platform-chart">
                        <h2 className="chart-title">Plataformas</h2>
                        <Chart 
                            options={{ ...pieOptions, labels: platformData?.labels}}
                            type="donut"
                            series={platformData?.series}
                         />
                    </div>
                    <div className="gender-chart">
                        <h2 className="chart-title">Gêneros</h2>
                        <Chart 
                            options={{ ...pieOptions, labels: genderData.labels}}
                            type="donut"
                            series={genderData?.series}

                        />
                    </div>
                </div>                
            </div>
        </div>
    )
}

export default Charts;