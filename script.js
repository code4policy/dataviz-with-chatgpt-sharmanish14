// Set dimensions for the chart
const width = 800;
const height = 400;
const margin = { top: 20, right: 30, bottom: 100, left: 60 };

// Create an SVG container
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load data from CSV
d3.csv("boston_311_2023_by_reason.csv").then(data => {
    // Convert Count to numeric and sort the data by Count in descending order
    data.forEach(d => {
        d.Count = +d.Count; // Ensure Count is a number
    });
    data.sort((a, b) => b.Count - a.Count); // Sort data by Count (largest to smallest)

    // Create scales
    const x = d3.scaleBand()
        .domain(data.map(d => d.reason))
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Count)])
        .nice()
        .range([height, 0]);

    // Add X-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Add Y-axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add bars
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.reason))
        .attr("y", d => y(d.Count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.Count));
}).catch(error => {
    console.error("Error loading the data:", error);
});
