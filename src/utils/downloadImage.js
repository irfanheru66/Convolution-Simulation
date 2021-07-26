const dataUriToBlob = (dataUri) => {
    const b64 = atob(dataUri.split(',')[1]);
    const u8 = Uint8Array.from(b64.split(''), e => e.charCodeAt());
    return new Blob([u8], { type: 'image/png' });
}

export const downloadImageOutput = (canvasRef, downloadButtonRef) => {
    const data = canvasRef.current.toDataURL()
    const url = URL.createObjectURL(dataUriToBlob(data));
    downloadButtonRef.current.href = url
}
