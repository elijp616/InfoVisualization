
var svg = d3.select('svg');
// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 40, r: 40, b: 40, l: 40};
var cellPadding = 10;

// Create a group element for appending chart elements


var dataAttributes = ['economy (mpg)', 'cylinders', 'power (hp)', '0-60 mph (s)'];
var N = dataAttributes.length;

// Compute chart dimensions
var cellWidth = (svgWidth - padding.l - padding.r) / N;
var cellHeight = (svgHeight - padding.t - padding.b) / N;

// Global x and y scales to be used for all SplomCells
var xScale = d3.scaleLinear().range([0, cellWidth - cellPadding]);
var yScale = d3.scaleLinear().range([cellHeight - cellPadding, 0]);
// axes that are rendered already for you
var xAxis = d3.axisTop(xScale)
var yAxis = d3.axisLeft(yScale)
var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
// Map for referencing min/max per each attribute
var extentByAttribute = {};
// Object for keeping state of which cell is currently being brushed
var brushCell;
var counts = [200,400,600,800]


d3.csv('cars.csv', dataPreprocessor).then(function(dataset) {
    
        cars = dataset;

        // Create map for each attribute's extent
        dataAttributes.forEach(function(attribute){
            if (attribute == "cylinders") {
                extentByAttribute[attribute] = d3.extent(dataset, function(d){
                return d[attribute];

      
                });
            }
        });

        // xScale.domain(d3.extent(dataset, d=>d['cylinders']));
        // yScale.domain(d3.extent(dataset, d=>d['power (hp)']));

        // svg.selectAll('.exit')
        //     .remove()
        // svg.selectAll('.x.axis')
        //     .data(dataAttributes)
        //     .enter()
        //     .append('g')
        //     .attr('class', 'x axis exit')
        //     .attr('transform', function(d,i){
        //         return 'translate('+[cellWidth + cellPadding /2 , 0]+')';
        //     })
        // svg.append('g')
        //     .attr('class', 'exit')
        //     .call(xAxis)
        //     .append('text')
        //     .text('cylinders')
        //     .attr('class', 'axis-label exit')
        //     .attr('transform', 'translate(' +[cellWidth / 2, cellHeight + 30]+')')
        //     .style('fill', 'black')

        // svg.selectAll('y axis exit')
        //     .data(dataAttributes)
        //     .enter()
        //     .append('g')
        //     .attr('class', 'y axis exit')
        //     .attr('transform', function(d, i) {
        //         return 'translate('+[0, cellHeight + cellPadding /2]+')';

        //     })
        // svg.append('g')
        //     .attr('class', 'exit')
        //     .call(yAxis)
        //     .append('text')
        //     .text('power (hp)')
        //     .attr('class', 'axis-label exit')
        //     .attr('transform', 'translate('+[-26, cellHeight /2]+')rotate(270)')
        //     .style('fill', 'black')




        //Pre-render gridlines and labels
        var x = d3.scaleLinear()
            .domain(extentByAttribute["cylinders"])
            .range(0, svgWidth / 2 - 70)

        svg.append('g')
            .attr('transform', 'translate(0,' + 1000 + ')')
            .call(d3.axisBottom(x).ticks(6));
        var y = d3.scaleLinear()
            .domain([0,200])
            .range([svgHeight - 80, 0]);
        svg.append('g')
            .attr('transform', 'translate(50,' + 10 + ')')
            .call(d3.axisLeft(y).ticks(6))
        svg.append('g')
            .attr('transform', 'translate(50,' + 10 + ')')
            .call(d3.axisLeft(y).ticks(6));
        svg.append('g')
            .selectAll('dot')
            .data(dataset)
            .enter()
            .append('circle')
                .attr('cx', function(d) {return x(d.cylinders);})
                .attr('cy', function(d) {return y(d['power (hp)']);})
                .attr("r", 4)
                .style('fill', function(d) {return colorScale(d.cylinders)})
        var xscaleBarchart = d3.scaleLinear().range[0, 10]
        xscaleBarchart = d3.scaleLinear().domain[0,8]
        var yscaleBarchart = d3.scaleLinear().range[0, 10]
        yscaleBarchart = d3.scaleLinear().domain[0,8]
        var axisLeft = d3.axisLeft(yscaleBarchart)
        var axisBottom = d3.axisBottom(xscaleBarchart)

        svg.append('g')
            .call(axisBottom)
            .attr('transform', 'translate(' +[0, svgHeight - padding.b- padding.t] + ')')
        svg.append('g')
            .call(axisLeft)
        var bars = svg.selectAll('.bar')
            .data(counts)
        var barsEnter = bars.enter()
            .append('g')
            .attr('class', 'bar')


});
//         SplomCell.prototype.init = function(g) {
//         var cell = d3.select(g);

//         cell.append('rect')
//         .attr('class', 'frame')
//         .attr('width', cellWidth - cellPadding)
//         .attr('height', cellHeight - cellPadding);
// }
//         SplomCell.prototype.update = function(g, data) {
//         var cell = d3.select(g);

//         // Update the global x,yScale objects for this cell's x,y attribute domains
//         xScale.domain(extentByAttribute[this.x]);
//         yScale.domain(extentByAttribute[this.y]);

//         // Save a reference of this SplomCell, to use within anon function scopes
//         var _this = this;

//         var dots = cell.selectAll('.dot')
//             .data(data, function(d){
//                 return d.name +'-'+d.year+'-'+d.cylinders; // Create a unique id for the car
//             });

//         var dotsEnter = dots.enter()
//             .append('circle')
//             .attr('class', 'dot')
//             .style("fill", function(d) { return colorScale(d.cylinders); })
//             .attr('r', 4);
//         dotsEnter.on('mouseover', toolTip.show)
//             .on('mouseout', toolTip.hide);

//         dots.merge(dotsEnter).attr('cx', function(d){
//                 return xScale(d[_this.x]);
//             })
//             .attr('cy', function(d){
//                 return yScale(d[_this.y]);
//             });

//         dots.exit().remove();
//     }

//     cellEnter.append('g')
//         .attr('class', 'brush')
//         .call(brush)

//     cellEnter.each(function(cell) {
//         cell.init(this);
//         cell.update(this, dataset)

//     });
    

        // ********* Your data dependent code goes here *********//



// ********* Your event listener functions go here *********//


// Remember code outside of the data callback function will run before the data loads

function dataPreprocessor(row) {
    return {
        'name': row['name'],
        'economy (mpg)': +row['economy (mpg)'],
        'cylinders': +row['cylinders'],
        'displacement (cc)': +row['displacement (cc)'],
        'power (hp)': +row['power (hp)'],
        'weight (lb)': +row['weight (lb)'],
        '0-60 mph (s)': +row['0-60 mph (s)'],
        'year': +row['year']
    };
}