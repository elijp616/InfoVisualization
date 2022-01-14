
// test code for scale
console.log("poo")

// selecting svg canvas
var chartG = d3.select('#chartG');
// getting width 
var svgWidth = +chartG.attr('width');
// getting height
var svgHeight = +chartG.attr('height');
var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-12, 0])
    .html(function(d) {
        return "<h5>"+d['Movie Title']+ ' (' + d['Content Rating'] + ')' + "</h5>";
    });
chartG.call(toolTip);



// chart data attributes 
var dataAttributes = ['Duration', 'Aspect Ratio', 'IMDb Score', 'Budget', 'Gross', 'Number of Users for Reviews',
'Number of Faces in Poster', 'Number of Voted Users'];
var N = dataAttributes.length;

// Map for referencing min/max per each attribute 
var extentByAttribute = {};



// ordinal color scale for cylinder color mapping
var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
var titleYears = [2010, 2011, 2012, 2013, 2014, 2015, 2016]
colorScale.domain(titleYears)
console.log(colorScale.domain())


var xScale = d3.scaleLinear().range([55, 980]);
var yScale = d3.scaleLinear().range([665, 20]);



function onCategoryChanged() {
    var xSelected = d3.select('#xSelect').node();
    var ySelected = d3.select('#ySelect').node();
    
    // get values of select element
    var xVal = xSelected.options[xSelected.selectedIndex].value;
    var yVal = ySelected.options[ySelected.selectedIndex].value;

    //  getting year selection
    var yearSelected = d3.select('#yearSelect').node()
    var yearFilter = yearSelected.options[yearSelected.selectedIndex].value;

    // formatting token for filter
    if (yearFilter != "all") {
    yearFilter = yearFilter.substring(5);
    }  
    
    chartG.selectAll('*')
    .remove()

    scatPlot(xVal, yVal, yearFilter)

}

var map = {
    'duration': 'Duration',
    'aspect-ratio': 'Aspect Ratio',
    'imdb-score': 'IMDb Score',
    'budget': 'Budget',
    'gross': 'Gross',
    'number-of-users-for-reviews': 'Number of Users for Reviews',
    'number-of-faces-in-poster': 'Number of Faces in Poster',
    'number-of-voted-users': 'Number of Voted Users'
};

// , data preprocessor
d3.csv('movies.csv', dataPreprocessor).then((d) => {
    data = d;
    var titleYears = [2011, 2012, 2013, 2014, 2015, 2016]
    console.log(data);


   
    console.log(titleYears);


    

    dataAttributes.forEach(function(attribute){
        extentByAttribute[attribute] = d3.extent(d, function(d) {
            return d[attribute];
        });
    });

    
    scatPlot('budget', 'gross');
    barChart();
});

function scatPlot(scaleX, scaleY, filterKey) {
   
    xAttr = map[scaleX]
    yAttr = map[scaleY]

    // axis related code passed 
    xScale.domain(extentByAttribute[xAttr]);
    yScale.domain(extentByAttribute[yAttr]);
    
    var xAxis = d3.axisBottom(xScale).ticks(6)
    var yAxis = d3.axisLeft(yScale).ticks(6)

    createScatPlotAxis(xAxis, yAxis);

    updatedData = [];


    // for (var i = 0; i < data.length; i++) {
    //     if (data['Title Year'] == filterKey) {
    //         updatedData.push(data[)
    //     }

    // }



    createLegend();
    //go back through only pick out data with matching years

    console.log(data)

    var circleUpdate = chartG.selectAll('.circle')
        .data(data);
    
    var circlesEnter = circleUpdate.enter()
        .append('circle')
        .attr('class', 'circle')
        .style("fill", function (d) {
            return colorScale(d['Title Year']);
        })
        .attr('r', 4);
        circlesEnter.on('mouseover', toolTip.show)
            .on('mouseout', toolTip.hide);
    
    circleUpdate.merge(circlesEnter)
        .attr('cx', function (d) {
            return xScale(d[xAttr]) + 50;
        })
        .attr('cy', function(d){
            return yScale(d[yAttr]);
        });

    circleUpdate.exit().remove();
}

function createScatPlotAxis(xAxis, yAxis) {
    chartG.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(50,700)')
    .call(xAxis)

    chartG.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(75,0)')
    .call(yAxis)
    

}

// function to create legend 

function createLegend(){

    chartG.selectAll('.squares')
    .data(titleYears)
    .enter()
    .append("rect")
    .attr("x", 1100)
    .attr("y", function(d,i){ return 100 + i*(20+5)}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", function(d){ return colorScale(d)})

    chartG.selectAll("myLablels")
    .data(titleYears)
    .enter()
    .append("text")
    .attr("x", 1100 + 20 *1.2)
    .attr("y", function(d,i){ return 100 + i*(20+5) + (20/2)}) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d){ return colorScale(d)})
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")

}

function barChart() {

}

// function filterYear (yearSelection) {



// }

// changes format of data in callback
function dataPreprocessor(row) {
    return {
        'Color': row['color'],
        'Director Name': row['director_name'],
        'Number Critic For Reviews': +row['num_critic_for_reviews'],
        'Duration': +row['duration'],
        'Director Facebook Likes': +row['director_facebook_likes'],
        'Actor 3 Facebook Likes': +row['actor_3_facebook_likes'],
        'Actor 2 Name': row['actor_2_name'],
        'Actor 1 Facebook Likes': +row['actor_1_facebook_likes'],
        'Gross': +row['gross'],
        'Genres': row['genres'],
        'Actor 1 Name': row['actor_1_name'],
        'Movie Title': row['movie_title'],
        'Number of Voted Users': +row['num_voted_users'],
        'Cast Total Facebook Likes': +row['cast_total_facebook_likes'],
        'Actor 3 Name': row['actor_3_name'],
        'Number of Faces in Poster': +row['facenumber_in_poster'],
        'Plot Keywords': row['plot_keywords'],
        'Movie IMDb Link': row['movie_imdb_link'],
        'Number of Users for Reviews': +row['num_user_for_reviews'],
        'Language': row['language'],
        'Country': row['country'],
        'Content Rating': row['content_rating'],
        'Budget': +row['budget'],
        'Title Year': +row['title_year'],
        'Actor 2 Facebook Likes': +row['actor_2_facebook_likes'],
        'IMDb Score': +row['imdb_score'],
        'Aspect Ratio': +row['aspect_ratio'],
        'Movie Facebook Likes': +row['movie_facebook_likes'],
    };
}