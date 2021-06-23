import React, { Component } from 'react';
import logo from './logo.svg'; // Tell webpack this JS file uses this image
import './App.css';

class App extends Component {
	render() {
		return (
			<div className='App'>
				<header className='App-header'>
					<div className='title'>
						<h3>A Web Component in </h3>
						<img src={logo} alt='Logo' />
						<h3>app.js</h3>
					</div>{' '}
					<p>We can edit props postid to 1220, 1050, 955, 647</p>
					<p>Components between red lines.</p>
					<div className='line'></div>
					<div className='web-component'>
						<show-post postid='1220'></show-post>
					</div>
					<hr />
					<div className='line'></div>
					<div className='web-component'>
						<show-post postid='647'></show-post>
					</div>
					<div className='line'></div>
				</header>
			</div>
		);
	}
}

export default App;
