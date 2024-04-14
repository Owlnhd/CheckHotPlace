const apiKey = 'AIzaSyDnKVr5IOUxBvfNRlGuIgUcqPlIM7Bdf1U';
const spreadsheetId = '1N_RCQ5L4ciWBs-DYMuEmJb8IZg0rqCDPuEvve4mZ43k';
const range = 'Sheet1'; // 데이터를 읽고 쓸 시트와 범위

let dataList = []; // 데이터 확인 시 사용할 리스트 변수

// 사용자의 위치와 이름을 Google Sheets에 저장
async function writeData() {
    if (!navigator.geolocation) {
        console.error("Geolocation is not supported by your browser");
        return;
    }

    const name = document.getElementById('name').value;
    if (!name) {
        alert("이름을 입력해주세요.");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const latitude = Math.round(position.coords.latitude * 100000) / 100000;
        const longitude = Math.round(position.coords.longitude * 100000) / 100000;

        const body = {
            name: name,
            latitude: latitude,
            longitude: longitude,
        };

        fetch('https://script.google.com/macros/s/AKfycbxR1tTrvqLH4dULybJTNUrvaQ8xbALBmyeXmmlb4P32j-PDbuC0W8U8vdTa6eZOrJqAIg/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch(error => console.error('Error:', error));
    });
}

// Google Sheets에서 데이터 읽고 좌표별 사람 수와 이름을 표시, 리스트 변수에 저장
function readData() {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        dataList = []; // 이전 데이터 초기화
        const counts = {}; // 좌표별 사람 수를 저장할 객체

        // 데이터를 순회하며 각 좌표별로 사람 수 계산
        data.values.forEach(row => {
            const name = row[2]; // 이름
            const coords = row[0] + ',' + row[1]; // 위도와 경도를 콤마로 구분하여 문자열 생성
            counts[coords] = counts[coords] ? counts[coords] + 1 : 1;
            dataList.push({name, coords}); // 리스트 변수에 저장
        });

        // 결과를 화면에 표시
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML = '';
        Object.keys(counts).forEach(coords => {
            messagesDiv.innerHTML += `좌표 [${coords}]에는 ${counts[coords]}명이 있습니다.<br>`;
        });
        console.log(dataList[0].coords);
    })
    .catch(error => console.error('Error:', error));
}
