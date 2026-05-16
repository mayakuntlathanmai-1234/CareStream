package com.carestream.payload.request;

import java.time.LocalDateTime;

public class AppointmentRequest {
    private Long doctorId;
    private LocalDateTime appointmentTime;
    private String reason;

    public AppointmentRequest() {}

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    public LocalDateTime getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(LocalDateTime appointmentTime) { this.appointmentTime = appointmentTime; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
