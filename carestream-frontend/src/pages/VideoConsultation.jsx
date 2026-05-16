import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Monitor, Users, Clock, Calendar, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import api from '../services/api';
import './PatientDashboard.css';

export default function VideoConsultation() {
  const { user, hasRole } = useAuth();
  const { client, connected } = useWebSocket();
  const isDoctor = hasRole('DOCTOR');
  
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [inCall, setInCall] = useState(false);
  const [activeCall, setActiveCall] = useState(null);
  const [remoteStreamAttached, setRemoteStreamAttached] = useState(false);
  
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  
  const timerRef = useRef(null);
  const videoRef = useRef(null); // Local video
  const remoteVideoRef = useRef(null); // Remote video
  const pcRef = useRef(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/appointments/my');
        setAppointments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to load appointments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (inCall && client && connected && activeCall) {
      timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("Camera API is not available. Please ensure you are using HTTPS.");
        return;
      }

      navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" }, 
        audio: true 
      })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
          
          const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
          });
          pcRef.current = pc;

          // Add local tracks to peer connection
          stream.getTracks().forEach(track => pc.addTrack(track, stream));

          // Listen for remote tracks
          pc.ontrack = (event) => {
            if (remoteVideoRef.current && event.streams[0]) {
              remoteVideoRef.current.srcObject = event.streams[0];
              setRemoteStreamAttached(true);
            }
          };

          // Listen for local ICE candidates to send to remote peer
          pc.onicecandidate = (event) => {
            if (event.candidate) {
              client.publish({
                destination: `/app/call/${activeCall.id}`,
                body: JSON.stringify({ type: 'candidate', candidate: event.candidate, sender: user.username })
              });
            }
          };

          // Subscribe to signaling topic for this specific appointment room
          subscriptionRef.current = client.subscribe(`/topic/call/${activeCall.id}`, async (msg) => {
            const data = JSON.parse(msg.body);
            if (data.sender === user.username) return; // ignore our own messages

            try {
              if (data.type === 'join') {
                // Another user joined. We should create an Offer.
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                client.publish({
                  destination: `/app/call/${activeCall.id}`,
                  body: JSON.stringify({ type: 'offer', offer, sender: user.username })
                });
              } else if (data.type === 'offer') {
                // Received an Offer. We should set it and create an Answer.
                await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                client.publish({
                  destination: `/app/call/${activeCall.id}`,
                  body: JSON.stringify({ type: 'answer', answer, sender: user.username })
                });
              } else if (data.type === 'answer') {
                // Received an Answer.
                await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
              } else if (data.type === 'candidate') {
                // Received an ICE candidate
                await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
              }
            } catch (err) {
              console.error("WebRTC Error:", err);
            }
          });

          // Broadcast that we have joined the room
          client.publish({
            destination: `/app/call/${activeCall.id}`,
            body: JSON.stringify({ type: 'join', sender: user.username })
          });
        })
        .catch(err => {
          console.error("Media Devices Error:", err);
          alert("Could not access your camera. Please check permissions.");
        });
    } else {
      // Cleanup when ending call
      clearInterval(timerRef.current);
      setCallDuration(0);
      setRemoteStreamAttached(false);
      
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
        videoRef.current.srcObject = null;
      }
      if (remoteVideoRef.current?.srcObject) {
        remoteVideoRef.current.srcObject.getTracks().forEach(t => t.stop());
        remoteVideoRef.current.srcObject = null;
      }
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    }
    return () => clearInterval(timerRef.current);
  }, [inCall, activeCall, client, connected, user?.username]);

  // Handle local mute/unmute
  useEffect(() => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getAudioTracks().forEach(t => t.enabled = micOn);
      videoRef.current.srcObject.getVideoTracks().forEach(t => t.enabled = camOn);
    }
  }, [micOn, camOn]);

  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const startCall = (appt) => { setActiveCall(appt); setInCall(true); };
  const endCall = () => { setInCall(false); setActiveCall(null); };

  const confirmedAppointments = appointments.filter(a => a.status === 'CONFIRMED');

  if (inCall && activeCall) {
    const remoteName = (isDoctor ? activeCall.patientName : activeCall.doctorName) || 'Unknown User';
    const remoteAvatar = remoteName.charAt(0).toUpperCase();

    return (
      <div className="fixed inset-0 bg-[#0a1020] z-50 flex flex-col">
        {/* Remote video area */}
        <div className="flex-1 relative flex items-center justify-center bg-[#0d1628]">
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline 
            className={`w-full h-full object-cover transition-opacity duration-500 ${remoteStreamAttached ? 'opacity-100' : 'opacity-0 absolute'}`} 
          />
          
          {/* Waiting Room Placeholder (shows until remote stream connects) */}
          {!remoteStreamAttached && (
            <div className="text-center">
              <div className="w-28 h-28 rounded-full bg-teal-500/20 text-teal-400 text-5xl font-bold flex items-center justify-center mx-auto mb-4 border-4 border-teal-500/30 animate-pulse">
                {remoteAvatar}
              </div>
              <p className="text-white text-xl font-semibold">{isDoctor ? '' : 'Dr. '}{remoteName}</p>
              <div className="text-teal-400 text-sm mt-2 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-ping"></div>
                Waiting for {isDoctor ? 'patient' : 'doctor'} to join...
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-slate-400 text-lg font-mono">
                <Clock size={16} /> {formatTime(callDuration)}
              </div>
            </div>
          )}

          {/* Local preview */}
          <div className="absolute bottom-6 right-6 w-40 h-28 bg-[#060b18] rounded-xl overflow-hidden border border-black/10 dark:border-white/10 shadow-xl z-10">
            {camOn
              ? <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-slate-500"><VideoOff size={28} /></div>
            }
            <div className="absolute bottom-2 left-2 text-[10px] text-white/80 bg-black/50 px-1.5 py-0.5 rounded">You</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-[#060b18]/90 backdrop-blur-xl border-t border-black/10 dark:border-white/10 p-6 flex items-center justify-center gap-6 z-20">
          <button onClick={() => setMicOn(m => !m)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${micOn ? 'bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-theme-main dark:text-white' : 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'}`}>
            {micOn ? <Mic size={22} /> : <MicOff size={22} />}
          </button>
          <button onClick={() => setCamOn(c => !c)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${camOn ? 'bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-theme-main dark:text-white' : 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'}`}>
            {camOn ? <Video size={22} /> : <VideoOff size={22} />}
          </button>
          <button onClick={endCall}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-all transform hover:scale-105">
            <PhoneOff size={26} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-dashboard max-w-5xl mx-auto">
      {/* Banner */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="welcome-banner mb-7">
        <div className="welcome-text">
          <h2>Video Consultation</h2>
          <p>Connect face-to-face from the comfort of your home or clinic</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/15 rounded-xl text-theme-main dark:text-white text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          {confirmedAppointments.length} Confirmed {confirmedAppointments.length === 1 ? 'Call' : 'Calls'}
        </div>
      </motion.div>

      {/* How it works */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: '📅', title: 'Confirmed Booking', desc: 'Ensure your appointment is confirmed' },
          { icon: '📹', title: 'Join Call', desc: 'Connect via secure video' },
          { icon: '💊', title: 'Consultation', desc: 'Discuss your health remotely' },
        ].map((s, i) => (
          <div key={i} className="stat-card text-center">
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="text-sm font-semibold text-[var(--text-primary)]">{s.title}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">{s.desc}</div>
          </div>
        ))}
      </motion.div>

      {/* Confirmed Appointments list */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="pd-card">
        <div className="card-header">
          <div>
            <div className="card-title">Available Consultations</div>
            <div className="card-subtitle">Click "Join Call" to start the video session</div>
          </div>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-8 h-8 border-2 border-[var(--teal-500)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : confirmedAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-[var(--text-muted)]">
              <Video size={48} className="mb-4 opacity-30" />
              <p className="text-base font-medium">No confirmed video calls available</p>
              {!isDoctor && <p className="text-sm mt-1">Book an appointment and wait for doctor confirmation</p>}
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {confirmedAppointments.map((appt) => {
                const displayName = isDoctor ? appt.patientName : `Dr. ${appt.doctorName}`;
                const displaySub = isDoctor ? (appt.reason || 'General Checkup') : 'Specialist';
                const apptDate = appt.appointmentDate ? new Date(appt.appointmentDate) : null;
                const dateStr = apptDate ? apptDate.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Time TBD';

                return (
                  <div key={appt.id} className="flex items-center gap-5 px-6 py-4 hover:bg-[var(--surface2)] transition-colors">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-[var(--teal-50)] text-[var(--teal-600)] font-bold text-lg flex items-center justify-center">
                        {displayName && displayName.length > 0 ? displayName.charAt(isDoctor ? 0 : 4).toUpperCase() : 'U'}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-green-400 animate-pulse"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-[var(--text-primary)]">{displayName}</div>
                      <div className="text-sm text-[var(--teal-500)]">{displaySub}</div>
                      <div className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-1">
                        <Clock size={11} /> Scheduled: {dateStr}
                      </div>
                    </div>
                    <button
                      onClick={() => startCall(appt)}
                      className="flex items-center gap-2 px-4 py-2 bg-[var(--teal-500)] hover:bg-[var(--teal-600)] text-white rounded-xl text-sm font-semibold transition-colors shadow-md hover:shadow-lg"
                    >
                      <Video size={15} /> Join Call
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
