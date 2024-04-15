const apiKey = 'AIzaSyDnKVr5IOUxBvfNRlGuIgUcqPlIM7Bdf1U';
const spreadsheetId = '1N_RCQ5L4ciWBs-DYMuEmJb8IZg0rqCDPuEvve4mZ43k';
const range = 'Sheet1'; // 데이터를 읽고 쓸 시트와 범위

let dataList = []; // 데이터 확인 시 사용할 리스트 변수

var clusterer = new kakao.maps.MarkerClusterer({
    map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
    averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
    minLevel: 10 // 클러스터 할 최소 지도 레벨 
});

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
            // const coords = row[0] + ',' + row[1]; // 위도와 경도를 콤마로 구분하여 문자열 생성
            
            const coords = new kakao.maps.LatLng(row[0], row[1]);

            counts[coords] = counts[coords] ? counts[coords] + 1 : 1;
            dataList.push({name, coords, counts}); // 리스트 변수에 저장
        });

        function createMarkersFromDataList() {
            var markers = dataList.map(function(item) {
                return new kakao.maps.Marker({
                    position: item.coords
                });
            });
        
            // 클러스터러에 마커들을 추가합니다
            clusterer.addMarkers(markers);
        }

    })
    
    .catch(error => console.error('Error:', error));
}
