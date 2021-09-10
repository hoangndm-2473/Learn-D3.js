async function drawBars() {
  // 1. Access data

  // Lấy data từ server
  let dataset = await d3.csv(
    "https://raw.githubusercontent.com/Wattenberger/d3-walkthroughs/master/interactions/data.csv"
  );

  // Tạo ra các hàm Accessor
  const summaryAccessor = (d) => d.Summary;
  const actualHoursAccessor = (d) => +d.HoursActual;
  const developerHoursAccessor = (d) => +d.DeveloperHoursActual;

  // Lọc lại data để lấy các vùng dữ liệu cần thiết để vẽ chart
  let usedTasks = {};
  dataset = dataset.filter((d) => {
    const hours = actualHoursAccessor(d);
    if (usedTasks[summaryAccessor(d)]) {
      const hasHigherValue = hours > usedTasks[summaryAccessor(d)];
      if (!hasHigherValue) return false;
    }
    usedTasks[summaryAccessor(d)] = hours;
    return actualHoursAccessor(d) > 10;
  });

  const diffAccessor = (d) => +d.HoursEstimate - actualHoursAccessor(d);
  dataset = dataset.filter(
    (d) => diffAccessor(d) >= -50 && diffAccessor(d) <= 50
  );
  console.log(dataset);
  const yAccessor = (d) => d.length;

  // 2. Create chart dimensions (Tạo kích thước chart)

  const width = 800;
  let dimensions = {
    width: width,
    height: width * 0.5,
    margin: {
      top: 35,
      right: 10,
      bottom: 50,
      left: 50,
    },
  };
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // 3. Draw canvas

  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  const background = bounds.append("g");

  // init static elements
  bounds.append("g").attr("class", "bins");
  bounds.append("line").attr("class", "mean");

  // Tạo trục nằm dưới
  bounds
    .append("g")
    .attr("class", "x-axis")
    .style("transform", `translateY(${dimensions.boundedHeight}px)`)
    .append("text")
    .attr("class", "x-axis-label");

  // 4. Create scales

  const xScale = d3
    .scaleLinear()
    //Hàm d3.extent sẽ trả về [min,max] của dataset. Ở đây hàm nhận vào thêm 1 diffAccessor tham số này sẽ nói cho d3 biết vùng nào cần được tính toàn để lấy minmax.
    .domain(d3.extent(dataset, diffAccessor))
    .range([0, dimensions.boundedWidth])
    .nice();

  const binsGenerator = d3
    .histogram()
    .domain(xScale.domain())
    .value(diffAccessor)
    .thresholds(30);

  const bins = binsGenerator(dataset);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(bins, yAccessor)])
    .range([dimensions.boundedHeight, 0])
    .nice();

  // 5. Draw data

  const barPadding = 1.5;

  let binGroups = bounds.select(".bins").selectAll(".bin").data(bins);

  binGroups.exit().remove();

  const newBinGroups = binGroups.enter().append("g").attr("class", "bin");

  newBinGroups.append("rect");

  // update binGroups to include new points
  binGroups = newBinGroups.merge(binGroups);

  const barRects = binGroups
    .select("rect")
    .attr("key", (d, i) => i)
    .attr("x", (d) => xScale(d.x0) + barPadding)
    .attr("y", (d) => yScale(yAccessor(d)))
    .attr("height", (d) => dimensions.boundedHeight - yScale(yAccessor(d)))
    .attr("width", (d) =>
      d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding])
    );

  const mean = d3.mean(dataset, diffAccessor);

  const meanLine = bounds
    .selectAll(".mean")
    .attr("x1", xScale(mean))
    .attr("x2", xScale(mean))
    .attr("y1", -20)
    .attr("y2", dimensions.boundedHeight);

  const meanLabel = bounds
    .append("text")
    .attr("class", "mean-label")
    .attr("x", xScale(mean))
    .attr("y", -25)
    .text("mean");

  // 6. Draw peripherals

  const xAxisGenerator = d3.axisBottom().scale(xScale);

  const xAxis = bounds.select(".x-axis").call(xAxisGenerator);

  const xAxisLabel = xAxis
    .select(".x-axis-label")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .text("Hours over-estimated");

  const backgroundLeft = background
    .append("rect")
    .attr("class", "background left-side-background")
    .attr("y", -20)
    .attr("width", dimensions.boundedWidth / 2)
    .attr("height", dimensions.boundedHeight + 20);

  const backgroundRight = background
    .append("rect")
    .attr("class", "background right-side-background")
    .attr("x", dimensions.boundedWidth / 2 + 1)
    .attr("y", -20)
    .attr("width", dimensions.boundedWidth / 2 - 1)
    .attr("height", dimensions.boundedHeight + 20);

  const leftSideLabel = background
    .append("text")
    .attr("class", "label left-side-label")
    .attr("x", 10)
    .attr("y", 0)
    .text("Under-estimated");

  const rightSideLabel = background
    .append("text")
    .attr("class", "label right-side-label")
    .attr("x", dimensions.boundedWidth - 10)
    .attr("y", 0)
    .text("Over-estimated");

  // 7. Set up interactions

  const barRectsListeners = bounds
    .selectAll(".listeners")
    .data(bins)
    .enter()
    .append("rect")
    .attr("class", "listeners")
    .attr("x", (d) => xScale(d.x0))
    .attr("y", -dimensions.margin.top)
    .attr("height", dimensions.boundedHeight + dimensions.margin.top)
    .attr("width", (d) => d3.max([0, xScale(d.x1) - xScale(d.x0)]))
    .on("mouseenter", onMouseEnter)
    .on("mouseleave", onMouseLeave);

  const tooltip = d3.select("#tooltip");
  function onMouseEnter(datum, index) {
    tooltip
      .select("#range")
      .text(
        [
          datum.x0 < 0 ? `Under-estimated by` : `Over-estimated by`,
          Math.abs(datum.x0),
          "to",
          Math.abs(datum.x1),
          "hours",
        ].join(" ")
      );
    tooltip
      .select("#examples")
      .html(datum.slice(0, 3).map(summaryAccessor).join("<br />"));

    tooltip.select("#count").text(Math.max(0, yAccessor(datum) - 2));

    const percentDeveloperHoursValues = datum.map(
      (d) => developerHoursAccessor(d) / actualHoursAccessor(d) || 0
    );
    const percentDeveloperHours = d3.mean(percentDeveloperHoursValues);
    const formatHours = (d) => d3.format(",.2f")(Math.abs(d));
    tooltip
      .select("#tooltip-bar-value")
      .text(formatHours(percentDeveloperHours));
    tooltip
      .select("#tooltip-bar-item-1")
      .style("width", `${percentDeveloperHours * 100}%`);

    const x =
      xScale(datum.x0) +
      (xScale(datum.x1) - xScale(datum.x0)) / 2 +
      dimensions.margin.left;
    const y = yScale(yAccessor(datum)) + dimensions.margin.top;

    tooltip.style(
      "transform",
      `translate(` + `calc( -50% + ${x}px),` + `calc(-100% + ${y}px)` + `)`
    );

    tooltip.style("opacity", 1);

    const hoveredBar = binGroups.select(`rect[key='${index}']`);
    hoveredBar.classed("hovered", true);
  }

  function onMouseLeave() {
    tooltip.style("opacity", 0);
    barRects.classed("hovered", false);
  }
}
drawBars();
