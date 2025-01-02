# MarvelNet
MarvelNet is an interactive data visualization system designed to explore the intricate connections between characters (heroes) and their appearances in movies within the Marvel Universe. This project aims to provide an engaging and insightful platform for users to understand and analyze the complex web of relationships among Marvel characters and their cinematic appearances.

## Features
- **Interactive Graph Visualization**: Uses a force-directed layout to dynamically position nodes (heroes and movies) and edges (connections) for clear and engaging visual representation.
- **Dynamic Node Sizing**: Nodes can be resized based on the number of connections, highlighting the most prominent characters.
- **Zoom and Pan**: Users can easily navigate the graph using zoom and pan functionalities.
- **Node Details on Hover**: Hovering over a node displays detailed information about the hero or movie.
- **Filters**: Users can filter the graph to display only heroes or only movies, customizing the visualization based on their interests.
- **Statistics Panel**: Displays overall statistics such as the total number of connections, heroes, and movies.
- **Responsive Design**: The layout adjusts to different screen sizes for an optimal user experience.

## Preview
Here are some snapshots of the system in action.

Overview of the MarvelNet user interface:
![marvelnet_interface](https://github.com/user-attachments/assets/16b8fee6-5440-4961-b11f-683247b78a4b)

Detailed information displayed upon hovering over a node and clicking it:
![node_details](https://github.com/user-attachments/assets/11531eb9-ec2d-4797-a6a4-5ef8b54f9243)

Dynamic sizing of nodes based on their degree:
![node_charge](https://github.com/user-attachments/assets/a8eb9905-cb62-499a-abe3-9722ea5ea9e7)

Quick demonstration of key features:
https://github.com/user-attachments/assets/06f32b92-21ed-4bfe-b697-918b7d1404cd

## Usage
1. Clone the repository: ```git clone https://github.com/username/marvelnet.git```
2. Navigate to the project directory: ```cd your/path/to/project/folder ```
3. Run ```python -m http.server``` (start simple http server)
4. Open ```index.html```
   
Or try it [here](https://raw.githack.com/gianmarcoferri/MarvelNet-Data-Visualization/refs/heads/main/index.html)
