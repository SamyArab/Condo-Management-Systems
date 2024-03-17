import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Adjusted generateTimeOptions to accept start and end parameters
const generateTimeOptions = (availableStartTime, availableEndTime) => {
  const options = [];
  let startHour, startMinute, endHour, endMinute;
  if (availableStartTime && availableEndTime) {
    [startHour, startMinute] = availableStartTime.split(':').map(Number);
    [endHour, endMinute] = availableEndTime.split(':').map(Number);
  } else {
    // Default to full day if not specified
    startHour = 0; startMinute = 0;
    endHour = 23; endMinute = 30;
  }

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = hour === startHour ? startMinute : 0; minute < 60; minute += 30) {
      if (hour === endHour && minute > endMinute) break;
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push(time);
    }
  }
  return options;
};

const FormReservationPage = () => {
  const router = useRouter();
  // Adjusted to use facility-specific parameters
  const { facilityId, facilityTitle, maxGuests, availableStartTime, availableEndTime } = router.query;

  const [guests, setGuests] = useState(1); // Default to 1, ensure it's within maxGuests
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [endTimeOptions, setEndTimeOptions] = useState([]);

  // Adjust time options based on facility availability
  const timeOptions = generateTimeOptions(availableStartTime, availableEndTime);

  useEffect(() => {
    // Update end time options based on the selected start time
    if (startTime) {
      const startDateTime = new Date(`01/01/2023 ${startTime}`);
      const updatedEndTimeOptions = timeOptions.filter(option => {
        const optionDateTime = new Date(`01/01/2023 ${option}`);
        return optionDateTime.getTime() > startDateTime.getTime() &&
               optionDateTime.getTime() <= startDateTime.getTime() + 2 * 60 * 60 * 1000; // 2 hours in milliseconds
      });

      setEndTimeOptions(updatedEndTimeOptions);
      if (!updatedEndTimeOptions.includes(endTime) && updatedEndTimeOptions.length > 0) {
        setEndTime(updatedEndTimeOptions[0]); // Automatically select the first valid end time option
      }
    } else {
      setEndTimeOptions([]);
      setEndTime('');
    }
  }, [startTime, timeOptions]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Form submission logic here
    console.log({
      facilityId,
      facilityTitle,
      guests,
      startTime,
      endTime,
    });
    // Integrate with backend here for capacity checks and reservation submission
  };

  return (
    <div>
      <h2>Reserve: {facilityTitle}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Number of Guests:</label>
          <input
            type="number"
            min="0"
            max={maxGuests}
            value={guests}
            onChange={(e) => setGuests(Math.min(e.target.value, maxGuests))}
            required
          />
        </div>
        <div>
          <label>Start Time:</label>
          <select
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          >
            <option value="">Select Start Time</option>
            {timeOptions.map((time, index) => (
              <option key={index} value={time}>{time}</option>
            ))}
          </select>
        </div>
        <div>
          <label>End Time:</label>
          <select
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            disabled={!startTime || endTimeOptions.length === 0}
          >
            {endTimeOptions.length > 0 ? endTimeOptions.map((time, index) => (
              <option key={index} value={time}>{time}</option>
            )) : <option value="">Select End Time</option>}
          </select>
        </div>
        <button type="submit">Submit Reservation</button>
      </form>
    </div>
  );
};

export default FormReservationPage;

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';

// function FormReservationPage({ activeForm }) {
//   return (
//     <div>
//       {activeForm === "form1" && <Form1 />}
//       {activeForm === "form2" && <Form2 />}
//       {activeForm === "form3" && <Form3 />}
//     </div>
//   );
// }

// function Form1() {
//     return (
//         <div>
//           <h2>Reserve: {facilityTitle}</h2>
//           <form onSubmit={handleSubmit}>
//             <div>
//               <label>Number of Guests:</label>
//               <input
//                 type="number"
//                 min="0"
//                 max={maxGuests}
//                 value={guests}
//                 onChange={(e) => setGuests(Math.min(e.target.value, maxGuests))}
//                 required
//               />
//             </div>
//             <div>
//               <label>Start Time:</label>
//               <select
//                 value={startTime}
//                 onChange={(e) => setStartTime(e.target.value)}
//                 required
//               >
//                 <option value="">Select Start Time</option>
//                 {timeOptions.map((time, index) => (
//                   <option key={index} value={time}>{time}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label>End Time:</label>
//               <select
//                 value={endTime}
//                 onChange={(e) => setEndTime(e.target.value)}
//                 required
//                 disabled={!startTime || endTimeOptions.length === 0}
//               >
//                 {endTimeOptions.length > 0 ? endTimeOptions.map((time, index) => (
//                   <option key={index} value={time}>{time}</option>
//                 )) : <option value="">Select End Time</option>}
//               </select>
//             </div>
//             <button type="submit">Submit Reservation</button>
//           </form>
//         </div>
//     );
// }

// function Form2() {
//   return <div>Form 2 Content</div>;
// }

// function Form3() {
//   return <div>Form 3 Content</div>;
// }


// export default FormReservationPage;



