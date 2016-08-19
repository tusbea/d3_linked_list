var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var data = [
	[1],
	[1, 2],
	[3, 1, 2],
	[3, 1, 4, 2],
	[3, 1, 5, 4, 2],
	[6, 3, 1, 5, 4, 2],
	[6, 3, 1, 5, 4, 2, 7],
	[6, 3, 1, 8, 5, 4, 2, 7]
];
var idx = 7;
var prev_data, cur_data;
var delay = 1000, duration = 500;

var svg = d3.select(".canvas").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
svg.append('defs').append('marker')
    .attr('id', 'arrow')
    .attr('viewBox', '0 -10 20 20')
    .attr('refX', 6)
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
  .append('path')
	.attr("d", "M0,10 L10,0 L0,-10")
    .attr('fill', '#000');
	
cur_data = data[idx];

redraw(cur_data);

 function endall(transition, callback) { 
    if (!callback) callback = function(){};
    if (transition.size() === 0) { callback() }
    var n = 0; 
    transition 
        .each(function() { ++n; }) 
        .each("end", function() { if (!--n) callback.apply(this); }); 
} 

var inc = 0;  

function step() {
	if (inc) {
		idx++;
		if (idx === 7)
			inc = 0;
	}
	else {
		idx--;
		if (idx === 0)
			inc = 1;
	}
	
	prev_data = cur_data;
	cur_data = data[idx];
	//console.log(prev_data, cur_data);
	change_data(prev_data, cur_data);
}	

function redraw(d) {
	var nodes = svg.selectAll(".node").data(d);
	nodes.style("opacity", 1);
	nodes.enter().append("rect")
		.attr("class", "node")
		.attr("x", function(d, i) { return i * 80; })
		.attr("y", 0)
		.attr("width", 30)
		.attr("height", 30);
	nodes.exit().remove();
	
	var texts = svg.selectAll(".text").data(d);
	texts.style("opacity", 1)
		.text(function(d) { return d; });
	texts.enter().append("text")
		.attr("class", "text")
		.attr("x", function(d, i) { return i * 80 + 15; })
		.attr("y", 20)
		.attr("text-anchor", "middle")
		.text(function(d) { return d; });
	texts.exit().remove();
	
	var arrows = svg.selectAll(".arrow").data(d.slice(0, -1));
	arrows.style("opacity", 1);
	arrows.enter().append("path")
		.attr("class", "arrow")
		.attr("transform", function(d, i) { return "translate(" + (i * 80) + ",15)" })
		.attr("d", "M40,0 L70,0")
		.style("marker-end", "url(#arrow)")
		.style("stroke", "black")
		.style("stroke-width", "3px");
	arrows.exit().remove();
}

function add_node(idx, val, cd)
{
	console.log("add node at " + idx + " with val " + val);
	console.log("cd : " + cd);
	
	var nodes = svg.selectAll(".node");
	var texts = svg.selectAll(".text");
	var arrows = svg.selectAll(".arrow");
	
	if (cd.length - 1 === idx) {	// 맨 뒤. arrow, node 추가
		nodes = nodes.data(cd)
			.enter().append("rect")
			.attr("class", "node")
			.attr("x", function(d, i) { return i * 80; })
			.attr("y", 0)
			.attr("width", 30)
			.attr("height", 30)
			.style("opacity", function(d, i) { return i === idx ? 0 : 1; });
		
		texts = texts.data(cd)
			.enter().append("text")
			.attr("class", "text")
			.attr("x", function(d, i) { return i * 80 + 15; })
			.attr("y", 20)
			.attr("text-anchor", "middle")
			.text(function(d) { return d; })
			.style("opacity", function(d, i) { return i === idx ? 0 : 1; });
		
		arrows = arrows.data(cd.slice(0, -1))
			.enter().append("path")
			.attr("class", "arrow")
			.attr("transform", function(d, i) { return "translate(" + (i * 80) + ",15)" })
			.attr("d", "M40,0 L70,0")
			.style("marker-end", "url(#arrow)")
			.style("stroke", "black")
			.style("stroke-width", "3px")
			.style("opacity", function(d, i) { return i === idx - 1 ? 0 : 1; });
		
		
		nodes.transition().duration(duration)
			.style("opacity", 1);
		texts.transition().duration(duration)
			.style("opacity", 1);
		arrows.transition().duration(duration)
			.style("opacity", 1);
	}
	else {	// node, arrow 추가
		nodes.transition().duration(duration)
			.attr("x", function(d, i) { return i >= idx ? (i+1) * 80 : i * 80; });
		texts.transition().duration(duration)
			.attr("x", function(d, i) { return i >= idx ? (i+1) * 80 + 15 : i * 80 + 15; });
		arrows.transition().duration(duration)
			.attr("transform", function(d, i) { return "translate(" + (i >= idx ? (i+1) * 80 : i * 80) + ",15)";})
			.call(endall, function() {
				nodes = nodes.data(cd);
				nodes.enter().append("rect")
					.attr("class", "node")
					.attr("x", function(d, i) { return i * 80; })
					.attr("y", 0)
					.attr("width", 30)
					.attr("height", 30)
					.style("opacity", function(d, i) { return i === idx ? 0 : 1; });
				nodes.style("opacity", function(d, i) { return i === idx ? 0 : 1; })
					.attr("x", function(d, i) { return i * 80; });
				
				texts = texts.data(cd);
				texts.enter().append("text")
					.attr("class", "text")
					.attr("x", function(d, i) { return i * 80 + 15; })
					.attr("y", 20)
					.attr("text-anchor", "middle")
					.text(function(d) { return d; })
					.style("opacity", function(d, i) { return i === idx ? 0 : 1; });
				texts.style("opacity", function(d, i) { return i === idx ? 0 : 1; })
					.attr("x", function(d, i) { return i * 80 + 15; })
					.text(function(d) { return d; });
				
				arrows = arrows.data(cd.slice(0, -1));
				arrows.enter().append("path")
					.attr("class", "arrow")
					.attr("transform", function(d, i) { return "translate(" + (i * 80) + ",15)" })
					.attr("d", "M40,0 L70,0")
					.style("marker-end", "url(#arrow)")
					.style("stroke", "black")
					.style("stroke-width", "3px")
					.style("opacity", function(d, i) { return i === idx ? 0 : 1; });
				arrows.style("opacity", function(d, i) { return i === idx ? 0 : 1; })
					.attr("transform", function(d, i) { return "translate(" + (i * 80) + ",15)" });
					
				nodes.transition().duration(duration)
					.style("opacity", 1);
				texts.transition().duration(duration)
					.style("opacity", 1);
				arrows.transition().duration(duration)
					.style("opacity", 1);
			});
	}
}

function delete_node(idx, cd)
{	
	console.log("delete node at " + idx);

	var nodes = svg.selectAll(".node");
	var texts = svg.selectAll(".text");
	var arrows = svg.selectAll(".arrow");
	
	if (cd.length === idx) {	// 맨 뒤. arrow, node 삭제
		nodes.filter(function(d, i) { return i === idx; })
			.transition().duration(duration)
			.style("opacity", 0);
			
		texts.filter(function(d, i) { return i === idx; })
			.transition().duration(duration)
			.style("opacity", 0);
			
		arrows.filter(function(d, i) { return i === idx - 1; })
			.transition().duration(duration)
			.style("opacity", 0)
			.call(endall, function() {
				nodes = nodes.data(cd);
				texts = texts.data(cd);
				arrows = arrows.data(cd.slice(0, -1));
				
				nodes.style("opacity", function(d, i) { return i === idx ? 0 : 1; })
					.attr("x", function(d, i) { return i * 80; });
				texts.style("opacity", function(d, i) { return i === idx ? 0 : 1; })
					.attr("x", function(d, i) { return i * 80 + 15; })
					.text(function(d) { return d; });
				arrows.style("opacity", function(d, i) { return i === idx ? 0 : 1; })
					.attr("transform", function(d, i) { return "translate(" + (i * 80) + ",15)" });
							
				
				nodes.exit().remove();
				texts.exit().remove();
				arrows.exit().remove();
			});
	}
	else {	// node, arrow 삭제
		nodes.filter(function(d, i) { return i === idx; })
			.transition().duration(duration)
			.style("opacity", 0);
			
		texts.filter(function(d, i) { return i === idx; })
			.transition().duration(duration)
			.style("opacity", 0);
			
		arrows.filter(function(d, i) { return i === idx; })
			.transition().duration(duration)
			.style("opacity", 0)
			.call(endall, function() {
				nodes.transition().duration(duration)
					.attr("x", function(d, i) { return i > idx ? (i-1) * 80 : i * 80; });
				texts.transition().duration(duration)
					.attr("x", function(d, i) { return i > idx ? (i-1) * 80 + 15 : i * 80 + 15; });
				arrows.transition().duration(duration)
					.attr("transform", function(d, i) { return "translate(" + (i > idx ? (i-1) * 80 : i * 80) + ",15)" })
					.call(endall, function() {
						nodes = nodes.data(cd);
						texts = texts.data(cd);
						arrows = arrows.data(cd.slice(0, -1));
						
						nodes.style("opacity", 1)
							.attr("x", function(d, i) { return i * 80; });
						texts.style("opacity", 1)
							.attr("x", function(d, i) { return i * 80 + 15; })
							.text(function(d) { return d; });
						arrows.style("opacity", 1)
							.attr("transform", function(d, i) { return "translate(" + (i * 80) + ",15)" });
									
						
						nodes.exit().remove();
						texts.exit().remove();
						arrows.exit().remove();
					});
			});
	}
	
	
}

function change_data(pd, cd)
{
	var i;
	// 이전 data와 d를 비교하여 add_node인지 delete_node인지 판단
	// delete_node
	if (pd.length === cd.length + 1) {
		for (i = 0; i < cd.length; i++)
			if (pd[i] !== cd[i])
				return delete_node(i, cd);
		return delete_node(i, cd);
	}
	// add_node
	else if (pd.length === cd.length - 1) {
		for (i = 0; i < pd.length; i++)
			if (pd[i] !== cd[i])
				return add_node(i, cd[i], cd);
		return add_node(i, cd[i], cd);
	}
	else {
		return;
	}
}

function highlight_node(idx) {
	var nodes = svg.selectAll(".node");
	nodes.style("fill", function(d, i) { return i === idx ? "orange" : "white"; });
}

	
	