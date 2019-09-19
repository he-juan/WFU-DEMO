import React from 'react';
import PropTypes from 'prop-types';

class Init_Websocket extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ws: new WebSocket(this.props.url, this.props.protocol),
            attempts: 1
        };
    }

    logging(logline) {
        if (this.props.debug === true) {
            //console.log(logline);
        }
    }

    generateInterval (k) {
        if(this.props.reconnectIntervalInMilliSeconds > 0) {
            return this.props.reconnectIntervalInMilliSeconds;
        }
        return Math.min(30, (Math.pow(2, k) - 1)) * 1000;
    }

    setupWebsocket() {
        let websocket = this.state.ws;

        websocket.onopen = () => {
            this.logging('Websocket connected');
            websocket.send("open" + '\n');
            if (typeof this.props.onOpen !== 'undefined') this.props.onOpen();
        };

        websocket.onmessage = (evt) => {
            this.props.onMessage(evt.data);
        };

        this.shouldReconnect = this.props.reconnect;
        websocket.onclose = () => {
            this.logging('Websocket disconnected');
            websocket.send("close" + '\n');
            if (typeof this.props.onClose !== 'undefined') this.props.onClose();
            if (this.shouldReconnect) {
                let time = this.generateInterval(this.state.attempts);
                setTimeout(() => {
                    this.setState({attempts: this.state.attempts+1});
                    this.setState({ws: new WebSocket(this.props.url, this.props.protocol)});
                    this.setupWebsocket();
                }, time);
            }
        }

         window.onbeforeunload = () => {
             websocket.close();
         };
    }

    componentDidMount() {
        this.setupWebsocket();
    }

    componentWillUnmount() {
        this.shouldReconnect = false;
        let websocket = this.state.ws;
        websocket.close();
    }

    render() {
        return (
            <div></div>
        );
    }
}

Init_Websocket.defaultProps = {
    debug: false,
    reconnect: true
};

Init_Websocket.propTypes = {
    url: PropTypes.string.isRequired,
    onMessage: PropTypes.func.isRequired,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    debug: PropTypes.bool,
    reconnect: PropTypes.bool,
    protocol: PropTypes.string,
    reconnectIntervalInMilliSeconds : PropTypes.number
};

export default Init_Websocket;