// Load the XML dataset
d3.xml('Dataset/marvel.xml').then(function(xml) {
    // Parse the XML data into a graph structure
    const graphData = parseGraphData(xml);
    console.log("Parsed Graph Data:", graphData);

    // Calculate and display statistics about the graph
    displayStatistics(graphData);

    // Create the graph visualization
    createGraph(graphData);
}).catch(function(error) {
    console.error('Error loading or parsing XML data:', error);
});

// Function to create the graph
function createGraph(graphData) {
    // Set the dimensions for the SVG container
    const width = window.innerWidth - 250; // Adjust width to leave space for the menu
    const height = window.innerHeight;

    let dynamicSizing = false;

    // Create an SVG container
    const svg = d3.select('#graph')
        .attr('width', width)
        .attr('height', height)
        .append('g'); // Append a group element to the SVG for zooming

    // Create zoom behavior and disable initial zoom
    const zoom = d3.zoom().on('zoom', function(event) {
        svg.attr('transform', event.transform);
    });

    // Apply zoom behavior to the SVG container
    d3.select('#graph').call(zoom);

    // Calculate the degree of each node (number of connections)
    const degree = {};
    graphData.nodes.forEach(node => degree[node.id] = 0);
    graphData.links.forEach(link => {
        degree[link.source]++;
        degree[link.target]++;
    });

    // Create force simulation for the graph layout
    const simulation = d3.forceSimulation(graphData.nodes)
        .force('link', d3.forceLink(graphData.links).id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-200))
        .force('center', d3.forceCenter(width / 2, height / 2));

    // Create links (edges)
    const link = svg.selectAll('.link')
        .data(graphData.links)
        .enter().append('line')
        .attr('class', 'link')
        .style('stroke', '#999')
        .style('stroke-width', 2) // Ensure the stroke width is set for visibility
        .style('opacity', 0.6);

    // Create nodes
    const node = svg.selectAll('.node')
        .data(graphData.nodes)
        .enter().append('circle')
        .attr('class', d => `node ${d.type}`) // Ensure correct class assignment
        .attr('r', 10)
        .call(d3.drag()
            .on('start', dragstart)
            .on('drag', dragging)
            .on('end', dragend))
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .on('click', function(event, d) {
            displayNodeDetails(d);
            event.stopPropagation(); // Prevent the click event from propagating to the SVG container
        });

    // Node labels
    const label = svg.selectAll('.label')
        .data(graphData.nodes)
        .enter().append('text')
        .attr('class', 'label')
        .attr('x', 12)
        .attr('y', '.31em')
        .text(d => d.name)
        .style('opacity', 0); // Initially hide the labels

    // Update simulation each tick
    simulation.on('tick', function() {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

        label
            .attr('x', d => d.x)
            .attr('y', d => d.y);
    });

    // Toggle dynamic node sizing
    d3.select('#dynamic-sizing').on('change', function() {
        dynamicSizing = this.checked;
        updateNodeSizes();
    });

    // Update node sizes based on degree
    function updateNodeSizes() {
        node.attr('r', d => dynamicSizing ? 5 + degree[d.id] : 10);
    }

    updateNodeSizes();

    // Filter nodes based on checkboxes
    function updateFilters() {
        const showHeroes = d3.select('#show-heroes').property('checked');
        const showMovies = d3.select('#show-movies').property('checked');

        node.style('display', d => {
            if (d.type === 'hero' && !showHeroes) return 'none';
            if (d.type === 'movie' && !showMovies) return 'none';
            return 'block';
        });

        link.style('display', l => {
            if ((l.source.type === 'hero' && !showHeroes) || (l.source.type === 'movie' && !showMovies)) return 'none';
            if ((l.target.type === 'hero' && !showHeroes) || (l.target.type === 'movie' && !showMovies)) return 'none';
            return 'block';
        });
    }

    // Add event listeners to the checkboxes
    d3.select('#show-heroes').on('change', updateFilters);
    d3.select('#show-movies').on('change', updateFilters);

    // Initial filter update
    updateFilters();

    // Reset node information when clicking outside nodes
    d3.select('#graph').on('click', function() {
        d3.select('#node-details').html("Select a node to see details");
    });

    // Drag events
    function dragstart(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragging(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragend(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    // Mouse interactions
    function mouseover(event, d) {
        // Find all connections for the hovered node
        const connections = graphData.links.filter(l => 
            l.source.id === d.id || l.target.id === d.id
        );

        // Highlight the connected links
        link.style("stroke-opacity", l => 
            connections.includes(l) ? 0.8 : 0.1
        );

        // Highlight the connected nodes and show labels
        label.style("opacity", n => {
            const isConnected = n.id === d.id || connections.some(l => l.source.id === n.id || l.target.id === n.id);
            const isVisible = d3.select(`.node.${n.type}`).style('display') !== 'none';
            return isConnected && isVisible ? 1 : 0;
        });

    }

    function mouseout() {
        // Reset link opacity
        link.style("stroke-opacity", 0.6);
        
        // Hide labels
        label.style("opacity", 0);
    }

    // Function to display node details
    function displayNodeDetails(d) {
        const details = `
            <strong>Name:</strong> ${d.name} <br>
            <strong>Type:</strong> ${d.type} <br>
            <strong>Connections:</strong> ${degree[d.id]}
        `;
        d3.select('#node-details').html(details);
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        const width = window.innerWidth - 250; // Adjust width to leave space for the menu
        const height = window.innerHeight;
        svg.attr('width', width).attr('height', height);
        simulation.force('center', d3.forceCenter(width / 2, height / 2)).alpha(1).restart();
    });
}

// Function to parse the XML and extract graph data
function parseGraphData(xml) {
    const nodes = [];
    const edges = [];

    // Parse nodes
    xml.querySelectorAll('node').forEach(nodeElement => {
        nodes.push({
            id: nodeElement.getAttribute('id'),
            type: nodeElement.querySelector('data[key="type"]').textContent,
            name: nodeElement.querySelector('data[key="name"]').textContent
        });
    });

    // Parse edges
    xml.querySelectorAll('edge').forEach(edgeElement => {
        edges.push({
            source: edgeElement.getAttribute('source'),
            target: edgeElement.getAttribute('target')
        });
    });

    console.log("Nodes:", nodes);
    console.log("Edges:", edges);

    return { nodes, links: edges };
}

// Function to display statistics
function displayStatistics(graphData) {
    const numConnections = graphData.links.length;
    const numHeroes = graphData.nodes.filter(node => node.type === 'hero').length;
    const numMovies = graphData.nodes.filter(node => node.type === 'movie').length;

    d3.select('#num-connections').text(`Connections: ${numConnections}`);
    d3.select('#num-heroes').text(`Heroes: ${numHeroes}`);
    d3.select('#num-movies').text(`Movies: ${numMovies}`);
}
