import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface SkillCategoryPieChartProps {
  data: Record<string, number>;
}

export const SkillCategoryPieChart: React.FC<SkillCategoryPieChartProps> = ({ data }) => {
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!chartRef.current || Object.keys(data).length === 0) return;

    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();

    // Convert data to array format for d3
    const chartData = Object.entries(data).map(([name, value]) => ({
      name,
      value,
    }));

    // Set dimensions
    const width = chartRef.current.clientWidth;
    const height = chartRef.current.clientHeight;
    const radius = Math.min(width, height) / 2;

    // Create SVG
    const svg = d3
      .select(chartRef.current)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Set color scale
    const color = d3.scaleOrdinal()
      .domain(chartData.map(d => d.name))
      .range([
        '#3b82f6', // blue
        '#10b981', // green
        '#f59e0b', // yellow
        '#ef4444', // red
        '#8b5cf6', // purple
        '#ec4899', // pink
        '#06b6d4', // cyan
        '#f97316', // orange
        '#6366f1', // indigo
        '#14b8a6', // teal
      ]);

    // Compute the position of each group on the pie
    const pie = d3.pie<any>()
      .value(d => d.value)
      .sort(null);

    const data_ready = pie(chartData);

    // Build the pie chart
    const arcGenerator = d3.arc<any>()
      .innerRadius(radius * 0.4)
      .outerRadius(radius * 0.8);

    // Add arcs
    svg
      .selectAll('slices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', d => color(d.data.name) as string)
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.7);

    // Add labels
    const labelArc = d3.arc<any>()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    svg
      .selectAll('labels')
      .data(data_ready)
      .enter()
      .append('text')
      .text(d => {
        if (d.data.value >= 5) { // Only show label if percentage is significant
          return `${d.data.name} (${d.data.value}%)`;
        }
        return '';
      })
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold');

    // Add polylines between chart and labels
    const outerArc = d3.arc<any>()
      .innerRadius(radius * 0.85)
      .outerRadius(radius * 0.85);

    svg
      .selectAll('allPolylines')
      .data(data_ready)
      .enter()
      .append('polyline')
      .attr('stroke', 'black')
      .style('fill', 'none')
      .style('opacity', d => d.data.value >= 5 ? 0.5 : 0) // Only show lines for significant slices
      .attr('points', d => {
        const posA = arcGenerator.centroid(d);
        const posB = outerArc.centroid(d);
        const posC = outerArc.centroid(d);
        posC[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        return [posA, posB, posC];
      });

    // Helper function to compute the mid-angle of an arc
    function midAngle(d: any) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    // Add center text
    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Skills');

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
