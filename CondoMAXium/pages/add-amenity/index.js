import React, { useState } from "react";
import { useRouter } from "next/router";
import { Container, Typography } from "@mui/material";

const AddAmenityForm = () => {
  const [amenityName, setAmenityName] = useState("");
  const [floor, setFloor] = useState("");
  const [sqft, setSqft] = useState("");
  const [days, setDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [hours, setHours] = useState({ from: "", to: "" });
  const [description, setDescription] = useState("");

  const {
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
  } = days;

  const error =
    [monday, tuesday, wednesday, thursday, friday, saturday, sunday].filter(
      (v) => v
    ).length < 2;

  const router = useRouter();

  return (
    <div style={{ paddingTop: "140px", paddingBottom: "40px" }}>
      {" "}
      <Container>
        <Typography variant="h4" gutterBottom>
          Add Amenity
        </Typography>
      </Container>
    </div>
  );
};

export default AddAmenityForm;
