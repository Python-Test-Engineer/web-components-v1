import React, { Component } from 'react';

import './App.css';

class App extends Component {
	render() {
		return (
			<div className='App'>
				<header className='App-header'>
					<div>
						<h1>IN APP</h1>
					</div>
					<div className='web-component'>
						<show-post postid='1220'></show-post>
					</div>
				</header>
			</div>
		);
	}
}

export default App;
