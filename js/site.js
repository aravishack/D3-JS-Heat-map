//Global Vars
var dataStatus = [];
var xAxis = [];
var yAxis = [];
var dataStatusWhole = [];

window.addEventListener("load", d3Call);

function d3Call() {

    //Getting Data From JSON
    d3.json("../data/data.json", function (error, data) {
        var dataKeys = Object.keys(data);

        //Getting the status
        for (var keyIndex in dataKeys) {
            if (dataKeys[keyIndex] != "apis" && dataKeys[keyIndex] != "timeSlot") {
                dataStatus.push(data[dataKeys[keyIndex]]);
            }
        }

        //Getting x-axis details
        for (var xIndex in data.apis) {
            xAxis.push(data.apis[xIndex]);
        }

        //Getting y-axis details
        for (var yIndex in data.timeSlot) {
            yAxis.push(data.timeSlot[yIndex]);
        }

        //Forming new Object with props slot,status and position
        for (var dataCopyOuterIndex in dataStatus) {
            for (var dataCopyInnerIndex in dataStatus[dataCopyOuterIndex]) {
                dataStatusWhole.push({
                    slot: +dataCopyOuterIndex + 1,
                    status: dataStatus[dataCopyOuterIndex][dataCopyInnerIndex],
                    pos: dataCopyInnerIndex
                })
            }
        }

        //Props to set upthe SVG
        var margin = {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
        };
        var times = yAxis.length+5;
        var innerWidth = window.innerWidth;
        var width = Math.max(900, innerWidth) - margin.right - margin.left;
        var gridSize = Math.floor(width / times);
        var height = gridSize * (yAxis.length + 2);

        // Create svg
        var svg = d3.select('#chart')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        // Create color scale
        var colorScale = d3.scaleLinear()
            .domain([0, 1])
            .range(["#FF0000", "#008000"]);

        // Add API labels
        var apiLabels = svg.selectAll(".apiLabel")
            .data(yAxis)
            .enter().append("text")
            .text(function (d) {
                return d;
            })
            .attr("x", 0)
            .attr("y", function (d, i) {
                return i * gridSize;
            })
            .style("text-anchor", "end")
            .attr("transform", "translate(-10," + gridSize / 1.5 + ")");

        // Add Time labels
        var timeLabels = svg.selectAll(".timeLabel")
            .data(xAxis)
            .enter().append("text")
            .text(function (d) {
                return d;
            })
            .attr("x", function (d, i) {
                return i * gridSize;
            })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -10)");


        // Add heatmap
        var heatMap = svg.selectAll("apiData")
            .data(dataStatusWhole)
            .enter().append("rect")
            .attr("x", function (d) {
                return (d.pos) * gridSize;
            })
            .attr("y", function (d) {
                return (d.slot - 1) * gridSize;
            })
            .attr("class", "data")
            .attr("width", gridSize)
            .attr("height", gridSize)
            .style("fill", function (d) {
                return colorScale(d.status);;
            });
        createHeatMaptable();
    });
}

function createHeatMaptable() {
    var tempArray = [];
    for (var dataCopyOuterIndex in dataStatus) {
        for (var dataCopyInnerIndex in dataStatus[dataCopyOuterIndex]) {
            if (dataStatus[dataCopyOuterIndex][dataCopyInnerIndex] == "0") {
                tempArray.push(xAxis[dataCopyInnerIndex]);
            }
        }
        var newHTML = "<div class='time'>"+yAxis[dataCopyOuterIndex]+" - </div><div class='apis-list'>"+tempArray+"</div>"
        var ele = document.getElementById("heatmap-table-wrap");
        var divWrap = document.createElement('div')
        divWrap.setAttribute("class","data-wrap");
        ele.appendChild(divWrap);
        divWrap.innerHTML=newHTML;
        tempArray.length=0;
    }
}
