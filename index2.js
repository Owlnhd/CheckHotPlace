const apiKey = 'AIzaSyDnKVr5IOUxBvfNRlGuIgUcqPlIM7Bdf1U';
const spreadsheetId = '1N_RCQ5L4ciWBs-DYMuEmJb8IZg0rqCDPuEvve4mZ43k';
const range = 'Sheet1'; // 데이터를 읽고 쓸 시트와 범위

let dataList = []; // 데이터 확인 시 사용할 리스트 변수


// // 현재 날짜와 시간을 가져오기
// const currentDate = new Date();

// // 각 구성 요소를 가져오기
// const year = currentDate.getFullYear();
// const month = currentDate.getMonth() + 1;
// const day = currentDate.getDate();
// const hours = currentDate.getHours();
// const minutes = currentDate.getMinutes();
// const seconds = currentDate.getSeconds();

// // 날짜와 시간을 문자열로 포맷팅
// const formatDate = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}${String(hours).padStart(2, '0')}${String(minutes).padStart(2, '0')}${String(seconds).padStart(2, '0')}`;


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
        const latitude = position.coords.latitude.toFixed(5);
        const longitude = position.coords.longitude.toFixed(5);

        const body = {
            name: name,
            latitude: latitude,
            longitude: longitude
            //time: formatDate
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

