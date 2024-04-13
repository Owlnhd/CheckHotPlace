var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(37.566405, 126.977822), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

// copyright의 위치를 오른쪽 아래로 설정하고, 로고와의 위치를 반전시킨다
map.setCopyrightPosition(kakao.maps.CopyrightPosition.BOTTOMRIGHT, true);


// 현재 위치 표시
// HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
if (navigator.geolocation) {
    
    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    navigator.geolocation.getCurrentPosition(function(position) {
        
        var lat = position.coords.latitude, // 위도
            lon = position.coords.longitude; // 경도
        
        var locPosition = new kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다

        // // 사용자 마커 이미지의 이미지 속성입니다
        // var imageSrc = "images/user_image.png",
        //     imageSize = new kakao.maps.Size(30, 30);

        // // 사용자 위치를 나타내는 마커의 이미지를 생성합니다
        // var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
        //     //markerPosition = new kakao.maps.LatLng(locPosition);

        // 마커를 생성합니다
        var locUser = new kakao.maps.Marker({
            position: locPosition
            //image: markerImage
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
    map.setLevel(4);

}


// 위치별 마커 생성 및 표시
// 마커를 표시할 위치와 title 객체 배열입니다 
var positions = [
    {
        title: '장소1',
        latlng: new kakao.maps.LatLng(36.798177, 127.075426),
        population: 1
    },
    {
        title: '장소2',
        latlng: new kakao.maps.LatLng(36.797057, 127.075426),
        population: 5
    },
    {
        title: '장소3',
        latlng: new kakao.maps.LatLng(36.800067, 127.075436),
        population: 10
    },
    {
        title: '장소4',
        latlng: new kakao.maps.LatLng(36.799067, 127.074456),
        population: 15
    }
];

var red = [],
    yellow = [],
    green = [],
    blue = [];

positions.forEach(element => {
    if (element.population >= 15) {
        red.push(element);
    }
    else if (element.population >= 10) {
        yellow.push(element);
    }
    else if (element.population >= 5) {
        green.push(element);
    }
    else {
        blue.push(element);
    }
});

// 마커 이미지의 이미지 주소입니다
const imageRed = "images/dot_red.png",
    imageYellow = "images/dot_yellow.png",
    imageGreen = "images/dot_green.png",
    imageBlue = "images/dot_blue.png";

// 마커 이미지의 이미지 크기 입니다
const imageSize = new kakao.maps.Size(15, 15); 
    
// 마커 이미지를 생성합니다    
const markerImageRed = new kakao.maps.MarkerImage(imageRed, imageSize),
    markerImageYellow = new kakao.maps.MarkerImage(imageYellow, imageSize),
    markerImageGreen = new kakao.maps.MarkerImage(imageGreen, imageSize),
    markerImageBlue = new kakao.maps.MarkerImage(imageBlue, imageSize);

// 15명 이상 red marker
red.forEach(element => {
    let marker = new kakao.maps.Marker({
        map: map,
        position: element.latlng,
        image: markerImageRed
    });

    let content = '<div class ="label">' +
    '<span class="left"></span>' + '<span class="center">' +
    element.title + "    " + element.population +
    '</span>' + '<span class="right"></span></div>';

    let position = element.latlng;

    let customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: content,
    });

    kakao.maps.event.addListener(marker, 'mouseover', function () {
        customOverlay.setMap(map);
    });

    kakao.maps.event.addListener(marker, 'mouseout', function () {
        setTimeout(function () {
            customOverlay.setMap();
        });
    });
});

// 10명 이상 yellow marker
yellow.forEach(element => {
    let marker = new kakao.maps.Marker({
        map: map,
        position: element.latlng,
        image: markerImageYellow
    });

    let content = '<div class ="label">' +
    '<span class="left"></span>' + '<span class="center">' +
    element.title + "    " + element.population +
    '</span>' + '<span class="right"></span></div>';

    let position = element.latlng;

    let customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: content,
    });

    kakao.maps.event.addListener(marker, 'mouseover', function () {
        customOverlay.setMap(map);
    });

    kakao.maps.event.addListener(marker, 'mouseout', function () {
        setTimeout(function () {
            customOverlay.setMap();
        });
    });
});

// 5명 이상 green marker
green.forEach(element => {
    let marker = new kakao.maps.Marker({
        map: map,
        position: element.latlng,
        image: markerImageGreen
    });

    let content = '<div class ="label">' +
    '<span class="left"></span>' + '<span class="center">' +
    element.title + "    " + element.population +
    '</span>' + '<span class="right"></span></div>';

    let position = element.latlng;

    let customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: content,
    });

    kakao.maps.event.addListener(marker, 'mouseover', function () {
        customOverlay.setMap(map);
    });

    kakao.maps.event.addListener(marker, 'mouseout', function () {
        setTimeout(function () {
            customOverlay.setMap();
        });
    });
});

// 5명 미만 blue marker
blue.forEach(element => {
    let marker = new kakao.maps.Marker({
        map: map,
        position: element.latlng,
        image: markerImageBlue
    });

    let content = '<div class ="label">' +
    '<span class="left"></span>' + '<span class="center">' +
    element.title + "    " + element.population +
    '</span>' + '<span class="right"></span></div>';

    let position = element.latlng;

    let customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: content,
    });

    kakao.maps.event.addListener(marker, 'mouseover', function () {
        customOverlay.setMap(map);
    });

    kakao.maps.event.addListener(marker, 'mouseout', function () {
        setTimeout(function () {
            customOverlay.setMap();
        });
    });
});

// // 마커 이미지의 이미지 크기 입니다
// var imageSize = new kakao.maps.Size(15, 15); 
    
// // 마커 이미지를 생성합니다    
// let markerImageRed = new kakao.maps.MarkerImage(imageRed, imageSize),
//     markerImageYellow = new kakao.maps.MarkerImage(imageYellow, imageSize),
//     markerImageGreen = new kakao.maps.MarkerImage(imageGreen, imageSize),
//     markerImageBlue = new kakao.maps.MarkerImage(imageBlue, imageSize);


//     // 마커 이미지의 이미지 크기 입니다
//     var imageSize = new kakao.maps.Size(15, 15); 
    
//     // 마커 이미지를 생성합니다    
//     var markerImage = new kakao.maps.MarkerImage(imageRed, imageSize); 
    
//     // 마커를 생성합니다
//     var marker = new kakao.maps.Marker({
//         map: map, // 마커를 표시할 지도
//         position: positions[i].latlng, // 마커를 표시할 위치
//         content : positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
//         image : markerImage, // 마커 이미지 
//         clickable: true // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
//     });

//     // 마커에 표시할 인포윈도우를 생성합니다 
//     var infowindow = new kakao.maps.InfoWindow({
//         content: positions[i].title // 인포윈도우에 표시할 내용
//     });

//     // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
//     // 이벤트 리스너로는 클로저를 만들어 등록합니다 
//     // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
//     kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
//     kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));

// }


// // 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
// function makeOverListener(map, marker, infowindow) {
//     return function() {
//         infowindow.open(map, marker);
//     };
// }

// // 인포윈도우를 닫는 클로저를 만드는 함수입니다 
// function makeOutListener(infowindow) {
//     return function() {
//         infowindow.close();
//     };
// }

