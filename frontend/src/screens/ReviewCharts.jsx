import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import './CallScreen.css'

function ReviewCharts({ labels, scores }) {
    const barChartRef = useRef(null);
    const pieChartRef = useRef(null);

    useEffect(() => {
        const barChartCtx = barChartRef.current.getContext('2d');
        const pieChartCtx = pieChartRef.current.getContext('2d');

        const barChart = new Chart(barChartCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Sentiment Score',
                    data: scores,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        const pieChart = new Chart(pieChartCtx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: scores,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)', 'rgba(255, 159, 64, 0.5)'
                    ]
                }]
            }
        });

        return () => {
            barChart.destroy();
            pieChart.destroy();
        };
    }, [labels, scores]);

    return (
        <div>
            <canvas ref={barChartRef}></canvas>
            <canvas ref={pieChartRef}></canvas>
        </div>
    );
}

export default ReviewCharts;
