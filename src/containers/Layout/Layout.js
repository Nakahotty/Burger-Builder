import React, { Component } from 'react';
import Aux from '../../hoc/Auxx.js';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import classes from './Layout.css';


// Using wrapper high-order component
class Layout extends Component {
    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () => {
        this.setState({showSideDrawer: false});
    }

    // access the previous state through parameter
    sideDrawerToggledHandler = () => {
        this.setState((prev) => {
            return {showSideDrawer: !prev.showSideDrawer};
        })
    }

    render() {
        return (
            <Aux>
                <Toolbar drawerToggleClicked={this.sideDrawerToggledHandler}/> 
                <SideDrawer open={this.state.showSideDrawer} closed={this.sideDrawerClosedHandler}/>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        )
    }
}
    

export default Layout;