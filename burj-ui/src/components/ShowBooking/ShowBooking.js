import React from 'react';
import './ShowBooking.css';

const showBooking = (props) => {
    const booking = props.data;
    return (
        <div className="container">
            <div className="show-booking">
                <h4>Name: {booking.name}</h4>
                <p>From: {(new Date(booking.checkIn)).toDateString('dd/MM/YYYY')}</p>
                <p>To: {(new Date(booking.checkOut)).toDateString('dd/MM/YYYY')}</p>
            </div>
        </div>
    );
};

export default showBooking;