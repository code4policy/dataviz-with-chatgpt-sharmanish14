// Set dimensions for the chart
const width = 800;
const height = 400;
const margin = { top: 20, right: 30, bottom: 20, left: 200 }; // Increased left margin for long labels

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
    const y = d3.scaleBand()
        .domain(data.map(d => d.reason))
        .range([0, height])
        .padding(0.2);

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Count)])
        .nice()
        .range([0, width]);

    // Add Y-axis (labels on the left)
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add X-axis (count scale)
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(5)); // Adjust number of ticks if necessary

    // Add bars
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", d => y(d.reason))
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("width", d => x(d.Count));
}).catch(error => {
    console.error("Error loading the data:", error);
});
