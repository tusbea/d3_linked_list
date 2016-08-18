var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var data = [
	[1],
	[1, 2],
	[1, 2, 3],
	[1, 2, 4, 3]
];
var idx = 0;
var prev_data, cur_data;
var delay = 1000, duration = 1000;

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

var inc = 1;  

function step() {
	if (inc) {
		idx++;
		if (idx === 3)
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
		console.log("nodes : " + nodes);
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
		
	}
	
	// 1단계 : 추가될 곳의 오른쪽에 있는 node들을 한 칸씩 밀기
	//nodes.transition().duration(duration)
	//	.attr("x", function(d, i) { 
	//		if (i >= idx) 	return (i + 1) * 80;
	//		else			return i * 80;
	//	});
	//	
	//texts.transition().duration(duration)
	//	.attr("x", function(d, i) { 
	//		if (i >= idx) 	return (i + 1) * 80 + 15; 
	//		else 			return i * 80 + 15;
	//	});
	//	
	//arrows.transition().duration(duration)
	//	.attr("transform", function(d, i) { 
	//		if (i >= idx - 1) 	return "translate(" + ((i+1) * 80) + ",15)";
	//		else			return "translate(" + (i * 80) + ",15)";
	//	});
	//	
	//svg.data([val]).enter().append("rect")
	//	.attr("class", "node")
	//	.attr("x", function(d, i) { return idx * 80; })
	//	.attr("y", 0)
	//	.attr("width", 30)
	//	.attr("height", 30);
	//
	//// 2단계 : node와 arrow 추가
	//nodes.filter(function(d, i) { return i === idx; })
	//	.transition().duration(duration).delay(delay)
	//	.style("opacity", 1);
	//	
	//texts.filter(function(d, i) { return i === idx; })
	//	.transition().duration(duration).delay(delay)
	//	.style("opacity", 1);
	//	
	//arrows.filter(function(d, i) { return i === idx - 1; })
	//	.transition().duration(duration).delay(delay)
	//	.style("opacity", 1);
	
	// 3단계 : redraw
	
}

function delete_node(idx, cd)
{	
	console.log("delete node at " + idx);

	var nodes = svg.selectAll(".node");
	var texts = svg.selectAll(".text");
	var arrows = svg.selectAll(".arrow");
	
	if (cd.length === idx) {	// 맨 뒤. arrow, node 삭제
		
	}
	else {	// node, arrow 삭제
		
	}
	
	// 1단계 : node와 arrow 사라짐
	nodes.filter(function(d, i) { return i === idx; })
		.transition().duration(duration)
		.style("opacity", 0);
		
	texts.filter(function(d, i) { return i === idx; })
		.transition().duration(duration)
		.style("opacity", 0);
		
	arrows.filter(function(d, i) { return i === idx - 1; })
		.transition().duration(duration)
		.style("opacity", 0);
		
	// 2단계 : 오른쪽에 있는 node가 왼쪽으로 붙음
	nodes.transition().delay(delay).duration(duration)
		.attr("x", function(d, i) { 
			if (i > idx) 	return (i - 1) * 80;
			else			return i * 80;
		});
		
	texts.transition().delay(delay).duration(duration)
		.attr("x", function(d, i) { 
			if (i > idx) 	return (i - 1) * 80 + 15; 
			else 			return i * 80 + 15;
		});
		
	arrows.transition().delay(delay).duration(duration)
		.attr("transform", function(d, i) { 
			if (i >= idx) 	return "translate(" + ((i-1) * 80) + ",15)";
			else			return "translate(" + (i * 80) + ",15)";
		})
		.call(endall, function() { redraw(cd); });
	
	
	// 3단계 : data 재설정(필요 없나?)
	//redraw(cd);
	
	
	
	
	//nodes.data(d).enter().append("rect")
	//	.attr("class", "node")
	//	.attr("x", function(d, i) { return i * 80; })
	//	.attr("y", 0)
	//	.attr("width", 30)
	//	.attr("height", 30);
	//nodes.data(d).exit().remove();
	//	
	//	
	//texts.data(d).enter().append("text")
	//	.attr("class", "text")
	//	.attr("x", function(d, i) { return i * 80 + 15; })
	//	.attr("y", 20)
	//	.attr("text-anchor", "middle")
	//	.text(function(d) { return d; });
	//texts
	//	.text(function(d) { return d; });
	//texts.data(d).exit().remove();
	//	
	//	
	//arrows.enter().append("path")
	//	.attr("class", "arrow")
	//	.attr("x", function(d, i) { return i * 80 + 40; })
	//	.attr("y", 0)
	//	.attr("d", function(d, i) {
	//		var x1 = 40;
	//		var x2 = 70;
	//		return "M" + x1 + ",15 L" + x2 + ",15";
	//	})
	//	.style("marker-end", "url(#arrow)")
	//	.style("stroke", "black")
	//	.style("stroke-width", "3px");
	//arrows.exit().remove();
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

	
	