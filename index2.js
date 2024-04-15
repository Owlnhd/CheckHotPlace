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

        // 결과를 화면에 표시
        // const messagesDiv = document.getElementById('messages');
        // messagesDiv.innerHTML = '';
        // Object.keys(counts).forEach(coords => {
        //     messagesDiv.innerHTML += `좌표 ${coords}에는 ${counts[coords]}명이 있습니다.<br>`;
        // });
        // console.log(dataList[0].coords);

        createMarkersFromDataList();

        
        
        
        // 데이터를 가져오기 위해 jQuery를 사용합니다
        // 데이터를 가져와 마커를 생성하고 클러스터러 객체에 넘겨줍니다
        //$.get("/download/web/data/chicken.json", function(data) {
            // 데이터에서 좌표 값을 가지고 마커를 표시합니다
            // 마커 클러스터러로 관리할 마커 객체는 생성할 때 지도 객체를 설정하지 않습니다

            // 클러스터러에 마커들을 추가합니다
            


        // dataList.forEach(element => {
        //     if (counts[element.coords] >= 4) {
        //         markerRed.push(element);
        //     }
        //     else if (counts[element.coords] >= 3) {
        //         markerYellow.push(element);
        //     }
        //     else if (counts[element.coords] >= 2) {
        //         markerGreen.push(element);
        //     }
        //     else if (counts[element.coords] >= 1) {
        //         markerBlue.push(element);
        //     }
        // });


        // dataList 참조하여 마커 생성 후 표시
        // markerRed.forEach(element => {
        //     let marker = new kakao.maps.Marker({
        //         map: map,
        //         position: element.coords,
        //         image: markerImageRed
        //     });
        
            // let content = '<div class ="label">'
            // + '<span class="left"></span><span class="center">'
            // + counts[element.coords] + " 명이 있어요!" //+ element.population
            // + '</span><span class="right"></span></div>';
        
            // let position = element.coords;
        
            // let customOverlay = new kakao.maps.CustomOverlay({
            //     position: position,
            //     //content: content,
            // });
        
            // kakao.maps.event.addListener(marker, 'mouseover', function () {
            //     customOverlay.setMap(map);
            // });
        
            // kakao.maps.event.addListener(marker, 'mouseout', function () {
            //     setTimeout(function () {
            //         customOverlay.setMap();
            //     });
            // });
        // });        
    })
    .catch(error => console.error('Error:', error));
}
