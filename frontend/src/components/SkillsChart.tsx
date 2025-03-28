import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface SkillsChartProps {
  data: Record<string, number>;
}

export const SkillsChart: React.FC<SkillsChartProps> = ({ data }) => {
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!chartRef.current || Object.keys(data).length === 0) return;

    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();

    // Convert data to array format for d3
    const chartData = Object.entries(data)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Only show top 10 skills

    // Set dimensions
    const margin = { top: 20, right: 30, bottom: 70, left: 60 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = chartRef.current.clientHeight - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(chartRef.current)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X axis
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(chartData.map((d) => d.name))
      .padding(0.3);

    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '12px');

    // Y axis
    const maxValue = Math.max(...chartData.map((d) => d.value));
    const y = d3.scaleLinear().domain([0, maxValue + 1]).range([height, 0]);

    svg.append('g').call(d3.axisLeft(y));

    // Add bars
    svg
      .selectAll('bars')
      .data(chartData)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.name) as number + (x.bandwidth() - 30) / 2)
      .attr('y', (d) => y(d.value))
      .attr('width', 30)
      .attr('height', (d) => height - y(d.value))
      .attr('fill', '#3b82f6')
      .attr('rx', 4)
      .attr('ry', 4);

    // Add value labels
    svg
      .selectAll('.label')
      .data(chartData)
      .enter()
      .append('text')
      .text((d) => d.value)
      .attr('x', (d) => (x(d.name) as number) + x.bandwidth() / 2)
      .attr('y', (d) => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#6b7280');

  }, [data]);

  return (
    <svg
      ref={chartRef}
      width="100%"
      height="100%"
      style={{ minHeight: '300px' }}
    />
  );
};
