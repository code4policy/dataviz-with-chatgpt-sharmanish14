// Set dimensions for the chart
const width = 800;
const height = 400;
const margin = { top: 20, right: 30, bottom: 100, left: 200 }; // Adjust left margin for labels

// Create an SVG container
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Initial data load
let fullData = [];
let initialData = [];

// Load data from CSV
d3.csv("boston_311_2023_by_reason.csv").then(data => {
    data.forEach(d => {
        d.Count = +d.Count; // Convert Count to a number
    });

    // Sort data by Count in descending order
    data.sort((a, b) => b.Count - a.Count);

    // Save full data and select initial subset
    fullData = data;
    initialData = data.slice(0, 10); // First 10 reasons

    drawChart(initialData); // Draw the initial chart
});

// Function to draw the chart
function drawChart(data) {
    // Clear existing chart elements
    svg.selectAll("*").remove();

    // Create scales
    const y = d3.scaleBand()
        .domain(data.map(d => d.reason))
        .range([0, height])
        .padding(0.2);

    const x = d3.scaleLinear()
        .domain([0, d3.max(fullData, d => d.Count)])
        .nice()
        .range([0, width]);

    // Add Y-axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add X-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

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
}

// Button event listener to extend the chart
d3.select("#show-more").on("click", () => {
    drawChart(fullData); // Draw chart with all data
});
