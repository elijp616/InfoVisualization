// Global function called when select element is changed
function onCategoryChanged() {
    var select = d3.select('#categorySelect').node();
    // Get current value of select element
    var category = select.options[select.selectedIndex].value;
    // Update chart with the selected category of letters
    updateChart(category);
}

// recall that when data is loaded into memory, numbers are loaded as strings
// this function helps convert numbers into string during data preprocessing
function dataPreprocessor(row) {
    return {
        letter: row.letter,
        frequency: +row.frequency
    };
}

var svg = d3.select('svg');

// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');
var letters

var padding = {t: 60, r: 40, b: 30, l: 40};

// Compute chart dimensions
var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

// Compute the spacing for bar bands based on all 26 letters
var barBand = chartHeight / 26;
var barHeight = barBand * 0.7;
var widthScale;
var heightScale;
const dom = .12702

// Create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

// A map with arrays for each category of letter sets
var lettersMap = {
    'all-letters': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    'only-consonants': 'BCDFGHJKLMNPQRSTVWXZ'.split(''),
    'only-vowels': 'AEIOUY'.split('')
};

d3.csv('letter_freq.csv', dataPreprocessor).then(function(dataset) {
    // Create global variables here and intialize the chart
    letters = dataset
    // for (var i = 0; i < dataset.length; i ++) {
    // 	letters.push(dataset[i])
    // }
    widthScale = d3.axisBottom(d3.scaleLinear().domain([0, dom])
        .range([0, chartWidth])).ticks(6);
        
    console.log(letters)
    heightScale = d3.scaleOrdinal()
    	.domain([0,26])
        .range([barHeight, 0]);
    //console.log(letters)

    svg.append("g")
    	.attr("transform", "translate(30," + (chartHeight + 60) + ")")
        .call(widthScale)
        .selectAll("text")
        .attr("class", "axis-label")
        .attr("transform", "translate(0, 0) rotate(0)")
        .text((d) => { return 100 * d  + "%"});

    svg.append("g")
        .attr("transform", "translate(30," + (50) + ") scale(1, -1)")
        .call(widthScale)
        .selectAll("text")
        .attr("class", "axis-label")
        .attr("transform", "translate(0, 30) scale (1, -1) rotate(0)")
        .text((d) => { return 100 * d + "%"});

    svg.append("text")
        .attr("transform", "translate(" + (60) + ", 20)")
        .text("Letter Frequency (%)")


    
    

    // **** Your JavaScript code goes here ****


    // Update the chart for all letters to initialize
    updateChart('all-letters');
});


function updateChart(filterKey) {
    // Create a filtered array of letters based on the filterKey
    var filteredLetters = letters.filter(function(d){
        return lettersMap[filterKey].indexOf(d.letter) >= 0;
    });
    
    var barchart = chartG.selectAll(".g")
    	.data(filteredLetters)
    var filterG = barchart.enter()
	    .append('g')
	    .attr('transform', 'translate(0,10)')

    filterG.merge(barchart)
    	.attr('transform', function(d, i){return 'translate(-25,' + (20* i) + ')';});

    // draw label each letter
    filterG.append('text')
    	.attr("font-weight", 700)

	    .style('font-size', '14px')

	    .text(function(d) {return d.letter;});

    // draw bar width for each letter
    filterG.append('rect')
	    .attr('width', function(d, i){return (d.frequency/dom) * chartWidth;})
	    .attr('height', '14px')
	    .attr('transform', 'translate(20, -5)')
	    barchart.exit().remove();


    // 	.enter()
    // 	.append("g")
    // 	.attr("transform", function(d) {return "translate(" + [widthScale(d.frequency),
    // 	 heightScale(d.letter)] + ')'; });
    // barchart.append("rect")
    // 	.attr("height", barHeight)
    // 	.attr("width", function(d) {return widthScale(d.frequency * 100);})

    // barchart.append("text")
    // 	.attr("x", -30)
    // 	.attr("y", 10)
    // 	.text(function(d) {return d.letter})



    // **** Draw and Update your chart here ****

}

// Remember code outside of the data callback function will run before the data loads