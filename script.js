const recordButton = document.getElementById('recordButton');
const stopButton = document.getElementById('stopButton');
const downloadButton = document.getElementById('downloadButton');
const status = document.getElementById('status');

let mediaRecorder;
let recordedBlobs;

function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
}

recordButton.addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recordedBlobs = [];
    let mimeType = 'audio/webm';
    try {
        mediaRecorder = new MediaRecorder(stream, { mimeType });
    } catch(error) {
        mimeType = 'audio/mp3';
        mediaRecorder = new MediaRecorder(stream, { mimeType });
    }

    
    recordButton.disabled = true;
    stopButton.disabled = false;
    downloadButton.disabled = true;
    status.textContent = 'Recording...';

    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start(10);
});

stopButton.addEventListener('click', () => {
    mediaRecorder.stop();
    recordButton.disabled = false;
    stopButton.disabled = true;
    downloadButton.disabled = false;
    status.textContent = 'Recording stopped. Click Download to save the file.';
});

downloadButton.addEventListener('click', () => {
    const blob = new Blob(recordedBlobs, { type: 'audio/mp4' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'voice_recording.mp4';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
});
