import axios from 'axios';
import { Buffer } from 'buffer';

export function formattedTime(time: number): string {
    const date = new Date(time * 1000)
    return date.toLocaleString()
}

export function formatFileSize(size: number): string {
    if (size < 1024) {
        return size + 'B'
    } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + 'KB'
    } else if (size < 1024 * 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(2) + 'MB'
    } else if (size < 1024 * 1024 * 1024 * 1024) {
        return (size / 1024 / 1024 / 1024).toFixed(2) + 'GB'
    }
    return size.toString()
}

export async function DownloadFile(path: string, filename: string) {
    try {
        const header = {
            Authorization: "Bearer " + localStorage.getItem('token'),
            //"Content-Security-Policy": "upgrade-insecure-requests",
        }
        const ret = await axios.get('/download/' + filename, { params: { path: path }, responseType: 'blob', headers: header })
        let content = await ret.data.text()
        let encodeData = JSON.parse(content).content
        console.log(encodeData)
        const decoded = Buffer.from(encodeData, 'base64')
        // can not use atob, will overflow
        const url = window.URL.createObjectURL(new Blob([decoded]));
        const link = document.createElement('a');
        console.log(url);
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
    } catch (err) {
        console.error(err)
    }
}