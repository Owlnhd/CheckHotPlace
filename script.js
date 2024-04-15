var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(37.566405, 126.977822), // 지도의 중심좌표
        level: 5 // 지도의 확대 레벨
    };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

// copyright의 위치를 오른쪽 아래로 설정하고, 로고와의 위치를 반전시킨다
map.setCopyrightPosition(kakao.maps.CopyrightPosition.BOTTOMRIGHT, true);

var locPosition;
const apiKey = 'AIzaSyDnKVr5IOUxBvfNRlGuIgUcqPlIM7Bdf1U';
const spreadsheetId = '1N_RCQ5L4ciWBs-DYMuEmJb8IZg0rqCDPuEvve4mZ43k';
const range = 'Sheet1'; // 데이터를 읽고 쓸 시트와 범위

let dataList = []; // 데이터 확인 시 사용할 리스트 변수

var clusterer = new kakao.maps.MarkerClusterer({
    map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
    averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
    minLevel: 10 // 클러스터 할 최소 지도 레벨 
});

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

        
        var markers = dataList.map(function(item) {
            return new kakao.maps.Marker({
                position: item.coords
            });
        });
        
        // 클러스터러에 마커들을 추가합니다
        clusterer.addMarkers(markers);
        

    })
    
    .catch(error => console.error('Error:', error));
}


// 현재 위치 표시
// HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
if (navigator.geolocation) {
    
    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    navigator.geolocation.getCurrentPosition(function(position) {
        
        var lat = position.coords.latitude, // 위도
            lng = position.coords.longitude; // 경도
        
        locPosition = new kakao.maps.LatLng(lat, lng); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다

        // // 사용자 마커 이미지의 이미지 속성입니다
        // var imageSrc = "images/user_image.png",
        //     imageSize = new kakao.maps.Size(30, 30);

        // // 사용자 위치를 나타내는 마커의 이미지를 생성합니다
        // var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
        //     //markerPosition = new kakao.maps.LatLng(locPosition);

        // 마커를 생성합니다
        var locUser = new kakao.maps.Marker({
            position: locPosition
            // image: markerImage
        });
        
        // 마커를 지도 위에 표시합니다
        locUser.setMap(map);
        map.setLevel(3);
        map.setCenter(locPosition);
        
        // 커스텀 오버레이에 표시할 내용입니다
        // HTML 문자열 또는 Dom Element 입니다
        var content = '<div class ="label"><span class="left"></span><span class="center">현위치</span><span class="right"></span></div>';

        // 커스텀 오버레이가 표시될 위치입니다
        var position = locPosition;

        // 커스텀 오버레이를 생성합니다
        var customOverlay = new kakao.maps.CustomOverlay({
            position: position,
            content: content
        });
        
        // 커스텀 오버레이를 지도에 표시합니다
        customOverlay.setMap(map);

    });
    
} else { // HTML5의 GeoLocation을 사용할 수 없을때 중심 위치를 설정합니다
    
    map.setCenter(37.566405, 126.977822);
    map.setLevel(5);

}


// // 위치별 마커 생성 및 표시
// // 마커를 표시할 위치와 title 객체 배열입니다 
// var positions = [
//     {
//         title: '장소1',
//         latlng: new kakao.maps.LatLng(36.798177, 127.075426),
//         population: 1
//     },
//     {
//         title: '장소2',
//         latlng: new kakao.maps.LatLng(36.797057, 127.075426),
//         population: 5
//     },
//     {
//         title: '장소3',
//         latlng: new kakao.maps.LatLng(36.800067, 127.075436),
//         population: 10
//     },
//     {
//         title: '장소4',
//         latlng: new kakao.maps.LatLng(36.799057, 127.074306),
//         population: 15
//     }
// ];

// var markerRed = [],
//     markerYellow = [],
//     markerGreen = [],
//     markerBlue = [];

// positions.forEach(element => {
//     if (element.population >= 15) {
//         markerRed.push(element);
//     }
//     else if (element.population >= 10) {
//         markerYellow.push(element);
//     }
//     else if (element.population >= 5) {
//         markerGreen.push(element);
//     }
//     else {
//         markerBlue.push(element);
//     }
// });

// 마커 이미지의 이미지 주소입니다
// const imageRed = "images/dot_red.png",
//     imageYellow = "images/dot_yellow.png",
//     imageGreen = "images/dot_green.png",
//     imageBlue = "images/dot_blue.png";


var markers = [];

var markerImagesrc = "images/dot_location.png";

// 마커 이미지의 이미지 크기 입니다
const imageSize = new kakao.maps.Size(12, 12);

// 마커 이미지를 생성합니다 
const markerImage = new kakao.maps.MarkerImage(markerImagesrc, imageSize);
    
// 마커 이미지를 생성합니다    
// const markerImageRed = new kakao.maps.MarkerImage(imageRed, imageSize),
//     markerImageYellow = new kakao.maps.MarkerImage(imageYellow, imageSize),
//     markerImageGreen = new kakao.maps.MarkerImage(imageGreen, imageSize),
//     markerImageBlue = new kakao.maps.MarkerImage(imageBlue, imageSize);

// // 15명 이상 red marker
// markerRed.forEach(element => {
//     let marker = new kakao.maps.Marker({
//         map: map,
//         position: element.latlng,
//         image: markerImageRed
//     });

//     let content = '<div class ="label">'
//     + '<span class="left"></span><span class="center">'
//     + element.title + "    " + element.population
//     + '</span><span class="right"></span></div>';

//     let position = element.latlng;

//     let customOverlay = new kakao.maps.CustomOverlay({
//         position: position,
//         content: content,
//     });

//     kakao.maps.event.addListener(marker, 'mouseover', function () {
//         customOverlay.setMap(map);
//     });

//     kakao.maps.event.addListener(marker, 'mouseout', function () {
//         setTimeout(function () {
//             customOverlay.setMap();
//         });
//     });
// });
