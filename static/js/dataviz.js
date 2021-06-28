function ordinalScale(domain, range) {
    return d3.scaleOrdinal()
        .domain(domain)
        .range(range);
};

function timeScale(domain, range) {
    return d3.scaleTime()
        .domain(domain)
        .range(range);
};

function linearScale(domain, range) {
    return d3.scaleLinear()
        .domain(domain)
        .range(range);
};

function parseYear(year) {
    let parseFunction = d3.timeParse("%Y");
    return parseFunction(year);
};

function createSvg(config) {
    return d3.select(`#${config.divId}`)
        .append('svg')
        .attr('viewBox', `0 0 ${config.width} ${config.height}`)
};

function createChartTitle(svg, config, w, l) {
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('width', w)
        .attr('height', config.title.height)
        .attr('x', l + (w / 2))
        .attr('y', config.title.height / 2)
        .text(config.title.text);
}

function createYAxisTitle(svg, config, h) {
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('width', config.yTitle.width)
        .attr('height', h)
        .attr("x", 40)
        .attr("y", h / 2)
        .attr("transform", `translate(0, ${config.title.height}), rotate(-90, 40, ${h / 2})`)
        .text(config.yTitle.text);
};

function createPattern(svg) {
    svg.append("pattern")
        .attr('id', 'hash-pattern')
        .attr('height', '5')
        .attr('width', '5')
        .attr('patternUnits', "userSpaceOnUse")
        .attr('patternContentUnits', "userSpaceOnUse")
        .attr('patternTransform', 'scale(1) rotate(115)')
        .append('path')
        .attr('id', 'pattern-hash')
        .attr('d', 'M 0 0 H 200')
        .attr('stroke', "#6C757D")
        .attr('stroke-width', '1px');
};

function mouseListener(setup) {
    const listener = setup.g.append('g')

    listener.append('path')
        .attr('class', 'dropLine')
        .style('stroke', 'black')
        .style('stroke-width', '1px')
        .style('opacity', '0');

    listener.append('rect')
        .attr('width', setup.w)
        .attr('height', setup.h)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function () {
            d3.selectAll(".dropLine")
                .style("opacity", "0");
            updateLegend("2019");
        })
        .on('mouseover', function () {
            d3.selectAll(".dropLine")
                .style("opacity", "1");
        })
        .on('mousemove', function (evt) {
            let initSvgWidth = evt.path[3].viewBox.baseVal.width;
            let currentSvgWidth = evt.path[3].width.baseVal.value;
            let resizeFactor = currentSvgWidth / initSvgWidth;
            let currentL = 50 * resizeFactor;
            let currentW = setup.w * resizeFactor;
            let domain = d3.extent(setup.years)
            let range = [currentL, currentL + currentW]
            let currentXScale = timeScale(domain, range)
            let x = evt.layerX;
            let y = evt.layerY;
            let xDate = currentXScale.invert(x - currentL)
            let closestIndex = d3.scan(
                setup.data,
                (a, b) => {
                    let aDiff = Math.abs(a.parsedYear - xDate);
                    let bDiff = Math.abs(b.parsedYear - xDate);
                    return aDiff - bDiff;
                }
            );
            let yearData = setup.data[closestIndex]
            let closestYear = yearData.parsedYear;
            let closestX = setup.xScale(closestYear);
            d3.selectAll('.dropLine')
                .attr('d', function () {
                    return 'M' + (closestX) + ',' + setup.h + ' ' + (closestX) + ',' + 0
                })
            updateLegend(yearData.year)
        });
};

function prepAreaData() {
    const dataKeys = Object.keys(data.shares[0]).filter(key => key != 'year');
    data.shares.forEach(row => {
        row.parsedYear = parseYear(row.year);
        let totalPct = 0;
        dataKeys.forEach(dataKey => {
            row[dataKey] = parseFloat(row[dataKey]);
            totalPct += row[dataKey];
        });
        dataKeys.forEach(dataKey => {
            row[dataKey] = row[dataKey] / totalPct * 100;
        });
    });
    return dataKeys;
};

function createAreaPlot(data, keys, config) {

    // Configuring size of svg and chart elements
    const plotSvg = createSvg(config);
    const plotLeft = config.yAxis.width + config.yTitle.width;
    const plotWidth = config.width - plotLeft;
    const plotHeight = config.height - config.xAxis.height - config.title.height;
    const plotMainG = plotSvg.append('g')
        .attr('transform', `translate(${plotLeft}, ${config.title.height})`);

    // Setting up the plot data
    const stack = d3.stack()
        .keys(keys);

    const dataStack = stack(data);

    // Creating scale functions and axes
    const years = data.map(d => d.parsedYear)
    const timeExtent = d3.extent(years)
    const colors = keys.map(d => this.config.fields[d].color)
    const xScale = timeScale(timeExtent, [0, plotWidth]);
    const yScale = linearScale([0, 100], [plotHeight, 0]);
    const bottomAxis = d3.axisBottom(xScale)
        .ticks(6)
        .tickValues([
            parseYear('1969'),
            parseYear('1979'),
            parseYear('1989'),
            parseYear('1999'),
            parseYear('2009'),
            parseYear('2019')
        ]);
    const leftAxis = d3.axisLeft(yScale)
        .ticks(6);
    const colorScale = ordinalScale(keys, colors)

    // Plotting areas
    const generateArea = d3.area()
        .x(d => xScale(d.data.parsedYear))
        .y0(d => yScale(d[0]))
        // Added a -1 to eliminate white space
        .y1(d => yScale(d[1]) - 1);

    plotMainG.selectAll('.areas')
        .data(dataStack)
        .join('path')
        .attr('d', generateArea)
        .attr('fill', (d) => colorScale(d.key));

    // Adding bottom axis
    plotMainG.append('g')
        .call(bottomAxis)
        .attr('transform', `translate(0, ${plotHeight})`)
        .selectAll('.tick text')
        .attr('text-anchor', 'end')
        .attr('transform', 'scale(1) rotate(-45), translate(-11, -6)')

    // Adding left axis and title
    plotMainG.append('g')
        .call(leftAxis);

    createChartTitle(plotSvg, config, plotWidth, plotLeft)
    createYAxisTitle(plotSvg, config, plotHeight);

    let listener = {
        svg: plotSvg,
        g: plotMainG,
        h: plotHeight,
        w: plotWidth,
        years: years,
        xScale: xScale,
        data: data
    }
    mouseListener(listener);
};

function prepLineData() {
    const dataKeys = Object.keys(data.means[0]).filter(key => key != 'year');
    let maxY = 0;
    data.means.forEach(row => {
        row.parsedYear = parseYear(row.year);
        dataKeys.forEach(dataKey => {
            row[dataKey] = parseInt(row[dataKey]) / 1000;
            if (row[dataKey] >= maxY) {
                maxY = row[dataKey];
            };
        });
    });
    return [dataKeys, maxY];
};

function createLinePlot(data, keys, config, maxY) {
    // keys.forEach(d => console.log(this.config.fields[d]))
    // keys = keys.filter(d => (this.config.fields[d].draw === true))
    // Configuring size of svg and chart elements
    const plotSvg = createSvg(config);
    const plotLeft = config.yAxis.width + config.yTitle.width;
    const plotWidth = config.width - plotLeft;
    const plotHeight = config.height - config.xAxis.height - config.title.height;
    const plotMainG = plotSvg.append('g')
        .attr('transform', `translate(${plotLeft}, ${config.title.height})`);

    // Setting up the plot data

    // Creating scale functions and axes
    const years = data.map(d => d.parsedYear)
    const timeExtent = d3.extent(years)
    const colors = keys.map(d => this.config.fields[d].color)
    const xScale = timeScale(timeExtent, [0, plotWidth]);
    const yScale = linearScale([0, maxY * 1.1], [plotHeight, 0]);
    const bottomAxis = d3.axisBottom(xScale)
        .ticks(6)
        .tickValues([
            parseYear('1969'),
            parseYear('1979'),
            parseYear('1989'),
            parseYear('1999'),
            parseYear('2009'),
            parseYear('2019')
        ]);
    const leftAxis = d3.axisLeft(yScale)
        .ticks(6);
    const colorScale = ordinalScale(keys, colors)

    // Plotting 'middle class' area
    createPattern(plotSvg);

    let areaData = data.map(d => [d.parsedYear, d.twoThirdsMedian, d.doubleMedian])

    const generateArea = d3.area()
        .x(d => xScale(d[0]))
        .y0(d => yScale(d[1]))
        .y1(d => yScale(d[2]))

    plotMainG.selectAll('.areas')
        .data([areaData])
        .join('path')
        .attr('d', generateArea)
        .attr('fill', 'url(#hash-pattern)')

    keys.forEach(function (key) {
        let drawLine = d3.line()
            .x(d => xScale(d.parsedYear))
            .y(d => yScale(d[key]));

        let line = plotMainG.append('path')
            .attr('d', drawLine(data))
            .style('stroke', colorScale(key))
            .attr('fill', 'none')
            .style('stroke-width', this.config.fields[key]['stroke-width'])

        let dash = this.config.fields[key]['stroke-dasharray']
        if (dash) {
            line.style('stroke-dasharray', dash)
        }
    });
    // Adding bottom axis
    plotMainG.append('g')
        .call(bottomAxis)
        .attr('transform', `translate(0, ${plotHeight})`)
        .selectAll('.tick text')
        .attr('text-anchor', 'end')
        .attr('transform', 'scale(1) rotate(-45), translate(-11, -6)')

    // Adding left axis and title
    plotMainG.append('g')
        .call(leftAxis);

    createChartTitle(plotSvg, config, plotWidth, plotLeft);
    createYAxisTitle(plotSvg, config, plotHeight);

    let listener = {
        svg: plotSvg,
        g: plotMainG,
        h: plotHeight,
        w: plotWidth,
        years: years,
        xScale: xScale,
        data: data
    }
    mouseListener(listener);
};

function createLegend(data, config) {

    const years = data.means.map(d => parseInt(d.year));
    const maxYear = Math.max(...years);
    const maxYearShares = data.shares.filter(d => d.year == maxYear)[0];
    const maxYearMeans = data.means.filter(d => d.year == maxYear)[0];
    const minYear = Math.min(...years);
    const minYearShares = data.shares.filter(d => d.year == minYear)[0];
    const minYearMeans = data.means.filter(d => d.year == minYear)[0];

    const fields = config.fields;

    const legendContainer = d3.select("#legendContainer");

    legendContainer.append("p")
        .attr("id", "legendHeader")
        .text(maxYear);

    const legendDiv = legendContainer.append("div")
        .attr("id", "legend");

    const legendFields = Object.entries(fields).filter(d => d[1].legend === true);
    const legendTables = legendDiv.selectAll("table")
        .data(legendFields)
        .enter()
        .append("table")
        .attr("id", d => `${d[0]}LegendTable`)
        .classed("legend-table", true)
        .append("tbody");

    const legendHead = legendTables.append("tr")
        .classed("legend-header-row", true);

    legendHead.append("td")
        .style("width", "25px")
        .style("height", "25px")
        .classed("legend-key", true)
        .attr("rowspan", 3)
        .append("svg")
        .attr("id", d => `${d[0]}LegendKey`)
        .attr("width", "100%")
        .attr("height", "100%")
        .append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .style("fill", d => d[1].color);

    legendHead.append("td")
        .classed("legend-header-name", true)
        .text(d => d[1].name);

    const middleClassKey = d3.select("#middleClassLegendKey");

    createPattern(middleClassKey);

    middleClassKey.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr('class', 'legend-line-rect')
        .style('fill', 'url(#hash-pattern)')
        .style('stroke', '#6b8a83')
        .style('stroke-width', '1px')
        .style('stroke-dasharray', '2,2');

    legendTables.append("tr")
        .classed("share-row", true)
        .append("td")
        .classed("share-data", "true")
        .attr("id", d => `${d[0]}Share`)
        .html(function (d) {
            let field = d[0];
            if (maxYearShares[field]) {
                let maxShares = maxYearShares[field];
                let minShares = minYearShares[field];
                let sharesText = maxShares.toFixed(2);
                let change = maxShares - minShares;
                let pctChange = change / minShares;
                let changeSign = Math.sign(pctChange);
                let changeType = "";
                if (changeSign === 1) {
                    changeType = "up";
                } else {
                    changeType = "down";
                };
                let icon = `<span class="material-icons ${changeType}-arrow-icon">arrow_drop_${changeType}</span>`;
                let changeText = Math.abs((pctChange * 100).toFixed(2));
                return `Share: ${sharesText}% (${icon} ${changeText}%)`;
            };
            return null;
        });

    legendTables.append("tr")
        .classed("mean-row", true)
        .append("td")
        .classed("mean-data", "true")
        .attr("id", d => `${d[0]}Mean`)
        .html(function (d) {
            let field = d[0];
            if (maxYearMeans[field]) {
                let maxMeans = maxYearMeans[field];
                let minMeans = minYearMeans[field];
                let meansText = Math.round(maxMeans * 1000).toLocaleString('en-US');
                let change = maxMeans - minMeans;
                let pctChange = change / minMeans;
                let changeSign = Math.sign(pctChange);
                let changeType = "";
                if (changeSign === 1) {
                    changeType = "up";
                } else {
                    changeType = "down";
                };
                let icon = `<span class="material-icons ${changeType}-arrow-icon">arrow_drop_${changeType}</span>`;
                let changeText = Math.abs((pctChange * 100).toFixed(2));
                return `Mean: $${meansText} (${icon} ${changeText}%)`;
            };
            return null;
        });

    let twoThirdsMedian = Math.round(maxYearMeans["twoThirdsMedian"] * 1000).toLocaleString('en-US');
    let doubleMedian = Math.round(maxYearMeans["doubleMedian"] * 1000).toLocaleString('en-US');
    d3.select("#middleClassLegendTable")
        .select(".mean-row")
        .select(".mean-data")
        .html(`$${twoThirdsMedian}-${doubleMedian}`)

};

function updateLegend(year) {
    const years = this.data.means.map(d => parseInt(d.year));
    const selectedShares = this.data.shares.filter(d => d.year == year)[0];
    const selectedMeans = this.data.means.filter(d => d.year == year)[0];
    const minYear = Math.min(...years);
    const minYearShares = this.data.shares.filter(d => d.year == minYear)[0];
    const minYearMeans = this.data.means.filter(d => d.year == minYear)[0];

    const fields = this.config.fields;

    const legendContainer = d3.select("#legendContainer");

    legendContainer.select("#legendHeader")
        .text(year);

    const legendDiv = legendContainer.select("#legend");

    const legendFields = Object.entries(fields).filter(d => d[1].legend === true);
    const legendTables = legendDiv.selectAll("table")
        // .data(legendFields)
        // .update()
        .select("tbody");

    legendTables.select(".share-row")
        .select(".share-data")
        .html(function (d) {
            let field = d[0];
            if (selectedShares[field]) {
                let shares = selectedShares[field];
                let minShares = minYearShares[field];
                let sharesText = shares.toFixed(2);
                let change = shares - minShares;
                let pctChange = change / minShares;
                let changeSign = Math.sign(pctChange);
                let changeType = "";
                if (changeSign === 1) {
                    changeType = "up";
                } else {
                    changeType = "down";
                };
                let icon = `<span class="material-icons ${changeType}-arrow-icon">arrow_drop_${changeType}</span>`;
                let changeText = Math.abs((pctChange * 100).toFixed(2));
                return `Share: ${sharesText}% (${icon} ${changeText}%)`;
            };
            return null;
        });

    legendTables.select(".mean-row")
        .select(".mean-data")
        .html(function (d) {
            let field = d[0];
            if (selectedMeans[field]) {
                let means = selectedMeans[field];
                let minMeans = minYearMeans[field];
                let meansText = Math.round(means * 1000).toLocaleString('en-US');
                let change = means - minMeans;
                let pctChange = change / minMeans;
                let changeSign = Math.sign(pctChange);
                let changeType = "";
                if (changeSign === 1) {
                    changeType = "up";
                } else {
                    changeType = "down";
                };
                let icon = `<span class="material-icons ${changeType}-arrow-icon">arrow_drop_${changeType}</span>`;
                let changeText = Math.abs((pctChange * 100).toFixed(2));
                return `Mean: $${meansText} (${icon} ${changeText}%)`;
            };
            return null;
        });

    let twoThirdsMedian = Math.round(selectedMeans["twoThirdsMedian"] * 1000).toLocaleString('en-US');
    let doubleMedian = Math.round(selectedMeans["doubleMedian"] * 1000).toLocaleString('en-US');
    let minYearMedian = minYearMeans["doubleMedian"];
    let medianChange = selectedMeans["doubleMedian"] - minYearMedian;
    let pctChange = medianChange/minYearMedian;
    let changeType = "";
    let changeSign = Math.sign(pctChange);
    if (changeSign === 1) {
        changeType = "up";
    } else {
        changeType = "down";
    };
    let icon = `<span class="material-icons ${changeType}-arrow-icon">arrow_drop_${changeType}</span>`;
    let changeText = Math.abs((pctChange * 100).toFixed(2))
    
    d3.select("#middleClassLegendTable")
        .select(".mean-row")
        .select(".mean-data")
        .html(`$${twoThirdsMedian}-${doubleMedian} (${icon} ${changeText}%)`)
};

function init() {

    $("#navbar-container").load("/static/html/navbar.html");
    $("#data-text").load("/static/html/data-text.html");
    $("#data-text-secondary").load("/static/html/data-text-secondary.html");

    d3.json('/static/json/data.json').then(data => {
        this.data = data;
        d3.json('/static/json/config.json').then(config => {
            this.config = config.plotLayout;

            plotConfig = config.plotLayout;

            const areaKeys = prepAreaData();
            createAreaPlot(data.shares, areaKeys, plotConfig.areaPlot);

            let lineKeys;
            let maxY;
            [lineKeys, maxY] = prepLineData();
            createLinePlot(data.means, lineKeys, plotConfig.linePlot, maxY);

            createLegend(data, plotConfig);
        });
    });
};

window.addEventListener('DOMContentLoaded', init);