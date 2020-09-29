import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../../App';
import ShowBooking from '../ShowBooking/ShowBooking';

import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { Button } from '@material-ui/core';

const Book = () => {
    const { bedType } = useParams();
    const [signedInUser, setSignedInUser] = useContext(UserContext);
    const [bookingData, setBookingData] = useState([]);

    const [selectedDate, setSelectedDate] = useState({
        checkIn: new Date(),
        checkOut: new Date()
    });

    const handleCheckIn = (date) => {
        const newDate = {...selectedDate};
        newDate.checkIn = date;
        setSelectedDate(newDate);
    };

    const handleCheckOut = (date) => {
        const newDate = {...selectedDate};
        newDate.checkOut = date;
        setSelectedDate(newDate);
    };
    
    const handleBooking = () => {
        const newBooking = {...signedInUser, ...selectedDate};
        fetch('http://localhost:5000/addBooking', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBooking)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
        });
    }

    useEffect(() => {
        fetch('http://localhost:5000/bookings')
        .then(res => res.json())
        .then(data => setBookingData(data));
    }, [])

    const matchedBooking = bookingData.filter(booking => booking.email == signedInUser.email);

    return (
        <div style={{textAlign: 'center'}}>
            <h1>Hello, {signedInUser.name}! Let's book a {bedType} Room.</h1>
            <p>Want a <Link to="/home">different room?</Link> </p>

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="space-around">
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="Start Date"
                        value={selectedDate.checkIn}
                        onChange={handleCheckIn}
                        KeyboardButtonProps={{
                        'aria-label': 'change date',
                        }}
                    />

                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="End Date"
                        value={selectedDate.checkOut}
                        onChange={handleCheckOut}
                        KeyboardButtonProps={{
                        'aria-label': 'change date',
                        }}
                    />

                </Grid>
            </MuiPickersUtilsProvider>
            <Button onClick={handleBooking} variant="contained" color="primary">
                    Book Now
            </Button>
            <h3 className="text-center">Number of your bookings: {matchedBooking.length}</h3>
            {
                matchedBooking.map(booking => <ShowBooking data={booking} />)
            }
        </div>
    );
};

export default Book;