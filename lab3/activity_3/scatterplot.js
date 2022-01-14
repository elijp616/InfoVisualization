// **** Your JavaScript code goes here ****
d3.csv('baseball_hr_leaders.csv').then(function(dataset) {
    var entryArray = []
    let duplicate = new Map()
    for (var i = 0; i < dataset.length; i++) {
        var check = false
        var str = ''
        var sub = []
        sub.push(dataset[i].name)
        sub.push(dataset[i].rank)
        var year = scaleYear(dataset[i].year)
        sub.push(year)
        var hr = scaleHomeruns(dataset[i].homeruns)
        sub.push(hr)
        str += dataset[i].year + dataset[i].rank
        console.log(str)
        if (duplicate.has(str)) {
            
            duplicate[str] += 1
            check = true
            sub.push(check)

        }
        else {
            duplicate.set(str, 1)
            sub.push(check)
        }
        entryArray.push(sub)

    }
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
    svg.append('g')
    .selectAll("dot")
    .data(entryArray)
    .enter()
    .append("circle")
    .attr("cx", function (d,i) { return (entryArray[i][2]); } )
    .attr("cy", function (d,i) { return (entryArray[i][3]); } )
    .attr("r", 2)
    .style("opacity", function(d, i) {
        if (entryArray[i][4]) {
            return .5
        }
        else {
            return .3
        }

    })

    .style("fill", function(d, i) {
        var a = parseInt(entryArray[i][1])
        return a < 4 ? "#ffa500" : "#69b3a2"
    })
    .on('mouseover', function(d,i) {
            d3.select(this).transition()
                .duration('100')
                .duration(100)
                .style("opacity", 1)
            div.transition()
               .duration(100)
               .style("opacity", 1);
            div.html(entryArray[i][0])
            
    })

    .on("mouseout", function(d, i) {
        d3.select(this).transition()
            .duration('200')
            .duration(200)
            .style("opacity", function(d, i) {
                if (entryArray[i][4]) {
                    return .5
                }
                else {
                    return .3
                }

            })
            div.transition()
               .duration('200')
               .style("opacity", 0);
    })
    

        




})

// **** Functions to call for scaled values ****

function scaleYear(year) {
    return yearScale(year);
}

function scaleHomeruns(homeruns) {
    return hrScale(homeruns);
}

// **** Code for creating scales, axes and labels ****

var yearScale = d3.scaleLinear()
    .domain([1870,2017]).range([60,700]);

var hrScale = d3.scaleLinear()
    .domain([0,75]).range([340,20]);

var svg = d3.select('svg');

svg.append('g').attr('class', 'x axis')
    .attr('transform', 'translate(0,345)')
    .call(d3.axisBottom(yearScale).tickFormat(function(d){return d;}));

svg.append('text')
    .attr('class', 'label')
    .attr('transform','translate(360,390)')
    .text('MLB Season');

svg.append('g').attr('class', 'y axis')
    .attr('transform', 'translate(55,0)')
    .call(d3.axisLeft(hrScale));

svg.append('text')
    .attr('class', 'label')
    .attr('transform','translate(15,200) rotate(90)')
    .text('Home Runs (HR)');

svg.append('text')
    .attr('class', 'title')
    .attr('transform','translate(360,30)')
    .text('Top 10 HR Leaders per MLB Season');