// **** Example of how to create padding and spacing for trellis plot****
var svg = d3.select('svg');

// Hand code the svg dimensions, you can also use +svg.attr('width') or +svg.attr('height')
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

// Define a padding object
// This will space out the trellis subplots
var padding = {t: 100, r: 100, b: 60, l: 60};
var parseDate = d3.timeParse('%b %Y');
// To speed things up, we have already computed the domains for your scales
var dateDomain = [new Date(2000, 0), new Date(2010, 2)];
var priceDomain = [0, 223.02];var parseDate = d3.timeParse('%b %Y');
// To speed things up, we have already computed the domains for your scales
var dateDomain = [new Date(2000, 0), new Date(2010, 2)];
var priceDomain = [0, 223.02];
var companies = ['MSFT', 'AAPL', 'IBM', 'AMZN']
var colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(companies)


// Compute the dimensions of the trellis plots, assuming a 2x2 layout matrix.
trellisWidth = svgWidth / 2 - padding.l - padding.r;
trellisHeight = svgHeight / 2 - padding.t - padding.b;
var xScale = d3.scaleTime()
        .domain(dateDomain)
        .range([0, trellisWidth]);
var yScale = d3.scaleLinear()
        .domain(priceDomain)
        .range([trellisHeight, 0]);

d3.csv('stock_prices.csv').then(function(dataset) {

	var dates = []
	var nested = d3.nest()
		.key(function(d) {
			var newd = parseDate(d.date)
	
			//console.log(newd)
			d.date = newd
			return(d.company)
			

		})


		.entries(dataset)
	var background = svg.selectAll('.background')
    .data(nested) // dummy data
    .enter()
    .append('rect') // Append 4 rectangles
    .attr('class', 'background')
    .attr('width', trellisWidth) // Use our trellis dimensions
    .attr('height', trellisHeight)
    .attr('transform', function(d, i) {
    	//console.log(d.values)
        // Position based on the matrix array indices.
        // i = 1 for column 1, row 0)
        var tx = (i % 2) * (trellisWidth + padding.l + padding.r) + padding.l;
        var ty = Math.floor(i / 2) * (trellisHeight + padding.t + padding.b) + padding.t;
        return 'translate('+[tx, ty]+')';
    });

    var trellisG = svg.selectAll('.trellis')
        .data(nested)
        .enter()
        .append('g')
        .attr('class', 'trellis')
        .attr('transform', function (d, i) { // i is index
            var tx = (i % 2) * (trellisWidth + padding.l + padding.r) + padding.l;
            var ty = Math.floor(i / 2) * (trellisHeight + padding.t + padding.b) + padding.t;
            return 'translate('+[tx, ty]+')';
        });
    var lineinterpolate = d3.line()
	          .x(function(d) { return xScale(d.date); })
	          .y(function(d) { return yScale(d.price); })
	var count = 0;

	          


	var count2 = 0
	var count3 = 0
	var xGrid = d3.axisTop(xScale)
    	.tickSize(-trellisHeight, 0, 0)
    	.tickFormat('');

	var yGrid = d3.axisLeft(yScale)
    	.tickSize(-trellisWidth, 0, 0)
    	.tickFormat('')

   

	trellisG.append('g')
    	.attr('class', 'x grid')
    	.style('fill', 0xFFFFFF)

  		.call(xGrid);
  	trellisG.append('g')
    	.attr('class', 'y grid')
    	.style('fill', 0xFFFFFF)

  		.call(yGrid);
  	trellisG.selectAll("line-plot")
    	.data(function(d){
    		return [d.values]

    	})

    	.enter()
    	.append('path')

    	//.attr("fill", "none")


    	.attr("class", "line-plot")
	    .attr("d", lineinterpolate)
		.style("stroke", function(d) {
			var set = companies[count]
			count += 1
			
			return colorScale(set)
		})





	trellisG.append('text')
        .attr('class', 'company-label')
        .attr('transform', 'translate(' + [trellisWidth / 1.96, 110] + ')')
        .style('fill', function(d) {
        	set = companies[count3]
        	count3 += 1
        	return(colorScale(set))
        	console.log(set)

        })
        .text(function(d) {
        	var set2 = companies[count2]
        	count2 += 1
            return (set2);
        });
    



	         
	var xAxis = d3.axisBottom(xScale)
        .ticks(10);

    trellisG.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + trellisHeight + ')')
        .call(xAxis);

    var yAxis = d3.axisLeft(yScale)
        .ticks(11);
     trellisG.append('g')
        .attr('class', 'y axis')
        .call(yAxis);
    trellisG.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'translate(' + [trellisWidth / 2, trellisHeight + 34] + ')')
        .text('Date (by Month)')
        .style("font-size", "12px");
    trellisG.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'translate(' + [-30, trellisHeight / 2] + ') rotate (-90)')
        .text('Stock Price (USD)')
        .style("font-size", "12px");

    



});
// As an example for how to layout elements with our variables
// Lets create .background rects for the trellis plots



// **** How to properly load data ****



// Remember code outside of the data callback function will run before the data loads