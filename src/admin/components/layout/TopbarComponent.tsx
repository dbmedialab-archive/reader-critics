import * as React from 'react';
import {connect} from 'react-redux';

import MainMenuComponent from 'admin/components/layout/MainMenuComponent';

class TopbarComponent extends React.Component <any, any>{

	constructor(props) {
		super(props);
	}
	componentWillMount() {
	}
	componentDidMount() {

	}
	componentWillUnmount() {

	}
	toggleSubmenu(e) {
		e.stopPropagation();

	}
	toggleAccountMenu(e) {
		e.stopPropagation();
	}
	closeAccountMenu(){
	}
	render(){
		const userName = this.props.currentUser.name;
		let submenuClass = 'top-bar-left show-for-small-only';
		submenuClass += (this.props.isSubmenuOpen)?' open':'';
		let accountMenuClass:string = 'has-dropdown bg-white';
		accountMenuClass += (this.props.isAccountMenuOpen)?' open':'';
		return(
			<div className="top-bar-nest">
				<nav className="top-bar" role="navigation">
					<div className="top-bar-title show-for-small-only">
						<button className="fa fa-bars" type="button" onClick={this.toggleSubmenu.bind(this)} >
						</button>
					</div>
					<div className={submenuClass}>
						<MainMenuComponent role ={this.props.currentUser.role}/>
					</div>
					<section className="top-bar-section ">
						<ul className="right">
							<li className={accountMenuClass} onClick={this.toggleAccountMenu.bind(this)}>
								<a className="bg-white" href="#">
									<img alt="" className="admin-pic img-circle" src="/static/admin/images/no_avatar.jpg"/>
									<span className="admin-pic-text text-gray">{userName}</span>
								</a>
								<ul
									className="dropdown dropdown-nest profile-dropdown"
									onMouseLeave={this.closeAccountMenu.bind(this)}
									>
									<li>
										<i className="fa fa-sign-out"></i>
										<a href="/logout">
											<h4>
												Logout
											</h4>
										</a>
									</li>
								</ul>
							</li>
						</ul>
					</section>
				</nav>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {

	return {
		isSubmenuOpen: false,
		isAccountMenuOpen: false,
		currentUser: {
			name: 'Dmitry',
			role: 1,
		},
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TopbarComponent);
