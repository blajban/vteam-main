import './EventEmitter.css';
import React from 'react';

const host = "localhost:8889";

const exchanges = {
    scooters: "scooters",
    system: "system",
    admin: "admin"
};


class EventForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleEventInput = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.handleEventInput(e.target.value);
    }

    render() {
        return(
            <>
            <label>
                Event: 
                <input
                    value={this.props.event}
                    onChange={this.handleEventInput}
                />
            </label>
            </>
        );
    }
}


class EventEmitter extends React.Component {
    constructor(props) {
        super(props);
        this.handleEventInput = this.handleEventInput.bind(this);
        this.handleExchangePick = this.handleExchangePick.bind(this);
        this.state = {
            log: [],
            exchange: "system",
            event: []
        };
        
    }
    sendEvent(x, e) {
        fetch(`http://${host}/send/${x}/${e}`, { mode: 'cors' })
            .then((res) => res.json())
            .then((data) => console.log(data));
    }
    updateLog() {
        fetch(`http://${host}/log/`, { mode: 'cors' })
            .then((res) => res.json())
            .then((data) => {
                this.setState({
                    log: data
                });
            });
    }
    handleEventInput(e) {
        this.setState({
            event: e
        });
    }
    handleExchangePick(e) {
        this.setState({
            exchange: e.target.value
        });
    }
    listLog() {
        const date = Date();
        return this.state.log.map((entry) =>  <li>{JSON.stringify(entry)}</li>);
    }
    exchangePicker() {
        const exchanges_arr = Object.keys(exchanges);
        return exchanges_arr.map((exchange) => <option value={exchange}>{exchange}</option>);
    }
    

    render() {
        return (
            <div className='container'>
                <label>
                    Exchange:
                    <select value={this.state.exchange} onChange={this.handleExchangePick}>
                        {this.exchangePicker()}
                    </select>
                </label>
                <div className='input'>
                    <EventForm 
                        event={this.state.event}
                        handleEventInput={this.handleEventInput}
                    />
                </div>
                <div className='buttons'>
                    <button className="button" onClick={ () => {
                        this.sendEvent(this.state.exchange, this.state.event);
                        this.updateLog();
                    }}>
                    Skicka meddelande
                    </button>

                    <button className="button" onClick={ () => {
                        this.updateLog();
                        
                    }}>
                    Uppdatera logg
                    </button>
                </div>
                    
                <div className='log'>
                    <strong>Logg</strong>
                    <ol>{ this.listLog() }</ol>
                </div>

            </div>
        );
    }
}

export default EventEmitter;
