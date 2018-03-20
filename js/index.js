function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function compareNumbers(a, b) {
	return a - b;
}

var App = React.createClass({
	displayName: 'App',

	getInitialState: function getInitialState() {
		return {
			data: [],
			series: ['Wheat', 'Paddy', 'Maize', 'Potato', 'Onion'],
			labels: ['Azadpur market', 'Nasik market', 'Ghazipur Mandi', 'Ludhiana Mandi', 'Lucknow Market'],
			colors: ['#43A19E', '#7B43A1', '#F2317A', '#FF9824', '#58CF6C']
		};
	},
	componentDidMount: function componentDidMount() {
		this.populateArray();
		setInterval(this.populateArray, 2000);
	},
	populateArray: function populateArray() {
		var data = [],
		    series = 5,
		    //getRandomInt(2, 10),
		serieLength = 5; //getRandomInt(2, 10);

		for (var i = series; i--;) {
			var tmp = [];

			for (var j = serieLength; j--;) {
				tmp.push(getRandomInt(0, 20));
			}

			data.push(tmp);
		}

		this.setState({ data: data });
	},
	render: function render() {
		return React.createElement(
			'section',
			null,
			React.createElement(Charts, {
				data: this.state.data,
				labels: this.state.series,
				colors: this.state.colors,
				height: 250
			}),
			React.createElement(Charts, {
				data: this.state.data,
				labels: this.state.series,
				colors: this.state.colors,
				height: 250,
				opaque: true,
				grouping: 'stacked'
			}),
			React.createElement(Charts, {
				data: this.state.data,
				labels: this.state.series,
				colors: this.state.colors,
				height: 250,
				grouping: 'layered'
			}),
			React.createElement(Charts, {
				data: this.state.data,
				labels: this.state.series,
				colors: this.state.colors,
				horizontal: true
			}),
			React.createElement(Legend, { labels: this.state.labels, colors: this.state.colors })
		);
	}
});

var Legend = React.createClass({
	displayName: 'Legend',

	render: function render() {
		var labels = this.props.labels,
		    colors = this.props.colors;

		return React.createElement(
			'div',
			{ className: 'Legend' },
			labels.map(function (label, labelIndex) {
				return React.createElement(
					'div',
					null,
					React.createElement('span', { className: 'Legend--color', style: { backgroundColor: colors[labelIndex % colors.length] } }),
					React.createElement(
						'span',
						{ className: 'Legend--label' },
						label
					)
				);
			})
		);
	}
});

var Charts = React.createClass({
	displayName: 'Charts',

	render: function render() {
		var self = this,
		    data = this.props.data,
		    layered = this.props.grouping === 'layered' ? true : false,
		    stacked = this.props.grouping === 'stacked' ? true : false,
		    opaque = this.props.opaque,
		    max = 0;

		for (var i = data.length; i--;) {
			for (var j = data[i].length; j--;) {
				if (data[i][j] > max) {
					max = data[i][j];
				}
			}
		}

		return React.createElement(
			'div',
			{ className: 'Charts' + (this.props.horizontal ? ' horizontal' : '') },
			data.map(function (serie, serieIndex) {
				var sortedSerie = serie.slice(0),
				    sum;

				sum = serie.reduce(function (carry, current) {
					return carry + current;
				}, 0);
				sortedSerie.sort(compareNumbers);

				return React.createElement(
					'div',
					{ className: 'Charts--serie ' + self.props.grouping,
						key: serieIndex,
						style: { height: self.props.height ? self.props.height : 'auto' }
					},
					React.createElement(
						'label',
						null,
						self.props.labels[serieIndex]
					),
					serie.map(function (item, itemIndex) {
						var color = self.props.colors[itemIndex],
						    style,
						    size = item / (stacked ? sum : max) * 100;

						style = {
							backgroundColor: color,
							opacity: opaque ? 1 : item / max + .05,
							zIndex: item
						};

						if (self.props.horizontal) {
							style['width'] = size + '%';
						} else {
							style['height'] = size + '%';
						}

						if (layered && !self.props.horizontal) {
							//console.log(sortedSerie, serie, sortedSerie.indexOf(item));
							style['right'] = sortedSerie.indexOf(item) / (serie.length + 1) * 100 + '%';
							// style['left'] = (itemIndex * 10) + '%';
						}

						return React.createElement(
							'div',
							{
								className: 'Charts--item ' + self.props.grouping,
								style: style,
								key: itemIndex
							},
							React.createElement(
								'b',
								{ style: { color: color } },
								item
							)
						);
					})
				);
			})
		);
	}
});

React.render(React.createElement(App, null), document.getElementById('charts'));