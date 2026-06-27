// Notification sound utility with pleasant chime
export const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioContext.currentTime;
    
    // Create a pleasant chime with multiple frequencies
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 (C major chord)
    
    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      
      // Stagger the start times for a chord effect
      const startTime = now + (index * 0.05);
      const duration = 0.6;
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  } catch (error) {
    console.log('Could not play notification sound:', error);
  }
};

// NEW: Japanese-style "Piro~n!" notification sound - soft, cute, and pleasant
export const playCompletionBell = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioContext.currentTime;
    
    // Create "Piro~n!" sound - ascending notes with soft envelope
    // Using pentatonic scale for Japanese aesthetic
    const notes = [
      { freq: 783.99, time: 0, duration: 0.15 },      // G5 - "Pi"
      { freq: 1046.50, time: 0.08, duration: 0.35 },  // C6 - "ro"
      { freq: 1318.51, time: 0.16, duration: 0.5 }    // E6 - "~n"
    ];
    
    notes.forEach((note) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = note.freq;
      oscillator.type = 'sine'; // Soft sine wave for pleasant tone
      
      const startTime = now + note.time;
      
      // Soft attack and gradual decay for "kawaii" effect
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.02); // Gentle attack
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + note.duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + note.duration);
    });
    
    console.log('🔔 Piro~n! PageSpeed check completed ✨');
  } catch (error) {
    console.log('Could not play notification sound:', error);
  }
};


// Text-to-speech for completion message (simplified - chime only, no TTS to avoid lag)
export const speakCompletionMessage = () => {
  try {
    // Play chime sound only (no text-to-speech to avoid lag)
    playNotificationSound();
    console.log('PageSpeed check completed - chime played');
  } catch (error) {
    console.log('Could not play completion notification:', error);
  }
};


// Sound for new ticket notification
export const speakTicketNotification = () => {
  try {
    // Play same chime sound as PageSpeed
    playNotificationSound();
  } catch (error) {
    console.log('Could not play ticket notification sound:', error);
  }
};
